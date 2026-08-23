const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function getImageUrl(image: string | null | undefined): string {
  if (!image) {
    return "/placeholder-property.jpg";
  }

  // Already a complete URL
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  // Already a frontend public path
  if (image.startsWith("/")) {
    return image;
  }

  // Backend returns only filename, e.g. "image1.jpg"
  return `${API_URL}/uploads/${image}`;
}