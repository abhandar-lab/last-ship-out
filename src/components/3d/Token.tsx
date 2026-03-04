// src/components/3d/Token.tsx
import React, { useRef, useCallback } from 'react';
import { MeshProps, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Float, Text, Billboard } from '@react-three/drei';
import { useDragToken } from '@/hooks/useDragToken';
import { ChapterNumber, SceneId } from '@/types/game';

export interface Token3DProps extends MeshProps {
  tokenId: string;
  label: string;
  chapter: ChapterNumber;
  scene: SceneId;
  basePosition: THREE.Vector3;
  getTimerRemainingMs?: () => number | undefined;
  onDropInSlot?: (worldPosition: [number, number, number]) => {
    inSlot: boolean;
    slotIndex?: number;
  };
}

export const Token: React.FC<Token3DProps> = ({
  tokenId,
  label,
  chapter,
  scene,
  basePosition,
  getTimerRemainingMs,
  onDropInSlot,
  ...rest
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size, camera, gl } = useThree();
  const hoverScaleRef = useRef(1);
  const isHoveredRef = useRef(false);

  const raycaster = useRef(new THREE.Raycaster()).current;
  const deckPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)).current;
  const intersectionPoint = useRef(new THREE.Vector3()).current;

  const screenToWorldOnDeck = useCallback(
    (screenX: number, screenY: number): [number, number, number] | null => {
      if (!meshRef.current) return null;
      const x = (screenX / size.width) * 2 - 1;
      const y = -(screenY / size.height) * 2 + 1;
      raycaster.setFromCamera({ x, y }, camera);

      const intersects = raycaster.ray.intersectPlane(deckPlane, intersectionPoint);
      if (!intersects) return null;
      return [intersects.x, intersects.y, intersects.z];
    },
    [camera, deckPlane, intersectionPoint, raycaster, size.width, size.height]
  );

  const { isDragging, onPointerDown, onPointerMove, onPointerUp } = useDragToken({
    tokenId,
    chapter,
    scene,
    getTimerRemainingMs,
    onDragStartWorld: (x, y) => screenToWorldOnDeck(x, y),
    onDragMoveWorld: (x, y) => {
      const world = screenToWorldOnDeck(x, y);
      if (world && meshRef.current) {
        meshRef.current.position.set(world[0], world[1] + 0.3, world[2]);
      }
      return world;
    },
    onDragEndWorld: (x, y) => {
      const world = screenToWorldOnDeck(x, y);
      if (world && meshRef.current) {
        meshRef.current.position.set(world[0], world[1], world[2]);
      }
      return world;
    },
    onDropInSlot,
  });

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const targetScale = isHoveredRef.current || isDragging ? 1.15 : 1;
    hoverScaleRef.current += (targetScale - hoverScaleRef.current) * delta * 10;
    meshRef.current.scale.setScalar(hoverScaleRef.current);
  });

  const handlePointerDown = (event: THREE.Event) => {
    event.stopPropagation();
    const { x, y } = event.pointer as any;
    onPointerDown(x, y, (event as any).pressure);
  };

  const handlePointerMove = (event: THREE.Event) => {
    if (!(event as any).buttons) return;
    const { x, y } = event.pointer as any;
    onPointerMove(x, y);
  };

  const handlePointerUp = (event: THREE.Event) => {
    const { x, y } = event.pointer as any;
    onPointerUp(x, y);
  };

  const handlePointerOver = (event: THREE.Event) => {
    event.stopPropagation();
    isHoveredRef.current = true;
  };

  const handlePointerOut = () => {
    isHoveredRef.current = false;
  };

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.1}>
      <group position={basePosition}>
        <mesh
          ref={meshRef}
          {...rest}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[0.4, 0.4, 0.08, 32]} />
          <meshStandardMaterial
            color={isDragging ? '#ffd27f' : '#eeeeee'}
            emissive={isHoveredRef.current ? '#ffcc66' : '#000000'}
            metalness={0.4}
            roughness={0.3}
          />
        </mesh>
        <Billboard position={[0, 0.6, 0]}>
          <Text fontSize={0.2} color="white" anchorX="center" anchorY="middle">
            {label}
          </Text>
        </Billboard>
      </group>
    </Float>
  );
};
