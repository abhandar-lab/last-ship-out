// src/components/effects/PostFX.tsx
import React from 'react';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

interface PostFXProps {
  pressureVignette?: number; // 0–1
}

export const PostFX: React.FC<PostFXProps> = ({ pressureVignette = 0 }) => {
  const vignetteDarkness = 0.5 + 0.5 * pressureVignette;
  const vignetteOffset = 0.3 + 0.2 * pressureVignette;

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.8}
        luminanceThreshold={1.1}
        luminanceSmoothing={0.2}
      />
      <Vignette
        offset={vignetteOffset}
        darkness={vignetteDarkness}
        eskil={false}
        blendFunction={BlendFunction.NORMAL}
      />
      <ChromaticAberration
        offset={[0.0008, 0.0008]}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
};
