import { AppProps } from 'next/app';
import '../styles/globals.css';

function VoiceraApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default VoiceraApp;
