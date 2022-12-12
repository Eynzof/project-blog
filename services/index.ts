//@ts-nocheck
import { request, gql } from "graphql-request";

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT;
/**
 * 发送一个 GraphQL 请求，获取所有文章的全部信息。
 * @returns {Promise<Array>} 返回一个 Promise，它包含包含文章信息的数组。
 */
export const getPosts = async () => {
  const query = gql`
    query MyQuery {
      postsConnection {
        edges {
          node {
            author {
              bio
              name
              id
              photo {
                url
              }
            }
            createdAt
            slug
            title
            excerpt
            featuredImage {
              url
            }
            categories {
              name
              slug
            }
          }
        }
      }
    }
  `;

  const result = await request(graphqlAPI, query);

  return result.postsConnection.edges;
};
/**
 * 发送一个 GraphQL 请求，获取所有分类的信息。
 * @returns {Promise<Array>} 返回一个 Promise，它包含分类信息的数组。
 */
export const getCategories = async () => {
  const query = gql`
    query GetCategories {
      categories {
        name
        slug
      }
    }
  `;

  const result = await request(graphqlAPI, query);

  return result.categories;
};

/**
 * 发送一个 GraphQL 请求，获取所有分类的信息。
 * @returns {Promise<Array>} 返回一个 Promise，它包含分类信息的数组。
 */
export const getComments = async (slug) => {
  console.log(slug);
  const query = gql`
    query GetComments($slug: String!) {
      comments(where: { post: { slug: $slug } }) {
        name
        createdAt
        comment
      }
    }
  `;

  const result = await request(graphqlAPI, query, { slug });
  console.log(result);
  return result.comments;
};
/**
 * 获取指定文章的详细信息
 * @param slug 文章的 slug
 * @returns 文章的详细信息
 */

export const getPostDetails = async (slug) => {
  const query = gql`
    query GetPostDetails($slug: String!) {
      post(where: { slug: $slug }) {
        title
        excerpt
        featuredImage {
          url
        }
        author {
          name
          bio
          photo {
            url
          }
        }
        createdAt
        slug
        content {
          raw
        }
        categories {
          name
          slug
        }
      }
    }
  `;

  const result = await request(graphqlAPI, query, { slug });

  return result.post;
};

export const getSimilarPosts = async (categories, slug) => {
  const query = gql`
    query GetPostDetails($slug: String!, $categories: [String!]) {
      posts(
        where: {
          slug_not: $slug
          AND: { categories_some: { slug_in: $categories } }
        }
        last: 3
      ) {
        title
        featuredImage {
          url
        }
        createdAt
        slug
      }
    }
  `;
  const result = await request(graphqlAPI, query, { slug, categories });

  return result.posts;
};

export const getRecentPosts = async () => {
  const query = gql`
    query GetPostDetails {
      posts(orderBy: createdAt_ASC, last: 3) {
        title
        featuredImage {
          url
        }
        createdAt
        slug
      }
    }
  `;
  const result = await request(graphqlAPI, query);

  return result.posts;
};
/**
 * 向本地后端发送请求，endpoint = /api
 * @param commentObj 要提交的评论对象
 */
export const submitComment = async (commentObj) => {
  const result = await fetch("/api/comments", {
    method: "POST",
    body: JSON.stringify(commentObj),
  });
  return result.json();
};
