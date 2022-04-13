import React from "react";
import { Result } from "../types";
import { useBooks } from "../BooksContext";
import { Link } from "react-router-dom";

type Props = {
  info: Result;
};

const SingleToRead: React.FC<Props> = ({ info }) => {
  const {
    id,
    volumeInfo: { imageLinks, title },
  } = info;
  const { handleDelete, isBookDeletedToRead } = useBooks();
  const slideRef = React.useRef(null);

  return (
    <div
      ref={slideRef}
      className={
        isBookDeletedToRead.includes(id)
          ? "book-collection-single removed"
          : "book-collection-single"
      }
    >
      <button
        className="delete-btn"
        onClick={() => {
          handleDelete(id, "To Read");
        }}
      >
        <p>DELETE</p>
      </button>

      <Link to={`/books/${id}`}>
        <img
          src={imageLinks ? imageLinks.thumbnail : "./images/questionMark.webp"}
          alt="cover"
        />
        <p>{title}</p>
      </Link>
    </div>
  );
};

export default SingleToRead;
