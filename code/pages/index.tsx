import Head from 'next/head';
import { useEffect } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  useEffect(() => {
    getCrimes();
  }, []);

  const getCrimes = async () => {
    const res = await fetch('/api/crimes');
    const records = await res.json();
    console.log(records);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Voicera</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}></main>

      <footer className={styles.footer}>
        <img src='/voicera.svg' alt='Voicera Logo' className={styles.logo} />
      </footer>
    </div>
  );
}
