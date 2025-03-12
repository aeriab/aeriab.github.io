"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useNavigation } from "../src/app/navigateContext";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import React from "react";

const BACK_COLOR = new THREE.Color(0xc3f1ff);
const ABOUT_COLOR = new THREE.Color(0xA8A8FF); // Color for About page

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
    </mesh>
  );
}

function LoneDot({ position, onRemove }: { position: THREE.Vector3, onRemove: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const [speed] = useState(new THREE.Vector3(0.003, 0.001, 0)); // Speed of movement (right and up)

  const elapsed = clock.getElapsedTime();
  const brightness = (Math.random() * 0.06 - 0.03) + Math.min(0.9,1.0 + 0.5 * (0.2 * Math.sin(0.39 * elapsed) + 0.5 * Math.cos(1.14 * elapsed) + 0.3 * Math.sin(1.52 * elapsed) + 0.81 * Math.cos(0.73 * elapsed)));

  useEffect(() => {
    if (!groupRef.current) return;

    const group = groupRef.current;
    const boxSize = 1;
    const dotSize = 0.2;
    const adjustedColor = new THREE.Color(0xffffff).multiplyScalar(brightness);
    const material = new THREE.MeshBasicMaterial({color: adjustedColor});

    const geometry = new THREE.SphereGeometry(dotSize * (Math.random() + 0.1), 8, 8);
    const dot = new THREE.Mesh(geometry, material);

    dot.position.set(
      (Math.random() - 0.5) * boxSize + position.x,
      (Math.random() - 0.5) * boxSize + position.y,
      position.z + 0.1 + Math.random() * 0.2
    );

    group.add(dot);
  }, [position]);

  // Update the position of all dots in the group and check if they need to be removed
  useFrame(() => {
    if (!groupRef.current) return;

    // Move each dot by the specified speed
    groupRef.current.children.forEach((dot) => {
      (dot as THREE.Mesh).position.add(speed); // Move the dot right and up
      
      // Check if the dot has moved beyond x=100
      if ((dot as THREE.Mesh).position.x > 30) {
        onRemove(); // Call the callback to remove this dot from the parent component
      }
    });
  });

  return <group ref={groupRef} />;
}

// Camera controller for forward movement
const CameraController = () => {
  const { camera } = useThree();
  const { currentView } = useNavigation();
  const targetPosition = useRef(new THREE.Vector3(0, 0, 5)); // Initial camera position

  useEffect(() => {
    if (currentView === "inAbout") {
      console.log("AAAAAAAABBBBBBOOOOOOUUUUUUUUUUUTTTTTTTTTTT");
      targetPosition.current.set(2, 3, 8);
    } else if (currentView === "inProjects") {
      console.log("Moving back to the initial position");
      targetPosition.current.set(-2, -3, 8);
    } else {
      // Move back to the initial position
      
      console.log("SNAP BACK TO REALITY");
      targetPosition.current.set(0, 0, 5);
    }
  }, [currentView, camera]);

  useFrame(() => {
    camera.position.lerp(targetPosition.current, 0.05); // Smooth movement
  });

  return null;
};

const ClickHandler = ({ addDot }: { addDot: (pos: THREE.Vector3) => void }) => {
  const { scene, camera } = useThree();
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const [isMouseDown, setIsMouseDown] = useState(false); // Track if the mouse is being dragged

  const handleMouseDown = () => {
    setIsMouseDown(true);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isMouseDown) return;
    // Convert screen coordinates to normalized device coordinates (NDC)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const clickPosition = intersects[0].point.clone();

      // Move the new dots slightly above the clicked position
      clickPosition.y += 0.2; // Adjust height to stack dots

      addDot(clickPosition);
    }
  };

  const handleClick = (event: MouseEvent) => {
    // Handle a click without dragging (just create dots at the position of the click)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
  
    if (intersects.length > 0) {
      const clickPosition = intersects[0].point.clone();
      clickPosition.y += 0.2; // Adjust height to stack dots
      
      addDot(clickPosition);
    }
  };
  
  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, [isMouseDown]);

  return null;
};

// Main 3D scene component
const ThreeDScene: React.FC = () => {
  const [backgroundColor, setBackgroundColor] = useState(BACK_COLOR); // Initial background color
  const { currentView } = useNavigation();

  // Smooth background color change when view changes
  useEffect(() => {
    // Determine target color based on current view
    const targetColor = currentView === "inAbout" ? ABOUT_COLOR : BACK_COLOR;
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
  }, [currentView]);

  interface Dot {
    id: string;
    position: THREE.Vector3;
  }
  
  const [dotList, setDotList] = useState<Dot[]>([]);

  const addDot = (pos: THREE.Vector3) => {
    setDotList((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, position: pos.clone() },
    ]);
  };

  // Function to remove a dot by its id
  const removeDot = (id: string) => {
    setDotList(prev => prev.filter(dot => dot.id !== id));
  };

  return (
    <div id="threeDContainer" className="absolute top-0 left-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: backgroundColor.getStyle() }}
        gl={{ toneMapping: THREE.NoToneMapping }}
      >
        <ClickHandler addDot={addDot} />
        <CameraController />
        <Wall />
        {dotList.map((dot) => (
          <LoneDot 
            key={dot.id} 
            position={dot.position} 
            onRemove={() => removeDot(dot.id)} 
          />
        ))}
        <ambientLight />
        <directionalLight color={0xffffff} intensity={500} position={[10, 10, 10]} />
      </Canvas>
    </div>
  );
};

export default ThreeDScene;