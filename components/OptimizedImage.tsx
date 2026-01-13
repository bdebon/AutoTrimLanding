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
  fetchPriority?: "high" | "low" | "auto";
}

export default function OptimizedImage({
  src,
  alt,
  className = "",
  width,
  height,
  priority = false,
  loading,
  quality = 75,
  sizes,
  fill = false,
  style,
  fetchPriority,
}: OptimizedImageProps) {
  // When priority is true, use eager loading and high fetch priority
  const effectiveLoading = priority ? undefined : (loading ?? "lazy");
  const effectiveFetchPriority = priority ? "high" : fetchPriority;
  const [isLoading, setIsLoading] = useState(true);

  const isGif = src.endsWith('.gif');

  if (isGif) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={className}
        loading={effectiveLoading}
        fetchPriority={effectiveFetchPriority}
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
        loading={effectiveLoading}
        fetchPriority={effectiveFetchPriority}
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
      loading={effectiveLoading}
      fetchPriority={effectiveFetchPriority}
      quality={quality}
      sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
      onLoad={() => setIsLoading(false)}
      style={style}
    />
  );
}