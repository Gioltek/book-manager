import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import {
  CurrentUser,
  Library,
  BooksContextType,
  Modal,
  ResultLS,
  BookData,
} from "./types";
import { db } from "./firebase";
import {
  addDoc,
  collection,
  getDocs,
  updateDoc,
  doc,
} from "@firebase/firestore";

export function useBooks() {
  return useContext(BooksContext);
}

const BooksContext = createContext<BooksContextType>({} as BooksContextType);

export function BooksProvider({ children }: { children: React.ReactNode }) {
  const [search, setSearch] = useState<string>("");
  const [library, setLibrary] = useState<Library>({} as Library);
  const [toRead, setToRead] = useState<BookData[]>([]);
  const [finished, setFinished] = useState<BookData[]>([]);
  const [favourites, setFavourites] = useState<BookData[]>([]);
  const [triggerDatabase, setTriggerDatabase] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modal, setModal] = useState<Modal>({} as Modal);
  const [updateLib, setUpdateLib] = useState(0);
  const [isBookDeletedToRead, setIsBookDeletedToRead] = useState<string[]>([]);
  const [isBookDeletedFinished, setIsBookDeletedFinished] = useState<string[]>(
    []
  );
  const [isBookDeletedFavourites, setIsBookDeletedFavourites] = useState<
    string[]
  >([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Collection states
  const [toReadFetched, setToReadFetched] = useState<ResultLS[]>(
    (localStorage.getItem("TO READ") &&
      JSON.parse(localStorage.getItem("TO READ") || "")) ||
      []
  );
  const [finishedFetched, setFinishedFetched] = useState<ResultLS[]>(
    (localStorage.getItem("FINISHED") &&
      JSON.parse(localStorage.getItem("FINISHED") || "")) ||
      []
  );
  const [favouritesFetched, setFavouritesFetched] = useState<ResultLS[]>(
    (localStorage.getItem("FAVOURITES") &&
      JSON.parse(localStorage.getItem("FAVOURITES") || "")) ||
      []
  );
  const [disableOthers, setDisableOthers] = useState(false);
  const usersCollectionRef = collection(db, "users");
  const skipFirstRender = useRef(true);
  const timeoutRef: { current: NodeJS.Timeout | null } = useRef(null);
  const user: CurrentUser | null =
    localStorage.getItem("user") &&
    JSON.parse(localStorage.getItem("user") || "");

  //? INITIALISE LIBRARY

  useEffect(() => {
    async function getUsersBooks() {
      if (user) {
        const data = await getDocs(usersCollectionRef);

        const currentUserLib = data.docs.find((doc) => {
          return doc.data().uid === user.user.uid;
        });

        if (currentUserLib) {
          const newLibrary: Library = {
            ...currentUserLib?.data(),
            id: currentUserLib?.id,
            uid: user.user.uid,
          };

          if (newLibrary.uid === user.user.uid) {
            setLibrary(newLibrary);

            if (newLibrary.books) {
              setToRead(newLibrary.books.toRead);
              setFinished(newLibrary.books.finished);
              setFavourites(newLibrary.books.favourites);
            }
          }
        }
      }
    }
    getUsersBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateLib]);

  //? DATABASE

  useEffect(() => {
    if (skipFirstRender.current) {
      skipFirstRender.current = false;
      return;
    }

    async function setBooksToDatabase() {
      if (user) {
        await addDoc(usersCollectionRef, {
          books: { toRead, finished, favourites },
          uid: user.user.uid,
        });
        setUpdateLib(updateLib + 1);
      }
    }

    async function updateBooksInDatabase(id: string) {
      const newFields = {
        books: {
          toRead,
          finished,
          favourites,
        },
      };
      const userDoc = doc(db, "users", id);
      await updateDoc(userDoc, newFields);
      setUpdateLib(updateLib + 1);
    }
    if (Object.keys(library).length === 0) {
      // ADD NEW ITEM TO DATABASE
      setBooksToDatabase();
    } else {
      // MODIFY DATABASE
      updateBooksInDatabase(library.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerDatabase]);

  //? COLLECTION FETCHING
  useEffect(() => {
    const toReadLS = localStorage.getItem("TO READ");
    const finishedLS = localStorage.getItem("FINISHED");
    const favouritesLS = localStorage.getItem("FAVOURITES");

    if (toReadLS) {
      const parsed = JSON.parse(toReadLS);
      if (parsed.length === 0 && toRead.length > 0) {
        localStorage.setItem("TO READ", JSON.stringify(toRead));
      }
    }
    if (finishedLS) {
      const parsed = JSON.parse(finishedLS);
      if (parsed.length === 0 && finished.length > 0) {
        localStorage.setItem("FINISHED", JSON.stringify(finished));
      }
    }
    if (favouritesLS) {
      const parsed = JSON.parse(favouritesLS);
      if (parsed.length === 0 && favourites.length > 0) {
        localStorage.setItem("FAVOURITES", JSON.stringify(favourites));
      }
    }
  }, [toRead, finished, favourites]);

  //? BUTTON POPUP

  React.useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setShowModal(false);
    }, 3000);
    return () => {
      clearTimeout(timeoutRef.current as NodeJS.Timeout);
    };
  }, [modal]);

  function handleToRead(bookId: string, title: string, img: string) {
    const toReadLS = localStorage.getItem("TO READ");
    if (toRead.some((item) => item.bookId === bookId)) {
      setToRead(toRead.filter((item) => item.bookId !== bookId));
      setTriggerDatabase(triggerDatabase + 1);
      if (toReadLS) {
        const objectLS: ResultLS[] = [...JSON.parse(toReadLS)];
        localStorage.setItem(
          "TO READ",
          JSON.stringify(objectLS.filter((item) => item.bookId !== bookId))
        );
        setToReadFetched(objectLS.filter((item) => item.bookId !== bookId));
      }
      return;
    }
    setToRead([...toRead, { bookId, img, title }]);
    if (toReadLS) {
      const objectLS: ResultLS[] = [...JSON.parse(toReadLS)];
      const newLS = [{ bookId, title, img }, ...objectLS];
      localStorage.setItem("TO READ", JSON.stringify(newLS));
      setToReadFetched(newLS);
    } else {
      localStorage.setItem("TO READ", JSON.stringify([{ bookId, title, img }]));
      setToReadFetched([{ bookId, title, img }]);
    }
  }
  function handleFinished(bookId: string, title: string, img: string) {
    const finishedLS = localStorage.getItem("FINISHED");
    if (finished.some((item) => item.bookId === bookId)) {
      setFinished(finished.filter((item) => item.bookId !== bookId));
      setTriggerDatabase(triggerDatabase + 1);
      if (finishedLS) {
        const objectLS: ResultLS[] = [...JSON.parse(finishedLS)];
        localStorage.setItem(
          "FINISHED",
          JSON.stringify(objectLS.filter((item) => item.bookId !== bookId))
        );
        setFinishedFetched(objectLS.filter((item) => item.bookId !== bookId));
      }
      return;
    }
    setFinished([...finished, { bookId, img, title }]);
    if (finishedLS) {
      const objectLS: ResultLS[] = [...JSON.parse(finishedLS)];
      const newLS = [{ bookId, title, img }, ...objectLS];
      localStorage.setItem("FINISHED", JSON.stringify(newLS));
      setFinishedFetched(newLS);
    } else {
      localStorage.setItem(
        "FINISHED",
        JSON.stringify([{ bookId, title, img }])
      );
      setFinishedFetched([{ bookId, title, img }]);
    }
  }

  function handleFavourites(bookId: string, title: string, img: string) {
    const favouritesLS = localStorage.getItem("FAVOURITES");

    if (favourites.some((item) => item.bookId === bookId)) {
      setFavourites(favourites.filter((item) => item.bookId !== bookId));
      setTriggerDatabase(triggerDatabase + 1);
      if (favouritesLS) {
        const objectLS: ResultLS[] = [...JSON.parse(favouritesLS)];
        localStorage.setItem(
          "FAVOURITES",
          JSON.stringify(objectLS.filter((item) => item.bookId !== bookId))
        );
        setFavouritesFetched(objectLS.filter((item) => item.bookId !== bookId));
      }
      return;
    }
    setFavourites([...favourites, { bookId, img, title }]);
    if (favouritesLS) {
      const objectLS: ResultLS[] = [...JSON.parse(favouritesLS)];
      const newLS = [{ bookId, title, img }, ...objectLS];
      localStorage.setItem("FAVOURITES", JSON.stringify(newLS));
      setFavouritesFetched(newLS);
    } else {
      localStorage.setItem(
        "FAVOURITES",
        JSON.stringify([{ bookId, title, img }])
      );
      setFavouritesFetched([{ bookId, title, img }]);
    }
  }

  function handleButton(
    bookId: string,
    label: string,
    title: string,
    img: string
  ) {
    if (label === "To Read") {
      setDisableOthers(true);
      handleToRead(bookId, title, img);
      //? Make sure to not bug database
      if (Object.keys(library).length === 0) {
        const timeout = setTimeout(() => {
          clearTimeout(timeout);
          setDisableOthers(false);
        }, 500);
      } else {
        const timeout = setTimeout(() => {
          clearTimeout(timeout);
          setDisableOthers(false);
        }, 200);
      }
    }
    if (label === "Finished") {
      setDisableOthers(true);
      handleFinished(bookId, title, img);
      //? Make sure to not bug database
      if (Object.keys(library).length === 0) {
        const timeout = setTimeout(() => {
          clearTimeout(timeout);
          setDisableOthers(false);
        }, 500);
      } else {
        const timeout = setTimeout(() => {
          clearTimeout(timeout);
          setDisableOthers(false);
        }, 200);
      }
    }
    if (label === "Favourites") {
      setDisableOthers(true);
      handleFavourites(bookId, title, img);
      //? Make sure to not bug database
      if (Object.keys(library).length === 0) {
        const timeout = setTimeout(() => {
          clearTimeout(timeout);
          setDisableOthers(false);
        }, 500);
      } else {
        const timeout = setTimeout(() => {
          clearTimeout(timeout);
          setDisableOthers(false);
        }, 200);
      }
    }

    if (!showModal) {
      setModal({
        title,
        label,
      });
      setShowModal(true);
    } else {
      setShowModal(false);
      clearTimeout(timeoutRef.current as NodeJS.Timeout);
      setModal({
        title,
        label,
      });
      setShowModal(true);
    }

    setTriggerDatabase(triggerDatabase + 1);
  }

  function handleDelete(bookId: string, label: string) {
    const toReadLS = localStorage.getItem("TO READ");
    const finishedLS = localStorage.getItem("FINISHED");
    const favouritesLS = localStorage.getItem("FAVOURITES");
    if (label === "To Read") {
      if (toRead.some((item) => item.bookId === bookId)) {
        setToRead(toRead.filter((item) => item.bookId !== bookId));
        setTriggerDatabase(triggerDatabase + 1);
        setIsBookDeletedToRead([...isBookDeletedToRead, bookId]);
      }
      if (toReadLS && toReadFetched.some((item) => item.bookId === bookId)) {
        setIsDeleting(true);
        const timeout = setTimeout(() => {
          const objectLS: ResultLS[] = [...JSON.parse(toReadLS)];
          localStorage.setItem(
            "TO READ",
            JSON.stringify(objectLS.filter((item) => item.bookId !== bookId))
          );
          setToReadFetched(objectLS.filter((item) => item.bookId !== bookId));
          setIsDeleting(false);
          clearTimeout(timeout);
        }, 700);
      }
      return;
    } else if (label === "Finished") {
      if (finished.some((item) => item.bookId === bookId)) {
        setFinished(finished.filter((item) => item.bookId !== bookId));
        setTriggerDatabase(triggerDatabase + 1);
        setIsBookDeletedFinished([...isBookDeletedFinished, bookId]);
      }
      if (
        finishedLS &&
        finishedFetched.some((item) => item.bookId === bookId)
      ) {
        setIsDeleting(true);
        const timeout = setTimeout(() => {
          const objectLS: ResultLS[] = [...JSON.parse(finishedLS)];
          localStorage.setItem(
            "FINISHED",
            JSON.stringify(objectLS.filter((item) => item.bookId !== bookId))
          );
          setFinishedFetched(objectLS.filter((item) => item.bookId !== bookId));
          setIsDeleting(false);
          clearTimeout(timeout);
        }, 700);
      }
      return;
    } else if (label === "Favourites") {
      if (favourites.some((item) => item.bookId === bookId)) {
        setFavourites(favourites.filter((item) => item.bookId !== bookId));
        setTriggerDatabase(triggerDatabase + 1);
        setIsBookDeletedFavourites([...isBookDeletedFavourites, bookId]);
      }
      if (
        favouritesLS &&
        favouritesFetched.some((item) => item.bookId === bookId)
      ) {
        setIsDeleting(true);
        const timeout = setTimeout(() => {
          const objectLS: ResultLS[] = [...JSON.parse(favouritesLS)];
          localStorage.setItem(
            "FAVOURITES",
            JSON.stringify(objectLS.filter((item) => item.bookId !== bookId))
          );
          setFavouritesFetched(
            objectLS.filter((item) => item.bookId !== bookId)
          );
          setIsDeleting(false);
          clearTimeout(timeout);
        }, 700);
      }
      return;
    }
  }

  function checkActive(bookId: string, label?: string) {
    if (toRead.some((item) => item.bookId === bookId) && label === "READ") {
      return "active";
    }
    if (
      finished.some((item) => item.bookId === bookId) &&
      label === "FINISHED"
    ) {
      return "active";
    }
    if (
      favourites.some((item) => item.bookId === bookId) &&
      label === "FAVOURITES"
    ) {
      return "active";
    } else return "not-active";
  }

  const value = {
    search,
    setSearch,
    toRead,
    finished,
    favourites,
    handleButton,
    checkActive,
    modal,
    library,
    showModal,
    handleDelete,
    isBookDeletedToRead,
    isBookDeletedFinished,
    isBookDeletedFavourites,
    toReadFetched,
    finishedFetched,
    favouritesFetched,
    isDeleting,
    disableOthers,
  };

  return (
    <BooksContext.Provider value={value}>{children}</BooksContext.Provider>
  );
}
