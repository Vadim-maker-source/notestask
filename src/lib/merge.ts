/**
 * Утилита для рекурсивного слияния пользовательских настроек с дефолтными.
 * 
 * Настройки пользователя могут содержать вложенные объекты и даже функции
 * (например, кастомные render-хуки с вложенной конфигурацией), поэтому
 * и объекты, и функции считаются "контейнерами" для мержа.
 */

type Obj = Record<PropertyKey, unknown>;

function isContainer(v: unknown): v is Obj {
  const t = typeof v;
  return (t === "object" || t === "function") && v !== null;
}

// Пропускаем __proto__ — присваивание к нему не работает как обычное свойство,
// а просто создаст own property вместо модификации цепочки прототипов.
// Блокируем, чтобы избежать путаницы у вызывающего кода.
const SKIP_KEYS = new Set(["__proto__"]);

/**
 * Сливает source в target рекурсивно, изменяя target на месте.
 * Ключи из SKIP_KEYS игнорируются.
 */
export function deepMerge(target: Obj, source: Obj): Obj {
  for (const key of Object.keys(source)) {
    if (SKIP_KEYS.has(key)) continue;

    const tv = target[key];
    const sv = source[key];

    if (isContainer(tv) && isContainer(sv)) {
      deepMerge(tv, sv);
    } else {
      target[key] = sv;
    }
  }
  return target;
}
