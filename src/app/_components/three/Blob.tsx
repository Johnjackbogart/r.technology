"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import isMobile from "ismobilejs";
import { type PerformanceProfile } from "@/lib/usePerformanceProfile";

interface BlobProps {
  points: number;
  flopAmount?: number;
  eggplantAmount?: number;
  speed?: number; // overall animation speed multiplier
  performanceProfile?: PerformanceProfile;
}
export default function Blob({
  points,
  flopAmount = 1.0,
  eggplantAmount = 1.0,
  speed = 0.5,
  performanceProfile,
}: BlobProps) {
  const mesh = useRef<THREE.Points>(null!);
  const mousePosition = useRef({ x: 0, y: 0 });
  const targetMousePosition = useRef({ x: 0, y: 0 });
  const lastUpdateTime = useRef(0);
  const { size } = useThree();
  const performanceLevel = performanceProfile?.level ?? "standard";

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector3(0, 0, 1) },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uSpeed: { value: speed },
      uFlopAmount: { value: flopAmount },
      uEggplantAmount: { value: eggplantAmount },
      uQuality: { value: performanceLevel === "low" ? 0 : 1 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- uniforms are stable, only inner values mutate
    [],
  );

  const [positions, colors] = useMemo(() => {
    // Seeded random for deterministic results (pure function)
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
      return x - Math.floor(x);
    };

    const positions = [];
    const colors = [];
    const isMobileDevice = isMobile(window.navigator).any;
    const profileMultiplier =
      performanceProfile?.particleMultiplier ??
      (performanceLevel === "low" ? 0.25 : 0.6);
    const particleCount = Math.max(
      6000,
      Math.floor(points * profileMultiplier * (isMobileDevice ? 0.35 : 1)),
    );
    const radius = 10;

    for (let i = 0; i < particleCount; i++) {
      const theta = seededRandom(i) * Math.PI * 2;
      const phi = Math.acos(2 * seededRandom(i + particleCount) - 1);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions.push(x, y, z);

      // Initial color (will be modified in the shader)
      colors.push(1, 1, 1);
    }

    return [new Float32Array(positions), new Float32Array(colors)];
  }, [points, performanceLevel, performanceProfile]);

  useFrame((state) => {
    const { clock } = state;
    const currentTime = clock.getElapsedTime();
    const deltaTime = currentTime - lastUpdateTime.current;
    lastUpdateTime.current = currentTime;

    if (mesh.current) {
      uniforms.uTime.value = currentTime;
      uniforms.uSpeed.value = speed;

      // Smoothly interpolate to new parameter values
      const lerpSpeed = 0.1; // Adjust for smoothness (lower = smoother but slower)
      uniforms.uFlopAmount.value +=
        (flopAmount - uniforms.uFlopAmount.value) * lerpSpeed;
      uniforms.uEggplantAmount.value +=
        (eggplantAmount - uniforms.uEggplantAmount.value) * lerpSpeed;

      // Apply momentum to mouse movement
      const lerpFactor =
        performanceLevel === "low"
          ? 1 - Math.pow(0.0005, deltaTime)
          : 1 - Math.pow(0.001, deltaTime);
      mousePosition.current.x +=
        (targetMousePosition.current.x - mousePosition.current.x) * lerpFactor;
      mousePosition.current.y +=
        (targetMousePosition.current.y - mousePosition.current.y) * lerpFactor;

      // Project mouse position onto a sphere
      if (currentTime > 5) {
        const mouseX = mousePosition.current.x * Math.PI;
        const mouseY = (mousePosition.current.y * Math.PI) / 2;
        const mouseZ = Math.cos(mouseY) * Math.cos(mouseX);
        const projectedMousePosition = new THREE.Vector3(
          Math.cos(mouseY) * Math.sin(mouseX),
          Math.sin(mouseY),
          mouseZ,
        ).normalize();
        uniforms.uMouse.value = projectedMousePosition;
      }

      // Apply rotation to the entire particle field
      const rotationSpeed = performanceLevel === "low" ? 0.05 : 0.1;
      mesh.current.rotation.y += deltaTime * rotationSpeed * speed;
    }
  });

  // Update uResolution when the window size changes
  useEffect(() => {
    uniforms.uResolution.value.set(size.width, size.height);
  }, [size, uniforms]);

  useEffect(() => {
    uniforms.uQuality.value = performanceLevel === "low" ? 0 : 1;
  }, [performanceLevel, uniforms]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const newX = (event.clientX / window.innerWidth) * 2 - 1;
      const newY = -(event.clientY / window.innerHeight) * 2 + 1;

      targetMousePosition.current = { x: newX, y: newY };
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const vertexShader = `
    uniform float uTime;
    uniform float uSpeed;
    uniform vec3 uMouse;
    uniform float uFlopAmount;
    uniform float uEggplantAmount;
    uniform float uQuality;
    attribute vec3 color;
    varying vec3 vColor;
    varying float vDistance;

    #define PI 3.14159265359

    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

    float snoise(vec3 v){
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.7, 1.0, 3.0);

      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 =   v - i + dot(i, C.xxx) ;

      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );

      vec3 x1 = x0 - i1 + 1.0 * C.xxx;
      vec3 x2 = x0 - i2 + 2.0 * C.xxx;
      vec3 x3 = x0 - 1. + 3.0 * C.xxx;

      i = mod(i, 289.0 );
      vec4 p = permute( permute( permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

      float n_ = 1.0/7.0;
      vec3  ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z *ns.z);

      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );

      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );

      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);

      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;

      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                    dot(p2,x2), dot(p3,x3) ) );
    }

    vec3 waveAnimation(vec3 pos, float t) {
      float waveHeight = 0.5;
      float waveFrequency = 0.5;
      float waveSpeed = 1.5;
      
      float wave = sin(pos.x * waveFrequency + t * waveSpeed) * 
                   cos(pos.z * waveFrequency + t * waveSpeed) * 
                   waveHeight;
      
      return vec3(pos.x, pos.y + wave, pos.z);
    }

    vec3 eggplantMorph(vec3 pos, float t) {
      float morphFactor = smoothstep(0.0, 1.0, sin(t * 0.2) * 0.05 + 0.05);
      
      // Generate a random bulge direction
      vec3 bulgeDir = normalize(vec3(
        sin(t * 0.1) + cos(t * 0.1),
        sin(t * 0.15) + cos(t * 0.25),
        sin(t * 0.3) + cos(t * 0.5)
      ));
      
      // Project the position onto the bulge direction
      float projection = dot(pos, bulgeDir);
      
      // Elongate in the bulge direction
      pos += bulgeDir * projection * morphFactor * 0.05;
      
      // Bulge out perpendicular to the elongation
      vec3 perpDir = normalize(pos - bulgeDir * projection);
      float bulge = smoothstep(-0.5, 0.5, projection) * morphFactor;
      pos += perpDir * bulge * 0.3;
      
      // Add some curvature
      pos += cross(bulgeDir, perpDir) * sin(projection * PI) * 0.2 * morphFactor;
      
      return pos;
    }

    vec3 stringSqueezemorph(vec3 pos, float t) {
      float morphFactor = smoothstep(0.0, 1.0, sin(t * 0.2) * 0.5 + 0.5);
      
      // Create a more complex, undulating plane
      vec3 planeNormal = normalize(vec3(
        sin(t * 0.23 + pos.x * 0.1) + cos(t * .3 + pos.y * 0.1),
        sin(t * 0.19 + pos.y * 0.1) + cos(t * 0.21 + pos.z * 0.1),
        sin(t * 0.17 + pos.z * 0.1) + cos(t * 0.15 + pos.x * 0.1)
      ));
      
      float distanceToPlane = dot(pos, planeNormal);
      
      // Adjust the squeeze factor to create more pronounced squiggles
      float squeezeFactor = exp(-distanceToPlane * distanceToPlane * 5.0);
      float thinningFactor = -smoothstep(0.0, 5.0, squeezeFactor);
      
      vec3 displacementDir = normalize(pos - planeNormal * distanceToPlane);
      pos += displacementDir * squeezeFactor * morphFactor * 1.0;
      
      // Add more complex modulation
      float modulation = sin(t * 2.0 + length(pos) * 0.5) * cos(t * 1.5 + pos.y * 0.3) 
                       + sin(t * 3.0 + pos.x * 0.4) * cos(t * 2.5 + pos.z * 0.2)
                       + sin(t * 4.0 + pos.z * 0.6) * cos(t * 3.5 + pos.x * 0.5);
      pos += planeNormal * modulation * morphFactor * 0.75;
      
      // Add twisting effect
      float twistFactor = sin(t * 0.5 + pos.y * 0.2) * .75;
      pos.x += pos.y * twistFactor;
      pos.z += pos.y * twistFactor;
      
      pos *= mix(1.0, 1.0 + thinningFactor * 0.75, morphFactor);
      
      return pos;
    }

    // Dark forest green palette anchored at #253D2C, desaturated (no moss tint)
    vec3 tieDyeColor(vec3 pos, float t) {
      float scale = 0.15;
      float speed = 0.2;

      float n1 = snoise(vec3(pos.x * scale, pos.y * scale, t * speed)) * 0.5 + 0.5;
      float n2 = snoise(vec3(pos.y * scale, pos.z * scale, t * speed + 31.0)) * 0.5 + 0.5;
      float n3 = snoise(vec3(pos.z * scale, pos.x * scale, t * speed + 73.0)) * 0.5 + 0.5;

      // Base forest color: #253D2C (RGB 37,61,44)
      vec3 BASE = vec3(0.145, 0.239, 0.173);
      // Darker variants derived from BASE (kept in green gamut)
      vec3 G1 = BASE * 0.55; // very dark
      vec3 G2 = BASE * 0.70; // dark
      vec3 G3 = BASE * 0.85; // mid-dark
      vec3 G4 = BASE;        // base
      vec3 G5 = BASE;        // no moss tint

      // Mix greens with strong bias to darkest tones (G1/G2)
      vec3 gA = mix(G1, G2, n1);              // darkest pair
      vec3 gB = mix(G3, G4, n2 * 0.5);        // limit mid contribution
      vec3 gMid = gB;                          // remove lightest/moss contribution entirely
      vec3 greens = mix(gA, gMid, 0.20);      // 80% weight to darkest greens

      // Use greens only; keep it anchored to BASE
      vec3 color = mix(greens, BASE, 0.30);

      // Muted brightness modulation for darker, earthy look
      float v = snoise(pos * 0.25 + t * 0.15) * 0.5 + 0.5; // 0..1
      float brightness = 0.26 + 0.10 * v; // 0.26..0.36

      // No desaturation: keep full saturation of the dark greens
      vec3 finalColor = clamp(color * brightness, 0.0, 1.0);

      return finalColor;
    }

    // Cheap hash-based color for low quality branch (1 trig)
    float hash13(vec3 p) {
      return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
    }

    vec3 simpleColor(vec3 pos, float t) {
      float h = hash13(pos * 0.25 + t * 0.05);
      // Two-tone mix to avoid multiple noise samples
      vec3 dark = vec3(0.12, 0.20, 0.15);
      vec3 mid = vec3(0.20, 0.32, 0.24);
      return mix(dark, mid, h);
    }

    void main() {
      vec3 pos = position;

      float t = uTime * 0.5 * uSpeed;

      bool lowQuality = uQuality < 0.5;

      if (lowQuality) {
        // Lighter path: remove squeeze/twist and heavy noise
        pos = waveAnimation(pos, uTime * uSpeed * 0.5);
        // Reintroduce squeeze morph but with gentler timing to keep cost manageable
        pos = stringSqueezemorph(pos, uTime * 1.0 * uSpeed - 1.0 * 10.0 * uFlopAmount);
        pos += normalize(pos) * 0.02 * sin(t * 0.5);

        float dotProduct = dot(normalize(pos), uMouse);
        if (dotProduct > 0.9 && uTime > 5.0) {
          pos += uMouse * 0.15 * (dotProduct - 0.9);
        }

        vColor = simpleColor(pos, t);
        vDistance = length(pos) / 10.0;
      } else {
        // Full quality path
        pos = waveAnimation(pos, uTime * uSpeed);
        pos = pos + uEggplantAmount * eggplantMorph(pos, uTime * uSpeed);
        pos = stringSqueezemorph(pos, uTime * 1.7 * uSpeed - 1.0 * 40.0 * uFlopAmount);

        float noiseScale = 0.5;
        float noiseAmplitude = 0.05;
        float undulation = snoise(vec3(pos.x * noiseScale, pos.y * noiseScale, pos.z * noiseScale + t * 0.2)) * noiseAmplitude;

        pos += normalize(pos) * undulation;

        float interactionRadius = 0.8;
        float dotProduct = dot(normalize(pos), uMouse);

        if (dotProduct > cos(interactionRadius) && uTime > 5.0) {
          float mouseEffect = smoothstep(cos(interactionRadius), 1.0, dotProduct) * 2.5;
          float mouseDisplacement = sin(dotProduct * 10.0 - uTime * 5.0) * mouseEffect;
          pos += uMouse * mouseDisplacement * 0.5;
        }

        vColor = tieDyeColor(pos, uTime * uSpeed);
        vDistance = length(pos) / 10.0;
      }

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      gl_PointSize = (lowQuality ? 3.0 : 4.0) / -mvPosition.z;
    }
  `;

  const fragmentShader = `
    varying vec3 vColor;
    varying float vDistance;

    void main() {
      if (length(gl_PointCoord - vec2(0.5)) > 0.5) discard;
      
      // Apply glow effect
      float glow = 1.0 - smoothstep(0.0, 1.0, vDistance);
      vec3 finalColor = mix(vColor, vec3(1.0), glow * 0.15);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  return (
    <points ref={mesh} position={[0, 0, -20]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}
