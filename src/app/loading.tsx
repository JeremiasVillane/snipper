import { Progress } from "@nextui-org/react";

export default function App() {
  return (
    <Progress
      size="sm"
      isIndeterminate
      aria-label="Loading..."
      className="w-screen"
    />
  );
}
