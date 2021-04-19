import { AppProps } from 'next/app';
import 'src/styles/App.scss';

function VoiceraApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default VoiceraApp;
