import { GetServerSideProps } from 'next';
import Dynamic from 'next/dynamic';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';

import Complaint, { IncidentType, Outcome, PoliceStations } from 'src/classes';
import { Select } from 'src/components/form';
import { getComplaints } from 'src/pages/api/complaints';
import { parse } from 'src/utils/helper';

export default function Home({ allComplaints }: HomeProps) {
  // Map needs not be affected by Next's server-side rendering.
  const VoiceraMap = Dynamic(() => import('src/components/map'), {
    ssr: false
  });

  const [complaints, setComplaints] = useState(allComplaints);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const filteredComplaints = allComplaints.filter((complaint) => {
      return Object.entries(filters).every(([property, value]) => {
        if (!value) return true;
        const key = property as keyof Complaint;
        return complaint[key] === value;
      });
    });

    setComplaints(filteredComplaints);
  }, [JSON.stringify(filters)]);

  /**
   * Set a new filter on selection.
   * @param e The change event.
   */
  const onFilterSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((filters) => ({ ...filters, [name]: value }));
  };

  return (
    <div>
      <Head>
        <title>Voicera</title>
        <link rel={'icon'} href={'/favicon.ico'} />
      </Head>

      <main>
        <div className={'filters'}>
          <Select
            name={'incidentType'}
            onChange={onFilterSelect}
            items={Object.values(IncidentType)}
            placeholder={'All incident types'}
          />
          <Select
            name={'station'}
            onChange={onFilterSelect}
            items={PoliceStations}
            placeholder={'All stations'}
          />
          <Select
            name={'outcome'}
            onChange={onFilterSelect}
            items={Object.values(Outcome)}
            placeholder={'All outcomes'}
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

type HomeProps = {
  allComplaints: Array<Complaint>;
};
