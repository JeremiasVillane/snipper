import { ShortenForm } from "@/components";

export default function Home() {
  return (
    <>
      <h1 className="text-4xl text-slate-700 my-4 text-center">
        Snipper: Your free URL shortener
      </h1>
      <ShortenForm />
    </>
  );
}
