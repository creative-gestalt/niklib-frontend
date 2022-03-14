export interface Book {
  _id: string;
  title: string;
  description: string;
  img_name: string;
  author: string;
  date_posted: string;
  filename: string;
}

export interface State {
  books: Record<string, Book[]>[];
  email: string;
  currentUser: Record<string, unknown>;
  token: string;
  currentTab: number;
  display: string;
  sessionTime: number;
}
