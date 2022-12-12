//@ts-nocheck
import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import { getComments } from "../services";
import moment from "moment/moment";

/**
 * 需要注意：评论发表后在 Hygraph 的后端存储，状态是 draft， 也就是说还不能被 API 所取得，但是可以被网页端的 API Playground获取。
 * @param slug
 * @constructor
 */
const Comments = ({ slug }) => {
  const [comments, setComments] = useState([]);
  useEffect(() => {
    getComments(slug).then((result) => setComments(result));
  }, []);
  return (
    <>
      {comments.length > 0 && (
        <div className="bg-white shadow-lg rounded-lg p-8 pb-12 mb-8">
          <h3 className="text-xl mb-8 font-semibold border-b pb-4">
            {comments.length} Comments
          </h3>
          {comments.map((comment) => (
            <div
              key={comment.createdAt}
              className="border-b border-gray-100 mb-4"
            >
              <p className="mb-4">
                <span className={"font-semibold"}>{comment.name}</span> on{" "}
                {moment(comment.createdAt).format("MMM DD, YYYY")}
              </p>
              {/* whitespace-pre-line 是一个 CSS 属性，它可以让文本中的空格在换行前保留。
              它与 white-space: pre-line 不同，后者会将空格替换为一个单独的空格，而 whitespace-pre-line 会保留多个连续的空格，并在换行处进行换行。 */}
              <p className="whitespace-pre-line text-gray-600 w-full">
                {parse(comment.comment)}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Comments;
