"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial, Center } from "@react-three/drei";
import * as THREE from "three";

// Dynamic particle swarm component
function ParticleSwarm({ count = 2000 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();

  // Create initial random position & phase data
  const particles = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 8;
      const speed = 0.01 + Math.random() * 0.02;
      const factor = 1 + Math.random() * 5;
      data.push({ x, y, z, speed, factor });
    }
    return data;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Get normalized pointer coordinates (-1 to 1) and map to viewport size
    const pointerX = state.pointer.x * (viewport.width / 2);
    const pointerY = state.pointer.y * (viewport.height / 2);

    particles.forEach((p, idx) => {
      // Rotate phase based on time
      const time = state.clock.getElapsedTime();
      
      // Calculate cursor attraction
      const targetX = pointerX + Math.sin(time + p.factor) * 0.5;
      const targetY = pointerY + Math.cos(time + p.factor) * 0.5;

      // Lerp particle coordinates closer to cursor target
      p.x = THREE.MathUtils.lerp(p.x, targetX, p.speed * 0.05);
      p.y = THREE.MathUtils.lerp(p.y, targetY, p.speed * 0.05);
      p.z += Math.sin(time + p.factor) * 0.005;

      // Position update
      dummy.position.set(p.x, p.y, p.z);
      
      // Variable sizing on particles
      const scale = 0.02 + Math.abs(Math.sin(time * p.speed + p.factor)) * 0.02;
      dummy.scale.set(scale, scale, scale);
      
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(idx, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#FF6200" transparent opacity={0.65} />
    </instancedMesh>
  );
}

// 3D Glass centerpiece component
function FocalObject() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.getElapsedTime();
    // Slowly rotate on multiple axes
    ref.current.rotation.x = time * 0.15;
    ref.current.rotation.y = time * 0.2;
    ref.current.rotation.z = Math.sin(time * 0.1) * 0.1;
  });

  return (
    <mesh ref={ref} scale={1.2}>
      {/* Immersive high-end TorusKnot geometry */}
      <torusKnotGeometry args={[1, 0.35, 120, 16]} />
      {/* High-end glass material mapping refraction and light transmission */}
      <MeshTransmissionMaterial
        resolution={512}
        distortion={0.25}
        thickness={1}
        anisotropy={0.5}
        roughness={0.05}
        chromaticAberration={0.4}
        color="#F3F4F6"
        temporalDistortion={0.1}
      />
    </mesh>
  );
}

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0 z-0 h-full w-full">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 5], fov: 45 }}
      >
        <color attach="background" args={["#0D0D0D"]} />
        <fog attach="fog" args={["#0D0D0D", 4, 10]} />
        
        {/* Lights setup matching the PRD */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#FFFFFF" />
        <pointLight position={[-4, -3, -5]} intensity={10} color="#FF6200" />
        <pointLight position={[4, 3, 5]} intensity={12} color="#6D28D9" />

        <Center>
          <FocalObject />
        </Center>

        <ParticleSwarm count={1500} />
      </Canvas>
    </div>
  );
}
