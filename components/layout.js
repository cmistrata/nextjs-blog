import Head from "next/head";
import Image from "next/image";
import styles from "./layout.module.css";
import Paper from "@mui/material/Paper";
import utilStyles from "../styles/utils.module.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Link from "next/link";
import Header from "./header";
import { css } from "@emotion/react";
import CloudIcon from "@mui/icons-material/Cloud";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
export const siteTitle = "Charlie Mistrata";

export default function Layout({ children, home, title }) {
  const pageHead = (
    <Head>
      <link rel="icon" href="/favicon.ico" />
      <meta
        name="description"
        content="Help I've been trapped in this website and can only communicate through the HTML meta element, please before it's too la"
      />
      <title>{title ?? siteTitle}</title>
    </Head>
  );
  return (
    <ThemeProvider theme={darkTheme}>
      <div className={styles.parallax}>
        <div
          className={`${styles.parallax__layer} ${styles.parallax__layerback}`}
        />
        <div
          className={`${styles.parallax__layer} ${styles.parallax__layerbase}`}
        />
        <CloudIcon className={`${styles.cloud} ${styles.cloud1}`} />
        <CloudIcon className={`${styles.cloud} ${styles.cloud2}`} />
        <CloudIcon className={`${styles.cloud} ${styles.cloud3}`} />
        <CloudIcon className={`${styles.cloud} ${styles.cloud7}`} />
        <CloudIcon className={`${styles.cloud} ${styles.cloud8}`} />
        <CloudIcon className={`${styles.cloud} ${styles.cloud10}`} />
        <Paper className={styles.container} elevation={3}>
          {pageHead}
          <Header />
          <main> {children}</main>
          {!home && (
            <div className={styles.backToHome}>
              <Link href="/">
                <a>← Back to home</a>
              </Link>
            </div>
          )}
        </Paper>
      </div>
    </ThemeProvider>
  );
}
