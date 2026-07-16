export default function CasesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Cases</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
            <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center text-gray-400">
              Case Image {i}
            </div>
            <div className="p-4">
              <h3 className="font-semibold">Case Study {i}</h3>
              <p className="text-sm text-gray-500 mt-1">Project description</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
