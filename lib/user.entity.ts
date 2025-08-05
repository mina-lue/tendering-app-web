export interface User {
  name: string;

  email: string;

  password: string;

  urlToDoc?: string;

  sex?: string;

  phone: string;

  role: 'VENDOR' | 'BUYER';
}