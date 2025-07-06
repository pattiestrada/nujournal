import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to nujournal ✍️</h1>
        <p className="mb-6 text-gray-600">A private journaling platform for your thoughts.</p>
        <Link href="/journal/new">
          <button className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800">
            Write a new entry
          </button>
        </Link>
      </div>
    </main>
  );
}