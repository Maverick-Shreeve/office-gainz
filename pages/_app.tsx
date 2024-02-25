import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import '../app/globals.css';
import { AppProps } from 'next/app';
import Layout from '../components/Layout'; 
import { ThemeProvider } from '../ThemeContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ThemeProvider> 
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
