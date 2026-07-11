import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField() {
  const ref = useRef<any>(null);
  const { mouse } = useThree();

  const count = 2500;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 2.5 + Math.random() * 2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.08;
    ref.current.rotation.x += delta * 0.03;
    // Subtle mouse parallax
    ref.current.rotation.y += mouse.x * 0.002;
    ref.current.rotation.x += mouse.y * 0.002;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#38cdc9"
        size={0.015}
        sizeAttenuation
        depthWrite={false}
        opacity={0.7}
      />
    </Points>
  );
}

function WireframeSphere() {
  const ref = useRef<any>(null);
  const { mouse } = useThree();

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.12;
    ref.current.rotation.z += delta * 0.05;
    ref.current.rotation.y += mouse.x * 0.003;
    ref.current.rotation.x += mouse.y * 0.003;
  });

  return (
    <mesh ref={ref} scale={1.8}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial color="#1ab3af" wireframe transparent opacity={0.15} />
    </mesh>
  );
}

function InnerSphere() {
  const ref = useRef<any>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y -= delta * 0.15;
    ref.current.rotation.x -= delta * 0.08;
  });
  return (
    <mesh ref={ref} scale={1.2}>
      <icosahedronGeometry args={[1, 2]} />
      <meshBasicMaterial color="#38cdc9" wireframe transparent opacity={0.08} />
    </mesh>
  );
}

export default function Hero3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.5} />
      <ParticleField />
      <WireframeSphere />
      <InnerSphere />
    </Canvas>
  );
}
