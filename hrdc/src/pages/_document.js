import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Load jQuery first */}
        <script
          src="/assets/js/jquery.min.js"
          defer
        />
        <script
          src="/assets/js/jquery.scrollex.min.js"
          defer
        />
        <script
          src="/assets/js/jquery.scrolly.min.js"
          defer
        />
        <script
          src="/assets/js/browser.min.js"
          defer
        />
        <script
          src="/assets/js/breakpoints.min.js"
          defer
        />
        <script
          src="/assets/js/util.js"
          defer
        />
        <script
          src="/assets/js/main.js"
          defer
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

