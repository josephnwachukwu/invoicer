/** Removes values Firestore cannot serialize while preserving timestamps and class instances. */
export function omitUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(item => omitUndefined(item)).filter(item => item !== undefined) as T;
  }

  if (value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.entries(value as Record<string, unknown>).reduce<Record<string, unknown>>((result, [key, item]) => {
      if (item !== undefined) result[key] = omitUndefined(item);
      return result;
    }, {}) as T;
  }

  return value;
}
