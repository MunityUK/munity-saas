import { MunityCommon, Complaint } from '@munity/utils';
import { GetServerSideProps } from 'next';
import Dynamic from 'next/dynamic';
import Head from 'next/head';
import React, { useState } from 'react';

import MapFiltersBar from 'fragments/map/filters';
import Header from 'fragments/partials/header';
import { getComplaints } from 'pages/api/complaints';

const MunityMap = Dynamic(() => import('fragments/map'), {
  ssr: false
});

export default function Home({ allComplaints }: HomeProps) {
  const [complaints, setComplaints] = useState(allComplaints);

  return (
    <div className={'map-page'}>
      <Head>
        <title>Munity</title>
        <link rel={'icon'} href={'/logos/munity-short.svg'} />
      </Head>

      <main className={'map-page-main'}>
        <Header />
        <main className={'map-page-content'}>
          <MapFiltersBar
            allComplaints={allComplaints}
            setComplaints={setComplaints}
          />
          <MunityMap complaints={complaints} />
        </main>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const complaints = await getComplaints();
  return {
    props: { allComplaints: MunityCommon.hydrate(complaints) ?? [] }
  };
};

interface HomeProps {
  allComplaints: Array<Complaint>;
}
