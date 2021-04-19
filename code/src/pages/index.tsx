import { GetServerSideProps } from 'next';
import Head from 'next/head';
import styles from 'src/styles/Home.module.css';
import { getCases } from 'src/pages/api/cases';

import Record from 'airtable/lib/record';
import { parse } from 'src/utils/helper';

export default function Home({ records }: HomeProps) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Voicera</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        {records.map((record) => {
          return <div>{record.fields['Borough']}</div>;
        })}
      </main>

      <footer className={styles.footer}>
        <img src='/voicera.svg' alt='Voicera Logo' className={styles.logo} />
      </footer>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const records = await getCases();
  return {
    props: { records: parse(records) },
  };
};

type HomeProps = {
  records: Array<Record>;
};
