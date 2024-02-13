import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import '../app/globals.css';
import { AppProps } from 'next/app';
import Layout from '../components/Layout'; 

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp;
