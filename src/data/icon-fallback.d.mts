export declare function createIconFallback<T>(
  fallbackIcon: T,
  warn?: (message: string) => void,
): (name: string, field: string) => T
