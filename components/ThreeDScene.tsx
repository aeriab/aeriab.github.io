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


function LoneDot({ position }: { position: THREE.Vector3 }) {
  const groupRef = useRef<THREE.Group>(null);
  const [speed] = useState(new THREE.Vector3(0.003, 0.001, 0)); // Speed of movement (right and up)

  let elapsed = clock.getElapsedTime();
  let brightness = (Math.random() * 0.06 - 0.03) + Math.min(0.9,1.0 + 0.5 * (0.2 * Math.sin(0.39 * elapsed) + 0.5 * Math.cos(1.14 * elapsed) + 0.3 * Math.sin(1.52 * elapsed) + 0.81 * Math.cos(0.73 * elapsed)));

  useEffect(() => {
    if (!groupRef.current) return;

    const group = groupRef.current;
    const boxSize = 1;
    const dotSize = 0.2;
    let adjustedColor = new THREE.Color(0xffffff).multiplyScalar(brightness);
    const material = new THREE.MeshBasicMaterial({color: adjustedColor});

    const geometry = new THREE.SphereGeometry(dotSize * (Math.random() + 0.1), 16, 16);
    const dot = new THREE.Mesh(geometry, material);

    dot.position.set(
      (Math.random() - 0.5) * boxSize + position.x,
      (Math.random() - 0.5) * boxSize + position.y,
      position.z + 0.1
    );

    group.add(dot);
  }, [position]);

  // Update the position of all dots in the group
  useFrame(() => {
    if (!groupRef.current) return;

    // Move each dot by the specified speed
    groupRef.current.children.forEach((dot) => {
      (dot as THREE.Mesh).position.add(speed); // Move the dot right and up
      
    });
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
      const clickedObject = intersects[0].object;
      const clickPosition = intersects[0].point.clone();

      // Move the new dots slightly above the clicked position
      clickPosition.y += 0.2; // Adjust height to stack dots

      // console.log("Clicked on:", clickedObject.name || clickedObject);
      // console.log("Click Position:", clickPosition);

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
  
      for (let i = 0; i < 10; i++) {
        addDot(clickPosition);
      }
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

  interface Dot {
    id: string;
    position: THREE.Vector3;
  }

  // interface Dots {
  //   id: string;
  //   position: THREE.Vector3;
  // }
  
  // const [dotsList, setDotsList] = useState<Dots[]>([]);
  const [dotList, setDotList] = useState<Dot[]>([]);
  // const [dotsList, setDotsList] = useState<{ id: number; position: THREE.Vector3 }[]>([]);


  // const addDots = (pos: THREE.Vector3) => {
    
  //   console.log("Clicking event going!!");
  //   setDotsList((prev) => [
  //     ...prev,
  //     { id: `${Date.now()}-${Math.random()}`, position: pos.clone() },
  //   ]);
  // };

  const addDot = (pos: THREE.Vector3) => {
    setDotList((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, position: pos.clone() },
    ]);
  };

  return (
    <div id="threeDContainer" className="absolute top-0 left-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: backgroundColor.getStyle() }} // Apply the smooth background color change here
        gl={{ toneMapping: THREE.NoToneMapping }}
      >
        <ClickHandler addDot={addDot} />
        <CameraController />
        <Wall />
        {dotList.map((dot) => (
          <LoneDot key={dot.id} position={dot.position} />
        ))}
        <ambientLight />
        <directionalLight color={0xffffff} intensity={500} position={[10, 10, 10]} />
      </Canvas>
    </div>
  );
};

export default ThreeDScene;