import React, { ReactNode, useEffect, useState } from 'react';

import { ARCGIS_BASE_URL } from 'src/utils/constants';
import { formatDate } from 'src/utils/helper';
import { Complaint, SexLookup } from 'types';

export default function MetricComplaintInfo({
  complaint
}: MetricStationProfileProps) {
  if (!complaint) return null;
  const [fields, setFields] = useState<Array<ComplaintField>>([]);

  useEffect(() => {
    reverseGeocodeCoordinates(complaint, collateFields);
  }, [complaint.id]);

  /**
   * Builds the list of fields to display.
   * @param address The address of the complaint.
   */
  const collateFields = (address: any) => {
    const complaintAddress = (
      <div>
        {address['Address']}
        <br />
        {address['District']}
        <br />
        {address['Postal']}
      </div>
    );

    const fields = [
      { label: 'Report ID', value: complaint.reportId },
      { label: 'Address', value: complaintAddress },
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
      { label: 'County', value: complaint.county },
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

/**
 * Reverse geocodes a complaint's location using its latitude and longtude.
 * @param complaint The complaint.
 * @param callback The function to be called on the response.
 */
function reverseGeocodeCoordinates(
  complaint: Complaint,
  callback: (address: string) => void
) {
  const url = new URL(`${ARCGIS_BASE_URL}/reverseGeocode`);
  url.searchParams.append('f', 'pjson');
  url.searchParams.append('langCode', 'EN');
  url.searchParams.append(
    'location',
    `${complaint.longitude},${complaint.latitude}`
  );

  fetch(url.href)
    .then((res) => res.json())
    .then((response) => {
      callback(response.address);
    });
}

interface MetricStationProfileProps {
  complaint: Complaint;
}

interface ComplaintField {
  label: string;
  value: ReactNode;
}
