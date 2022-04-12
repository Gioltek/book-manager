import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import { CurrentUser, Library, BooksContextType, Modal } from "./types";
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
  const [toRead, setToRead] = useState<string[]>([]);
  const [finished, setFinished] = useState<string[]>([]);
  const [favourites, setFavourites] = useState<string[]>([]);
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
    }

    if (Object.keys(library).length === 0) {
      // ADD NEW ITEM TO DATABASE
      setBooksToDatabase();
      localStorage.setItem("refetch", "TRUE"); // triggers rerender on collection
    } else {
      // MODIFY DATABASE
      updateBooksInDatabase(library.id);
      localStorage.setItem("refetch", "TRUE"); // triggers rerender on collection
    }
  }, [triggerDatabase]);

  //? BUTTON POPUP

  React.useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setShowModal(false);
    }, 3000);
    return () => {
      clearTimeout(timeoutRef.current as NodeJS.Timeout);
    };
  }, [modal]);

  function handleButton(bookId: string, label: string, title: string) {
    if (label === "To Read") {
      if (toRead.some((item) => item === bookId)) {
        setToRead(toRead.filter((item) => item !== bookId));
        setTriggerDatabase(triggerDatabase + 1);
        return;
      }
      setToRead([...toRead, bookId]);
    }
    if (label === "Finished") {
      if (finished.some((item) => item === bookId)) {
        setFinished(finished.filter((item) => item !== bookId));
        setTriggerDatabase(triggerDatabase + 1);
        return;
      }
      setFinished([...finished, bookId]);
    }
    if (label === "Favourites") {
      if (favourites.some((item) => item === bookId)) {
        setFavourites(favourites.filter((item) => item !== bookId));
        setTriggerDatabase(triggerDatabase + 1);
        return;
      }
      setFavourites([...favourites, bookId]);
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
    if (label === "To Read") {
      if (toRead.some((item) => item === bookId)) {
        setToRead(toRead.filter((item) => item !== bookId));
        setTriggerDatabase(triggerDatabase + 1);
        setIsBookDeletedToRead([...isBookDeletedToRead, bookId]);
      }
      return;
    } else if (label === "Finished") {
      if (finished.some((item) => item === bookId)) {
        setFinished(finished.filter((item) => item !== bookId));
        setTriggerDatabase(triggerDatabase + 1);
        setIsBookDeletedFinished([...isBookDeletedFinished, bookId]);
      }
      return;
    } else if (label === "Favourites") {
      if (favourites.some((item) => item === bookId)) {
        setFavourites(favourites.filter((item) => item !== bookId));
        setTriggerDatabase(triggerDatabase + 1);
        setIsBookDeletedFavourites([...isBookDeletedFavourites, bookId]);
      }
      return;
    }
  }

  function checkActive(bookId: string, label?: string) {
    if (toRead.some((item) => item === bookId) && label === "READ") {
      return "active";
    }
    if (finished.some((item) => item === bookId) && label === "FINISHED") {
      return "active";
    }
    if (favourites.some((item) => item === bookId) && label === "FAVOURITES") {
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
  };

  return (
    <BooksContext.Provider value={value}>{children}</BooksContext.Provider>
  );
}
