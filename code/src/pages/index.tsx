import Record from 'airtable/lib/record';
import { GetServerSideProps } from 'next';
import Dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';

import { getCases } from 'src/pages/api/cases';
import styles from 'src/styles/Home.module.scss';
import { parse } from 'src/utils/helper';

export default function Home({ records }: HomeProps) {
  const VoiceMap = Dynamic(() => import('src/components/map'), { ssr: false });
  return (
    <div className={styles.container}>
      <Head>
        <title>Voicera</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {records.map((record, key) => {
          return <div key={key}>{record.fields['Borough']}</div>;
        })}
        <VoiceMap />
      </main>

      <footer className={styles.footer}>
        <img src="/voicera.svg" alt="Voicera Logo" className={styles.logo} />
      </footer>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const records = await getCases();
  return {
    props: { records: parse(records) }
  };
};

type HomeProps = {
  records: Array<Record>;
};
