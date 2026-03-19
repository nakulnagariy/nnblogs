// Category-based color themes for the blog
export const categoryThemes = {
  "Web Development": {
    light: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      accent: "bg-blue-500",
      hover: "hover:bg-blue-100",
    },
    dark: {
      bg: "dark:bg-blue-950/20",
      border: "dark:border-blue-900",
      text: "dark:text-blue-300",
      accent: "dark:bg-blue-600",
      hover: "dark:hover:bg-blue-900/30",
    },
    gradient: "from-blue-500 to-cyan-500",
  },
  "AI & Machine Learning": {
    light: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-700",
      accent: "bg-purple-500",
      hover: "hover:bg-purple-100",
    },
    dark: {
      bg: "dark:bg-purple-950/20",
      border: "dark:border-purple-900",
      text: "dark:text-purple-300",
      accent: "dark:bg-purple-600",
      hover: "dark:hover:bg-purple-900/30",
    },
    gradient: "from-purple-500 to-pink-500",
  },
  JavaScript: {
    light: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-700",
      accent: "bg-yellow-500",
      hover: "hover:bg-yellow-100",
    },
    dark: {
      bg: "dark:bg-yellow-950/20",
      border: "dark:border-yellow-900",
      text: "dark:text-yellow-300",
      accent: "dark:bg-yellow-600",
      hover: "dark:hover:bg-yellow-900/30",
    },
    gradient: "from-yellow-500 to-orange-500",
  },
  React: {
    light: {
      bg: "bg-cyan-50",
      border: "border-cyan-200",
      text: "text-cyan-700",
      accent: "bg-cyan-500",
      hover: "hover:bg-cyan-100",
    },
    dark: {
      bg: "dark:bg-cyan-950/20",
      border: "dark:border-cyan-900",
      text: "dark:text-cyan-300",
      accent: "dark:bg-cyan-600",
      hover: "dark:hover:bg-cyan-900/30",
    },
    gradient: "from-cyan-500 to-blue-500",
  },
  "Next.js": {
    light: {
      bg: "bg-gray-50",
      border: "border-gray-200",
      text: "text-gray-700",
      accent: "bg-gray-900",
      hover: "hover:bg-gray-100",
    },
    dark: {
      bg: "dark:bg-gray-950/20",
      border: "dark:border-gray-800",
      text: "dark:text-gray-300",
      accent: "dark:bg-gray-100",
      hover: "dark:hover:bg-gray-900/30",
    },
    gradient: "from-gray-900 to-gray-700",
  },
  TypeScript: {
    light: {
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      text: "text-indigo-700",
      accent: "bg-indigo-500",
      hover: "hover:bg-indigo-100",
    },
    dark: {
      bg: "dark:bg-indigo-950/20",
      border: "dark:border-indigo-900",
      text: "dark:text-indigo-300",
      accent: "dark:bg-indigo-600",
      hover: "dark:hover:bg-indigo-900/30",
    },
    gradient: "from-indigo-500 to-blue-500",
  },
  "Cloud & DevOps": {
    light: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
      accent: "bg-emerald-500",
      hover: "hover:bg-emerald-100",
    },
    dark: {
      bg: "dark:bg-emerald-950/20",
      border: "dark:border-emerald-900",
      text: "dark:text-emerald-300",
      accent: "dark:bg-emerald-600",
      hover: "dark:hover:bg-emerald-900/30",
    },
    gradient: "from-emerald-500 to-teal-500",
  },
  Tutorials: {
    light: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-700",
      accent: "bg-orange-500",
      hover: "hover:bg-orange-100",
    },
    dark: {
      bg: "dark:bg-orange-950/20",
      border: "dark:border-orange-900",
      text: "dark:text-orange-300",
      accent: "dark:bg-orange-600",
      hover: "dark:hover:bg-orange-900/30",
    },
    gradient: "from-orange-500 to-red-500",
  },
  Design: {
    light: {
      bg: "bg-pink-50",
      border: "border-pink-200",
      text: "text-pink-700",
      accent: "bg-pink-500",
      hover: "hover:bg-pink-100",
    },
    dark: {
      bg: "dark:bg-pink-950/20",
      border: "dark:border-pink-900",
      text: "dark:text-pink-300",
      accent: "dark:bg-pink-600",
      hover: "dark:hover:bg-pink-900/30",
    },
    gradient: "from-pink-500 to-rose-500",
  },
  Performance: {
    light: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      accent: "bg-green-500",
      hover: "hover:bg-green-100",
    },
    dark: {
      bg: "dark:bg-green-950/20",
      border: "dark:border-green-900",
      text: "dark:text-green-300",
      accent: "dark:bg-green-600",
      hover: "dark:hover:bg-green-900/30",
    },
    gradient: "from-green-500 to-emerald-500",
  },
  default: {
    light: {
      bg: "bg-slate-50",
      border: "border-slate-200",
      text: "text-slate-700",
      accent: "bg-slate-500",
      hover: "hover:bg-slate-100",
    },
    dark: {
      bg: "dark:bg-slate-950/20",
      border: "dark:border-slate-800",
      text: "dark:text-slate-300",
      accent: "dark:bg-slate-600",
      hover: "dark:hover:bg-slate-900/30",
    },
    gradient: "from-slate-500 to-gray-500",
  },
} as const;

export type CategoryName = keyof typeof categoryThemes;

/**
 * Get theme classes for a category
 */
export function getCategoryTheme(category?: string) {
  const categoryKey = (category as CategoryName) || "default";
  const theme = categoryThemes[categoryKey] || categoryThemes.default;

  return {
    ...theme,
    // Combined classes for convenience
    card: `${theme.light.bg} ${theme.dark.bg} ${theme.light.border} ${theme.dark.border}`,
    text: `${theme.light.text} ${theme.dark.text}`,
    accent: `${theme.light.accent} ${theme.dark.accent}`,
    hover: `${theme.light.hover} ${theme.dark.hover}`,
  };
}

/**
 * Get gradient class for a category
 */
export function getCategoryGradient(category?: string) {
  const categoryKey = (category as CategoryName) || "default";
  return (
    categoryThemes[categoryKey]?.gradient || categoryThemes.default.gradient
  );
}

/**
 * Get all available categories
 */
export function getAvailableCategories(): string[] {
  return Object.keys(categoryThemes).filter((key) => key !== "default");
}
