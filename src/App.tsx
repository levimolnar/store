import { Canvas, useFrame } from "@react-three/fiber";
import './App.css';
import { useRef } from "react";
import { AmbientLight, Mesh } from "three";

const ProductView = () => {
  const meshRef = useRef<Mesh>(null!);

  useFrame((state, delta) => {
    meshRef.current.rotation.x = .25*-state.mouse.y + .1*Math.PI;
    meshRef.current.rotation.y = .25*state.mouse.x + .25*Math.PI;
  });

  return (
    <mesh 
      ref={meshRef} 
      position={[0, .25, 0]}
      rotation={[.1*Math.PI, .25*Math.PI, 0]}
    >
      <boxGeometry />
      <meshBasicMaterial color={"#777"} />
    </mesh>
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
        camera={{ fov: 30 }}
        // style={{ background: "#ff00ff55" }}
      >
        <ProductView />
      </Canvas>
    </div>
  );
}

export default App;
