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
  books: Book[];
  email: string;
  password: string;
  currentUser: Record<string, unknown>;
  token: string;
}