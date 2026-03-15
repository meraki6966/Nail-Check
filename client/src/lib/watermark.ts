/**
 * Add "created by nail check" watermark to image
 * @param imageUrl - URL or base64 of the image to watermark
 * @param options - Watermark customization options
 * @returns Promise with watermarked image as base64 data URL
 */
export async function addNailCheckWatermark(
  imageUrl: string,
  options: {
    text?: string;
    fontSize?: number;
    position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
    opacity?: number;
    color?: string;
  } = {}
): Promise<string> {
  const {
    text = 'created by nail check',
    fontSize = 16,
    position = 'bottom-right',
    opacity = 0.7,
    color = '#ffffff'
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Configure watermark text
      ctx.font = `${fontSize}px Arial, sans-serif`;
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;
      ctx.textBaseline = 'bottom';

      // Measure text width
      const textWidth = ctx.measureText(text).width;
      const padding = 10;

      // Calculate position
      let x: number;
      const y = canvas.height - padding;

      switch (position) {
        case 'bottom-left':
          x = padding;
          ctx.textAlign = 'left';
          break;
        case 'bottom-center':
          x = canvas.width / 2;
          ctx.textAlign = 'center';
          break;
        case 'bottom-right':
        default:
          x = canvas.width - padding;
          ctx.textAlign = 'right';
          break;
      }

      // Add semi-transparent background for readability
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = '#000000';
      const bgPadding = 5;
      const textHeight = fontSize;
      
      let bgX: number;
      let bgWidth = textWidth + (bgPadding * 2);
      
      switch (position) {
        case 'bottom-left':
          bgX = padding - bgPadding;
          break;
        case 'bottom-center':
          bgX = (canvas.width / 2) - (bgWidth / 2);
          break;
        case 'bottom-right':
        default:
          bgX = canvas.width - padding - textWidth - bgPadding;
          break;
      }
      
      ctx.fillRect(
        bgX,
        y - textHeight - bgPadding,
        bgWidth,
        textHeight + (bgPadding * 2)
      );

      // Draw watermark text
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);

      // Convert to base64
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageUrl;
  });
}

/**
 * Download image with watermark
 * @param imageUrl - URL or base64 of the image
 * @param filename - Name for the downloaded file
 */
export async function downloadWithWatermark(
  imageUrl: string,
  filename: string = 'nail-check-design.png'
): Promise<void> {
  try {
    // Add watermark
    const watermarkedImage = await addNailCheckWatermark(imageUrl);

    // Create download link
    const link = document.createElement('a');
    link.href = watermarkedImage;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error adding watermark:', error);
    throw error;
  }
}
