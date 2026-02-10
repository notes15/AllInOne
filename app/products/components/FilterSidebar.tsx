"use client";

import { useState } from 'react';


interface FilterSidebarProps {
  onFilterChange: (filters: any) => void;
}

export default function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStock, setInStock] = useState(false);

  const brands = [
    { id: 'brand_luxury', name: 'Luxury Scents' },
    { id: 'brand_tech', name: 'TechPro' },
    { id: 'brand_fashion', name: 'Urban Style' },
    { id: 'brand_premium', name: 'Premium Goods' },
  ];

  const handleBrandToggle = (brandName: string) => {
    const newBrands = selectedBrands.includes(brandName)
      ? selectedBrands.filter(b => b !== brandName)
      : [...selectedBrands, brandName];
    
    setSelectedBrands(newBrands);
    onFilterChange({ brands: newBrands, priceRange, inStock });
  };

  const handlePriceChange = (value: number, index: number) => {
    const newRange: [number, number] = [...priceRange] as [number, number];
    newRange[index] = value;
    setPriceRange(newRange);
    onFilterChange({ brands: selectedBrands, priceRange: newRange, inStock });
  };

  const handleInStockToggle = () => {
    const newInStock = !inStock;
    setInStock(newInStock);
    onFilterChange({ brands: selectedBrands, priceRange, inStock: newInStock });
  };

  return (
    <aside className="w-full lg:w-64 space-y-8">
      {/* Price Range */}
      <div className="bg-card p-6 rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Price Range</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
          <input
            type="range"
            min="0"
            max="500"
            value={priceRange[1]}
            onChange={(e) => handlePriceChange(Number(e.target.value), 1)}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
      </div>

      {/* Brands */}
      <div className="bg-card p-6 rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Brands</h3>
        <div className="space-y-3">
          {brands.map((brand) => (
            <label key={brand.id} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand.name)}
                onChange={() => handleBrandToggle(brand.name)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary cursor-pointer"
              />
              <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                {brand.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* In Stock */}
      <div className="bg-card p-6 rounded-xl border border-border">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={inStock}
            onChange={handleInStockToggle}
            className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary cursor-pointer"
          />
          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
            In Stock Only
          </span>
        </label>
      </div>
    </aside>
  );
}