import type { Metadata, Viewport } from "next";
import Link from "next/link";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1e40af',
};

export const metadata: Metadata = {
  title: "Not Found | Miliare",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-2">404 - Not Found</h1>
      <p className="text-gray-600 mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
        Go Home
      </Link>
    </div>
  );
}

