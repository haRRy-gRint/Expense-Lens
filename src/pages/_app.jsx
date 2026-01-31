import '../index.css';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>Cashvion - Your Finance Buddy</title>
                <meta name="description" content="Expense-Lens your finance buddy" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Component {...pageProps} />
        </>
    );
}
