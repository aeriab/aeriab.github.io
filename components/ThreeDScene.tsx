"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRotation } from "../src/app/rotateContext";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import React from "react";

const DOT_COLOR = new THREE.Color(0xffffff);
const BACK_COLOR = new THREE.Color(0xc3f1ff);

// Creates dots in a group
function Dots() {
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const movement = useRef({ x: 0, y: 0, z: 0 });


  useEffect(() => {
    if (!groupRef.current) return;

    const group = groupRef.current;
    const numDots = 500;
    const boxSize = 10;
    const dotSize = 0.2;
    const material = new THREE.MeshStandardMaterial({ 
      color: DOT_COLOR, 
      emissive: 0xffffff,
      roughness: 0.1,
      metalness: 1.0
    });

    for (let i = 0; i < numDots; i++) {
      const geometry = new THREE.SphereGeometry(dotSize * (Math.random() + 0.1), 32, 32);
      const dot = new THREE.Mesh(geometry, material);

      // Random position within the box
      dot.position.set(
        (Math.random() - 0.5) * boxSize * 2,
        (Math.random() - 0.5) * boxSize * 2,
        (Math.random() - 0.4) * boxSize * 0.65
      );

      group.add(dot);
    }

    // Mouse movement tracking
    const onMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;

    // const SPEED_MAX = 0.002;
    const boxSize = 10;

    // Update movement values
    // movement.current.x += Math.max(-SPEED_MAX, Math.min(mouseRef.current.x - movement.current.x, SPEED_MAX));
    // movement.current.y += Math.max(-SPEED_MAX, Math.min(mouseRef.current.y - movement.current.y, SPEED_MAX));
    
    movement.current.x += 0.0008;
    movement.current.y += 0.0010;

    // Apply movement to dots
    groupRef.current.children.forEach((dot) => {
      dot.position.x += movement.current.x * 0.05;
      dot.position.y += movement.current.y * 0.05;

      // Wrap-around effect
      if (dot.position.x > boxSize) dot.position.x -= 2 * boxSize;
      else if (dot.position.x < -boxSize) dot.position.x += 2 * boxSize;

      if (dot.position.y > boxSize) dot.position.y -= 2 * boxSize;
      else if (dot.position.y < -boxSize) dot.position.y += 2 * boxSize;
    });

    // Smooth out movement over time
    movement.current.x *= 0.95;
    movement.current.y *= 0.95;
  });

  return <group ref={groupRef} />;
}

// Camera controller for forward movement
const CameraController = () => {
  const { camera } = useThree();
  const { rotate } = useRotation();
  const targetPosition = useRef(new THREE.Vector3(0, 0, 5)); // Initial camera position

  useEffect(() => {
    if (rotate) {
      // Move forward by 5 units
      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction); // Get forward direction
      direction.multiplyScalar(5); // Scale movement by 5 units
      targetPosition.current.add(direction);
    }
  }, [rotate]);

  useFrame(() => {
    camera.position.lerp(targetPosition.current, 0.05); // Smooth movement
  });

  return null;
};

// Main 3D scene component
const ThreeDScene: React.FC = () => {
  const [backgroundColor, setBackgroundColor] = useState(BACK_COLOR); // Initial background color

  // Smooth background color change when camera moves
  const { rotate } = useRotation();

  useEffect(() => {
    if (rotate) {
      // Animate the background color change
      const targetColor = new THREE.Color(0xA8A8FF); // Lighter shade of blue
      const startColor = new THREE.Color(backgroundColor);

      const duration = 600; // Animation duration in milliseconds
      let startTime: number | null = null;

      const animateColor = (time: number) => {
        if (!startTime) startTime = time;

        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Interpolate between start and target colors
        const interpolatedColor = startColor.clone().lerp(targetColor, progress);
        setBackgroundColor(interpolatedColor);

        if (progress < 1) {
          requestAnimationFrame(animateColor);
        }
      };

      requestAnimationFrame(animateColor);
    }
  }, [rotate]);

  return (
    <div id="threeDContainer" className="absolute top-0 left-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: backgroundColor.getStyle() }} // Apply the smooth background color change here
      >
        <CameraController />
        <Dots />
        <ambientLight />
        <directionalLight color={0xffffff} intensity={20000000} position={[10, 10, 10]} />
      </Canvas>
    </div>
  );
};

export default ThreeDScene;