import React from 'react';
import { Provider as ReduxProvider } from 'react-redux'; 
import { store } from '../store/store';
import '../app/globals.css';
import { AppProps } from 'next/app';
import Layout from '../components/Layout';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider>
        <AuthProvider> 
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AuthProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}

export default MyApp;

