import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, MeshWobbleMaterial, PointMaterial, Points } from '@react-three/drei';
import * as THREE from 'three';

interface CyberneticReactorProps {
    soul: number; // 0 - 100
    state: string; // 'CRISIS', 'STABLE', etc.
}

export function CyberneticReactor({ soul, state }: CyberneticReactorProps) {
    const coreRef = useRef<THREE.Mesh>(null!);
    const wireframeInnerRef = useRef<THREE.Mesh>(null!);
    const wireframeOuterRef = useRef<THREE.Mesh>(null!);
    const pointsRef = useRef<THREE.Points>(null!);

    // --- Configuration based on Soul/State ---
    const isCrisis = state === 'CRISIS' || soul < 30;

    // Core Parameters
    const coreColor = isCrisis ? '#ff003c' : '#06b6d4'; // Red vs Cyan
    const wobbleFactor = isCrisis ? 0.8 : 0.3;
    const wobbleSpeed = isCrisis ? 3 : 1;

    // Wireframe Rotation Speed (Base)
    const rotationSpeed = isCrisis ? 0.05 : 0.01;

    // --- Particles Setup ---
    // Generate 500 random points in a sphere shell
    const particles = useMemo(() => {
        const temp = new Float32Array(500 * 3);
        for (let i = 0; i < 500; i++) {
            const theta = THREE.MathUtils.randFloatSpread(360);
            const phi = THREE.MathUtils.randFloatSpread(360);
            const radius = 2.5 + Math.random() * 2; // Radius between 2.5 and 4.5

            const x = radius * Math.sin(theta) * Math.cos(phi);
            const y = radius * Math.sin(theta) * Math.sin(phi);
            const z = radius * Math.cos(theta);

            temp[i * 3] = x;
            temp[i * 3 + 1] = y;
            temp[i * 3 + 2] = z;
        }
        return temp;
    }, []);

    useFrame((state, delta) => {
        const time = state.clock.getElapsedTime();
        const mouseX = state.mouse.x;
        const mouseY = state.mouse.y;

        // 1. Core Rotation & Wobble (Handled by material mostly, but giving it some base spin)
        if (coreRef.current) {
            coreRef.current.rotation.x = THREE.MathUtils.lerp(coreRef.current.rotation.x, mouseY * 0.5, 0.1);
            coreRef.current.rotation.y = THREE.MathUtils.lerp(coreRef.current.rotation.y, mouseX * 0.5, 0.1);
        }

        // 2. Wireframes Rotation (Opposing directions)
        if (wireframeInnerRef.current) {
            wireframeInnerRef.current.rotation.x += delta * (rotationSpeed * 5);
            wireframeInnerRef.current.rotation.y -= delta * (rotationSpeed * 5);
        }
        if (wireframeOuterRef.current) {
            wireframeOuterRef.current.rotation.x -= delta * (rotationSpeed * 3);
            wireframeOuterRef.current.rotation.y += delta * (rotationSpeed * 3);

            // Mouse Influence on Outer Wireframe
            wireframeOuterRef.current.rotation.z = THREE.MathUtils.lerp(wireframeOuterRef.current.rotation.z, mouseX * 0.2, 0.05);
        }

        // 3. Particles Orbit
        if (pointsRef.current) {
            pointsRef.current.rotation.y += delta * 0.05;
            pointsRef.current.rotation.z += delta * 0.02;
        }
    });

    return (
        <group>
            {/* --- 1. The Core (Icosahedron + Wobble) --- */}
            <mesh ref={coreRef} scale={1}>
                <icosahedronGeometry args={[1, 0]} /> {/* Detail 0 = sharp geometric look */}
                <MeshWobbleMaterial
                    color={coreColor}
                    factor={wobbleFactor}
                    speed={wobbleSpeed}
                    roughness={0.1}
                    metalness={0.9}
                    emissive={coreColor}
                    emissiveIntensity={isCrisis ? 0.8 : 0.2}
                />
            </mesh>

            {/* --- 2. Inner Wireframe (Fast) --- */}
            <mesh ref={wireframeInnerRef} scale={1.2}>
                <icosahedronGeometry args={[1, 1]} />
                <meshStandardMaterial
                    color={isCrisis ? "#ff5555" : "#a5f3fc"}
                    wireframe
                    transparent
                    opacity={0.3}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* --- 3. Outer Wireframe (Slow, Larger) --- */}
            <mesh ref={wireframeOuterRef} scale={1.6}>
                <sphereGeometry args={[1, 12, 12]} />
                <meshStandardMaterial
                    color={isCrisis ? "#ff0000" : "#0891b2"}
                    wireframe
                    transparent
                    opacity={0.15}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* --- 4. Particle Atmosphere --- */}
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={particles.length / 3}
                        array={particles}
                        itemSize={3}
                        args={[particles, 3]}
                    />
                </bufferGeometry>
                <PointMaterial
                    transparent
                    vertexColors={false}
                    color={isCrisis ? "#ff8888" : "#88ccff"}
                    size={0.05}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.6}
                />
            </points>

            {/* --- Lights attached to component for self-illumination --- */}
            <pointLight position={[0, 0, 0]} intensity={isCrisis ? 5 : 2} color={coreColor} distance={5} />
        </group>
    );
}
