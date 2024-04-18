import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Mesh } from "three";

// import { useSpring, animated } from '@react-spring/three'
import { easing } from 'maath'

import "./App.css";
import { useRef, useState } from "react";

const ProductView = ({reset}: {reset: boolean}) => {

  const ref = useRef<Mesh>(null!);
  
  // const { rotation } = useSpring({
  //   rotation: 
  //     reset || !ref.current
  //     ? [.1*Math.PI, 1.25*Math.PI, 0] 
  //     : [ref.current.rotation.x, ref.current.rotation.y, ref.current.rotation.z] 
  // }) as any;

  const parcelPath = new URL("1982_sony_betacam.glb", import.meta.url);
  const model = useLoader(GLTFLoader, parcelPath.href);

  // useFrame((state) => {
  //   if (!reset) {
  //     ref.current.rotation.x = .2*-state.pointer.y + .1*Math.PI;
  //     ref.current.rotation.y = .2*state.pointer.x + 1.25*Math.PI;
  //   };
  // });

  useFrame((state, delta) => {
    easing.dampE(ref.current.rotation, [.2*-state.pointer.y + .1*Math.PI, .2*state.pointer.x + 1.25*Math.PI, 0, 0], .2, delta);
  });

  return (
    <mesh
      ref={ref}
      position={[-2.5, 1, -35]}
      rotation={[.1*Math.PI, 1.25*Math.PI, 0]}
    >
      <primitive object={model.scene} />
      <ambientLight intensity={.4} />
      <pointLight position={[-5, 10, -50]} intensity={5_000} color="#80ffff" />
    </mesh>
  )
}

const App = () => {

  // const [resetRotation, setResetRotation] = useState(true);

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
        style={{ width: "1000px", height: "1000px" }}
        // onMouseEnter={() => setResetRotation(false)}
        // onMouseLeave={() => setResetRotation(true)}
      >
        <ProductView reset={false} />
      </Canvas>
    </div>
  );
}

export default App;
