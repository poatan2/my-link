export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-8">
      <main className="flex flex-col items-center justify-center text-center gap-6">
        <h1 className="text-5xl font-bold tracking-tight text-black dark:text-zinc-50">
          홍태경
        </h1>
        <p className="max-w-md text-xl leading-relaxed text-zinc-600 dark:text-zinc-400">
          안녕하세요! 정보보안을 배우고 있는 대학생입니다.
        </p>
        <div className="mt-4 w-12 h-1 bg-zinc-900 dark:bg-zinc-100 rounded-full" />
      </main>
    </div>
  );
}
