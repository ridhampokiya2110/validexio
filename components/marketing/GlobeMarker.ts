// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getMarkerHTML(d: any): string {
  return `
    <div class="relative group cursor-pointer -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
      
      <!-- Expanding Ripple Rings for Premium Visual -->
      <div class="absolute inset-0 rounded-full border border-red-600/40 scale-[1.6] animate-[ping_3s_infinite_ease-out]"></div>
      <div class="absolute inset-0 rounded-full border border-red-500/20 scale-[2.2] animate-[ping_3s_infinite_ease-out_1s]"></div>
      <div class="absolute inset-0 rounded-full bg-red-600/10 scale-[1.3]"></div>
      
      <!-- Sticker Profile Base -->
      <div class="relative w-12 h-12 md:w-16 md:h-16 bg-white rounded-full p-[3px] shadow-[0_8px_20px_rgba(0,0,0,0.15)] ring-1 ring-black/5 z-20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_12px_30px_rgba(0,0,0,0.2)]">
        <div class="w-full h-full rounded-full overflow-hidden border border-gray-100 bg-[#FDFCF8] flex items-center justify-center">
          <img src="${d.avatar}" class="w-full h-full object-cover object-center" alt="Competitor" />
        </div>
      </div>

      <!-- Sleek Tooltip -->
      <div class="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-30 w-48 translate-y-2 group-hover:translate-y-0">
        <div class="bg-white/95 backdrop-blur-xl shadow-[0_12px_40px_rgb(0,0,0,0.12)] border border-gray-100/50 rounded-2xl p-3 flex flex-col items-center text-center">
          <span class="text-sm font-bold text-gray-900 leading-tight">${d.name}</span>
          <span class="text-[11px] font-medium text-gray-500 mb-2 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            ${d.location}
          </span>
          <div class="w-full h-[1px] bg-gray-100 mb-2"></div>
          <span class="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m13 2-2 2.5h3L11 22l2-2.5h-3L13 2z"/></svg>
            ${d.status}
          </span>
        </div>
      </div>
    </div>
  `;
}
