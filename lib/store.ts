export const sidebarStore = {
  isOpen: false, // Default closed on mobile, open on desktop (handled by CSS)
  listeners: new Set<() => void>(),
  toggle() {
    sidebarStore.isOpen = !sidebarStore.isOpen;
    sidebarStore.listeners.forEach(l => l());
  },
  set(open: boolean) {
    if (sidebarStore.isOpen !== open) {
      sidebarStore.isOpen = open;
      sidebarStore.listeners.forEach(l => l());
    }
  },
  subscribe(listener: () => void) {
    sidebarStore.listeners.add(listener);
    return () => sidebarStore.listeners.delete(listener);
  },
  getSnapshot() {
    return sidebarStore.isOpen;
  }
};
