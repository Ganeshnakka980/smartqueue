export const skeletons = {
  /**
   * Card skeleton for stats or simple widgets.
   */
  card() {
    return `
      <div class="glass-card p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/30 animate-pulse">
        <div class="flex items-center justify-between mb-4">
          <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
          <div class="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
        </div>
        <div class="h-8 bg-slate-300 dark:bg-slate-600 rounded w-1/2 mb-2"></div>
        <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
      </div>
    `
  },

  /**
   * Grid of card skeletons.
   */
  cardGrid(count = 3) {
    return `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        ${Array(count).fill(this.card()).join('')}
      </div>
    `
  },

  /**
   * List skeleton for notifications, history, or recent items.
   */
  list(count = 4) {
    const item = `
      <div class="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-850 animate-pulse">
        <div class="flex items-center gap-3 flex-grow">
          <div class="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex-shrink-0"></div>
          <div class="flex-grow flex flex-col gap-2">
            <div class="h-4 bg-slate-300 dark:bg-slate-650 rounded w-1/3"></div>
            <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
          </div>
        </div>
        <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
      </div>
    `
    return `
      <div class="flex flex-col">
        ${Array(count).fill(item).join('')}
      </div>
    `
  },

  /**
   * Table skeleton for user management, service management, or reports.
   */
  table(rows = 5, cols = 4) {
    const ths = Array(cols)
      .fill('<div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>')
      .map(h => `<th class="px-6 py-4">${h}</th>`)
      .join('')

    const tr = `
      <tr class="border-b border-slate-100 dark:border-slate-800/40 animate-pulse">
        ${Array(cols)
          .fill('<div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>')
          .map(td => `<td class="px-6 py-4">${td}</td>`)
          .join('')}
      </tr>
    `

    return `
      <div class="overflow-x-auto rounded-xl border border-slate-200/50 dark:border-slate-800/30">
        <table class="min-w-full divide-y divide-slate-200/50 dark:divide-slate-800/30 text-left text-sm">
          <thead class="bg-slate-50 dark:bg-slate-900/50">
            <tr>${ths}</tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/20 bg-white dark:bg-slate-900/10">
            ${Array(rows).fill(tr).join('')}
          </tbody>
        </table>
      </div>
    `
  },

  /**
   * Full Dashboard Loading skeleton.
   */
  dashboard() {
    return `
      <div class="flex min-h-screen bg-bg-light dark:bg-bg-dark">
        <!-- Sidebar Placeholder -->
        <div class="hidden md:block w-64 border-r border-slate-200 dark:border-slate-800 p-6 animate-pulse">
          <div class="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-10"></div>
          <div class="flex flex-col gap-4">
            <div class="h-10 bg-slate-200 dark:bg-slate-700 rounded-xl w-full"></div>
            <div class="h-10 bg-slate-200 dark:bg-slate-700 rounded-xl w-full"></div>
            <div class="h-10 bg-slate-200 dark:bg-slate-700 rounded-xl w-full"></div>
            <div class="h-10 bg-slate-200 dark:bg-slate-700 rounded-xl w-full"></div>
          </div>
        </div>

        <!-- Content Placeholder -->
        <div class="flex-grow p-6 md:p-10 flex flex-col gap-6">
          <div class="flex justify-between items-center animate-pulse">
            <div>
              <div class="h-6 bg-slate-300 dark:bg-slate-650 rounded w-48 mb-2"></div>
              <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
            </div>
            <div class="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
          </div>
          
          ${this.cardGrid(3)}
          
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 glass-card p-6 rounded-2xl h-80 animate-pulse bg-slate-200/10">
              <div class="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-6"></div>
              <div class="h-full bg-slate-200/40 dark:bg-slate-750/30 rounded-xl"></div>
            </div>
            <div class="glass-card p-6 rounded-2xl h-80">
              ${this.list(3)}
            </div>
          </div>
        </div>
      </div>
    `
  }
}

export default skeletons
