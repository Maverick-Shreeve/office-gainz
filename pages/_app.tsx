import { useEffect } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head'; 
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { ViewportProvider } from '../context/ViewportContext';
import Layout from '../components/Layout';
import '../app/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <ViewportProvider> 
      <ThemeProvider>
        <AuthProvider>
          <Layout>
            <Head>
              {/* Google site verification meta tag */}
              <meta name="google-site-verification" content="hJI_1hGI3FwrcQuqJ8KsdZZ8Hf_xmNzfhQavkoYppac" />
            </Head>
            <Component {...pageProps} />
          </Layout>
        </AuthProvider>
      </ThemeProvider>
    </ViewportProvider>
  );
}

export default MyApp;
