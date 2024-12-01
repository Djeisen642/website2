import type { Timestamp } from 'firebase/firestore';

export type LinkDetails = {
  title: string;
  description: string;
  shortDescription: string;
  link: string;
  dateAdded?: Date;
  imageExists?: boolean;
};

export type GameDetails = {
  name: string;
  description: string;
  shortDescription: string;
  image: string;
  imageSrcSet?: string;
  link: string;
  year: number;
};

export type BlogPost = {
  title: string;
  content: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  postedAt?: Timestamp;
  status: 'draft' | 'published';
  author: string;
  id?: string;
};

export type RGBObject = {
  r: number;
  g: number;
  b: number;
};
