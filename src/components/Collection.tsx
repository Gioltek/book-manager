import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import SingleFavourite from "./SingleFavourite";
import SingleToRead from "./SingleToRead";
import SingleFinished from "./SingleFinished";
import ShowMore from "./ShowMore";

import { useBooks } from "../BooksContext";
import { useLogin } from "../LoginContext";
import { Result } from "../types";

// SWIPERJS
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper";
import "swiper/scss";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
// ICONS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons/faAngleDown";
import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";

const Collection = () => {
  const { library } = useBooks();
  const { setIsLoading, setCurrentPage } = useLogin();

  const [toReadFetched, setToReadFetched] = useState<Result[]>([]);
  const [finishedFetched, setFinishedFetched] = useState<Result[]>([]);
  const [favouritesFetched, setFavouritesFetched] = useState<Result[]>([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [canRender, setCanRender] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [showMoreOff, setShowMoreOff] = useState(false);
  const [showMore, setShowMore] = useState("");
  const refetch = localStorage.getItem("refetch");

  // ADJUST SLIDES BASED ON WINDOW WIDTH
  useEffect(() => {
    const updateWindowDimensions = () => {
      const newWidth = window.innerWidth;
      setWindowWidth(newWidth);
    };

    window.addEventListener("resize", updateWindowDimensions);

    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);

  // SET PAGE FOR NAVBAR
  useEffect(() => {
    setCurrentPage(window.location.href);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("refetch") === null) {
      localStorage.setItem("refetch", "TRUE");
    }
    setIsLoading(true);

    async function fetchData(id: string) {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes/${id}`
      );
      const data: Result = await res.json();

      return data;
      //TODO HANDLE ERRORS
    }

    function fetchPromises(array: string[], category: string) {
      const toReadPromises: Promise<Result>[] = array.map(async (id) => {
        const data = await fetchData(id);
        return data;
      });

      Promise.all(toReadPromises).then((res) =>
        localStorage.setItem(category, JSON.stringify(res))
      );
    }

    function setStates() {
      const toReadLS = localStorage.getItem("TO READ");
      const finishedLS = localStorage.getItem("FINISHED");
      const favouritesLS = localStorage.getItem("FAVOURITES");
      if (toReadLS) {
        setToReadFetched(JSON.parse(toReadLS));
      }
      if (finishedLS) {
        setFinishedFetched(JSON.parse(finishedLS));
      }
      if (favouritesLS) {
        setFavouritesFetched(JSON.parse(favouritesLS));
      }
    }

    if (refetch === "TRUE") {
      if (library.books) {
        console.log("try");

        const toReadIds = [...library.books.toRead];
        const finishedIds = [...library.books.finished];
        const favouritesIds = [...library.books.favourites];
        try {
          fetchPromises(toReadIds, "TO READ");
          fetchPromises(finishedIds, "FINISHED");
          fetchPromises(favouritesIds, "FAVOURITES");
          setStates();
          localStorage.setItem("refetch", "FALSE");
          const timeout = setTimeout(() => {
            window.history.go();
            setCanRender(true);
          }, 1000);
          return () => clearTimeout(timeout);
        } catch (error) {
          console.log(error);
          setIsLoading(false);
          window.location.href = "/oops";
          localStorage.setItem("refetch", "FALSE");
          //TODO RENDER HOMEPAGE
        }
      } else if (library.books === undefined) {
        localStorage.setItem("refetch", "TRUE");
        console.log("undef lib");
      } else {
        console.log("boh");
        console.log(library);

        localStorage.setItem("refetch", "FALSE");
        const timeout = setTimeout(() => {
          window.history.go();
          setCanRender(true);
        }, 1000);
        return () => clearTimeout(timeout);
      }
    } else {
      setStates();
      setCanRender(true);
      setIsLoading(false);
    }
  }, [library]);

  const handleCloseModal = () => {
    setShowMoreOff(true);
    const timeout = setTimeout(() => {
      document.body.classList.remove("modal-open");
      setShowMoreOff(false);
      setShowMore("");
      window.location.reload();
      clearTimeout(timeout);
    }, 600);
  };

  return canRender ? (
    <main className="collections-main">
      <h1>Your Collection</h1>
      <div className="delete-mode">
        <p>Delete mode</p>
        <label className="switch">
          <input
            type="checkbox"
            checked={deleteMode}
            onChange={(e) => setDeleteMode(e.target.checked)}
          />
          <span className="slider round"></span>
        </label>
      </div>

      {showMore === "To Read" ? (
        <div className={showMoreOff ? "show-more off" : "show-more"}>
          <div className="flex-header">
            <h2>
              Books<span> {showMore}</span>
            </h2>
            <FontAwesomeIcon
              className="close-modal"
              icon={faClose}
              onClick={handleCloseModal}
            />
          </div>
          {toReadFetched.map((item: Result) => (
            <ShowMore info={item} key={item.id} label={showMore} />
          ))}
        </div>
      ) : (
        <div className="books-container">
          <h2>
            Books<span> To Read</span>
          </h2>
          <div className="underline"></div>
          {toReadFetched.length < 1 && (
            <div className="default-no-books">
              <p>You have not added any book in this collection yet.</p>
              <Link to="/">Start your research</Link>
            </div>
          )}
          <Swiper
            modules={[Scrollbar]}
            spaceBetween={10}
            slidesPerView={windowWidth / 190}
            scrollbar={{ draggable: true }}
            watchOverflow
          >
            {toReadFetched.map((item: Result) => (
              <SwiperSlide key={item.id}>
                <SingleToRead
                  key={item.id}
                  info={item}
                  showDelete={deleteMode}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="show-collection">
            <FontAwesomeIcon
              icon={faAngleDown}
              onClick={() => {
                document.body.classList.add("modal-open");
                setShowMore("To Read");
              }}
            />
          </div>
        </div>
      )}

      {showMore === "Finished" ? (
        <div className={showMoreOff ? "show-more off" : "show-more"}>
          <div className="flex-header">
            <h2>
              <span>{showMore} </span>Books
            </h2>
            <FontAwesomeIcon
              className="close-modal"
              icon={faClose}
              onClick={handleCloseModal}
            />
          </div>
          {finishedFetched.map((item: Result) => (
            <ShowMore info={item} key={item.id} label={showMore} />
          ))}
        </div>
      ) : (
        <div className="books-container">
          <h2>
            <span>Finished </span>Books
          </h2>
          <div className="underline"></div>
          {finishedFetched.length < 1 && (
            <div className="default-no-books">
              <p>You have not added any book in this collection yet.</p>
              <Link to="/">Start your research</Link>
            </div>
          )}
          <Swiper
            modules={[Scrollbar]}
            spaceBetween={10}
            slidesPerView={windowWidth / 190}
            scrollbar={{ draggable: true }}
            watchOverflow
          >
            {finishedFetched.map((item: Result) => (
              <SwiperSlide key={item.id}>
                <SingleFinished
                  key={item.id}
                  info={item}
                  showDelete={deleteMode}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="show-collection">
            <FontAwesomeIcon
              icon={faAngleDown}
              onClick={() => {
                document.body.classList.add("modal-open");
                setShowMore("Finished");
              }}
            />
          </div>
        </div>
      )}

      {showMore === "Favourites" ? (
        <div className={showMoreOff ? "show-more off" : "show-more"}>
          <div className="flex-header">
            <h2>
              <span>Favourite </span>Books
            </h2>
            <FontAwesomeIcon
              className="close-modal"
              icon={faClose}
              onClick={handleCloseModal}
            />
          </div>
          {favouritesFetched.map((item: Result) => (
            <ShowMore info={item} key={item.id} label={showMore} />
          ))}
        </div>
      ) : (
        <div className="books-container">
          <h2>
            <span>Favourite </span>Books
          </h2>
          <div className="underline"></div>
          {favouritesFetched.length < 1 && (
            <div className="default-no-books">
              <p>You have not added any book in this collection yet.</p>
              <Link to="/">Start your research</Link>
            </div>
          )}
          <Swiper
            modules={[Scrollbar]}
            spaceBetween={10}
            slidesPerView={windowWidth / 190}
            scrollbar={{ draggable: true }}
            watchOverflow
          >
            {favouritesFetched.map((item: Result) => (
              <SwiperSlide key={item.id}>
                <SingleFavourite
                  key={item.id}
                  info={item}
                  showDelete={deleteMode}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="show-collection">
            <FontAwesomeIcon
              icon={faAngleDown}
              onClick={() => {
                document.body.classList.add("modal-open");
                setShowMore("Favourites");
              }}
            />
          </div>
        </div>
      )}
    </main>
  ) : null;
};

export default Collection;
