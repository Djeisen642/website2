export type LinkDetails = {
  title: string;
  description: string;
  shortDescription: string;
  link: string;
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
