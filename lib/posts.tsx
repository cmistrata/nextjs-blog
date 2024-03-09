import Image from "next/image";

import fs from "fs";
import path from "path";
import matter from "gray-matter";

import { unified } from "unified";
import remarkRehype from "remark-rehype";
import remarkToc from "remark-toc";
import remarkMath from "remark-math";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkPrism from "remark-prism";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeMathjax from "rehype-mathjax";

const postsDirectory = path.join(process.cwd(), "posts");

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData: any = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...matterResult.data,
    };
  });

  // Sort posts by date
  return allPostsData
    .filter((data) => data.completed)
    .sort(({ date: a }, { date: b }) => {
      if (a < b) {
        return 1;
      } else if (a > b) {
        return -1;
      } else {
        return 0;
      }
    });
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);

  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  return fileNames.map((fileName) => fileName.replace(/\.md$/, ""));
}

async function convertToHtmlString(markdownString: string): Promise<string> {
  const markdownToHtmlProcessor = unified()
    .use(remarkParse) // convert string to mdast (markdown abstract syntax tree)
    .use(remarkGfm) // Support GFM (tables, autolinks, tasklists, strikethrough)
    .use(remarkToc, { tight: true }) // add toc
    .use(remarkPrism) // highlight code blocks
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true }) // convert mdast to hast (html abstract syntax tree)
    .use(rehypeMathjax)
    .use(rehypeSlug) // add ids to header elements
    // @ts-ignore
    .use(rehypeAutolinkHeadings, { behavior: "wrap" })

    .use(rehypeStringify, { allowDangerousHtml: true }); // convert hast to html string
  const processedContent = await markdownToHtmlProcessor.process(
    markdownString
  );
  return processedContent.toString();
}

export async function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);
  const contentHtml = await convertToHtmlString(matterResult.content);

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}
