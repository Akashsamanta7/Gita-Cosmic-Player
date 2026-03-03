import React from 'react';

export const CosmicBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Layered gradients for atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-cosmic-dark via-cosmic-purple/20 to-cosmic-dark opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(45,27,78,0.3)_0%,transparent_70%)]" />
      
      {/* Cosmic Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-screen"
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-stars-in-the-night-sky-11641-large.mp4" type="video/mp4" />
      </video>

      {/* Animated nebula-like overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_30%_40%,#2D1B4E_0%,transparent_50%)] animate-pulse" />
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_70%_60%,#1a0b2e_0%,transparent_50%)] animate-pulse delay-1000" />
      </div>
    </div>
  );
};
