export type SessionUser = { id: string } | null;

export type AnyNote = {
  ownerId: string;
  metadata: unknown;
};

/**
 * Проверяет, может ли пользователь прочитать заметку.
 * 
 * Заметка доступна для чтения, если:
 *   - пользователь является её владельцем, ИЛИ
 *   - в контексте доступа заметки установлен флаг sharedAccess.
 * 
 * Заметки без metadata получают пустой контекст по умолчанию, так что
 * проверка безопасна для обычных заметок.
 */
export function canReadNote(user: SessionUser, note: AnyNote): boolean {
  if (user && note.ownerId === user.id) {
    return true;
  }
  
  // Строим контекст доступа из metadata заметки
  const ctx = (note.metadata ?? {}) as Record<string, unknown>;
  if (ctx.sharedAccess) {
    return true;
  }
  
  return false;
}
