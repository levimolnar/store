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
      <pointLight position={[-5, 10, -50]} intensity={5_000} color="#80ffff" />
    </a.mesh>
  );
}

const App = () => {

  const [resetRotation, setResetRotation] = useState(true);

  return (
    <div className="wrap">
      <div className="label large">
        <span className="boldest">BRAND</span>&nbsp;
        <span className="thin">SHOWCASE</span>
      </div>
      <div className="productinfo">
        <div className="boldest medium">SONY</div>
        <div className="bold medium">BETACAM 1982</div>
        <div className="thin small">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
        </div>
      </div>
      <Canvas 
        camera={{ fov: 50 }}
        style={{ width: "1000px", height: "1000px", borderRadius: "50%"}} // , background: "radial-gradient(transparent, black)"
        onMouseEnter={() => setResetRotation(false)}
        onMouseLeave={() => setResetRotation(true)}
      >
        <ProductView reset={resetRotation} loaded={true}/>
      </Canvas>
    </div>
  );
}

export default App;
