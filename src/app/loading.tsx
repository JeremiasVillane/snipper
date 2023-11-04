import { Spinner } from "@nextui-org/react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center fixed mt-64">
      <Spinner size="lg" />
    </div>
  );
}
