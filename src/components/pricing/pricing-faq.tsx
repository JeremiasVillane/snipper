import { BlurFade } from "@/components/ui/blur-fade";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Can I upgrade or downgrade my plan?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle.",
  },
  {
    question: "Is there a trial period?",
    answer:
      "Yes, all paid plans come with a 14-day free trial so you can test all features before committing.",
  },
  {
    question: "What happens when I reach my link limit?",
    answer:
      "You'll need to upgrade to a higher plan to create more links, or you can delete existing links to free up space.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a 30-day money-back guarantee if you're not satisfied with our service.",
  },
  {
    question: "Can I pay annually?",
    answer:
      "Yes, annual billing is available with a 20% discount compared to monthly billing.",
  },
  {
    question: "How does the API access work?",
    answer:
      "Business plan customers get API keys to programmatically create and manage short links.",
  },
];

export function PricingFAQ() {
  return (
    <section id="faq" className="py-20 bg-muted/50">
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
          {faqData.map((item, index) => (
            <BlurFade key={index} delay={0.25 + index * 0.05} inView>
              <div key={index} className="space-y-2">
                <h3 className="text-lg font-medium">{item.question}</h3>
                <p className="text-muted-foreground">{item.answer}</p>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
