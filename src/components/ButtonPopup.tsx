import React from "react";
import { useBooks } from "../BooksContext";

const ButtonPopup = () => {
  const { modal, showModal } = useBooks();
  return (
    <div className={`button-popup ${showModal ? "on" : "off"}`}>
      "{modal.title}" has been added to the "<span>{modal.label}</span>"
      collection
    </div>
  );
};

export default ButtonPopup;
