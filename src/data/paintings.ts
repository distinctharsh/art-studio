import { Painting } from "@/components/PaintingCard";

// Fallback static data for development or when API is unavailable
export const fallbackPaintings: Painting[] = [
  {
    id: "quiet-moments",
    title: "Quiet Moments",
    medium: "Acrylic and mixed media on raw canvas",
    dimensions: "36 x 48 inches",
    year: "2025",
    status: "Available",
    price: "INR 52,000",
    image: "/images/painting_1.png",
  },
  {
    id: "memory-of-water",
    title: "Memory of Water",
    medium: "Oil, ink, and gold leaf on canvas",
    dimensions: "30 x 40 inches",
    year: "2026",
    status: "Available",
    price: "INR 48,000",
    image: "/images/painting_2.png",
  },
  {
    id: "fields-of-gold",
    title: "Fields of Gold",
    medium: "Acrylic and charcoal on canvas",
    dimensions: "40 x 40 inches",
    year: "2025",
    status: "Sold",
    price: "INR 55,000",
    image: "/images/painting_3.png",
  },
  {
    id: "silent-reverie",
    title: "Silent Reverie",
    medium: "Mixed media and pencil on paper",
    dimensions: "24 x 32 inches",
    year: "2026",
    status: "Available",
    price: "INR 35,000",
    image: "/images/painting_4.png",
  },
  {
    id: "echoes-of-silence",
    title: "Echoes of Silence",
    medium: "Acrylic, sand, and copper leaf on canvas",
    dimensions: "48 x 60 inches",
    year: "2026",
    status: "Available",
    price: "INR 72,000",
    image: "/images/painting_5.png",
  },
];

// Fetch paintings from the PHP API
export async function fetchPaintings(): Promise<Painting[]> {
  try {
    const response = await fetch('/api/paintings.php');
    if (!response.ok) {
      console.warn('API fetch failed, using fallback data');
      return fallbackPaintings;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('API error, using fallback data:', error);
    return fallbackPaintings;
  }
}

// Get a single painting by ID
export async function getPaintingById(id: string): Promise<Painting | undefined> {
  const paintings = await fetchPaintings();
  return paintings.find((p) => p.id === id);
}

// Legacy export for backward compatibility
export const paintings = fallbackPaintings;
