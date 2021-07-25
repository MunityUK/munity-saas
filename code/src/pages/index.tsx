import { GetServerSideProps } from 'next';
import Dynamic from 'next/dynamic';
import Head from 'next/head';
import React, { useState } from 'react';

import MapFiltersBar from 'src/fragments/map/filters';
import { getComplaints } from 'src/pages/api/complaints';
import { parse } from 'src/utils/functions';
import { Complaint } from 'types';

const VoiceraMap = Dynamic(() => import('src/fragments/map'), {
  ssr: false
});

export default function Home({ allComplaints }: HomeProps) {
  const [complaints, setComplaints] = useState(allComplaints);

  return (
    <div className={'map-page'}>
      <Head>
        <title>Voicera</title>
        <link rel={'icon'} href={'/favicon.ico'} />
      </Head>

      <main className={'map-main'}>
        <MapFiltersBar
          allComplaints={allComplaints}
          setComplaints={setComplaints}
        />
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

interface HomeProps {
  allComplaints: Array<Complaint>;
}

type MapFiltersBar = {
  [key in keyof Complaint]: Array<string>;
};
