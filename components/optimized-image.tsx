"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useMemo, useState } from "react";

export interface OptimizedImageSource {
  url: string;
  width: number;
  format?: "webp" | "avif" | "jpeg";
}

interface OptimizedImageProps extends Omit<ImageProps, "src"> {
  src: string;
  variants?: OptimizedImageSource[];
  fallbackSrc?: string;
}

function buildSrcSet(variants: OptimizedImageSource[] = []) {
  return [...variants]
    .sort((a, b) => a.width - b.width)
    .map((variant) => `${variant.url} ${variant.width}w`)
    .join(", ");
}

export function OptimizedImage({
  src,
  alt,
  variants = [],
  fallbackSrc,
  sizes = "(max-width: 768px) 100vw, 50vw",
  loading = "lazy",
  ...props
}: OptimizedImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const srcSet = useMemo(() => buildSrcSet(variants), [variants]);

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      sizes={sizes}
      loading={loading}
      onError={() => {
        if (fallbackSrc && currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
      {...(srcSet ? { srcSet } : {})}
    />
  );
}
