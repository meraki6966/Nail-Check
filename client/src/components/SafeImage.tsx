import { useState, type ImgHTMLAttributes } from "react";

interface SafeImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "onError"> {
  fallbackLabel?: string;
  fallbackFrom?: string; // hex
  fallbackTo?: string;   // hex
}

/**
 * <img> with a built-in gradient SVG fallback when the source fails to load.
 * Use anywhere a remote URL might 404.
 */
export function SafeImage({
  fallbackLabel,
  fallbackFrom = "#FF6B9D",
  fallbackTo = "#9B5DE5",
  alt,
  ...rest
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    const label = (fallbackLabel ?? alt ?? "").replace(/[<>&]/g, "");
    const svg = encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${fallbackFrom}'/><stop offset='1' stop-color='${fallbackTo}'/></linearGradient></defs><rect width='400' height='400' fill='url(#g)'/>${label ? `<text x='200' y='210' text-anchor='middle' font-family='serif' font-size='26' fill='white' opacity='0.95'>${label}</text>` : ""}</svg>`
    );
    return <img alt={alt} {...rest} src={`data:image/svg+xml;utf8,${svg}`} />;
  }

  return <img alt={alt} {...rest} onError={() => setFailed(true)} />;
}
