import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Mesh } from "three";

import { useSpring, a } from '@react-spring/three'

import "./App.css";
import { useEffect, useRef, useState } from "react";

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
      <ambientLight intensity={.4} />
      <pointLight position={[-5, 10, -50]} intensity={5000} color="#80ffff" />
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
      </Canvas>
    </div>
  );
};

const ProductCard = () => {
  return (
    <div className="card">
      <div className="card__view">
        <Canvas
          camera={{ fov: 80 }}
        >
          <mesh 
            scale={3} 
            position={[0, 0, -2.5]}
          >
            {/* <ambientLight intensity={.1} /> */}
            <pointLight position={[10, 10, 20]} intensity={5000} color="white" />
            <sphereGeometry />
            <meshStandardMaterial color="white" />
          </mesh>
        </Canvas>
      </div>
      <div className="card__content">
        <div className="card__column">
          <div className="xw m condensed">BETACAM</div>
          <div className="xt m">⚪︎⚪︎⚪︎⚪︎⚪︎</div>
        </div>
        <div className="card__column t s">
          <div>€<span className="m">1299</span>.99</div>
        </div>
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
      <ProductCard />
    </div>
  );
};



const App = () => {
  return (
    <div className="wrap">
      <div className="page__title xl condensed">
        <span className="xw">PRODUCT</span>&nbsp;
        <span className="t">SHOWCASE</span>
      </div>
      <ProductView />
      <Carousel />
    </div>
  );
};

export default App;
