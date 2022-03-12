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
  public readonly complaints: Complaint[] = [];
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

  private static SLACK_DAYS = 5;

  private totalInvTimeInMs = 0;
  private totalResTimeInMs = 0;
  private totalCasDurInMs = 0;

  private baseScoreUnit = 0;
  private _finalScore = 100;

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
      const quantity = complaintsByStation[stationName].length;
      station.setTotalNumberOfComplaints(quantity);
      station.addComplaint(complaint);
      stationScores[stationName] = station;
    });

    return stationScores;
  }

  /**
   * Add and process a complaint.
   * @param complaint The complaint to add.
   */
  public addComplaint(complaint: Complaint) {
    this.complaints.push(complaint);

    if (complaint.status === ComplaintStatus.RESOLVED) {
      this.processResolvedComplaint(complaint);
    } else if (complaint.status === ComplaintStatus.INVESTIGATING) {
      this.processInvestigatingComplaint(complaint);
    } else {
      this.processUnaddressedComplaint(complaint);
    }
  }

  /**
   * Set the total number of complaints for your station.
   * @param quantity The number to set.
   */
  public setTotalNumberOfComplaints(quantity: number) {
    this.totalNumberOfComplaints = quantity;
    this.baseScoreUnit = 1 / quantity;
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

    this.totalInvTimeInMs += diffInMs(
      complaint.dateUnderInvestigation!,
      complaint.dateComplaintMade!
    );
    this.totalResTimeInMs += diffInMs(
      complaint.dateResolved!,
      complaint.dateUnderInvestigation!
    );
    this.totalCasDurInMs += diffInMs(
      complaint.dateResolved!,
      complaint.dateComplaintMade!
    );

    this.averageInvestigationTime = calculateAverageTimeInDays(
      this.totalInvTimeInMs,
      this.numberOfComplaintsInvestigating + this.numberOfComplaintsResolved
    );
    this.averageResolutionTime = calculateAverageTimeInDays(
      this.totalResTimeInMs,
      this.numberOfComplaintsResolved
    );
    this.averageCaseDuration = calculateAverageTimeInDays(
      this.totalCasDurInMs,
      this.numberOfComplaintsResolved
    );

    this.incurPenalty(complaint);
  }

  /**
   * Process a complaint under investigation.
   * @param complaint The complaint to process.
   */
  private processInvestigatingComplaint(complaint: Complaint) {
    this.numberOfComplaintsInvestigating++;
    this.percentageInvestigating = percent(
      this.numberOfComplaintsInvestigating,
      this.totalNumberOfComplaints
    );
    this.percentageAttendedTo = percent(
      this.numberOfComplaintsResolved + this.numberOfComplaintsInvestigating,
      this.totalNumberOfComplaints
    );

    this.totalInvTimeInMs += diffInMs(
      complaint.dateUnderInvestigation!,
      complaint.dateComplaintMade!
    );
    this.averageInvestigationTime = calculateAverageTimeInDays(
      this.totalInvTimeInMs,
      this.numberOfComplaintsInvestigating + this.numberOfComplaintsResolved
    );

    this.incurPenalty(complaint);
  }

  /**
   * Process an unaddressed complaint.
   * @param complaint The complaint to process.
   */
  private processUnaddressedComplaint(complaint: Complaint) {
    this.numberOfComplaintsUnaddressed++;
    this.percentageUnaddressed = percent(
      this.numberOfComplaintsUnaddressed,
      this.totalNumberOfComplaints
    );
    this.incurPenalty(complaint);
  }

  /**
   * Incur a penalty based on complaint severity and delays.
   * @param complaint The reference complaint.
   */
  private incurPenalty(complaint: Complaint) {
    const severityPenalty = getSeverityPenalty(complaint.incidentType!);
    const lowerBoundDate =
      complaint.status === ComplaintStatus.UNADDRESSED
        ? Date.now()
        : complaint.dateUnderInvestigation!;
    const differenceInDays = diffInDays(
      lowerBoundDate,
      complaint.dateComplaintMade!
    );

    const numOfPenalUnaddressedDays = Math.min(
      Math.max(differenceInDays - Station.SLACK_DAYS, 0),
      90
    );
    const penaltyFactor = this.baseScoreUnit * (2 + severityPenalty);
    const penalty = penaltyFactor * numOfPenalUnaddressedDays;

    if (complaint.status !== ComplaintStatus.UNADDRESSED) {
      const dateResolved =
        complaint.status === ComplaintStatus.RESOLVED
          ? complaint.dateResolved!
          : Date.now();
      const numOfRecompenseInvestigationDays = Math.min(
        diffInDays(dateResolved, complaint.dateUnderInvestigation!),
        30
      );
      const recompense =
        penaltyFactor * numOfRecompenseInvestigationDays * 0.55;
      this._finalScore += recompense;
    }

    this._finalScore -= penalty;
  }

  /**
   * Retrieves the final score to a maximum of 2 decimal places.
   * @returns The final score value.
   */
  public get finalScore(): number {
    if (this._finalScore > 100) {
      this._finalScore = 100;
    } else if (this._finalScore < 0) {
      this._finalScore = 0;
    }
    return Math.round(this._finalScore * 100) / 100;
  }
}

/**
 * Retrieves the penalty factor based on the incident type severity.
 * @param incidentType The incident type.
 * @returns The penalty factor.
 */
function getSeverityPenalty(incidentType: IncidentType) {
  switch (IncidentTypeSeverities[incidentType]) {
    case 'HIGH':
      return 5;
    case 'MEDIUM':
      return 2;
    case 'LOW':
    default:
      return 0;
  }
}

/**
 * Transforms a fraction into a percentage string.
 * @param numerator The fraction numerator.
 * @param denominator The fraction denominator.
 * @returns The number as a percentage.
 */
function percent(numerator: number, denominator: number): string {
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

/**
 * Calculates the difference between two dates in days.
 * @param lDate The first date.
 * @param eDate The second date.
 * @returns The difference in days.
 */
function diffInDays(lDate: number | Date, eDate: number | Date) {
  return differenceInDays(new Date(lDate), new Date(eDate));
}

/**
 * Calculates the average number of days complaints have spanned for a particular
 * status.
 * @param totalTimeInMs The total number of milliseconds of complaints for a
 * particular status.
 * @param numberOfStatus The number of complaints of a particular status.
 * @returns The average time in days.
 */
function calculateAverageTimeInDays(
  totalTimeInMs: number,
  numberOfStatus: number
): string {
  const average = totalTimeInMs / numberOfStatus;
  const averageTime = diffInDays(average, 0);
  return averageTime + ' days';
}

type StationScores = Record<string, Station>;
