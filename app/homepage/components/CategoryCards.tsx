import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function CategoryCards() {
  const categories = [
  {
    id: 'cat_fragrances',
    name: 'Fragrances',
    count: '120+ scents',
    icon: 'SparklesIcon',
    href: '/products?category=fragrances',
    bgImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1b610d6db-1770057686503.png",
    bgImageAlt: 'Collection of luxury perfume bottles in various shapes and colors'
  },
  {
    id: 'cat_gadgets',
    name: 'Gadgets',
    count: '85+ devices',
    icon: 'DevicePhoneMobileIcon',
    href: '/products?category=gadgets',
    bgImage: "https://img.rocket.new/generatedImages/rocket_gen_img_133ce5c54-1767581016610.png",
    bgImageAlt: 'Modern tech gadgets including smartphone, earbuds, and smartwatch on desk'
  },
  {
    id: 'cat_clothing',
    name: 'Clothing',
    count: '200+ styles',
    icon: 'ShoppingBagIcon',
    href: '/products?category=clothing',
    bgImage: "https://images.unsplash.com/photo-1729487151777-b4be9098ecbb",
    bgImageAlt: 'Stylish clothing items hanging on rack in modern boutique'
  }];


  return (
    <section className="py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in-up"><h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-foreground">
            Shop by Category
          </h2>
          <p className="text-muted-foreground text-lg">
            Explore our curated collections
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) =>
          <Link
            key={category.id}
            href={category.href}
            className="group relative h-80 overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}>

              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                src={category.bgImage}
                alt={category.bgImageAlt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-8">
                <div className="mb-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <Icon name={category.icon as any} size={24} className="text-white" />
                </div>
                <h3 className="text-3xl font-serif font-bold text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-white/80 text-sm uppercase tracking-wide">
                  {category.count}
                </p>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300 pointer-events-none"></div>
            </Link>
          )}
        </div>
      </div>
    </section>);

}