import { useEffect } from "react";
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

function scrollPastHeaderIfNoSubLink() {
  if (typeof document !== "undefined") {
    const pageIsPost = document.URL.includes("/posts/");
    const noSubLink = !document.URL.includes("#");
    // From header.module.css header style.
    const headerVerticalSize = 140;

    if (pageIsPost && noSubLink) {
      scroll(0, headerVerticalSize);
    }
  }
}

export default function Post({ postData }) {
  const metadata = {
    "og:url": `https://www.charliemistrata.com/posts/${postData.id}`,
    "og:title": postData.title,
    "og:type": "article",
  };
  if (postData.description) {
    metadata["description"] = postData.description;
    metadata["og:description"] = postData.description;
  }
  if (postData.previewImage) {
    metadata[
      "og:image"
    ] = `https://www.charliemistrata.com${postData.previewImage}`;
  }

  useEffect(scrollPastHeaderIfNoSubLink, []);

  return (
    <Layout title={postData.title} metadata={metadata}>
      <h1 className={utilStyles.headingXl} id="title">
        {postData.title}
      </h1>
      <div className={utilStyles.lightText}>
        <Date dateString={postData.date} />
      </div>
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </Layout>
  );
}
