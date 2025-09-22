"use client";
import { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
  src: string;
  alt: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
}

export default function VideoPlayer({
  src,
  alt,
  className = "",
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const mp4Src = src.replace(/\.gif$/, '.mp4');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible && videoRef.current && autoPlay) {
      videoRef.current.play().catch(err =>
        console.log('Autoplay failed:', err)
      );
    }
  }, [isVisible, autoPlay]);

  return (
    <video
      ref={videoRef}
      className={className}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      autoPlay={false}
      preload={isVisible ? "auto" : "none"}
      aria-label={alt}
      title={alt}
    >
      <source src={mp4Src} type="video/mp4" />
      <track kind="captions" />
      Your browser does not support the video tag.
    </video>
  );
}