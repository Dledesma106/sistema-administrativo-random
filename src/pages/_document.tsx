import { Html, Head, Main, NextScript } from 'next/document';

export default function Document(): JSX.Element {
    return (
        <Html>
            <Head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap"
                    rel="stylesheet"
                />
                <link rel="icon" href="/logo.png" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
