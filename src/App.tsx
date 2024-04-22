import { useContext, useState } from "react";

import "./App.css";
import { Modal } from "./components/Modal";
import { Slider } from "./components/Slider";
import { ProductView } from "./components/Product";
import { ProductContext } from "./context/product";

const App = () => {

  const { cart: { data: cartData } } = useContext(ProductContext);
  const [ cartOpen, setCartOpen ] = useState<boolean>(false);

  return (
    <>
      <Modal open={cartOpen} setOpen={setCartOpen}/>
      <div className={`wrap ${cartOpen ? "wrap--blurred" : ""}`}>
        <div className="page__top">
          <div className="page__title xxl condensed">
            <span className="xw">PRODUCT</span>&nbsp;
            <span className="t">SHOWCASE</span>
          </div>
          <div 
            className="button button--cart material-symbols-outlined xw s"
            onClick={() => {setCartOpen(true)}}
          >
            shopping_cart
            {Object.keys(cartData).length ? (
              <div className="button button--indicator xw s">
                {Object.keys(cartData).length}
              </div>
            ) : null}
          </div>
        </div>
        <ProductView />
        <Slider />
        <footer className="credit xt s">
          3D model by <a href="https://sketchfab.com/maxdragon" target="_blank" rel="noreferrer" className="w">@MAXDRAGON</a>
        </footer>
      </div>
    </>
  );
};

export default App;