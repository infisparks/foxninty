// types/index.ts

export interface Gift {
  name: string;
  value: number;
  image: string;
}

export interface Review {
  id: string;
  reviewer: string;
  rating: number;
  comment: string;
  isFake: boolean;
}

export interface Product {
  id: string;
  key: string;
  name: string;
  category: string;
  price: number;
  description: string;
  warranty: string;
  images: string[];
  gift: Gift;
  isNew?: boolean;
  reviews?: Review[];
  numReviewsToShow: number;
}
