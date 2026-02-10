import Icon from '@/components/ui/AppIcon';

export default function TrustBadges() {
  const badges = [
    {
      id: 'badge_shipping',
      icon: 'TruckIcon',
      title: 'Free Shipping',
      description: 'On orders over $50',
    },
    {
      id: 'badge_returns',
      icon: 'ArrowPathIcon',
      title: '30-Day Returns',
      description: 'Easy return policy',
    },
    {
      id: 'badge_secure',
      icon: 'LockClosedIcon',
      title: 'Secure Checkout',
      description: '100% protected',
    },
    {
      id: 'badge_support',
      icon: 'ChatBubbleLeftRightIcon',
      title: '24/7 Support',
      description: 'Always here to help',
    },
  ];

  return (
    <section className="py-20 bg-background border-y border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {badges.map((badge, index) => (
            <div
              key={badge.id}
              className={`text-center animate-fade-in-up delay-${index * 100}`}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-secondary rounded-xl">
                <Icon name={badge.icon as any} size={24} className="text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">
                {badge.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}