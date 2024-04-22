import { useSpring, a, useTransition } from '@react-spring/three'
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { BrightnessContrast, EffectComposer } from '@react-three/postprocessing';
import { useRef, useState } from "react";
import { Mesh } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";


const ProductDescription = () => {
  return (
  <div className="product__description">
    <div className="xw xl condensed">SONY</div>
    <div className="w xl condensed">
      BETACAM <span className="t">1982</span>
    </div>
    <div className="t m">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
    </div>
  </div>
  );
};

const ProductMesh = ({reset}: {reset: boolean}) => {

  const ref = useRef<Mesh>(null!);
  
  const parcelPath = new URL("../models/1982_sony_betacam.glb", import.meta.url);
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

export const ProductView = () => {
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
        {/* <EffectComposer>
          <BrightnessContrast
            brightness={0}
            contrast={0}
          />
        </EffectComposer> */}
      </Canvas>
    </div>
  );
};