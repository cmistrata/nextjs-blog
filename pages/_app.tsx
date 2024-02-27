import "../styles/global.css";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import { Analytics } from "@vercel/analytics/react";

export default function App({ Component, pageProps }) {
  // Use smooth scroll only after loading the page, so that
  // if a section is used in the link that section is quickly
  // jumped to rather than being smooth scrolled to.
  if (typeof document !== "undefined") {
    setTimeout(() => {
      document.documentElement.style.scrollBehavior = "smooth";
    }, 1000);
  }
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
