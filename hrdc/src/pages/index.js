import Image from "next/image";

export default function Home() {
  return (

    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header>
        <div className="grid grid-rows-auto">
          <ul>Home</ul>
          <ul>Contact</ul>
          <ul>Volunteer</ul>
          <ul>Our Staff</ul>

        </div>
      </header>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/logo.png"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            HRDC{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
               bozeman warming center
            </code>

          </li>
          <li>2015 Wheat Dr, Bozeman, MT 59715</li>
          <li>
          (406) 585-4893</li>
        </ol>


      </main>

    </div>
  );
}