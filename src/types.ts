export type Results = {
  items: Result[];
  kind: string;
  totalItems: 794;
};

type Result1 = {
  accessInfo: any;
  etag: string;
  id: string;
  kind: string;
  saleInfo: any;
  searchInfo: SearchInfo;
  selfLink: string;
  volumeInfo: VolumeInfo;
};

export type Result = Omit<Result1, "accessInfo" | "saleInfo">;

//! SUBTYPES OF RESULT

type SearchInfo = {
  textSnippet: string;
};
type VolumeInfo = {
  allowAnonLogging: boolean;
  authors: string[];
  categories: string[];
  canonicalVolumeLink: string;
  contentVersion: string;
  imageLinks: ImageLinks;
  industryIdentifiers: IndustryIdentifier[];
  infoLink: string;
  language: string;
  maturityRating: string;
  panelizationSummary: PanelizationSummary;
  previewLink: string;
  pageCount: number;
  publishedDate: string;
  printType: string;
  publisher: string;
  readingModes: ReadingModes;
  title: string;
};
type ImageLinks = {
  smallThumbnail: string;
  thumbnail: string;
};
type IndustryIdentifier = {
  type: string;
  identifier: string;
};
type PanelizationSummary = {
  containsEpubBubbles: boolean;
  containsImageBubbles: boolean;
};
type ReadingModes = {
  image: boolean;
  text: boolean;
};

export type LoginContextType = {
  currentUser: CurrentUser | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<CurrentUser | null>>;
  isLoggedIn: string | null;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<string | null>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => void;
  currentPage: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
};

export type CurrentUser = {
  _tokenResponse: TokenResponse;
  operationType: string;
  providerId: string;
  user: any;
};

export type TokenResponse = {
  context: string;
  displayName: string;
  email: string;
  emailVerified: boolean;
  expiresIn: string;
  federatedId: string;
  firstName: string;
  fullName: string;
  idToken: string;
  kind: string;
  lastName: string;
  localId: string;
  oauthAccessToken: string;
  oauthExpireIn: number;
  oauthIdToken: string;
  photoUrl: string;
  providerId: string;
  rawUserInfo: string;
  refreshToken: string;
};

// FIRESTORE OBJECTS

export type Library = {
  books?: Books;
  id: string;
  uid: string;
};

export type Books = {
  favourites: string[];
  finished: string[];
  toRead: string[];
};

// BOOKS CONTEXT TYPES
export type BooksContextType = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  handleButton: (bookId: string, label: string, title: string) => void;
  checkActive: (bookId: string, label?: string) => string;
  toRead: string[];
  finished: string[];
  favourites: string[];
  modal: Modal;
  library: Library;
  showModal: boolean;
  handleDelete: (bookId: string, label: string) => void;
  isBookDeletedToRead: string[];
  isBookDeletedFinished: string[];
  isBookDeletedFavourites: string[];
};

export type Modal = {
  title: string;
  label: string;
};
