import React from "react";
import { Result } from "../types";
import { useBooks } from "../BooksContext";
import { Link } from "react-router-dom";

type Props = {
  info: Result;
  showDelete: boolean;
};

const SingleFavourite: React.FC<Props> = ({ info, showDelete }) => {
  const {
    id,
    volumeInfo: { imageLinks, title },
  } = info;
  const { handleDelete, isBookDeletedFavourites } = useBooks();
  const slideRef = React.useRef(null);

  return (
    <div
      ref={slideRef}
      className={
        isBookDeletedFavourites.includes(id)
          ? "book-collection-single removed"
          : "book-collection-single"
      }
    >
      <button
        className={`${
          showDelete || window.innerWidth > 800
            ? "delete-btn"
            : "delete-btn off"
        }`}
        onClick={(e: any) => {
          handleDelete(id, "Favourites");
          setTimeout(() => {
            e.target.parentElement.parentElement.style.width = "0px";
            e.target.parentElement.parentElement.style.margin = "0px";
          }, 500);
        }}
      >
        <p>DELETE</p>
      </button>

      <Link to={`/books/${id}`}>
        <img src={imageLinks.thumbnail} alt="cover" />
        <p>{title}</p>
      </Link>
    </div>
  );
};

export default SingleFavourite;
