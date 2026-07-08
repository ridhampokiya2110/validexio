import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-[#FDFCF8] font-sans">
      <h2 className="text-4xl font-black text-[#1B1716] mb-4">404 - Not Found</h2>
      <p className="text-lg text-[#1B1716]/60 font-medium max-w-md mx-auto mb-8">
        We couldn't find the page you were looking for. It might have been moved or doesn't exist.
      </p>
      <Link 
        href="/"
        className="px-8 py-3 bg-[#1B1716] text-white rounded-xl font-bold shadow-md hover:bg-black transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
