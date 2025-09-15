export default function Upload() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-6">Upload Photo</h1>
      <input type="file" accept="image/*" className="border border-gray-400 p-2 rounded mb-6" disabled />
      <button disabled className="bg-gray-400 cursor-not-allowed text-white px-6 py-3 rounded">Next (coming soon)</button>
    </main>
  );
}
