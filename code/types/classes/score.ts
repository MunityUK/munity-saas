export class StationScore {
  totalNumberOfComplaints?: number;
  numberOfComplaintsResolved?: number;
  numberOfComplaintsAddressed?: number;
  numberOfComplaintsUnaddressed?: number;
  percentageUnaddressed?: string;
  percentageAddressed?: string;
  percentageResolved?: string;
  percentageProgressed?: string;
  averageAddressalTime?: string | null;
  averageResolutionTime?: string | null;
  averageCaseDuration?: string | null;
  finalScore?: number;
}
