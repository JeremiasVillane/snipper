import { customDomainsRepository } from "@/lib/db/repositories";

import { authActionClient } from "../safe-action";

export const getUserCustomDomains = authActionClient({})
  .metadata({
    name: "get-user-custom-domains",
    limiter: {
      refillRate: 10,
      interval: 10,
      capacity: 100,
      requested: 1,
    },
  })
  .action(async ({ ctx }) => {
    const { userId } = ctx;
    return await customDomainsRepository.findByUserId(userId);
  });
