"use client";
import * as THREE from "three";
import { useState, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import {
  useMask,
  Text,
  DragControls,
  MeshTransmissionMaterial,
  Html,
} from "@react-three/drei";

function MaskedScene() {
  const group = useRef<THREE.Mesh>(null);
  const [hovered, hover] = useState(false);
  const tk = useRef<THREE.Mesh>(null);

  const p = 31;
  const q = 5;

  useFrame((state) => {
    if (!tk.current) return;
    tk.current.rotation.z = 1 * state.clock.getElapsedTime();

    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime / 2;
  });
  return (
    <group>
      <mesh position={[0, 0, 1]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial
          color="#000000" // Plane color
          transparent={true}
          opacity={1}
        />
      </mesh>

      <Text position={[0, 0, 2]} color="transparent">
        yoooo
        <Html
          style={{ color: "transparent", fontSize: "6em" }}
          transform={true}
        >
          yoooo
        </Html>
        <meshStandardMaterial attach="material" opacity={0.1} />
      </Text>
      <ambientLight intensity={1} />

      <pointLight position={[0, 0, 0]} />
      <DragControls>
        <RigidBody colliders={"hull"} restitution={2}>
          <mesh ref={tk} position={[0, 0, -10]}>
            <torusKnotGeometry args={[5, 0.5, 1000, 100, p, q]} />
            <MeshTransmissionMaterial
              thickness={2}
              backside
              backsideThickness={1}
            />
          </mesh>
        </RigidBody>
      </DragControls>

      <mesh position={[-0.75, 0, 0]} scale={1} ref={group}>
        <torusKnotGeometry args={[0.6, 0.2, 128, 64]} />
        <meshNormalMaterial />
      </mesh>
      <mesh
        position={[0.75, 0, 0]}
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}
      >
        <sphereGeometry args={[0.8, 64, 64]} />
        <meshStandardMaterial color={hovered ? "orange" : "white"} />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <Physics gravity={[0, 0, 0]}>
      <MaskedScene />
      <spotLight position={[0, 0, 0]} penumbra={10} castShadow angle={0.2} />
    </Physics>
  );
}

export { Scene };
