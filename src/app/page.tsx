import { SnipForm, ThemeToggle } from "@/components";

export default function Home() {
  return (
    <>
      <ThemeToggle />
      <h1 className="text-4xl text-slate-700 my-4 text-center">
        Paste a URL to be snipped
      </h1>
      <SnipForm />
    </>
  );
}
