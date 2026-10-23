export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
        <p role="status" className="text-gray-600">
          Memuat katalog produk...
        </p>
      </div>
    </div>
  );
}