"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRotation } from "../src/app/rotateContext";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import React from "react";

const DOT_COLOR = new THREE.Color(0xffffff);
const BACK_COLOR = new THREE.Color(0xc3f1ff);

const clock = new THREE.Clock();


function Wall() {
  const wallRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (wallRef.current) {
      wallRef.current.name = "Wall"; // Give it a name for identification
    }
  }, []);

  return (
    <mesh ref={wallRef} position={[0, 0, -1]}>
      <boxGeometry args={[100, 100, 0.2]} />,
      <meshBasicMaterial color={BACK_COLOR} />
      {/* <meshBasicMaterial color={new THREE.Color(BACK_COLOR).multiplyScalar(1.5)} /> */}
    </mesh>
  );
}

// Creates dots in a group
function Dots({ position }: { position: THREE.Vector3 }) {
  const groupRef = useRef<THREE.Group>(null);

  let elapsed = clock.getElapsedTime();
  let brightness = 1.0 + 0.5 * (0.2 * Math.sin(0.39 * elapsed) + 0.5 * Math.cos(1.14 * elapsed) + 0.3 * Math.sin(1.52 * elapsed) + 0.81 * Math.cos(0.73 * elapsed));

  // 0.1\sin\left(0.39x\right)+0.5\cos\left(1.14x\right)\ +\ 0.2\sin\left(1.52x\right)+0.81\cos\left(0.73x\right)

  useEffect(() => {
    if (!groupRef.current) return;

    const group = groupRef.current;
    const numDots = 20;
    const boxSize = 1;
    const dotSize = 0.2;
    let adjustedColor = new THREE.Color(0xffffff).multiplyScalar(brightness);
    const material = new THREE.MeshBasicMaterial({color: adjustedColor});

    for (let i = 0; i < numDots; i++) {
      const geometry = new THREE.SphereGeometry(dotSize * (Math.random() + 0.1), 16, 16);
      const dot = new THREE.Mesh(geometry, material);

      dot.position.set(
        (Math.random() - 0.5) * boxSize + position.x,
        (Math.random() - 0.5) * boxSize + position.y,
        position.z + 0.1
      );

      group.add(dot);
    }
  }, [position]);

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

const ClickHandler = ({ addDots }: { addDots: (pos: THREE.Vector3) => void }) => {
  const { scene, camera } = useThree();
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const handleClick = (event: MouseEvent) => {
    // Convert screen coordinates to normalized device coordinates (NDC)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      const clickPosition = intersects[0].point.clone();

      // Move the new dots slightly above the clicked position
      clickPosition.y += 0.2; // Adjust height to stack dots

      console.log("Clicked on:", clickedObject.name || clickedObject);
      console.log("Click Position:", clickPosition);

      addDots(clickPosition);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

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

  const [dotsList, setDotsList] = useState<{ id: number; position: THREE.Vector3 }[]>([]);

  const addDots = (pos: THREE.Vector3) => {
    setDotsList((prev) => [...prev, { id: Date.now(), position: pos.clone() }]);
  };

  return (
    <div id="threeDContainer" className="absolute top-0 left-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: backgroundColor.getStyle() }} // Apply the smooth background color change here
        gl={{ toneMapping: THREE.NoToneMapping }}
      >
        <ClickHandler addDots={addDots} />
        <CameraController />
        <Wall />
        {dotsList.map((dot) => (
          <Dots key={dot.id} position={dot.position} />
        ))}
        <ambientLight />
        <directionalLight color={0xffffff} intensity={500} position={[10, 10, 10]} />
      </Canvas>
    </div>
  );
};

export default ThreeDScene;