import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { EffectComposer, BrightnessContrast } from '@react-three/postprocessing'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Mesh } from "three";

import { useSpring, a, useTransition } from '@react-spring/three'
import { animated } from 'react-spring'

import { useEffect, useMemo, useRef, useState, useContext, createContext } from "react";

import "./App.css";
import { Product, ProductContext } from "./context/product";
// import cardImage from "./images/betacam.png";

const ProductDescription = () => {
  return (
  <div className="product__description">
    <div className="xw l condensed">SONY</div>
    <div className="l condensed w">
      BETACAM <span className="t">1982</span>
    </div>
    <div className="t s">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
    </div>
  </div>
  );
};

const ProductMesh = ({reset}: {reset: boolean}) => {

  const ref = useRef<Mesh>(null!);
  
  const parcelPath = new URL("1982_sony_betacam.glb", import.meta.url);
  const model = useLoader(GLTFLoader, parcelPath.href);

  const { scale } = useSpring({
    from: { scale: 0 }, to: { scale: .95 },
    config: { mass: 2, tension: 500, friction: 50 },
  });

  const [{ rotation }, set] = useSpring(() => ({ rotation: [.1*Math.PI, 1.25*Math.PI, 0] }));

  useFrame((state) => {
    set({ rotation: 
      !reset 
      ? [.25*-state.pointer.y + .1*Math.PI, .25*state.pointer.x + 1.25*Math.PI, 0] 
      : [.1*Math.PI, 1.25*Math.PI, 0],
      config: { mass: 5, tension: 500, friction: 50 },
    });
  });

  return (
    <a.mesh
      ref={ref}
      position={[-2.5, 1, -35]}
      // @ts-ignore: Spring = Vector3!
      rotation={rotation}
      scale={scale}
    >
      <primitive object={model.scene} />
      <ambientLight intensity={.5} />
      <pointLight position={[-25, 12.5, 0]} intensity={500} color="#00ffff" />
    </a.mesh>
  );
};
const ProductView = () => {
  const [resetRotation, setResetRotation] = useState(true);

  return (
    <div className="product">
      <ProductDescription />
      <Canvas 
        className="product__canvas"
        camera={{ fov: 50 }}
        onMouseEnter={() => setResetRotation(false)}
        onMouseLeave={() => setResetRotation(true)}
      >
        <ProductMesh 
          reset={resetRotation} 
        />
        <EffectComposer>
          <BrightnessContrast 
            brightness={0}
            contrast={0}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

const CardMesh = () => {

  // const parcelPath = new URL("1982_sony_betacam.glb", import.meta.url);
  // const { scene } = useLoader(GLTFLoader, parcelPath.href);
  // const copiedScene = useMemo(() => scene.clone(), [scene]);

  const parcelPath = new URL("1982_sony_betacam.glb", import.meta.url);
  const mesh = useLoader(GLTFLoader, parcelPath.href);
  const copiedScene = useMemo(() => mesh.scene.clone(), [mesh.scene]);

  // mesh.geometry.computeBoundingBox();

  return (
    <mesh 
      // scale={3} 
      // position={[0, 0, -2.5]}
      scale={1} 
      position={[-3.25, 4, -80]}
      rotation={[.5*Math.PI, .35*Math.PI, -.5*Math.PI]}
    >
      <ambientLight intensity={2} />
      <pointLight position={[0, 25, 25]} intensity={10_000} color="white" />
      {/* <sphereGeometry /> */}
      <primitive object={copiedScene} />
      <meshStandardMaterial color="white" />
    </mesh>
  )
}

const ProductCard = ({ product } : { product: Product }) => {

  const { cart: { data: cartData, add } } = useContext(ProductContext);
  console.log(cartData);

  const [ priceBig, priceSmall ] = String(product.price).split(".");
  
  return (
    <div className="card">
      <div className="card__view">
        <img 
          src={product.image_file ? require(`./images/${product.image_file}`) : require("./images/placeholder.png")}
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
        <div className="card__column card__column--details">
          <div className="w s condensed">{product.name}</div>
          <div className="xt xs">{product.code}</div>
        </div>
        <div className="card__column card__column--price t s">
          <div>
            €<span className="t m">{priceBig}</span>.{priceSmall}
            <div 
              className="button button--add material-symbols-outlined xs"
              onClick={() => {add(product.id)}}
            >
              add_shopping_cart
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Slider = () => {

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

const Modal = ({ open, setOpen }: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {

  const { products, cart: { data: cartData, remove } } = useContext(ProductContext);

  useEffect(() => {

    const close = (e: KeyboardEvent) => {
      if (e.keyCode === 27) {setOpen(false)};
    };

    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
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

const App = () => {

  // const { selected: [selectedProduct, setProductSelected] } = useContext(ProductContext);
  const [ cartOpen, setCartOpen ] = useState<boolean>(false);

  return (
    <>
      <Modal open={cartOpen} setOpen={setCartOpen}/>
      <div className={`wrap ${cartOpen ? "wrap--blurred" : ""}`}>
        <div className="page__title xl condensed">
          <span className="xw">PRODUCT</span>&nbsp;
          <span className="t">SHOWCASE</span>
        </div>
        <div 
          className="button button--cart material-symbols-outlined xw s"
          onClick={() => {setCartOpen(true)}}
        >
          shopping_cart
        </div>
        <ProductView />
        <Slider />
        <footer className="credit xt xs">
          3D model by <a href="https://sketchfab.com/maxdragon" target="_blank" className="w">@MAXDRAGON</a>
        </footer>
      </div>
    </>
  );
};

export default App;