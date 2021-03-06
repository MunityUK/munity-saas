import {
  Complainant,
  Complaint,
  MunityCommon,
  Officer,
  Person,
  SexLookup
} from '@munity/utils';
import React, {
  Fragment,
  ReactNode,
  useCallback,
  useEffect,
  useState
} from 'react';

export default function MetricComplaintInfo({
  complaint
}: MetricStationProfileProps) {
  const [fields, setFields] = useState<Array<ComplaintField>>([]);

  /**
   * Builds the list of fields to display.
   * @param address The address of the complaint.
   */
  const collateFields = useCallback(
    (address: any) => {
      const fields = [
        { label: 'Complaint ID', value: <p>{complaint.complaintId}</p> },
        {
          label: 'Address',
          value: (
            <address className={'complaint-field__address'}>
              {address['Address']}
              <br />
              {address['District']}
              <br />
              {address['Postal']}
            </address>
          )
        },
        { label: 'Station', value: <p>{complaint.station}</p> },
        { label: 'Police Force', value: <p>{complaint.force}</p> },
        { label: 'Status', value: <p>{complaint.status?.toUpperCase()}</p> },
        {
          label: 'Date of Complaint',
          value: (
            <time>{MunityCommon.formatDate(complaint.dateComplaintMade!)}</time>
          )
        },
        {
          label: 'Date of Investigation Start',
          value: (
            <time>
              {MunityCommon.formatDate(complaint.dateUnderInvestigation!)}
            </time>
          )
        },
        {
          label: 'Date of Resolution',
          value: <time>{MunityCommon.formatDate(complaint.dateResolved!)}</time>
        },
        { label: 'Incident Type', value: <p>{complaint.incidentType}</p> },
        {
          label: 'Incident Description',
          value: <p>{complaint.incidentDescription}</p>
        },
        { label: 'County', value: <p>{complaint.county}</p> },
        {
          label: 'Complainant(s)',
          value: <PeopleGrid people={complaint.complainants as Complainant[]} />
        },
        {
          label: 'Officer(s)',
          value: <PeopleGrid people={complaint.officers as Officer[]} />
        },
        { label: 'Notes', value: <p>{complaint.notes}</p> }
      ];
      setFields(fields);
    },
    [complaint]
  );

  /**
   * Function to run on every new complaint selection.
   */
  const onComplaintSelection = useCallback(async () => {
    const { address } = await Complaint.reverseGeocodeCoordinates(complaint);
    collateFields(address);
  }, [complaint, collateFields]);

  useEffect(() => {
    onComplaintSelection();
  }, [onComplaintSelection]);

  return (
    <section className={'map-metrics-content--complaint'}>
      {fields.map(({ label, value }, key) => {
        return (
          <fieldset className={'complaint-field'} key={key}>
            <label>{label}:</label>
            <Fragment>{value}</Fragment>
          </fieldset>
        );
      })}
    </section>
  );
}

function PeopleGrid({ people }: ComplainantProps) {
  return (
    <table className={'people-grid'}>
      <thead>
        <tr>
          <th>Age</th>
          <th>Ethnic Group</th>
          <th>Sex</th>
        </tr>
      </thead>
      <tbody>
        {people.map((person, key) => {
          const sex = SexLookup[person.sex!][0];
          return (
            <tr key={key}>
              <td>{person.age}</td>
              <td>{person.ethnicGroup}</td>
              <td>{sex}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
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
