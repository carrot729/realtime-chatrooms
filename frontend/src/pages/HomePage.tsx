const HomePage = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 px-5 py-12 sm:py-16">
      <div className="max-w-3xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6 mb-10 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />

            <div>
              <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-neutral-500">
                Live · Socket.IO
              </p>

              <h1 className="text-3xl sm:text-4xl font-semibold tracking-wide">
                Channels
              </h1>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="px-5 py-2.5 rounded-lg border border-neutral-700 text-sm font-semibold hover:border-neutral-500 transition cursor-pointer">
              Join by code
            </button>

            <button className="px-5 py-2.5 rounded-lg bg-amber-400 text-neutral-950 text-sm font-semibold hover:bg-amber-300 transition cursor-pointer">
              + Create room
            </button>
          </div>
        </header>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:border-amber-400 hover:-translate-y-0.5 transition">
            <div className="flex justify-between items-start gap-3">
              <h2 className="text-lg font-semibold">Room Name</h2>
              {/* 
              <span className="flex items-end gap-0.5 h-4">
                <span className="w-0.5 rounded-sm h-1 bg-amber-400" />
                <span className="w-0.5 rounded-sm h-1.5 bg-amber-400" />
                <span className="w-0.5 rounded-sm h-2.5 bg-neutral-700" />
                <span className="w-0.5 rounded-sm h-4 bg-neutral-700" />
              </span> */}
            </div>

            <p className="text-xs text-neutral-500 mt-1 mb-4">5 online</p>

            <div className="flex justify-between items-center">
              <span className="font-mono text-xs font-semibold tracking-[0.12em] bg-neutral-800 border border-neutral-700 text-teal-300 px-2.5 py-1.5 rounded-md">
                ABC123
              </span>

              <button className="px-4 py-1.5 rounded-md bg-teal-400 text-neutral-950 text-sm font-semibold hover:bg-teal-300 transition cursor-pointer">
                Join
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
