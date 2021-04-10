import Head from 'next/head';
import { useEffect } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const getCrimes = async () => {
    const res = await fetch('/api/crimes');
    const records = await res.json();
    console.log(records);
  };

  useEffect(() => {
    getCrimes();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Voicera</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        
      </main>

      <footer className={styles.footer}>
        <a
          href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          Powered by Voicera
          <img src='/voicera.svg' alt='Voicera Logo' className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}
