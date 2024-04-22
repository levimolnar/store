import { useContext, useEffect, useRef } from "react";
import { Product, ProductContext } from "../context/product";

export const ProductCard = ({ product } : { product: Product }) => {

  const { cart: { add } } = useContext(ProductContext);

  const [ priceBig, priceSmall ] = String(product.price).split(".");
  
  return (
    <div className="card">
      <div className="card__view">
        <img 
          src={product.image_file ? require(`../images/${product.image_file}`) : require("../images/placeholder.png")}
          alt={product.name}
          style={{ 
            width: "0",
            minWidth: "100%", 
            height: "100%", 
            transform: "scale(115%)",
          }}
        />
      </div>
      <div className="card__content">
        <div 
          className="button button--add material-symbols-outlined s"
          onClick={() => {add(product.id)}}
        >
          add_shopping_cart
        </div>
        <div className="card__column card__column--details m">
          <div className="w condensed">{product.name}</div>
          <div className="xt ">{product.code}</div>
        </div>
        <div className="card__column card__column--price t l">
          <div>
            €<span style={{fontSize: "120%"}}>{priceBig}</span>.{priceSmall}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Slider = () => {

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    
    const handleScroll = (e: WheelEvent) => {

      // could be improved by disallowing scroll to anywhere but scroll snap locations
      // when scroll is canceled it stops somewhere halfway and ruins the snapscroll effect

      if (ref.current) {
        const nextStopX = ref.current.scrollLeft + Math.sign(e.deltaY) * .31666 * ref.current.clientWidth;
        const nextStopY = ref.current.scrollTop + Math.sign(e.deltaY) * .47500 * ref.current.clientHeight;
        ref.current.scrollTo({
          left: nextStopX,
          top: nextStopY,
          behavior: "smooth",
        });
      };
    };

    document.addEventListener("wheel", handleScroll);
    return () => document.removeEventListener("wheel", handleScroll);
  }, []);

  const { products } = useContext(ProductContext);

  return (
    <div className="slider" ref={ref}>
      { products?.map((p: Product) => <ProductCard key={p.id} product={p}/>) }
    </div>
  );
};