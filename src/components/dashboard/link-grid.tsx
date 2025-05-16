import { ShortLinkFromRepository } from "@/lib/types";

import { LinkCard } from "./link-card";

interface LinkGridProps {
  links: ShortLinkFromRepository[];
  onEdit: (link: ShortLinkFromRepository) => void;
  onDelete: (link: ShortLinkFromRepository) => void;
  onQrCode: (link: ShortLinkFromRepository) => void;
}

export function LinkGrid({
  links,
  onEdit,
  onDelete,
  onQrCode,
  ...props
}: LinkGridProps & Omit<React.ComponentPropsWithoutRef<"div">, "onCopy">) {
  return (
    <section {...props}>
      {links.map((link) => (
        <LinkCard key={link.id} {...{ link, onEdit, onDelete, onQrCode }} />
      ))}
    </section>
  );
}
