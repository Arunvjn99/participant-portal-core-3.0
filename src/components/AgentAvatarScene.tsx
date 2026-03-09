/**
 * Agent Avatar Scene — 3D advisor environment for Agent Mode Lab.
 * Renders GLB avatar with FBX animations (Talking, Pointing).
 * Used only in the /agent-lab sandbox; does not touch enrollment.
 */

import { Suspense, Component, useRef, useEffect, useMemo, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import {
  useGLTF,
  useFBX,
  useAnimations,
  OrbitControls,
  Environment,
} from "@react-three/drei";
import type { Object3D } from "three";
import type { GLTF } from "three-stdlib";

/* ─── Placeholder when GLB is missing or fails ─── */

function AvatarPlaceholder() {
  return (
    <mesh position={[0, -0.5, 0]}>
      <boxGeometry args={[1.2, 2, 0.6]} />
      <meshStandardMaterial color="#6366f1" metalness={0.2} roughness={0.8} />
    </mesh>
  );
}

type AnimationState = "talking" | "pointing";

function AvatarModel({ animationState }: { animationState: AnimationState }) {
  const sceneRef = useRef<Object3D>(null);
  const { scene } = useGLTF("/models/advisor.glb") as GLTF;
  const talkingFbx = useFBX("/models/animations/talking.fbx");
  const pointingFbx = useFBX("/models/animations/pointing.fbx");

  if (talkingFbx.animations?.length) talkingFbx.animations[0].name = "Talking";
  if (pointingFbx.animations?.length) pointingFbx.animations[0].name = "Pointing";

  const clips = useMemo(
    () => [
      ...(talkingFbx.animations ?? []),
      ...(pointingFbx.animations ?? []),
    ],
    [talkingFbx.animations, pointingFbx.animations]
  );

  const { actions } = useAnimations(clips, sceneRef);

  useEffect(() => {
    actions.Talking?.reset().fadeIn(0.2).play();
  }, [actions]);

  useEffect(() => {
    if (animationState === "pointing") {
      actions.Talking?.fadeOut(0.2);
      actions.Pointing?.reset().fadeIn(0.2).play();
    } else {
      actions.Pointing?.fadeOut(0.2);
      actions.Talking?.reset().fadeIn(0.2).play();
    }
  }, [animationState, actions]);

  return (
    <primitive
      ref={sceneRef}
      object={scene}
      rotation={[Math.PI, 0, 0]}
      scale={1.3}
      position={[0, -0.9, 0]}
    />
  );
}

class SceneErrorBoundary extends Component<
  { fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError = () => ({ hasError: true });
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

/* ─── Floor plane ─── */

function FloorPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="#e5e7eb" metalness={0} roughness={1} />
    </mesh>
  );
}

/* ─── Scene contents (lights, avatar, environment) ─── */

function SceneContent({
  animationState,
}: {
  animationState: AnimationState;
}) {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 5, 2]} intensity={1} castShadow />
      <Environment preset="studio" />
      <FloorPlane />
      <SceneErrorBoundary fallback={<AvatarPlaceholder />}>
        <Suspense fallback={<AvatarPlaceholder />}>
          <AvatarModel animationState={animationState} />
        </Suspense>
      </SceneErrorBoundary>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
      />
    </>
  );
}

/**
 * Renders the full 3D advisor scene (Canvas + lights + environment + avatar).
 * animationState: "talking" (default) | "pointing" (e.g. when user clicks Next Step).
 */
export function AgentAvatarScene({
  animationState = "talking",
}: {
  animationState?: AnimationState;
}) {
  return (
    <Canvas
      camera={{ position: [0, 1.6, 3], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      <SceneContent animationState={animationState} />
    </Canvas>
  );
}

export default AgentAvatarScene;
