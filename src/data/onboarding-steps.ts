import { Step } from "@/components/ui/intro-disclosure";

export const onboardingSteps: Step[] = [
  {
    title: "Welcome!",
    short_description: "Your new link management hub.",
    full_description:
      "Welcome aboard! We're excited to have you. Let's take a quick tour to show you how Snipper helps you shorten, manage, and track your links effortlessly.",
    media: {
      type: "image",
      src: "/onboarding/welcome.png",
      alt: "Snipper welcome illustration",
    },
  },
  {
    title: "Create a Short Link",
    short_description: "Turn long URLs into short ones.",
    full_description:
      "Ready to shorten? Just paste your long URL into the main input field. You can also add a custom alias to personalize it. Hit 'Create Link', and your short link is ready!",
    media: {
      type: "image",
      src: [
        "/onboarding/create-link-step-01.png",
        "/onboarding/create-link-step-02.png",
        "/onboarding/create-link-step-03.png",
        "/onboarding/create-link-step-04.png",
        "/onboarding/create-link-step-05.png",
        "/onboarding/create-link-step-06.png",
      ],
      alt: "Creating short link",
    },
  },
  {
    title: "Manage Your Links",
    short_description: "View and control all your links.",
    full_description:
      "All the links you create are neatly organized in your dashboard. From here, you can easily copy, edit details, view stats, or delete them whenever needed.",
    media: {
      type: "image",
      src: [
        "/onboarding/dashboard-overview-01.png",
        "/onboarding/dashboard-overview-02.png",
        "/onboarding/dashboard-overview-03.png",
      ],
      alt: "Overview of the user's link dashboard",
    },
  },
  {
    title: "Track Your Performance",
    short_description: "See how your links are doing.",
    full_description:
      "Curious about clicks? Select any link in your dashboard to dive into detailed analytics. Discover click counts, visitor locations, device types, and more.",
    media: {
      type: "image",
      src: [
        "/onboarding/analytics-preview-01.png",
        "/onboarding/analytics-preview-02.png",
        "/onboarding/analytics-preview-03.png",
        "/onboarding/analytics-preview-04.png",
        "/onboarding/analytics-preview-05.png",
        "/onboarding/analytics-preview-06.png",
      ],
      alt: "Preview of the link analytics chart and data",
    },
  },
  {
    title: "Organize with Tags",
    short_description: "Categorize your links easily.",
    full_description:
      "Keep your links tidy by assigning tags. This makes it simple to categorize them. Later, use the search and filter options to find exactly what you need, fast.",
    media: {
      type: "image",
      src: [
        "/onboarding/tags-feature-01.png",
        "/onboarding/tags-feature-02.png",
        "/onboarding/tags-feature-03.png",
        "/onboarding/tags-feature-04.png",
      ],
      alt: "Illustration showing how to add tags to links",
    },
  },
  {
    title: "Explore Advanced Features",
    short_description: "Unlock more possibilities.",
    full_description:
      "Snipper offers more! Don't forget to explore other powerful features like generating QR Codes for offline sharing or securing links with passwords and expiration dates.",
    media: {
      type: "image",
      src: [
        "/onboarding/advanced-features-01.png",
        "/onboarding/advanced-features-02.png",
        "/onboarding/advanced-features-03.png",
        "/onboarding/advanced-features-04.png",
        "/onboarding/advanced-features-05.png",
        "/onboarding/advanced-features-06.png",
      ],
      alt: "Collage of advanced features",
    },
  },
  {
    title: "You're All Set!",
    short_description: "Start shortening and tracking.",
    full_description:
      "You've got the basics down! You're now ready to make the most of Snipper. If you have questions, check out our help section or reach out. Happy snipping!",
    media: {
      type: "image",
      src: "/onboarding/all-set.png",
      alt: "Final step illustration showing success or completion",
    },
  },
];
