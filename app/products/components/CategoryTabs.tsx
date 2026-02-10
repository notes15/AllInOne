"use client";
import { useState, useEffect } from 'react';
import { rtdb } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

interface Category {
  id: string;
  name: string;
}

export default function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Clear old localStorage categories only in browser
    if (typeof window !== 'undefined') {
      localStorage.removeItem('categories');
    }
    
    // Real-time listener for categories from Firebase
    const categoriesRef = ref(rtdb, 'categories');
    const unsubscribe = onValue(categoriesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const categoriesArray = Object.entries(data).map(([id, val]: [string, any]) => ({
          id,
          name: typeof val === 'string' ? val : val.name
        })) as Category[];
        console.log('Loaded categories:', categoriesArray); setCategories(categoriesArray);
      } else {
        setCategories([]);
      }
    }, (error) => {
      console.error('Error loading categories:', error); console.log('Categories snapshot exists:', snapshot.exists());
      setCategories([]);
    });

    return () => unsubscribe();
  }, []);

  // Don't render until client-side to avoid localStorage errors
  if (!isClient) {
    return (
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <button className="px-6 py-2 text-sm font-medium uppercase tracking-wide rounded-lg bg-primary text-primary-foreground shadow-md">
          All Products
        </button>
      </div>
    );
  }

  const allCategories = [
    { id: 'all', name: 'All Products' },
    ...categories,
  ];

  return (
    <div className="flex flex-wrap items-center gap-4 mb-8">
      {allCategories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id === 'all' ? 'all' : category.name.toLowerCase())}
          className={`px-6 py-2 text-sm font-medium uppercase tracking-wide rounded-lg transition-all duration-300 ${
            activeCategory === (category.id === 'all' ? 'all' : category.name.toLowerCase())
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
