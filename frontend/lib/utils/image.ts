const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function getImageUrl(image: string | null | undefined): string {
  if (!image) {
    return "/placeholder-property.jpg";
  }


  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  if (image.startsWith("/")) {
    return image;
  }


  return `${API_URL}/uploads/${image}`;
}
