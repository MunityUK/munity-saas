import React, { ReactNode, useEffect, useState } from 'react';

import { Complaint } from 'types';
import { Complainant, Officer, Person, SexLookup } from 'types/classes/Person';
import { formatDate } from 'utils/functions';

export default function MetricComplaintInfo({
  complaint
}: MetricStationProfileProps) {
  if (!complaint) return null;
  const [fields, setFields] = useState<Array<ComplaintField>>([]);

  useEffect(() => {
    onComplaintSelection();
  }, [complaint.id]);

  /**
   * Function to run on every new complaint selection.
   */
  const onComplaintSelection = async () => {
    const { address } = await Complaint.reverseGeocodeCoordinates(complaint);
    collateFields(address);
  };

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
      { label: 'Complaint ID', value: complaint.complaintId },
      { label: 'Address', value: complaintAddress },
      { label: 'Station', value: complaint.station },
      { label: 'Police Force', value: complaint.force },
      { label: 'Status', value: complaint.status?.toUpperCase() },
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
        label: 'Complainant(s)',
        value: <People people={complaint.complainants as Complainant[]} />
      },
      {
        label: 'Officer(s)',
        value: <People people={complaint.officers as Officer[]} />
      },
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

function People({ people }: ComplainantProps) {
  return (
    <ul className={'complaint-field__list'}>
      {people.map((person, key) => {
        const sex = SexLookup[person.sex!];
        return (
          <li key={key}>
            {person.age}yo {person.race} {sex}
          </li>
        );
      })}
    </ul>
  );
}

interface MetricStationProfileProps {
  complaint: Complaint;
}

interface ComplainantProps {
  people: Person[];
}

interface ComplaintField {
  label: string;
  value: ReactNode;
}
