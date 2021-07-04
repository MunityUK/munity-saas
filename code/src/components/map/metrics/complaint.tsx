import React, { ReactNode, useEffect, useState } from 'react';

import { formatDate } from 'src/utils/helper';
import { Complaint, SexLookup } from 'types';

export default function MetricComplaintInfo({
  complaint
}: MetricStationProfileProps) {
  if (!complaint) return null;
  const [fields, setFields] = useState<Array<ComplaintField>>([]);

  useEffect(() => {
    collateFields();
  }, [complaint.id]);

  /**
   * Builds the list of fields to display.
   */
  const collateFields = () => {
    const fields = [
      { label: 'Report ID', value: complaint.reportId },
      { label: 'Station', value: complaint.station },
      { label: 'Police Force', value: complaint.force },
      { label: 'Status', value: complaint.status },
      {
        label: 'Date of Complaint',
        value: formatDate(complaint.dateOfComplaint!)
      },
      {
        label: 'Date of Addressal',
        value: formatDate(complaint.dateOfAddressal!)
      },
      {
        label: 'Date of Resolution',
        value: formatDate(complaint.dateOfResolution!)
      },
      { label: 'Incident Type', value: complaint.incidentType },
      { label: 'Incident Description', value: complaint.incidentDescription },
      { label: 'City', value: complaint.city },
      { label: 'County', value: complaint.county },
      { label: 'Latitude', value: complaint.latitude },
      { label: 'Longitude', value: complaint.longitude },
      {
        label: 'Complainant Age',
        value: `${complaint.complainantAge} years old`
      },
      { label: 'Complainant Race', value: complaint.complainantRace },
      { label: 'Complainant Sex', value: SexLookup[complaint.complainantSex!] },
      { label: 'Officer ID', value: complaint.officerId },
      { label: 'Officer Age', value: `${complaint.officerAge} years old` },
      { label: 'Officer Race', value: complaint.officerRace },
      { label: 'Officer Sex', value: SexLookup[complaint.officerSex!] },
      { label: 'Notes', value: complaint.notes }
    ];
    setFields(fields);
  };

  return (
    <div className={'map-metrics-content--complaint'}>
      {fields.map(({ label, value }, key) => {
        return (
          <div className={'complaint-field'} key={key}>
            <label>{label}:</label>
            <div>{value}</div>
          </div>
        );
      })}
    </div>
  );
}

interface MetricStationProfileProps {
  complaint: Complaint;
}

interface ComplaintField {
  label: string;
  value: ReactNode;
}
