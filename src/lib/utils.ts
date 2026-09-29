import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * خوارزمية Fisher-Yates لخلط وترتيب الأسئلة عشوائياً لكل طالب
 * تدعم الـ Seed الحتمي (Seeded PRNG) بناءً على هوية الطالب واسم الاختبار
 * لضمان عدم تغير الترتيب عشوائياً عند قيام نفس الطالب بعمل Refresh للصفحة أثناء الامتحان،
 * ومنع مشاكل الـ Hydration Mismatch، مع إعطاء كل طالب ترتيباً عشوائياً مختلفاً تماماً عن زملائه.
 */
export function shuffleArray<T>(array: T[], seed?: string): T[] {
  const result = [...array];
  if (result.length <= 1) return result;

  let randFn: () => number;

  if (seed) {
    // FNV-1a Hash
    let h = 0x811c9dc5;
    for (let i = 0; i < seed.length; i++) {
      h ^= seed.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    let a = h >>> 0;
    // Mulberry32 32-bit PRNG
    randFn = () => {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  } else {
    randFn = Math.random;
  }

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(randFn() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }

  return result;
}
