import { useState } from "react";
import styles from "./Badge.module.css";

interface BadgeProps {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const FALLBACK_SHIELD = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120"><path d="M50 5 L95 25 L95 65 Q95 95 50 115 Q5 95 5 65 L5 25 Z" fill="%23ddd" stroke="%23999" stroke-width="2"/><text x="50" y="70" text-anchor="middle" font-size="30" fill="%23999">?</text></svg>'
)}`;

export function Badge({ src, alt, size = "md", className = "" }: BadgeProps) {
  const [error, setError] = useState(false);

  return (
    <img
      src={error ? FALLBACK_SHIELD : src}
      alt={alt}
      loading="lazy"
      className={`${styles.badge} ${styles[size]} ${className}`}
      onError={() => setError(true)}
    />
  );
}
