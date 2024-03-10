import Layout from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { getSortedPostsData } from "../lib/posts";
import Link from "next/link";
import Date from "../components/date";
import { GetStaticProps } from "next";

export default function Posts({ allPostsData }) {
  return (
    <Layout title="Posts - Charlie Mistrata">
      <h1>Posts</h1>
      <ul className={utilStyles.list}>
        {allPostsData.map((postData) => (
          <li className={utilStyles.listItem} key={postData.id}>
            <h2 className="style-as-link">
              <Link href={`/posts/${postData.id}`}>{postData.title}</Link>
            </h2>
            <span>{postData.description}</span>
            <br />
            <small className={utilStyles.lightText}>
              <Date dateString={postData.date} />
            </small>
          </li>
        ))}
      </ul>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
};
