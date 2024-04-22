import { useContext, useEffect } from "react";
import { ProductContext } from "../context/product";
import { useTransition } from "@react-spring/three";
import { animated } from 'react-spring';

export const Modal = ({ open, setOpen }: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {

  const { products, cart: { data: cartData, remove } } = useContext(ProductContext);

  useEffect(() => {

    const close = (e: KeyboardEvent) => {
      if (e.keyCode === 27) {setOpen(false)};
    };

    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
    // @ts-ignore: missing dependency
  },[]);

  const transition = useTransition(
    (open || undefined), {
      from:  { opacity: 0, scale: 0.9 },
      enter: { opacity: 1, scale: 1.0 },
      leave: { opacity: 0, scale: 0.9 },
      config: {duration: 150}
    }
  );

  return transition((style, item) => (
    <animated.div className="modal__backdrop" style={style}>
      <div className="modal__box">
        <div className="modal__bar">  
          <div className="modal__title m t">SHOPPING CART</div>
          <div 
            className="button button--exit" 
            onClick={() => {setOpen(false)}}
          />
        </div>
        <div className="cart">
          {
            Object.entries(cartData).map(([k, v]) => (
              <div className="cart__item s" key={k}>
                <span>{v.amount}x {products[+k].name}</span>
                <div 
                  className="button button--remove"
                  onClick={() => remove(+k)}
                />
              </div>
            ))
          }
        </div>
      </div>
    </animated.div>
  ));
};