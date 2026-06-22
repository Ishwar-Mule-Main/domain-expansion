"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, Center } from "@react-three/drei";
import * as THREE from "three";

interface ServiceCanvasProps {
  slug: string;
}

// Sub-component to render the specific 3D model based on service slug
function FocalObject({ slug }: { slug: string }) {
  const primaryRef = useRef<THREE.Mesh>(null);
  const secondaryRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (primaryRef.current) {
      primaryRef.current.rotation.x = time * 0.15;
      primaryRef.current.rotation.y = time * 0.2;
    }
    if (secondaryRef.current) {
      secondaryRef.current.rotation.x = -time * 0.25;
      secondaryRef.current.rotation.y = -time * 0.15;
      secondaryRef.current.rotation.z = time * 0.1;
    }
  });

  if (slug === "marketing-expansion") {
    // Geodesic / interconnected nodes
    return (
      <group>
        <mesh ref={primaryRef}>
          <icosahedronGeometry args={[1.2, 1]} />
          <meshBasicMaterial color="#FF6200" wireframe transparent opacity={0.4} />
        </mesh>
        <mesh ref={secondaryRef} scale={0.75}>
          <icosahedronGeometry args={[1, 2]} />
          <MeshTransmissionMaterial
            resolution={256}
            distortion={0.3}
            thickness={0.8}
            roughness={0.1}
            chromaticAberration={0.3}
            color="#FF8C42"
          />
        </mesh>
      </group>
    );
  }

  if (slug === "development-expansion") {
    // Structured cubic grids
    return (
      <group>
        <mesh ref={primaryRef}>
          <boxGeometry args={[1.4, 1.4, 1.4]} />
          <meshBasicMaterial color="#FF8C42" wireframe transparent opacity={0.3} />
        </mesh>
        <mesh ref={secondaryRef} scale={0.7}>
          <boxGeometry args={[1.4, 1.4, 1.4]} />
          <MeshTransmissionMaterial
            resolution={256}
            distortion={0.1}
            thickness={1.2}
            roughness={0.05}
            chromaticAberration={0.2}
            color="#FFFFFF"
          />
        </mesh>
      </group>
    );
  }

  if (slug === "design-expansion") {
    // Creative organic morphing torus
    return (
      <group>
        <mesh ref={primaryRef}>
          <torusGeometry args={[0.8, 0.28, 16, 100]} />
          <MeshTransmissionMaterial
            resolution={256}
            distortion={0.5}
            thickness={1.0}
            roughness={0.02}
            chromaticAberration={0.5}
            color="#8B5CF6"
          />
        </mesh>
        <mesh ref={secondaryRef} scale={1.2}>
          <torusGeometry args={[0.8, 0.05, 8, 48]} />
          <meshBasicMaterial color="#6D28D9" wireframe transparent opacity={0.25} />
        </mesh>
      </group>
    );
  }

  if (slug === "ai-expansion") {
    // Synapse constellation concentric rings
    return (
      <group>
        <mesh ref={primaryRef}>
          <octahedronGeometry args={[1.3, 1]} />
          <meshBasicMaterial color="#6D28D9" wireframe transparent opacity={0.4} />
        </mesh>
        <mesh ref={secondaryRef} scale={0.8}>
          <sphereGeometry args={[1, 16, 16]} />
          <MeshTransmissionMaterial
            resolution={256}
            distortion={0.4}
            thickness={1.5}
            roughness={0.1}
            chromaticAberration={0.4}
            color="#FF6200"
          />
        </mesh>
      </group>
    );
  }

  // Fallback basic Torus
  return (
    <mesh ref={primaryRef}>
      <torusGeometry args={[1, 0.3, 16, 100]} />
      <meshStandardMaterial color="#FF6200" roughness={0.1} />
    </mesh>
  );
}

// Light particle drift background
function BackgroundParticles({ count = 500, color = "#FF6200" }: { count?: number; color?: string }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
      spd[i] = 0.002 + Math.random() * 0.005;
    }
    return [pos, spd];
  }, [count]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;
    for (let i = 0; i < count; i++) {
      let y = posAttr.getY(i);
      y -= speeds[i];
      if (y < -4) {
        y = 4;
      }
      posAttr.setY(i, y);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color={color} transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

export default function ServiceCanvas({ slug }: ServiceCanvasProps) {
  // Determine dominant theme color for background particles based on slug
  const particleColor =
    slug === "design-expansion" || slug === "ai-expansion" ? "#8B5CF6" : "#FF6200";

  return (
    <div className="absolute inset-0 z-0 h-full w-full pointer-events-none">
      <Canvas
        dpr={[1, 1.5]} // Capped dpr for performance
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 4.5], fov: 45 }}
      >
        <color attach="background" args={["#0D0D0D"]} />
        <fog attach="fog" args={["#0D0D0D", 3, 8]} />

        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 3, 3]} intensity={1.5} color="#FFFFFF" />
        <pointLight position={[-3, -3, -4]} intensity={8} color="#FF6200" />
        <pointLight position={[3, 3, 4]} intensity={10} color="#6D28D9" />

        <Center>
          <FocalObject slug={slug} />
        </Center>

        <BackgroundParticles count={400} color={particleColor} />
      </Canvas>
    </div>
  );
}
