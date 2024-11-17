"use client";
import * as THREE from "three";
import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, Html, MeshTransmissionMaterial } from "@react-three/drei";
import Blob from "./Blob";

function MaskedScene() {
  const [rerender, setRerender] = useState(false);
  const tk = useRef<THREE.Mesh>(null);
  const { viewport, gl } = useThree();

  useFrame((state) => {
    if (!tk.current) return;
    tk.current.rotation.z = 1 * state.clock.getElapsedTime();

    if (!tk.current) return;
    tk.current.rotation.y = state.clock.elapsedTime / 2;
  });

  useEffect(() => {
    const handleResize = () => {
      setRerender(!rerender);
    };
    const handleMouseEnter = () => {
      console.log("enter");
      setRerender(!rerender);
    };
    const handleMouseLeave = () => {
      console.log("leave");
      setRerender(!rerender);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [rerender]);
  return (
    <group>
      <Blob rerender={rerender} />
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
        maxWidth={viewport.width / 10}
        fontSize={1}
        textAlign={"center"}
        lineHeight={0.75}
        font={"/fonts/geist_black.ttf"}
      >
        There has to be a better way
        <Html
          style={{
            color: "transparent",
            fontSize: "3em",
            width: "10rem",
            textAlign: "center",
            lineHeight: "1em",
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
