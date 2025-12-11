"use client";
import * as THREE from "three";
import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import {
  MeshTransmissionMaterial,
  Text3D,
  Center,
  Edges,
} from "@react-three/drei";
import isMobile from "ismobilejs";
import { useThemeToFill } from "&/theme";

interface MaskedSceneProps {
  scrollProgress?: number; // 0-1 progress through hero section
}

function SoftEmbers({
  active,
  origin = [0, 0, 0],
}: {
  active: boolean;
  origin?: [number, number, number];
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const startRef = useRef<number | null>(null);

  const { basePositions, phases, speeds, colors, count } = useMemo(() => {
    const count = 90;
    const basePositions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const speeds = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const palette = [new THREE.Color("#b6f2c8"), new THREE.Color("#ffffff")];

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      basePositions[idx] = (Math.random() - 0.5) * 0.4;
      basePositions[idx + 1] = (Math.random() - 0.3) * 0.25;
      basePositions[idx + 2] = (Math.random() - 0.5) * 0.35;
      phases[i] = Math.random() * Math.PI * 2;
      speeds[i] = 0.4 + Math.random() * 0.6;
      const color = palette[i % palette.length]!;
      colors[idx] = color.r;
      colors[idx + 1] = color.g;
      colors[idx + 2] = color.b;
    }

    return { basePositions, phases, speeds, colors, count };
  }, []);

  useEffect(() => {
    if (!pointsRef.current) return;
    const positionAttr = pointsRef.current.geometry.getAttribute(
      "position",
    ) as THREE.BufferAttribute;
    positionAttr.array.set(basePositions);
    positionAttr.needsUpdate = true;
    startRef.current = null;
  }, [active, basePositions]);

  useFrame((state) => {
    if (!pointsRef.current || !materialRef.current) return;
    if (!active) {
      materialRef.current.opacity = 0;
      return;
    }

    if (startRef.current === null) {
      startRef.current = state.clock.getElapsedTime();
    }

    const elapsed = state.clock.getElapsedTime() - startRef.current;
    const positionAttr = pointsRef.current.geometry.getAttribute(
      "position",
    ) as THREE.BufferAttribute;
    const positions = positionAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const speed = speeds[i] ?? 0;
      const phase = phases[i] ?? 0;
      const baseX = basePositions[idx] ?? 0;
      const baseY = basePositions[idx + 1] ?? 0;
      const baseZ = basePositions[idx + 2] ?? 0;

      const t = elapsed * speed + phase;
      const drift = Math.sin(t) * 0.08;
      positions[idx] = baseX + Math.sin(t * 0.7) * 0.05;
      positions[idx + 1] = baseY + drift + elapsed * 0.08; // slow upward lift
      positions[idx + 2] = baseZ + Math.cos(t * 0.6) * 0.05;
    }

    positionAttr.needsUpdate = true;
    // Fade in quickly, then fade out softly
    const fadeIn = Math.min(1, elapsed / 0.6);
    const fadeOut = Math.max(0, 1 - elapsed / 3);
    materialRef.current.opacity = fadeIn * fadeOut * 0.6;
    pointsRef.current.rotation.y += 0.05 * state.clock.getDelta();
  });

  return (
    <points ref={pointsRef} position={origin}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[basePositions, 3]}
        />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.06}
        sizeAttenuation
        vertexColors
        transparent
        depthWrite={false}
      />
    </points>
  );
}

