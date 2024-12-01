export interface Gift {
  name: string;
  value: number;
  image: string;
}

export interface Product {
  rating: number;
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  gift?: Gift;
  isNew?: boolean;
}

