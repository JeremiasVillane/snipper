import { Plan } from "@prisma/client";

interface Validation {
  condition: boolean;
  planAllows: boolean;
  errorMessage: string;
}

function validateFeatures(validations: Validation[]): void {
  validations.forEach(({ condition, planAllows, errorMessage }) => {
    if (condition && !planAllows) {
      throw new Error(errorMessage);
    }
  });
}

export function validateShortLinkFeatures(
  formData: any,
  activeUserPlans: Plan[],
  totalUserLinks?: number,
): void {
  const validations: Validation[] = [
    {
      condition: Boolean(totalUserLinks),
      planAllows: activeUserPlans.some(
        (p) =>
          (!!totalUserLinks && !!p.maxLinks && p.maxLinks > totalUserLinks) ||
          p.maxLinks === null,
      ),
      errorMessage: `Your current plan does not allow you to create more than ${totalUserLinks} short links. Upgrade your plan to create unlimited short links.`,
    },
    {
      condition: Boolean(formData?.shortCode),
      planAllows: activeUserPlans.some((p) => p.custom),
      errorMessage:
        "Your current plan does not allow you to create custom short links. Upgrade your plan to create personalized, branded links.",
    },
    {
      condition: Boolean(formData?.password?.length),
      planAllows: activeUserPlans.some((p) => p.password),
      errorMessage:
        "Your current plan does not allow you to password protect links. Upgrade your plan to create private links.",
    },
    {
      condition: Boolean(formData?.expiresAt),
      planAllows: activeUserPlans.some((p) => p.expiration),
      errorMessage:
        "Your current plan does not allow you to set links with an expiration date. Upgrade your plan to schedule links expiration.",
    },
    {
      condition: Boolean(
        formData?.utmSets?.length && formData.utmSets.length > 1,
      ),
      planAllows: !activeUserPlans.some((p) => p.maxLinks === 10),
      errorMessage:
        "Your current plan only allows you to set up one campaign per link. Upgrade your plan to set unlimited campaigns.",
    },
    {
      condition: Boolean(
        formData?.utmSets?.length && formData.utmSets.length > 3,
      ),
      planAllows: !activeUserPlans.some((p) => p.maxLinks === 500),
      errorMessage:
        "Your current plan only allows you to set up three campaigns per link. Upgrade your plan to set unlimited campaigns.",
    },
    {
      condition: Boolean(
        formData?.isCustomOgEnabled ||
          formData?.customOgImageUrl ||
          formData?.customOgTitle ||
          formData?.customOgDescription,
      ),
      planAllows: activeUserPlans.some((p) => p.thumbnail),
      errorMessage:
        "Your current plan does not allow you to set custom preview images. Upgrade your plan to create personalized, branded links.",
    },
  ];

  validateFeatures(validations);
}
