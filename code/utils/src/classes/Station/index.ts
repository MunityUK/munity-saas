import addMonths from 'date-fns/addMonths';
import differenceInDays from 'date-fns/differenceInDays';
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds';

import { ComplaintsByStation, StationScoreByMonth } from './types';

import { formatDate, isDateInRange } from '../../functions/common';
import {
  Complaint,
  ComplaintStatus,
  IncidentType,
  IncidentTypeSeverities
} from '../Complaint';

export class Station {
  public complaints: Complaint[] = [];
  public totalNumberOfComplaints = 0;
  public numberOfComplaintsResolved = 0;
  public numberOfComplaintsInvestigating = 0;
  public numberOfComplaintsUnaddressed = 0;
  public percentageUnaddressed = '0%';
  public percentageInvestigating = '0%';
  public percentageResolved = '0%';
  public percentageAttendedTo = '0%';
  public averageInvestigationTime: string | null = null;
  public averageResolutionTime: string | null = null;
  public averageCaseDuration: string | null = null;
  public finalScore = 100;

  private avgInvTimeInMs = 0;
  private avgResTimeInMs = 0;
  private avgCasDurInMs = 0;

  /**
   * Groups the list of complaints by their stations.
   * @param complaints The list of complaints.
   * @returns The grouped complaints by station.
   */
  public static groupComplaints(complaints: Complaint[]): ComplaintsByStation {
    const complaintsByStation: ComplaintsByStation = {};
    complaints.forEach((complaint) => {
      const { station } = complaint;
      const currentComplaints = complaintsByStation[station!];
      complaintsByStation[station!] = currentComplaints
        ? [...currentComplaints, complaint]
        : [complaint];
    });
    return complaintsByStation;
  }

  /**
   * Calculates the station scores for each month across a specified time period
   * and groups results by station.
   * @param complaints The list of complaints.
   * @param startDate The lower bound of the time period.
   * @param endDate The upper bound of the time period.
   * @returns The station scores for each month grouped by station.
   */
  public static trackScores(
    complaints: Complaint[],
    startDate: Date,
    endDate: Date
  ) {
    const complaintsByStation = this.groupComplaints(complaints);
    const stationScoreByMonth = Object.keys(complaintsByStation).reduce(
      (acc: StationScoreByMonth, i) => {
        acc[i] = {};
        return acc;
      },
      {}
    );

    Object.entries(complaintsByStation).forEach(
      ([stationName, stationComplaints]) => {
        let currentMonth = startDate;
        while (currentMonth.getTime() <= endDate.getTime()) {
          const complaintsInDateRange = stationComplaints.filter((c) => {
            return isDateInRange(
              c.dateComplaintMade!,
              {
                startDate,
                endDate: currentMonth
              },
              { inclusive: true, strict: true }
            );
          });

          if (complaintsInDateRange.length) {
            const monthKey = formatDate(currentMonth, 'yyyy-MM');
            const stationScore = Station.calculateScores(complaintsInDateRange)[
              stationName
            ];
            stationScoreByMonth[stationName][monthKey] =
              stationScore?.finalScore ?? 0;
          }
          currentMonth = addMonths(currentMonth, 1);
        }
      }
    );

    return stationScoreByMonth;
  }

  /**
   * Calculates the ComRank score for each station among the total list of
   * complaints.
   * @param complaints The list of complaints.
   * @returns The mapping of scores to station.
   */
  public static calculateScores(complaints: Complaint[]): StationScores {
    const complaintsByStation = this.groupComplaints(complaints);
    const stationScores: StationScores = {};

    complaints.forEach((complaint) => {
      if (!complaint.station) return;

      const stationName = complaint.station;
      const station = stationScores[stationName] ?? new Station();
      station.totalNumberOfComplaints = complaintsByStation[stationName].length;
      station.addComplaint(complaint);
      stationScores[stationName] = station;
    });

    return stationScores;
  }

  /**
   * Add and process a complaint.
   * @param complaint The complaint to add.
   * @param numOfComplaintsToStation The total number of complaints for the station.
   * @param options Extra options.
   */
  public addComplaint(complaint: Complaint, options: AddComplaintOptions = {}) {
    this.complaints.push(complaint);

    const params = {
      baseScoreUnit: 1 / this.totalNumberOfComplaints,
      severityPenalty: getSeverityPenalty(complaint.incidentType!),
      endDate: options.endDate ?? new Date()
    };

    if (complaint.status === ComplaintStatus.RESOLVED) {
      this.processResolvedComplaint(complaint);
    } else if (complaint.status === ComplaintStatus.INVESTIGATING) {
      this.processInvestigatingComplaint(complaint, params);
    } else {
      this.processUnaddressedComplaint(complaint, params);
    }
  }

