"use client";
import * as THREE from "three";
import { useRef, useEffect, useState, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Text,
  Html,
  MeshTransmissionMaterial,
  Text3D,
  Center,
} from "@react-three/drei";
import Blob from "./Blob";

function MaskedScene() {
  const tk = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const [wordIndex, setWordIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [flipT, setFlipT] = useState(0);
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const prismRef = useRef<THREE.Group>(null);

  const words = ["healthier", "faster", "easier", "cheaper", "better"];

  // Drive the word rotation with decreasing waits and trigger flip animation
  useEffect(() => {
    if (finished) return;
    const rollMs = 700; // flip duration
    const durations = [5000, 4000, 3000, 2000];
    const timeouts: number[] = [];
    let acc = 0;

    durations.forEach((d, i) => {
      acc += d;
      const t = window.setTimeout(() => {
        setNextIndex(i + 1);
        setRolling(true);
        const done = window.setTimeout(() => {
          setWordIndex(i + 1);
          setRolling(false);
          setNextIndex(null);
        }, rollMs);
        timeouts.push(done);
      }, acc);
      timeouts.push(t);
    });

    // After showing "better" for 1s, finish
    const finishTimeout = window.setTimeout(
      () => setFinished(true),
      acc + 1000,
    );
    timeouts.push(finishTimeout);

    return () => {
      timeouts.forEach((id) => clearTimeout(id));
    };
  }, [finished]);

  const line = useMemo(() => {
    const base = ["There", "has", "to", "be", "a"];
    if (finished) {
      return [...base, "way"].join("\n");
    }
    const current = words[Math.min(wordIndex, words.length - 1)];
    return [...base, " ", "way"].join("\n");
  }, [finished, wordIndex]);

  const currentWord = words[Math.min(wordIndex, words.length - 1)];
  const upcomingWord = nextIndex != null ? words[nextIndex] : currentWord;

  // Animate the prism flip when rolling starts
  useEffect(() => {
    if (!rolling) return;
    const start = performance.now();
    const dur = 700;
    let raf = 0 as number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      if (prismRef.current) prismRef.current.rotation.x = Math.PI * 0.5 * t;
      setFlipT(t);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [rolling]);

  useEffect(() => {
    if (!rolling && prismRef.current) {
      prismRef.current.rotation.x = 0;
      setFlipT(0);
    }
  }, [rolling]);

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

  const size = 0.8;
  const gap = size * 0.9;
  const baseWords = ["There", "has", "to", "be", "a"] as const;
  const totalLines = finished ? baseWords.length + 1 : baseWords.length + 2;
  const startY = ((totalLines - 1) / 2) * gap;
  const double = [1, 0.99];

  return (
    <group>
      <Blob points={100000} flopAmount={"0.1"} eggplantAmount={"0.0"} />
      {double.map((d) => (
        <group key={d} scale={d}>
          <group key={d} position={[0, 0, 1.5]}>
            <group>
              {baseWords.map((w, i) => (
                <group key={w} position={[0, startY - i * gap, 0]}>
                  <Center disableY disableZ>
                    <Text3D
                      font={"/fonts/geist_black.typeface.json"}
                      size={size}
                      height={0.08}
                      bevelEnabled
                      bevelThickness={0.02}
                      bevelSize={0.02}
                      bevelSegments={2}
                      curveSegments={8}
                    >
                      {w}
                      <MeshTransmissionMaterial
                        attach="material-0"
                        background={new THREE.Color().setHex(0x000000)}
                        color={new THREE.Color().setHex(0xb6f2c8)}
                        thickness={0.2}
                        roughness={0.1}
                        transmission={1}
                        distortion={0}
                        ior={1.25}
                        chromaticAberration={0}
                      />
                      <meshStandardMaterial
                        attach="material-1"
                        color="#253D2C"
                        roughness={0.85}
                        metalness={0.05}
                        envMapIntensity={0.6}
                      />
                    </Text3D>
                  </Center>
                </group>
              ))}
            </group>

            {!finished && (
              <group position={[0, startY - baseWords.length * gap, 0]}>
                <group ref={prismRef}>
                  <group
                    matrixAutoUpdate={false}
                    onUpdate={(g) =>
                      //italic
                      g.matrix.set(
                        1,
                        0.2,
                        0,
                        0,
                        0,
                        1,
                        0,
                        0,
                        0,
                        0,
                        1,
                        0,
                        0,
                        0,
                        0,
                        1,
                      )
                    }
                    visible={!rolling || flipT < 0.5}
                  >
                    <group>
                      <Center disableY disableZ>
                        <Text3D
                          font={"/fonts/geist_black.typeface.json"}
                          size={size}
                          height={0.08}
                          bevelEnabled
                          bevelThickness={0.02}
                          bevelSize={0.02}
                          bevelSegments={2}
                          curveSegments={8}
                        >
                          {currentWord}
                          <MeshTransmissionMaterial
                            attach="material-0"
                            background={new THREE.Color().setHex(0x000000)}
                            color={new THREE.Color().setHex(0xb6f2c8)}
                            thickness={0.2}
                            roughness={0.1}
                            transmission={0.99}
                            ior={1.25}
                            chromaticAberration={0}
                          />
                          <meshStandardMaterial
                            attach="material-1"
                            color="#253D2C"
                            roughness={0.85}
                            metalness={0.05}
                            envMapIntensity={0.6}
                          />
                        </Text3D>
                      </Center>
                    </group>
                  </group>
                  <group
                    rotation={[Math.PI / 2, 0, 0]}
                    matrixAutoUpdate={false}
                    onUpdate={(g) =>
                      g.matrix.set(
                        1,
                        0.2,
                        0,
                        0,
                        0,
                        1,
                        0,
                        0,
                        0,
                        0,
                        1,
                        0,
                        0,
                        0,
                        0,
                        1,
                      )
                    }
                    visible={rolling && flipT >= 0.5}
                  >
                    <group>
                      <Center disableY disableZ>
                        <Text3D
                          font={"/fonts/geist_black.typeface.json"}
                          size={size}
                          height={0.08}
                          bevelEnabled
                          bevelThickness={0.02}
                          bevelSize={0.02}
                          bevelSegments={2}
                          curveSegments={8}
                        >
                          {upcomingWord}

                          <MeshTransmissionMaterial
                            attach="material-0"
                            background={new THREE.Color().setHex(0x000000)}
                            color={new THREE.Color().setHex(0xb6f2c8)}
                            thickness={0.2}
                            roughness={0.1}
                            transmission={0.99}
                            ior={1.25}
                            chromaticAberration={0}
                          />
                          <meshStandardMaterial
                            attach="material-1"
                            color="#253D2C"
                            roughness={0.85}
                            metalness={0.05}
                            envMapIntensity={0.6}
                          />
                        </Text3D>
                      </Center>
                    </group>
                  </group>
                </group>
              </group>
            )}

            <group
              position={[
                0,
                startY -
                  (finished ? baseWords.length : baseWords.length + 1) * gap,
                0,
              ]}
            >
              <Center disableY disableZ>
                <Text3D
                  font={"/fonts/geist_black.typeface.json"}
                  size={size}
                  height={0.08}
                  bevelEnabled
                  bevelThickness={0.05}
                  bevelSize={0.02}
                  bevelSegments={2}
                  curveSegments={8}
                >
                  way
                  <MeshTransmissionMaterial
                    attach="material-0"
                    background={new THREE.Color().setHex(0x000000)}
                    color={new THREE.Color().setHex(0xb6f2c8)}
                    thickness={0.2}
                    roughness={0.1}
                    transmission={1}
                    ior={1.25}
                    chromaticAberration={0}
                  />
                  <meshStandardMaterial
                    attach="material-1"
                    color="#253D2C"
                    roughness={0.85}
                    metalness={0.05}
                    envMapIntensity={0.6}
                  />
                </Text3D>
              </Center>
            </group>
          </group>
        </group>
      ))}
      <ambientLight intensity={0.3} />
      <directionalLight position={[2, 4, 3]} intensity={1.2} />
      <directionalLight position={[-3, 2, 2]} intensity={0.6} />
      {/* Subtle rim/back light to make bevels pop */}
      <directionalLight position={[0, 1, -6]} intensity={0.4} color="#b6f2c8" />
    </group>
  );
}

function Hero() {
  return (
    <>
      <MaskedScene />
      <spotLight position={[0, 0, 0]} penumbra={1} castShadow angle={0.2} />
    </>
  );
}

export { Hero };
