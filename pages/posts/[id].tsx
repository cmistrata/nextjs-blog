import Layout from "../../components/layout";
import { getAllPostIds, getPostData } from "../../lib/posts";
import { GetStaticProps, GetStaticPaths } from "next";
import Date from "../../components/date";
import utilStyles from "../../styles/utils.module.css";

export const getStaticProps: GetStaticProps = async (context) => {
  const postData = await getPostData(context.params.id as string);
  return {
    props: {
      postData,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const postIds = getAllPostIds();
  const postParams = postIds.map((id) => {
    return {
      params: {
        id,
      },
    };
  });
  return {
    paths: postParams,
    fallback: false,
  };
};

export default function Post({ postData }) {
  return (
    <Layout title={postData.title}>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  );
}
