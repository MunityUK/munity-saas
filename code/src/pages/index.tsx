import { GetServerSideProps } from 'next';
import Dynamic from 'next/dynamic';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';

import { Select, SelectProps } from 'src/components/form';
import { getComplaints } from 'src/pages/api/complaints';
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
        return complaint[key] === value;
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
          <MapFilter
            name={'incidentType'}
            onChange={onFilterSelect}
            items={Object.values(IncidentType)}
            placeholder={'All incident types'}
          />
          <MapFilter
            name={'station'}
            onChange={onFilterSelect}
            items={PoliceStations}
            placeholder={'All stations'}
          />
          <MapFilter
            name={'status'}
            onChange={onFilterSelect}
            items={Object.values(ComplaintStatus)}
            placeholder={'All statuses'}
          />
        </div>
        <VoiceraMap complaints={complaints} />
      </main>
    </div>
  );
}

/** A dropdown menu to filter map markers by property. */
function MapFilter(props: MapFilterProps) {
  return <Select {...props} className={'map-sidebar-filter'} />;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const complaints = await getComplaints();
  return {
    props: { allComplaints: parse(complaints) ?? [] }
  };
};

interface MapFilterProps extends SelectProps {
  /** The property of the field to filter on. */
  name?: keyof Complaint;
}

type HomeProps = {
  /** The full list of complaints from the server. */
  allComplaints: Array<Complaint>;
};
