import Icon from '@/components/ui/AppIcon';

export default function Testimonials() {
  const testimonial = {
    quote: "AllInOne has completely changed how I shop online. The quality of products, from fragrances to gadgets, is exceptional. Fast shipping and the best customer service I've experienced!",
    name: 'Sarah Mitchell',
    role: 'Verified Purchase',
    rating: 5,
    image: 'https://i.pravatar.cc/300?u=sarah',
  };

  return (
    <section className="py-32 bg-primary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* Quote */}
          <div className="lg:w-1/2 animate-fade-in-up">
            <Icon name="ChatBubbleLeftIcon" size={48} className="text-primary-foreground/20 mb-8" />
            <blockquote className="text-3xl md:text-4xl font-serif italic leading-relaxed text-primary-foreground mb-8">
              "{testimonial?.quote}"
            </blockquote>
            <div className="flex items-center gap-2 mb-4">
              {[...Array(testimonial?.rating)]?.map((_, i) => (
                <Icon key={i} name="StarIcon" size={20} className="text-primary-foreground fill-current" />
              ))}
            </div>
          </div>

          {/* Customer Info */}
          <div className="lg:w-1/2 flex flex-col items-start gap-8 animate-fade-in-up delay-200">
            <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-xl">
              <img
                src={testimonial?.image}
                alt={`Portrait of ${testimonial?.name}`}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div>
              <p className="text-2xl font-bold uppercase tracking-wide text-primary-foreground mb-2">
                {testimonial?.name}
              </p>
              <p className="text-sm uppercase tracking-[0.3em] text-primary-foreground/60">
                {testimonial?.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}