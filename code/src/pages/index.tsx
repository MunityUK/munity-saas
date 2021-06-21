import { GetServerSideProps } from 'next';
import Dynamic from 'next/dynamic';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';

import { Label, Select, SelectProps } from 'src/components/form';
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
  const [filters, setFilters] = useState({});

  useEffect(() => {
    filterComplaints();
  }, [JSON.stringify(filters)]);

  /** Filter the list of complaints by specified property. */
  const filterComplaints = () => {
    const filteredComplaints = allComplaints.filter((complaint) => {
      return Object.entries(filters).every(([property, value]) => {
        if (!value) return true;
        const key = property as keyof Complaint;
        return complaint[key] == value;
      });
    });

    setComplaints(filteredComplaints);
  };

  /**
   * Set a new filter on selection.
   * @param e The change event.
   */
  const onFilterSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((filters) => ({ ...filters, [name]: value }));
  };

  // Map need not be affected by Next's server-side rendering.
  const VoiceraMap = Dynamic(() => import('src/components/map'), {
    ssr: false
  });

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
            onChange={onFilterSelect}
          />
          <MapFilterField
            label={'Station'}
            name={'station'}
            items={PoliceStations}
            placeholder={'All stations'}
            onChange={onFilterSelect}
          />
          <MapFilterField
            label={'Status'}
            name={'status'}
            items={Object.values(ComplaintStatus)}
            placeholder={'All statuses'}
            onChange={onFilterSelect}
          />
          <MapFilterField
            label={'Officer Race'}
            name={'officerRace'}
            items={RACE_OPTIONS}
            placeholder={'Any officer race'}
            onChange={onFilterSelect}
          />
          <MapFilterField
            label={'Officer Sex'}
            name={'officerSex'}
            items={SEX_OPTIONS}
            placeholder={'Any officer sex'}
            onChange={onFilterSelect}
          />
          <MapFilterField
            label={'Complainant Race'}
            name={'complainantRace'}
            items={RACE_OPTIONS}
            placeholder={'Any complainant race'}
            onChange={onFilterSelect}
          />
          <MapFilterField
            label={'Complainant Sex'}
            name={'complainantSex'}
            items={SEX_OPTIONS}
            placeholder={'Any complainant sex'}
            onChange={onFilterSelect}
          />
        </div>
        <VoiceraMap complaints={complaints} />
      </main>
    </div>
  );
}

/** A field for the dropdown menu to filter map markers by property. */
function MapFilterField(props: MapFilterProps) {
  const { label, name, onChange, items, placeholder } = props;
  return (
    <div className={'map-sidebar-field'}>
      <Label className={'map-sidebar-field__label'}>{label}</Label>
      <Select
        name={name}
        onChange={onChange}
        items={items}
        placeholder={placeholder}
        className={'map-sidebar-field__select'}
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const complaints = await getComplaints();
  return {
    props: { allComplaints: parse(complaints) ?? [] }
  };
};

interface MapFilterProps extends SelectProps {
  /** The label text. */
  label: string;
  /** The property of the field to filter on. */
  name: keyof Complaint;
}

type HomeProps = {
  /** The full list of complaints from the server. */
  allComplaints: Array<Complaint>;
};
