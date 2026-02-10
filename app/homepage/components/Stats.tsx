export default function Stats() {
  const stats = [
    {
      id: 'stat_customers',
      number: '5,000+',
      label: 'Happy Customers',
    },
    {
      id: 'stat_countries',
      number: '50+',
      label: 'Countries Shipped',
    },
    {
      id: 'stat_rating',
      number: '4.8★',
      label: 'Average Rating',
    },
    {
      id: 'stat_products',
      number: '1,000+',
      label: 'Products Available',
    },
  ];

  return (
    <section className="py-32 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-border pt-12">
          {stats?.map((stat, index) => (
            <div
              key={stat?.id}
              className={`border-l border-border pl-8 animate-fade-in-up delay-${index * 100}`}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 leading-relaxed">
                {stat?.label}
              </p>
              <p className="text-5xl md:text-6xl font-bold tracking-tighter text-foreground">
                {stat?.number}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}