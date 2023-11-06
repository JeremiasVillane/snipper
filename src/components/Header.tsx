export default function Header({ title }: { title: string }) {
  return (
    <header className="bg-gray-50 dark:bg-gray-900 shadow w-screen mb-9">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-50 text-center md:text-left">
          {title}
        </h1>
      </div>
    </header>
  );
}
