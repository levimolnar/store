import { useContext, useEffect, useRef, useState, useCallback } from "react";
import { Product, ProductContext } from "../context/product";
import { useSpring, animated } from "react-spring";

export const ProductCard = ({ product } : { product: Product }) => {

  const { cart: { add } } = useContext(ProductContext);

  const [ priceBig, priceSmall ] = String(product.price).split(".");

  const fadeInStyle = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 50 },
  })
  
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
        <animated.div 
          className="button button--add material-symbols-outlined s"
          style={fadeInStyle}
          onClick={() => {add(product.id)}}
        >
          add_shopping_cart
        </animated.div>
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

  const [currentSlide, setCurrentSlide] = useState(0);

  const handleScroll = useCallback((e: WheelEvent) => {

    if (ref.current) {
      const isPortrait = window.innerWidth <= window.innerHeight;

      const sliderLength = isPortrait ? ref.current.scrollWidth : ref.current.scrollHeight;
      const pageLength   = isPortrait ? ref.current.clientWidth : ref.current.clientHeight;
      const maxScroll    = sliderLength - pageLength;

      const cardLength   = sliderLength / ref.current.childNodes.length;

      const nextSlide = currentSlide + Math.sign(e.deltaY);
      const scrollDistance = Math.round(nextSlide * cardLength);

      if (scrollDistance < 0 || scrollDistance > maxScroll) { return };

      ref.current.scrollTo({
        top: isPortrait ? 0 : scrollDistance,
        left: isPortrait ? scrollDistance : 0,
        behavior: "smooth",
      });

      setCurrentSlide(nextSlide);
    };
  }, [currentSlide]);

  useEffect(() => {
    document.addEventListener("wheel", handleScroll);
    return () => document.removeEventListener("wheel", handleScroll);
  }, [handleScroll]);

  const { products } = useContext(ProductContext);

  return (
    <div className="slider" ref={ref}>
      { products?.map((p: Product) => <ProductCard key={p.id} product={p}/>) }
    </div>
  );
};