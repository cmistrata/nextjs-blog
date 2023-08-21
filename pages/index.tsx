import Link from "next/link";
import Layout from "../components/layout";

export default function Home({ allPostsData }) {
  return (
    <Layout home title="Charlie Mistrata">
      <h1>About me</h1>
      <p>
        Hi! I'm a software engineer working at Google. I'm originally from
        Chicago and am currently living in the Bay Area.{" "}
      </p>

      <p>
        I use this site as a place to dump some of my thoughts and explanations
        for stuff I find interesting into posts. You can reach out to me at
        cmistrata@gmail.com or at my{" "}
        <Link href="https://www.linkedin.com/in/charlie-mistrata/">
          LinkedIn
        </Link>
        , thanks!
      </p>
    </Layout>
  );
}
