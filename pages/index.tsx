import Link from "next/link";
import Layout from "../components/layout";
import utilStyles from "../styles/utils.module.css";

export default function Home({ allPostsData }) {
  return (
    <Layout
      metadata={{
        "google-site-verification":
          "rbr68Nt3ykvHS24XXqyoUbLg3GrWmfS6vk_jcL1KC54",
      }}
    >
      <h1>About Me</h1>
      <p>
        Hello 👋 I'm a software engineer working at Google. I'm originally from
        Chicago and am currently living in the Bay Area.{" "}
      </p>

      <p>
        I use this site as a place to write notes on stuff I want to remember
        into <Link href="/posts">posts</Link>. You can reach out to me at
        cmistrata@gmail.com or at my{" "}
        <Link href="https://www.linkedin.com/in/charlie-mistrata/">
          LinkedIn
        </Link>
        .
      </p>

      <p>
        You can see the code for this site on my GitHub at{" "}
        <Link href="https://github.com/cmistrata/nextjs-blog">
          github.com/cmistrata/nextjs-blog
        </Link>
        .
      </p>
    </Layout>
  );
}
