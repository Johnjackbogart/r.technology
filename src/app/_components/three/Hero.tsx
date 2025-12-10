"use client";
import * as THREE from "three";
import { useRef, useEffect, useState, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  MeshTransmissionMaterial,
  Text3D,
  Center,
  Edges,
} from "@react-three/drei";
import isMobile from "ismobilejs";
import Blob from "./Blob";
import { useThemeToFill } from "&/theme";

// Simple easing for a stronger "slam" feel
function easeInCubic(t: number) {
  return t * t * t;
}

function MaskedScene() {
  const theming = useThemeToFill();
  const dark = theming?.theme === "dark" ? true : false;
  const tk = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const mobile = isMobile(window.navigator).any;
  const [wordIndex, setWordIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [flipT, setFlipT] = useState(1);
  const [nextWord, setNextWord] = useState<number | null>(null);
  const [tiltSign, setTiltSign] = useState<1 | -1>(1);
  const [outgoingWord, setOutgoingWord] = useState<string | null | undefined>(null);
  const [outgoingTilt, setOutgoingTilt] = useState<1 | -1>(1);
  const [fading, setFading] = useState(false);
  const [fadeT, setFadeT] = useState(0);
  const [showDisplay, setShowDisplay] = useState(false); // hidden until first word animates in
  const [introRolling, setIntroRolling] = useState(true); // drive initial animation for first word
  const [introStarted, setIntroStarted] = useState(false); // delay before starting intro motion
  const wordIndexRef = useRef(wordIndex);
  const tiltSignRef = useRef<1 | -1>(tiltSign);

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
    // Added
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

  // Shared flip duration (ms) for both scheduling and animation
  const FLIP_MS = 700;
  // Make the very first intro animation a bit slower than the rest
  const INTRO_MS = 1000;
  const TILT_ANGLE = 0.1;
  const FADE_MS = 150; // fade duration for outgoing word

  // Drive the word rotation with decreasing waits and trigger flip animation
  // Start scheduling only after the intro animation completes
  useEffect(() => {
    if (finished || introRolling) return;

    const rollMs = FLIP_MS; // flip duration
    // Faster progression to shortest waits
    const startHold = 2500;
    const endHold = 250;
    const transitions = Math.max(0, words.length - 1);

    // Build decreasing durations across transitions (geometric ramp)
    // Ratio chosen so first = startHold and last = endHold
    const durations = Array.from({ length: transitions }, (_, i) => {
      if (transitions <= 1) return startHold; // single step edge case
      const n = transitions - 1;
      const r = Math.pow(endHold / startHold, 1 / n); // 0<r<1
      const gamma = 1.8; // steeper front-loaded decay to reach fast times sooner
      const t = i / n;
      const iPrime = Math.pow(t, gamma) * n;
      return Math.round(startHold * Math.pow(r, iPrime));
    });

    const timeouts: number[] = [];
    let acc = 0;

    durations.forEach((d, i) => {
      acc += d;
      const fadeLead = FADE_MS; // start fade right before incoming lands
      const fadeStart = Math.max(0, acc + rollMs - fadeLead);

      // Start fade-out just before the incoming finishes
      const tFade = window.setTimeout(() => {
        const prevIdx = Math.min(wordIndexRef.current, words.length - 1);
        const prevTilt = tiltSignRef.current;
        // Hide the settled display while we fade it out
        setShowDisplay(false);
        setOutgoingWord(words[prevIdx]);
        setOutgoingTilt(prevTilt);
        setFadeT(0);
        setFading(true);
      }, fadeStart);
      timeouts.push(tFade);

      // Begin the incoming translation
      const t = window.setTimeout(() => {
        // Prepare incoming animation: set progress to 0
        setFlipT(0);
        setNextWord(i + 1);
        setRolling(true);
        const done = window.setTimeout(() => {
          // Swap to the new word and new tilt for the display layer
          setWordIndex(i + 1);
          setRolling(false);
          setNextWord(null);
          // Alternate tilt AFTER the animation completes
          setTiltSign((s) => (s === 1 ? -1 : 1));
          // Reveal the settled display again for the new word
          setShowDisplay(true);
        }, rollMs);
        timeouts.push(done);
      }, acc);
      timeouts.push(t);
    });

    // After the final word is shown for a beat, finish
    const finalHold = 500;
    const finishTimeout = window.setTimeout(
      () => setFinished(true),
      acc + finalHold,
    );
    timeouts.push(finishTimeout);

    return () => {
      timeouts.forEach((id) => clearTimeout(id));
    };
  }, [finished, words.length, introRolling]);

  const currentWord = words[Math.min(wordIndex, words.length - 1)];
  // Keep refs in sync so timeouts use the latest values
  useEffect(() => {
    wordIndexRef.current = wordIndex;
  }, [wordIndex]);
  useEffect(() => {
    tiltSignRef.current = tiltSign;
  }, [tiltSign]);
  const outgoingOpacity = fading ? 1 - fadeT : 1;

  // Fade-out driver once fading starts
  useEffect(() => {
    if (!fading) return;
    const start = performance.now();
    let raf = 0 as number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / FADE_MS);
      setFadeT(t);
      if (t < 1) raf = requestAnimationFrame(tick);
      else {
        setFading(false);
        setOutgoingWord(null);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [fading]);

  // Intro animation for the first word: translate in from front
  useEffect(() => {
    if (!introRolling) return;
    // Wait 3 seconds before starting the intro motion
    let raf = 0 as number;
    const delayMs = 3000;
    setIntroStarted(false);
    const to = window.setTimeout(() => {
      setIntroStarted(true);
      setFlipT(0);
      const start = performance.now();
      const dur = INTRO_MS;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / dur);
        const e = 1 - Math.pow(1 - t, 3); // easeOutCubic
        setFlipT(e);
        if (t < 1) raf = requestAnimationFrame(tick);
        else {
          setIntroRolling(false);
          setShowDisplay(true);
        }
      };
      raf = requestAnimationFrame(tick);
    }, delayMs);
    return () => {
      clearTimeout(to);
      cancelAnimationFrame(raf);
    };
  }, [introRolling]);

  // Animate the word translating in from in front of the scene when rolling starts
  useEffect(() => {
    if (!rolling) return;
    const start = performance.now();
    const dur = FLIP_MS;
    let raf = 0 as number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      // easeOutCubic
      const e = 1 - Math.pow(1 - t, 3);
      setFlipT(e);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
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
  const gap = size * 1;
  // Lift incoming word slightly while it travels to avoid overlap with "way"
  const incomingLift = gap * 0.35;
  // Raise final resting position of animated word to clear "way"
  const animatedLineOffsetY = gap * 0.5;
  const baseLines = ["There", "has to be a"] as const;
  const totalLines = finished ? baseLines.length + 1 : baseLines.length + 2;
  const startY = ((totalLines - 1) / 2) * gap;
  const double = mobile ? [1] : [1];

  return (
    <group>
      <Blob points={100000} flopAmount={"0.1"} eggplantAmount={"0.0"} />
      {double.map((d) => (
        <group key={d} scale={d}>
          <group key={d} position={[0, 0, 1.5]}>
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

            {!finished && (
              <group
                position={[
                  0,
                  startY - baseLines.length * gap + animatedLineOffsetY,
                  0,
                ]}
              >
                {/* Display layer: shows the current settled word at z=0 */}
                {showDisplay && (
                  <group
                    scale={1.5}
                    rotation={[tiltSign * TILT_ANGLE, 0, tiltSign * TILT_ANGLE]}
                    renderOrder={0}
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
                            color={dark ? "#f5f5f5" : "#253D2C"}
                          />
                        </Text3D>
                      </group>
                    </Center>
                  </group>
                )}

                {/* Incoming layer: only render while animating to avoid duplicates */}
                {((introRolling && introStarted) ||
                  (rolling && nextWord !== null)) && (
                  <group
                    scale={1.5}
                    position={[0, incomingLift * (1 - flipT), (1 - flipT) * 8]}
                    rotation={[
                      (introRolling ? tiltSign : -tiltSign) * TILT_ANGLE,
                      0,
                      (introRolling ? tiltSign : -tiltSign) * TILT_ANGLE,
                    ]}
                    renderOrder={2}
                  >
                    {/* Center raw text so translation/rotation act around its center */}
                    <Center
                      key={`${introRolling ? currentWord : nextWord !== null ? words[nextWord] : currentWord}`}
                      disableZ
                    >
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
                          {introRolling
                            ? currentWord
                            : nextWord !== null
                              ? words[nextWord]
                              : currentWord}
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
                            color={dark ? "#f5f5f5" : "#253D2C"}
                          />
                        </Text3D>
                      </group>
                    </Center>
                  </group>
                )}

                {/* Outgoing overlay: only created after incoming finishes; fades out */}
                {outgoingWord && (
                  <group
                    scale={1.5}
                    position={[0, 0, 0]}
                    rotation={[
                      outgoingTilt * TILT_ANGLE,
                      0,
                      outgoingTilt * TILT_ANGLE,
                    ]}
                    renderOrder={1}
                  >
                    <Center key={`${outgoingWord}`} disableZ>
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
                          {outgoingWord}
                          <MeshTransmissionMaterial
                            attach="material-0"
                            background={new THREE.Color().setHex(0x000000)}
                            color={
                              dark
                                ? new THREE.Color().set("#f5f5f5")
                                : new THREE.Color().set("#253D2C")
                            }
                            transparent
                            opacity={outgoingOpacity}
                            thickness={0.2}
                            roughness={0.1}
                            transmission={0.99}
                            ior={1.25}
                            chromaticAberration={0}
                          />
                          <meshStandardMaterial
                            attach="material-1"
                            color="#253D2C"
                            transparent
                            opacity={outgoingOpacity}
                            roughness={0.85}
                            metalness={0.05}
                            envMapIntensity={0.6}
                          />
                          {outgoingOpacity > 0.05 && (
                            <Edges
                              threshold={25}
                              scale={1.001}
                              color={dark ? "#f5f5f5" : "#253D2C"}
                            />
                          )}
                        </Text3D>
                      </group>
                    </Center>
                  </group>
                )}
              </group>
            )}

            <group
              position={[
                0,
                startY -
                  (finished ? baseLines.length : baseLines.length + 1) * gap,
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
