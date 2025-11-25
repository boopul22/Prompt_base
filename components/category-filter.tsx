"use client"

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 md:gap-3">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`
            px-3 md:px-4 py-2 font-bold brutalist-border brutalist-shadow-sm text-sm md:text-base
            transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none
            ${
              selectedCategory === category
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground hover:bg-muted"
            }
          `}
        >
          {category.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
