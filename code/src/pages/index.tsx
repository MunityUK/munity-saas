import Record from 'airtable/lib/record';
import { GetServerSideProps } from 'next';
import Dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';

import { getComplaints } from 'src/pages/api/complaints';
import { parse } from 'src/utils/helper';

export default function Home({ complaints }: HomeProps) {
  // Map needs not be affected by Next's server-side rendering.
  const VoiceraMap = Dynamic(() => import('src/components/map'), {
    ssr: false
  });

  return (
    <div>
      <Head>
        <title>Voicera</title>
        <link rel={'icon'} href={'/favicon.ico'} />
      </Head>

      <main>
        <div className={'voicera-map'}>
          <VoiceraMap complaints={complaints} />
        </div>
      </main>

      <footer>
        <img src={'/voicera.svg'} alt={'Voicera Logo'} />
      </footer>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const complaints = await getComplaints();
  return {
    props: { complaints: parse(complaints) }
  };
};

type HomeProps = {
  complaints: Array<Record>;
};