function MaskedScene({ scrollProgress = 0 }: MaskedSceneProps = {}) {
  const theming = useThemeToFill();
  const dark = theming?.theme === "dark" ? true : false;
  const tk = useRef<THREE.Mesh>(null);
  const mobile = isMobile(window.navigator).any;

  const words = [
    "healthier",
    "faster",
    "easier",
    "cheaper",
    "better",
    "quicker",
    "smarter",
    "safer",
    "happier",
    "simpler",
    "cleaner",
    "greener",
    "leaner",
    "fairer",
    "stronger",
    "brighter",
    "clearer",
    "kinder",
    "quieter",
    "lighter",
    "smoother",
    "friendlier",
    "nimbler",
    "wiser",
    "resilient",
    "reliable",
    "robust",
    "secure",
    "private",
    "ethical",
    "inclusive",
    "accessible",
    "sustainable",
    "transparent",
    "accountable",
    "regenerative",
    "circular",
    "equitable",
    "open",
    "thoughtful",
    "intuitive",
    "effortless",
    "delightful",
    "responsible",
    "humane",
  ];

  const TILT_ANGLE = 0.1;
  const showAnimatedWords = scrollProgress < 0.999;

  // Calculate current word and transition based on scroll progress
  const { currentWordIndex, transitionProgress, tiltSign } = useMemo(() => {
    // Map scroll progress (0-1) to word index
    const totalWords = words.length;
    const rawIndex = scrollProgress * totalWords;
    const currentWordIndex = Math.floor(rawIndex);
    const transitionProgress = rawIndex - currentWordIndex; // 0-1 within current word

    // Clamp to valid range
    const clampedIndex = Math.min(currentWordIndex, totalWords - 1);

    // Alternate tilt direction
    const tiltSign = clampedIndex % 2 === 0 ? 1 : -1;

    return {
      currentWordIndex: clampedIndex,
      transitionProgress,
      tiltSign,
    };
  }, [scrollProgress, words.length]);

  const currentWord = words[currentWordIndex];
  const nextWord =
    currentWordIndex < words.length - 1 ? words[currentWordIndex + 1] : null;

  // Show incoming word when transition is > 50%
  const showIncoming = transitionProgress > 0.5 && nextWord !== null;
  const incomingProgress = showIncoming ? (transitionProgress - 0.5) * 2 : 0; // 0-1

  // Fade out current word when transition starts
  const currentWordOpacity =
    transitionProgress < 0.8 ? 1 : 1 - (transitionProgress - 0.8) / 0.2;

  useFrame((state) => {
    if (!tk.current) return;
    tk.current.rotation.z = 1 * state.clock.getElapsedTime();

    if (!tk.current) return;
    tk.current.rotation.y = state.clock.elapsedTime / 2;
  });

  // Responsive text size - smaller on mobile to fit the screen
  const size = mobile ? 0.4 : 0.8;
  const gap = size * 1;
  // Offset to compensate for italic skew - proportional to text size
  const centerOffset = mobile ? -0.05 : -0.1;
  // Scale for animated words - match base size on mobile, larger on desktop
  const animatedScale = mobile ? 1.0 : 1.5;
  // Lift incoming word slightly while it travels to avoid overlap with "way"
  const incomingLift = gap * 0.35;
  // Raise final resting position of animated word to clear "way"
  // Adjusted based on scale - larger words need more offset
  const animatedLineOffsetY = gap * (mobile ? 1.0 : 0.5);
  const baseLines = ["There", "has to be a"] as const;
  const totalLines = showAnimatedWords ? baseLines.length + 2 : baseLines.length + 1;
  const startY = ((totalLines - 1) / 2) * gap;
  const double = mobile ? [1] : [1];

  // Incoming word animation: easeOutCubic
  const incomingEased = 1 - Math.pow(1 - incomingProgress, 3);

  // Apply opacity to all materials would be complex, so for now just render/don't render
  // In the future, could iterate through materials and set opacity
  return (
    <group>
      {double.map((d) => (
        <group key={d} scale={d}>
          <group key={d} position={[mobile ? -0.3 : 0, 0, 1.5]}>
            <group>
              {baseLines.map((line, i) => (
                <group key={line} position={[0, startY - i * gap, 0]}>
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
                      {line}
                      <MeshTransmissionMaterial
                        attach="material-0"
                        background={
                          dark
                            ? new THREE.Color().setHex(0x000000)
                            : new THREE.Color().setHex(0xdddddd)
                        }
                        color={
                          dark
                            ? new THREE.Color().setHex(0xb6f2c8)
                            : new THREE.Color().setHex(0xf5f5f5)
                        }
                        thickness={0.2}
                        roughness={0.1}
                        transmission={1}
                        distortion={0}
                        ior={1.25}
                        chromaticAberration={0}
                      />
                      <meshStandardMaterial
                        attach="material-1"
                        color={
                          dark
                            ? new THREE.Color().setHex(0x253d2c)
                            : new THREE.Color().setHex(0xf5f5f5)
                        }
                        roughness={0.85}
                        metalness={0.05}
                        envMapIntensity={0.6}
                      />
                      <Edges
                        threshold={25}
                        scale={1.001}
                        color={dark ? "#b6f2c8" : "#253D2C"}
                      />
                    </Text3D>
                  </Center>
                </group>
              ))}
            </group>

            <group
              position={[
                0,
                startY - baseLines.length * gap + animatedLineOffsetY,
                0,
              ]}
            >
              {/* Current word with fade-out */}
              {showAnimatedWords && currentWordOpacity > 0.01 && (
                <group
                  scale={animatedScale}
                  rotation={[tiltSign * TILT_ANGLE, 0, tiltSign * TILT_ANGLE]}
                  renderOrder={0}
                  position={[centerOffset, 0, 0]}
                >
                  <Center key={`${currentWord}`} disableZ>
                    <group
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
                    >
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
                          color={
                            dark
                              ? new THREE.Color().set("#f5f5f5")
                              : new THREE.Color().set("#253D2C")
                          }
                          thickness={0.2}
                          roughness={0.1}
                          transmission={0.99}
                          ior={1.25}
                          chromaticAberration={0}
                          transparent
                          opacity={currentWordOpacity}
                        />
                        <meshStandardMaterial
                          attach="material-1"
                          color="#253D2C"
                          roughness={0.85}
                          metalness={0.05}
                          envMapIntensity={0.6}
                          transparent
                          opacity={currentWordOpacity}
                        />
                        <Edges
                          threshold={25}
                          scale={1.001}
                          color={dark ? "#f5f5f5" : "#b6f2c8"}
                        />
                      </Text3D>
                    </group>
                  </Center>
                </group>
              )}

              {/* Incoming word animation */}
              {showAnimatedWords && showIncoming && nextWord && (
                <group
                  scale={animatedScale}
                  position={[
                    centerOffset,
                    incomingLift * (1 - incomingEased),
                    (1 - incomingEased) * 8,
                  ]}
                  rotation={[-tiltSign * TILT_ANGLE, 0, -tiltSign * TILT_ANGLE]}
                  renderOrder={2}
                >
                  {/* Center raw text so translation/rotation act around its center */}
                  <Center key={nextWord} disableZ>
                    <group
                      matrixAutoUpdate={false}
                      onUpdate={(g) =>
                        // italic skew
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
                    >
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
                        {nextWord}
                        <MeshTransmissionMaterial
                          attach="material-0"
                          background={new THREE.Color().setHex(0x000000)}
                          color={
                            dark
                              ? new THREE.Color().set("#f5f5f5")
                              : new THREE.Color().set("#253D2C")
                          }
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
                        <Edges
                          threshold={25}
                          scale={1.001}
                          color={dark ? "#f5f5f5" : "#b6f2c8"}
                        />
                      </Text3D>
                    </group>
                  </Center>
                </group>
              )}
            </group>

            <group
              position={[
                0,
                showAnimatedWords
                  ? startY - (baseLines.length + 1) * gap
                  : startY - baseLines.length * gap,
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
                    background={
                      dark
                        ? new THREE.Color().setHex(0x000000)
                        : new THREE.Color().setHex(0xdddddd)
                    }
                    color={
                      dark
                        ? new THREE.Color().setHex(0xb6f2c8)
                        : new THREE.Color().setHex(0xf5f5f5)
                    }
                    thickness={0.2}
                    roughness={0.1}
                    transmission={1}
                    distortion={0}
                    ior={1.25}
                    chromaticAberration={0}
                  />
                  <meshStandardMaterial
                    attach="material-1"
                    color={
                      dark
                        ? new THREE.Color().setHex(0x253d2c)
                        : new THREE.Color().setHex(0xf5f5f5)
                    }
                    roughness={0.85}
                    metalness={0.05}
                    envMapIntensity={0.6}
                  />
                  <Edges
                    threshold={25}
                    scale={1.001}
                    color={dark ? "#b6f2c8" : "#253D2C"}
                  />
                </Text3D>
              </Center>
            </group>
            <SoftEmbers
              active={!showAnimatedWords}
              origin={[0, startY - baseLines.length * gap, 0]}
            />
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

export { Hero, MaskedScene };
