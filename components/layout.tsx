import Head from "next/head";
import styles from "./layout.module.css";
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Link from "next/link";
import Header from "./header";
import CloudIcon from "@mui/icons-material/Cloud";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
export const siteTitle = "Charlie Mistrata";

interface LayoutProps {
  children: any;
  title?: string;
}

export default function Layout({ children, title = null }: LayoutProps) {
  const pageHead = (
    <Head>
      <title>{title ?? siteTitle}</title>
    </Head>
  );
  return (
    <ThemeProvider theme={darkTheme}>
      {pageHead}

      {/* background */}
      <div className={styles.background}>
        {/* <div className={styles.ground} /> */}
        <div className={styles.sky} />
        <CloudIcon className={`${styles.cloud} ${styles.cloud1}`} />
        <CloudIcon className={`${styles.cloud} ${styles.cloud2}`} />
        <CloudIcon className={`${styles.cloud} ${styles.cloud3}`} />
        <CloudIcon className={`${styles.cloud} ${styles.cloud7}`} />
        <CloudIcon className={`${styles.cloud} ${styles.cloud8}`} />
        <CloudIcon className={`${styles.cloud} ${styles.cloud10}`} />
      </div>

      {/* content */}
      <Paper className={styles.container} elevation={3}>
        <Header />

        <main> {children}</main>
      </Paper>
    </ThemeProvider>
  );
}
