// Category cover-image gradient fallbacks, keyed by post category.
const DEFAULT_GRADIENT = "from-slate-500 to-gray-500";

const categoryGradients: Record<string, string> = {
  "Web Development": "from-blue-500 to-cyan-500",
  "AI & Machine Learning": "from-purple-500 to-pink-500",
  JavaScript: "from-yellow-500 to-orange-500",
  React: "from-cyan-500 to-blue-500",
  "Next.js": "from-gray-900 to-gray-700",
  TypeScript: "from-indigo-500 to-blue-500",
  "Cloud & DevOps": "from-emerald-500 to-teal-500",
  Tutorials: "from-orange-500 to-red-500",
  Design: "from-pink-500 to-rose-500",
  Performance: "from-green-500 to-emerald-500",
};

/**
 * Get the cover-image gradient fallback class for a category.
 */
export function getCategoryGradient(category?: string): string {
  return (category && categoryGradients[category]) || DEFAULT_GRADIENT;
}
