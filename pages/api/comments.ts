// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { GraphQLClient, gql } from "graphql-request";

type Data = {
  name: string;
};
// !是 not null assertion，表示这个变量一定不是null，否则报错
const graphQLAPI: string = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT!;

export default async function comments(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { name, email, slug, comment } = req.body;

  const graphQLClient = new GraphQLClient(graphQLAPI, {
    headers: {
      authorization: `Bearer ${process.env.NEXT_PUBLIC_GRAPHCMS_TOKEN}`,
    },
  });

  const query = gql`
    mutation CreateComment(
      $name: String!
      $email: String!
      $comment: String!
      $slug: String!
    ) {
      createComment(
        data: {
          name: $name
          email: $email
          comment: $comment
          post: { connect: { slug: $slug } }
        }
      ) {
        id
      }
    }
  `;

  const result = await graphQLClient.request(query, {
    name,
    email,
    slug,
    comment,
  });

  return res.status(200).send(result);
}
