// types/index.ts

export interface Gift {
    image: string;
    name: string;
    value: number;
  }
  
  export interface Product {
    id: string; // Changed from number to string
    category: string;
    gift?: Gift;
    image: string;
    isNew: boolean;
    name: string;
    price: number;
  }
  