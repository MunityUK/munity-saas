import { GetServerSideProps } from 'next';
import Dynamic from 'next/dynamic';
import Head from 'next/head';
import React, { useState } from 'react';

import { hydrate } from '@utils/functions/common';
import { Complaint } from '@utils/types';
import MapFiltersBar from 'src/fragments/map/filters';
import { getComplaints } from 'src/pages/api/complaints';

const MunityMap = Dynamic(() => import('src/fragments/map'), {
  ssr: false
});

export default function Home({ allComplaints }: HomeProps) {
  const [complaints, setComplaints] = useState(allComplaints);

  return (
    <div className={'map-page'}>
      <Head>
        <title>Munity</title>
        {/* <link rel={'icon'} href={'/favicon.ico'} /> */}
      </Head>

      <main className={'map-main'}>
        <MapFiltersBar
          allComplaints={allComplaints}
          setComplaints={setComplaints}
        />
        <MunityMap complaints={complaints} />
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const complaints = await getComplaints();
  return {
    props: { allComplaints: hydrate(complaints) ?? [] }
  };
};

interface HomeProps {
  allComplaints: Array<Complaint>;
}
