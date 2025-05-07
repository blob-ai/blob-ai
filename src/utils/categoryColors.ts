
type CategoryColorMap = {
  [key: string]: {
    bg: string;
    text: string;
    border: string;
  };
};

export const categoryColors: CategoryColorMap = {
  "Best practices": {
    bg: "bg-orange-100",
    text: "text-orange-800",
    border: "border-orange-200"
  },
  "Explanation / Analysis": {
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-200"
  },
  "List of advice/rules/etc": {
    bg: "bg-purple-100",
    text: "text-purple-800",
    border: "border-purple-200"
  },
  "Useful resources": {
    bg: "bg-sky-100",
    text: "text-sky-800",
    border: "border-sky-200"
  },
  "Personal reflection": {
    bg: "bg-pink-100",
    text: "text-pink-800",
    border: "border-pink-200"
  },
  "Thought-provoking": {
    bg: "bg-indigo-100",
    text: "text-indigo-800",
    border: "border-indigo-200"
  },
  // Fallback for any uncategorized content
  "default": {
    bg: "bg-gray-100",
    text: "text-gray-800",
    border: "border-gray-200"
  }
};

export const getCategoryColors = (category: string) => {
  return categoryColors[category] || categoryColors.default;
};
