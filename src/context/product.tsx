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

export interface ContextValues {
  products: Product[];
  selected: [number | undefined, React.Dispatch<React.SetStateAction<number | undefined>>];
};

export const ProductContext = createContext<ContextValues>({
  products: [], 
  selected: [undefined, () => {}]}
);

export const ProductProvider = ({ children }: any) => {

  const [productData, setProductData] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | undefined>(undefined);

  const contextValues: ContextValues = {products: productData, selected: [selectedProduct, setSelectedProduct]};

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