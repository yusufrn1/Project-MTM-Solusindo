"use client";

import { useEffect } from "react";

export default function KatalogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Katalog error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="mb-2 text-xl font-bold">
        Terjadi Kesalahan
      </h2>

      <p className="mb-4 text-gray-600">
        Maaf, katalog belum dapat ditampilkan. Silakan coba lagi.
      </p>

      <button
        onClick={() => reset()}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Coba Lagi
      </button>
    </div>
  );
}