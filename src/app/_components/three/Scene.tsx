"use client";
import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Html, MeshTransmissionMaterial } from "@react-three/drei";
import Blob from "./Blob";

function MaskedScene() {
  const tk = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!tk.current) return;
    tk.current.rotation.z = 1 * state.clock.getElapsedTime();

    if (!tk.current) return;
    tk.current.rotation.y = state.clock.elapsedTime / 2;
  });
  return (
    <group>
      <Blob />
      <mesh position={[0, 0, 1]}>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial
          attach="material"
          transparent
          color={new THREE.Color().setHex(0x000000)}
          opacity={0.1}
        />
      </mesh>

      <Text
        position={[0, 0, 1.5]}
        maxWidth={18}
        fontSize={3}
        textAlign={"center"}
        lineHeight={0.75}
        font={"/fonts/geist_black.ttf"}
      >
        There has to be a better way
        <Html
          style={{
            color: "transparent",
            fontSize: "6em",
            width: "30rem",
            textAlign: "center",
            lineHeight: ".75",
          }}
          transform={true}
        >
          There has to be a better way
        </Html>
        <MeshTransmissionMaterial
          background={new THREE.Color().setHex(0xffffff)}
        />
      </Text>
      <ambientLight intensity={1} />

      <pointLight position={[0, 0, 0]} />
    </group>
  );
}

function Scene() {
  return (
    <>
      <MaskedScene />
      <spotLight position={[0, 0, 0]} penumbra={10} castShadow angle={0.2} />
    </>
  );
}

export { Scene };
