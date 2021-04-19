import Record from 'airtable/lib/record';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React from 'react';

import GoogleMap from 'src/components/map';
import { getCases } from 'src/pages/api/cases';
import styles from 'src/styles/Home.module.scss';
import { parse } from 'src/utils/helper';

export default function Home({ records }: HomeProps) {
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
        <GoogleMap />
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
