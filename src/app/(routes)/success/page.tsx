import { CopyUrlForm } from "@/components";

interface SuccessPageProps {
  searchParams: {
    code: string;
  };
}

export default function SuccessPage({ searchParams }: SuccessPageProps) {
  const { code } = searchParams;

  return (
    <>
      <h1 className="text-4xl text-slate-700 my-4 text-center">
        Copy the snipped URL
      </h1>
      <CopyUrlForm code={code} />
    </>
  );
}
