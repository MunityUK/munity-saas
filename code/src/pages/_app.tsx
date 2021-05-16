import { AppProps } from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';

import 'src/styles/App.scss';
import store from 'src/utils/reducers';

export default function VoiceraApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
