export default function Loading() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Skeleton */}
      <aside className="hidden md:flex flex-col w-[280px] h-full py-8 px-6 space-y-8 border-r border-slate-100">
        <div className="space-y-2">
          <div className="h-8 w-32 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-12 w-full bg-slate-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <main className="flex-1 p-6 md:p-8 space-y-8">
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 h-64 bg-white rounded-[32px] animate-pulse" />
          <div className="h-64 bg-white rounded-[32px] animate-pulse" />
        </div>

        {/* List Items */}
        <div className="space-y-4">
          <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse" />
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 w-full bg-white rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </main>
    </div>
  );
}
