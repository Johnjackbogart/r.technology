"use client";
import * as THREE from "three";
import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, Html, MeshTransmissionMaterial } from "@react-three/drei";
import Blob from "./three/Blob";

function MaskedScene() {
  const tk = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .custom-selection::selection {
        background: rgba(.1, .1, .1, .1);
        color: transparent;
      }
      .custom-selection::-moz-selection {
        background: rgba(.1, .1, .1, .1);
        color: transparent;
      }
    `;
    document.head.appendChild(style);

    // Cleanup the style tag on component unmount
    return () => {
      document.head.removeChild(style);
    };
  });

  useFrame((state) => {
    if (!tk.current) return;
    tk.current.rotation.z = 1 * state.clock.getElapsedTime();

    if (!tk.current) return;
    tk.current.rotation.y = state.clock.elapsedTime / 2;
  });

  return (
    <group>
      <Blob points={5000} />

      <Text
        position={[0, 0, 1.5]}
        maxWidth={viewport.width / 10}
        fontSize={1}
        textAlign={"center"}
        lineHeight={0.75}
        font={"/fonts/geist_black.ttf"}
      >
        This has to work!
        <Html
          className="custom-selection"
          style={{
            color: "transparent",
            fontSize: "3em",
            width: "10rem",
            textAlign: "center",
            lineHeight: "1em",
          }}
          transform={true}
        >
          There has to be a healthier way
        </Html>
        <MeshTransmissionMaterial
          background={new THREE.Color().setHex(0xffffff)}
        />
      </Text>
      <ambientLight intensity={10} />

      <pointLight intensity={10} position={[0, 0, 0]} />
    </group>
  );
}

function Thesis() {
  return (
    <>
      <MaskedScene />
      <spotLight position={[0, 0, 0]} penumbra={1} castShadow angle={0.2} />
    </>
  );
}

export { Thesis };
