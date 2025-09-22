"use client";
import Image from "next/image";
import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  loading?: "lazy" | "eager";
  quality?: number;
  sizes?: string;
  fill?: boolean;
  style?: React.CSSProperties;
}

export default function OptimizedImage({
  src,
  alt,
  className = "",
  width,
  height,
  priority = false,
  loading = "lazy",
  quality = 75,
  sizes,
  fill = false,
  style,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  const isGif = src.endsWith('.gif');

  if (isGif) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading={priority ? "eager" : loading}
        style={style}
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={`${className} ${isLoading ? 'blur-sm' : 'blur-0'} transition-all duration-300`}
        priority={priority}
        quality={quality}
        sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        onLoad={() => setIsLoading(false)}
        style={style}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width || 800}
      height={height || 600}
      className={`${className} ${isLoading ? 'blur-sm' : 'blur-0'} transition-all duration-300`}
      priority={priority}
      quality={quality}
      sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
      onLoad={() => setIsLoading(false)}
      style={style}
    />
  );
}