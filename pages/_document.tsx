import { Html, Head, Main, NextScript } from "next/document";
import { StyledEngineProvider } from "@mui/material/styles";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Help I've been trapped in this website and can only communicate through the HTML meta element, please before it's too la"
        />
      </Head>
      <StyledEngineProvider injectFirst>
        <body>
          <Main />
          <NextScript />
        </body>
      </StyledEngineProvider>
    </Html>
  );
}
