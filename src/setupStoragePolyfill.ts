// Node.js 22+ compatibility: Ensure localStorage and sessionStorage are properly initialized
// This must run before any code that uses localStorage/sessionStorage
// See: https://github.com/jsdom/jsdom/issues/3757

if (typeof globalThis !== 'undefined') {
  // Create a simple storage implementation
  class Storage {
    private data: Record<string, string> = {};

    getItem(key: string): string | null {
      return this.data[key] || null;
    }

    setItem(key: string, value: string): void {
      this.data[key] = String(value);
    }

    removeItem(key: string): void {
      delete this.data[key];
    }

    clear(): void {
      this.data = {};
    }

    key(index: number): string | null {
      const keys = Object.keys(this.data);
      return keys[index] || null;
    }

    get length(): number {
      return Object.keys(this.data).length;
    }
  }

  // Polyfill if not properly defined
  if (!globalThis.localStorage || typeof globalThis.localStorage.getItem !== 'function') {
    Object.defineProperty(globalThis, 'localStorage', {
      value: new Storage(),
      writable: true,
      configurable: true,
    });
  }

  if (!globalThis.sessionStorage || typeof globalThis.sessionStorage.getItem !== 'function') {
    Object.defineProperty(globalThis, 'sessionStorage', {
      value: new Storage(),
      writable: true,
      configurable: true,
    });
  }
}
