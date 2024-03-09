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
      id: context.params.id,
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

export default function Post({ postData, id }) {
  const metas = [
    <meta
      key="url"
      property="og:url"
      content={`https://www.charliemistrata.com/posts/${id}`}
    />,
    <meta key="title" property="og:title" content={postData.title} />,
    <meta key="type" property="og:type" content="article" />,
  ];
  if (postData.description) {
    metas.push(
      <meta
        key="description"
        property="og:description"
        content={postData.description}
      />
    );
  }
  if (postData.previewImage) {
    metas.push(
      <meta
        key="image"
        property="og:image"
        content={`https://www.charliemistrata.com${postData.previewImage}`}
      />
    );
  }
  return (
    <Layout title={postData.title} metas={metas}>
      <article>
        <h1 className={utilStyles.headingXl} id="title">
          {postData.title}
        </h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  );
}
