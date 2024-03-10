import Head from "next/head";
import styles from "./layout.module.css";
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header from "./header";
import CloudIcon from "@mui/icons-material/Cloud";
import { useState, useEffect } from "react";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
export const siteTitle = "Charlie Mistrata";

interface LayoutProps {
  children: any;
  title?: string;
  metadata?: { [key: string]: string };
}

function createCloudAnimationStyle(
  animationDuration: number,
  initialAnimationDelay: number,
  currentTime: number
) {
  const durationIntoCurrentAnimation =
    (currentTime - initialAnimationDelay) % animationDuration;
  return {
    animationDelay: `${-durationIntoCurrentAnimation}s`,
    animationDuration: `${animationDuration}s`,
  };
}

export default function Layout({
  children,
  title = null,
  metadata,
}: LayoutProps) {
  metadata = metadata ?? {};
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const metaElements = Object.entries(metadata)?.map(([key, value]) => (
    <meta key={key} property={key} content={value} />
  ));
  if (!("og:image" in metadata)) {
    metaElements.push(
      <meta
        key={"og:image"}
        property={"og:image"}
        content={"https://www.charliemistrata.com/images/default_og_image.png"}
      />
    );
  }

  const currentTimeInSeconds = Date.now() / 1000;
  const pageHead = (
    <Head>
      <title>{title ?? siteTitle}</title>
      {metaElements}
    </Head>
  );
  const clouds = isClient ? (
    <>
      <CloudIcon
        className={`${styles.cloud} ${styles.cloud1}`}
        style={createCloudAnimationStyle(160, -30, currentTimeInSeconds)}
      />
      <CloudIcon
        className={`${styles.cloud} ${styles.cloud2}`}
        style={createCloudAnimationStyle(135, -10, currentTimeInSeconds)}
      />
      <CloudIcon
        className={`${styles.cloud} ${styles.cloud3}`}
        style={createCloudAnimationStyle(145, -120, currentTimeInSeconds)}
      />
      <CloudIcon
        className={`${styles.cloud} ${styles.cloud4}`}
        style={createCloudAnimationStyle(145, -80, currentTimeInSeconds)}
      />
      <CloudIcon
        className={`${styles.cloud} ${styles.cloud5}`}
        style={createCloudAnimationStyle(139, -50, currentTimeInSeconds)}
      />
      <CloudIcon
        className={`${styles.cloud} ${styles.cloud6}`}
        style={createCloudAnimationStyle(130, -60, currentTimeInSeconds)}
      />
    </>
  ) : (
    <></>
  );
  return (
    <ThemeProvider theme={darkTheme}>
      {pageHead}

      {/* background */}
      <div className={styles.background}>
        <div className={styles.sky} />
        {clouds}
      </div>

      {/* content */}
      <Paper className={styles.container} elevation={3}>
        <Header />
        <main>
          <article> {children} </article>
        </main>
      </Paper>
    </ThemeProvider>
  );
}
