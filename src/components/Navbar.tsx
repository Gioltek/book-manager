import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../LoginContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons/faBars";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";

const Navbar = () => {
  const { currentUser, currentPage } = useLogin();
  const [menu, setMenu] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [checkCurrentPage, setCheckCurrentPage] = useState("");

  useEffect(() => {
    function checkPage() {
      if (currentPage.indexOf("collection") >= 0) {
        setCheckCurrentPage("collection");
      } else if (currentPage.indexOf("profile") >= 0) {
        setCheckCurrentPage("profile");
      } else {
        setCheckCurrentPage("home");
      }
    }
    checkPage();
  }, [currentPage]);

  useEffect(() => {
    setIsDisabled(true);
    const timeout = setTimeout(() => {
      setIsDisabled(false);
    }, 800);
    return () => clearTimeout(timeout);
  }, [menu]);

  return (
    <nav>
      <div className="logo">
        <a href="/">bookmanager</a>
      </div>
      <div className="links">
        <ul>
          <li>
            <Link
              to="/"
              className={
                checkCurrentPage === "home"
                  ? "active-section"
                  : currentUser === null
                  ? "disabled-link"
                  : ""
              }
            >
              home
            </Link>
          </li>
          <li>
            <a
              href="/collection"
              className={
                checkCurrentPage === "collection"
                  ? "active-section"
                  : currentUser === null
                  ? "disabled-link"
                  : ""
              }
            >
              collection
            </a>
          </li>
          <li>
            <Link
              to="/profile"
              className={
                checkCurrentPage === "profile"
                  ? "active-section"
                  : currentUser === null
                  ? "disabled-link"
                  : ""
              }
            >
              <span>
                profile
                <img src={currentUser?.user.photoURL} alt="profile" />
              </span>
            </Link>
          </li>
        </ul>
      </div>
      <button
        className={`${menu ? "open-menu" : "closed-menu"} `}
        onClick={() => {
          if (document.body.classList.contains("modal-open")) {
            document.body.classList.remove("modal-open");
          } else document.body.classList.add("modal-open");
          setMenu(!menu);
        }}
        disabled={isDisabled}
      >
        {menu ? (
          <FontAwesomeIcon icon={faXmark} />
        ) : (
          <FontAwesomeIcon icon={faBars} />
        )}
      </button>
      <div className={`${menu ? "menu" : "menu off"} `}>
        <ul>
          <li>
            <Link
              to="/"
              className={checkCurrentPage === "home" ? "active-section" : ""}
              onClick={() => setMenu(false)}
            >
              home
            </Link>
          </li>
          <li>
            <a
              href="/collection"
              className={
                checkCurrentPage === "collection" ? "active-section" : ""
              }
              onClick={() => setMenu(false)}
            >
              collection
            </a>
          </li>
          <li>
            <Link
              to="/profile"
              className={checkCurrentPage === "profile" ? "active-section" : ""}
              onClick={() => setMenu(false)}
            >
              profile
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
