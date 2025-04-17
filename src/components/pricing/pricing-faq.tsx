export function PricingFAQ() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our pricing and features.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:gap-12 max-w-4xl mx-auto">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">
              Can I upgrade or downgrade my plan?
            </h3>
            <p className="text-muted-foreground">
              Yes, you can upgrade or downgrade your plan at any time. Changes
              take effect at your next billing cycle.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Is there a trial period?</h3>
            <p className="text-muted-foreground">
              Yes, all paid plans come with a 14-day free trial so you can test
              all features before committing.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">
              What happens when I reach my link limit?
            </h3>
            <p className="text-muted-foreground">
              You'll need to upgrade to a higher plan to create more links, or
              you can delete existing links to free up space.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Do you offer refunds?</h3>
            <p className="text-muted-foreground">
              We offer a 30-day money-back guarantee if you're not satisfied
              with our service.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Can I pay annually?</h3>
            <p className="text-muted-foreground">
              Yes, annual billing is available with a 20% discount compared to
              monthly billing.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">
              How does the API access work?
            </h3>
            <p className="text-muted-foreground">
              Business plan customers get API keys to programmatically create
              and manage short links.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
