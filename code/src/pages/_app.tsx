import { AppProps } from 'next/app';
import React from 'react';
import 'src/styles/App.scss';

export default function VoiceraApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
