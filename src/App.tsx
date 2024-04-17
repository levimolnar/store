import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { AmbientLight, Mesh } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import "./App.css";
import { useRef } from "react";


const ProductView = () => {
  const meshRef = useRef<Mesh>(null!);

  const parcelPath = new URL("1982_sony_betacam.glb", import.meta.url);
  const model = useLoader(GLTFLoader, parcelPath.href);
  console.log(model);

  useFrame((state, delta) => {
    meshRef.current.rotation.x = .25*-state.pointer.y + .1*Math.PI;
    // meshRef.current.rotation.y = .25*state.mouse.x + .25*Math.PI;
    meshRef.current.rotation.y = .25*state.pointer.x + 1.15*Math.PI;
  });

  return (
    <primitive 
      object={model.scene} 
      ref={meshRef}
      position={[-2.5,2.5,-35]}
      rotation={[.1*Math.PI, 1.15*Math.PI, 0]}
    >
      <ambientLight />
      <pointLight position={[10, 10, 10]}/>
      {/* <meshBasicMaterial color={"#777"} /> */}
    </primitive>
    // <mesh 
    //   ref={meshRef} 
    //   position={[0, .25, 0]}
    //   rotation={[.1*Math.PI, .25*Math.PI, 0]}
    // >
    //   <boxGeometry />
    //   <meshBasicMaterial color={"#777"} />
    // </mesh>
  )
}

const App = () => {
  return (
    <div className="wrap">
      <div className="label large">
        <span className="boldest">BRAND</span>&nbsp;
        <span className="thin">SHOWCASE</span>
      </div>
      <div className="productinfo">
        <div className="bold medium">A-100</div>
        <div className="bold medium">CAMCORDER</div>
        <div className="thin small">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
        </div>
      </div>
      <Canvas 
        camera={{ fov: 50 }}
        style={{ width: "1000px", height: "1000px" }}
      >
        <ProductView />
      </Canvas>
    </div>
  );
}

export default App;