  /**
   * Process a resolved complaint.
   * @param complaint The complaint to process.
   */
  private processResolvedComplaint(complaint: Complaint) {
    this.numberOfComplaintsResolved++;
    this.percentageResolved = percent(
      this.numberOfComplaintsResolved,
      this.totalNumberOfComplaints
    );
    this.percentageAttendedTo = percent(
      this.numberOfComplaintsResolved + this.numberOfComplaintsInvestigating,
      this.totalNumberOfComplaints
    );

    this.avgInvTimeInMs += diffInMs(
      complaint.dateUnderInvestigation!,
      complaint.dateComplaintMade!
    );
    this.avgResTimeInMs += diffInMs(
      complaint.dateResolved!,
      complaint.dateUnderInvestigation!
    );
    this.avgCasDurInMs += diffInMs(
      complaint.dateResolved!,
      complaint.dateComplaintMade!
    );

    this.averageInvestigationTime = calculateAverageTimeInDays(
      this.avgInvTimeInMs,
      this.numberOfComplaintsInvestigating + this.numberOfComplaintsResolved
    );
    this.averageResolutionTime = calculateAverageTimeInDays(
      this.avgResTimeInMs,
      this.numberOfComplaintsResolved
    );
    this.averageCaseDuration = calculateAverageTimeInDays(
      this.avgCasDurInMs,
      this.numberOfComplaintsResolved
    );
  }

  /**
   * Process a complaint under investigation.
   * @param complaint The complaint to process.
   * @param params Parameters for processing.
   */
  private processInvestigatingComplaint(
    complaint: Complaint,
    params: AddParams
  ) {
    this.numberOfComplaintsInvestigating++;
    this.percentageInvestigating = percent(
      this.numberOfComplaintsInvestigating,
      this.totalNumberOfComplaints
    );
    this.percentageAttendedTo = percent(
      this.numberOfComplaintsResolved + this.numberOfComplaintsInvestigating,
      this.totalNumberOfComplaints
    );

    this.avgInvTimeInMs += diffInMs(
      complaint.dateUnderInvestigation!,
      complaint.dateComplaintMade!
    );
    this.averageInvestigationTime = calculateAverageTimeInDays(
      this.avgInvTimeInMs,
      this.numberOfComplaintsInvestigating + this.numberOfComplaintsResolved
    );

    const daysDeltaPen = Math.max(
      diffInDays(
        complaint.dateUnderInvestigation!,
        complaint.dateComplaintMade!
      ),
      30
    );

    const { baseScoreUnit, endDate, severityPenalty } = params;
    const penalty = baseScoreUnit * (2 + severityPenalty) * daysDeltaPen;
    const daysDeltaRec = diffInDays(endDate, complaint.dateUnderInvestigation!);
    const recompense =
      baseScoreUnit * (1 + severityPenalty) * Math.min(daysDeltaRec, 30);
    this.decreaseFinalScore(penalty);
    this.increaseFinalScore(recompense);
  }

  /**
   * Process an unaddressed complaint.
   * @param complaint The complaint to process.
   * @param params Parameters for processing.
   */
  private processUnaddressedComplaint(complaint: Complaint, params: AddParams) {
    this.numberOfComplaintsUnaddressed++;
    this.percentageUnaddressed = percent(
      this.numberOfComplaintsUnaddressed,
      this.totalNumberOfComplaints
    );

    const { baseScoreUnit, endDate, severityPenalty } = params;
    const daysDelta = diffInDays(endDate, complaint.dateComplaintMade!);
    const penalty = baseScoreUnit * (2 + severityPenalty) * daysDelta;
    this.decreaseFinalScore(penalty);
  }

  /**
   * Increase the final score by a specified value. Ensures the final score
   * never surpasses 100.
   * @param value The value to increase the score by.
   */
  private increaseFinalScore(value: number) {
    this.finalScore = Math.min(this.finalScore + value, 100);
  }

  /**
   * Decrease the final score by a specified value. Ensures the final score
   * never falls below 0.
   * @param value The value to decrease the score by.
   */
  private decreaseFinalScore(value: number) {
    this.finalScore = Math.max(this.finalScore - value, 0);
  }
}

function getSeverityPenalty(incidentType: IncidentType) {
  switch (IncidentTypeSeverities[incidentType]) {
    case 'HIGH':
      return 2;
    case 'MEDIUM':
      return 1;
    case 'LOW':
    default:
      return 0;
  }
}

function percent(numerator: number, denominator: number) {
  return round((numerator / denominator) * 100) + '%';
}

/**
 * Rounds a float to the specified number of decimal places. Will leave out
 * decimals if the number is an integer.
 * @param number The number to round.
 * @param precision The number of decimal places.
 * @returns The rounded number.
 */
function round(number: number, precision = 1) {
  if (!precision) return number;
  const scale = 10 ** precision;
  return Math.round(number * scale) / scale;
}

/**
 * Calculates the difference between two dates in milliseconds.
 * @param lDate The first date.
 * @param eDate The second date.
 * @returns The difference in milliseconds.
 */
function diffInMs(lDate: number | Date, eDate: number | Date) {
  return differenceInMilliseconds(new Date(lDate), new Date(eDate));
}

function diffInDays(lDate: number | Date, eDate: number | Date) {
  return differenceInDays(new Date(lDate), new Date(eDate));
}

function calculateAverageTimeInDays(
  timeInMs: number,
  numberOfStatus: number
): string {
  const average = timeInMs / numberOfStatus;
  const averageTime = diffInDays(average, 0);
  return averageTime + ' days';
}

type StationScores = Record<string, Station>;

interface AddComplaintOptions {
  endDate?: Date;
}

interface AddParams {
  baseScoreUnit: number;
  severityPenalty: number;
  endDate: Date;
}
