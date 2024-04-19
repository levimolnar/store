import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Mesh } from "three";

import { useSpring, a } from '@react-spring/three'

import "./App.css";
import { useEffect, useRef, useState } from "react";

const ProductView = ({reset, loaded}: {reset: boolean, loaded: boolean}) => {

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
      <ambientLight intensity={.4} />
      <pointLight position={[-5, 10, -50]} intensity={5000} color="#80ffff" />
    </a.mesh>
  );
};

const ProductInfo = () => {
  return (
  <div className="productinfo">
    <div className="w1 size2 condensed">SONY</div>
    <div>
      <span className="w2 size2 condensed">BETACAM </span> 
      <span className="w3 size2 condensed">1982</span>
    </div>
    <div className="w3 size4">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
    </div>
  </div>
  );
};

const ProductCard = () => {
  return (
    <div className="card">
      <div className="card__view">
      </div>
      <div className="card__content">
        <div className="card__column">
          <div className="w1 size3">BETACAM</div>
          <div className="w4 size4">⚪︎⚪︎</div>
        </div>
        <div className="card__column w4 size3">€1299.99</div>
      </div>
    </div>
  );
};

const Carousel = () => {
  return (
    <div className="carousel">
      <ProductCard />
      <ProductCard />
      <ProductCard />
      <ProductCard />
    </div>
  );
};



const App = () => {

  const [resetRotation, setResetRotation] = useState(true);

  return (
    <div className="wrap">
      <div className="label size1 condensed">
        <span className="w1">PRODUCT</span>&nbsp;
        <span className="w3">SHOWCASE</span>
      </div>
      <ProductInfo />
      <Canvas 
        camera={{ fov: 50 }}
        style={{ width: "1000px", height: "1000px", borderRadius: "50%", zIndex: "2"}} // , background: "radial-gradient(transparent, black)"
        onMouseEnter={() => setResetRotation(false)}
        onMouseLeave={() => setResetRotation(true)}
      >
        <ProductView reset={resetRotation} loaded={true}/>
      </Canvas>
      <Carousel />
    </div>
  );
};

export default App;
