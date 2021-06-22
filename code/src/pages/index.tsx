import { GetServerSideProps } from 'next';
import Dynamic from 'next/dynamic';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';

import { Label } from 'src/components/form';
import {
  CheckboxGroup,
  CheckboxGroupProps
} from 'src/components/form/lib/checkbox';
import { getComplaints } from 'src/pages/api/complaints';
import { RACE_OPTIONS, SEX_OPTIONS } from 'src/utils/constants';
import { parse } from 'src/utils/helper';
import {
  Complaint,
  ComplaintStatus,
  IncidentType,
  PoliceStations
} from 'types';

export default function Home({ allComplaints }: HomeProps) {
  const [complaints, setComplaints] = useState(allComplaints);
  const [filters, setFilters] = useState<MapFilters>({});

  useEffect(() => {
    filterComplaints();
  }, [JSON.stringify(filters)]);

  /** Filter the list of complaints by specified property. */
  const filterComplaints = () => {
    const filteredComplaints = allComplaints.filter((complaint) => {
      return Object.entries(filters).every(([property, values]) => {
        if (!values || !values.length) return true;
        const key = property as keyof Complaint;
        return values.includes(complaint[key] as string);
      });
    });

    setComplaints(filteredComplaints);
  };

  /**
   * Set a new filter on check.
   * @param e The change event.
   */
  const onFilterCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFilters((filters) => {
      const values = filters[name as keyof Complaint] || [];
      if (checked) {
        values.push(value);
      } else {
        const index = values.indexOf(value);
        if (index > -1) {
          values.splice(index, 1);
        }
      }
      return { ...filters, [name]: values };
    });
  };

  // Map need not be affected by Next's server-side rendering.
  const VoiceraMap = Dynamic(() => import('src/components/map'), {
    ssr: false
  });

  /** A field for the dropdown menu to filter map markers by property. */
  const MapFilterField = (props: MapFilterProps) => {
    const { label, name, items } = props;
    return (
      <div className={'map-sidebar-field'}>
        <Label className={'map-sidebar-field__label'}>{label}</Label>
        <CheckboxGroup name={name} items={items} onChange={onFilterCheck} />
      </div>
    );
  };

  return (
    <div className={'map-page'}>
      <Head>
        <title>Voicera</title>
        <link rel={'icon'} href={'/favicon.ico'} />
      </Head>

      <main className={'map-main'}>
        <div className={'map-sidebar'}>
          <MapFilterField
            label={'Incident Type'}
            name={'incidentType'}
            items={Object.values(IncidentType)}
            placeholder={'All incident types'}
          />
          <MapFilterField
            label={'Station'}
            name={'station'}
            items={PoliceStations}
            placeholder={'All stations'}
          />
          <MapFilterField
            label={'Status'}
            name={'status'}
            items={Object.values(ComplaintStatus)}
            placeholder={'All statuses'}
          />
          <MapFilterField
            label={'Officer Race'}
            name={'officerRace'}
            items={RACE_OPTIONS}
            placeholder={'Any officer race'}
          />
          <MapFilterField
            label={'Officer Sex'}
            name={'officerSex'}
            items={SEX_OPTIONS}
            placeholder={'Any officer sex'}
          />
          <MapFilterField
            label={'Complainant Race'}
            name={'complainantRace'}
            items={RACE_OPTIONS}
            placeholder={'Any complainant race'}
          />
          <MapFilterField
            label={'Complainant Sex'}
            name={'complainantSex'}
            items={SEX_OPTIONS}
            placeholder={'Any complainant sex'}
          />
        </div>
        <VoiceraMap complaints={complaints} />
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const complaints = await getComplaints();
  return {
    props: { allComplaints: parse(complaints) ?? [] }
  };
};

interface MapFilterProps extends CheckboxGroupProps {
  /** The label text. */
  label: string;
  /** The property of the field to filter on. */
  name: keyof Complaint;
}

interface HomeProps {
  /** The full list of complaints from the server. */
  allComplaints: Array<Complaint>;
}

type MapFilters = {
  [key in keyof Complaint]: Array<string>;
};
