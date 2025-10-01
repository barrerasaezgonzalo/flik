import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        {/* Script de AdSense insertado aquí para evitar data-nscript */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5063066587377461"
        />
        {/* Puedes agregar aquí otros tags globales del <head> si lo necesitas */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
