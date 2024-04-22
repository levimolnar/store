import { createContext, useState, useEffect } from 'react';
import axios from "axios";

export interface Product {
  id: number;
  name: string;
  code: string;
  price: number;
  color_options: string[];
  categories: string[];
  description: string;
  image_file?: string;
};

export interface Cart {
  [id: number]: {amount: number};
}


export interface ContextValues {
  products: Product[];
  cart: {
    data: Cart, 
    add: (id: number) => void,
    remove: (id: number) => void,
  },
};

export const ProductContext = createContext<ContextValues>({
  products: [], 
  cart: {
    data: {}, 
    add: () => {},
    remove: () => {},
  },
});

export const ProductProvider = ({ children }: any) => {

  const [productData, setProductData] = useState<Product[]>([]);
  const [cart, setCart] = useState<Cart>({});

  const add = (id: number) => {
    // increase amount by 1 if product already in cart
    // otherwise add product id to cart

    if (Object.keys(cart).includes(String(id))) {
      setCart(prev => {
        const newCart = structuredClone(prev);
        newCart[id].amount += 1;
        return newCart;
      });
    } else {
      setCart(prev => {
        const newCart = structuredClone(prev);
        newCart[id] = {amount: 1};
        return newCart;
      });
    }
  };

  const remove = (id: number) => {

    if (!Object.keys(cart).includes(String(id))) { return };

    // decrease amount by 1 if amount larger than 1
    // otherwise remove product id from cart
    if (cart[id].amount > 1) {
      setCart(prev => {
        const newCart = structuredClone(prev);
        newCart[id].amount -= 1;
        return newCart;
      });
    } else {
      setCart(prev => {
        const newCart = structuredClone(prev);
        delete newCart[id];
        return newCart;
      });
    }
  };

  const contextValues: ContextValues = {
    products: productData, 
    cart: {data: cart, add, remove},
  };

  useEffect(() => {
    axios
    .get("mock_products.json")
    .then((res) => setProductData(res.data))
    .catch((err) =>console.log(err))

  }, []);

  return (
    <ProductContext.Provider value={contextValues}>
      {children}
    </ProductContext.Provider>
  )
};