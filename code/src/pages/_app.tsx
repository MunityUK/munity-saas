import { AppProps } from 'next/app';
import React from 'react';
import 'src/styles/App.scss';

function VoiceraApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default VoiceraApp;
