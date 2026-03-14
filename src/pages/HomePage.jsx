import { useState } from 'react';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <div className="animate-fade-in">
      <section className="text-center py-12 sm:py-16">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#1A1A1A] leading-tight">
          Curated with Care
        </h1>
        <p className="mt-4 text-[#1A1A1A]/60 max-w-md mx-auto">
          Discover a thoughtful collection of everyday essentials, crafted for quality and designed for life.
        </p>
      </section>

      <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-[#1A1A1A] text-white'
                : 'bg-white text-[#1A1A1A]/70 hover:bg-[#1A1A1A]/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-[#1A1A1A]/40">
          No products found in this category.
        </div>
      )}
    </div>
  );
}
