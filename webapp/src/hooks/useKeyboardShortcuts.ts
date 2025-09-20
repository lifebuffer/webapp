import { useEffect, useCallback } from 'react';

export interface ShortcutHandler {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  handler: () => void;
  preventDefault?: boolean;
}

export class KeyboardShortcuts {
  private shortcuts: Map<string, ShortcutHandler> = new Map();

  register(shortcut: ShortcutHandler): () => void {
    const id = this.getShortcutId(shortcut);
    this.shortcuts.set(id, shortcut);

    return () => {
      this.shortcuts.delete(id);
    };
  }

  private getShortcutId(shortcut: Omit<ShortcutHandler, 'handler' | 'preventDefault'>): string {
    const parts: string[] = [];
    if (shortcut.ctrl) parts.push('ctrl');
    if (shortcut.alt) parts.push('alt');
    if (shortcut.shift) parts.push('shift');
    if (shortcut.meta) parts.push('meta');
    parts.push(shortcut.key.toLowerCase());
    return parts.join('+');
  }

  handleKeyDown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;

    // Don't trigger shortcuts when typing in inputs or textareas
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      return;
    }

    const shortcutId = this.getShortcutId({
      key: event.key.toLowerCase(),
      ctrl: event.ctrlKey,
      alt: event.altKey,
      shift: event.shiftKey,
      meta: event.metaKey,
    });

    const handler = this.shortcuts.get(shortcutId);
    if (handler) {
      if (handler.preventDefault !== false) {
        event.preventDefault();
      }
      handler.handler();
    }
  }
}

export function useKeyboardShortcuts(shortcuts: ShortcutHandler[]): void {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const target = event.target as HTMLElement;

    // Don't trigger shortcuts when typing in inputs or textareas
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      return;
    }

    for (const shortcut of shortcuts) {
      const matchesKey = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const matchesCtrl = shortcut.ctrl ? event.ctrlKey : !event.ctrlKey;
      const matchesAlt = shortcut.alt ? event.altKey : !event.altKey;
      const matchesShift = shortcut.shift ? event.shiftKey : !event.shiftKey;
      const matchesMeta = shortcut.meta ? event.metaKey : !event.metaKey;

      if (matchesKey && matchesCtrl && matchesAlt && matchesShift && matchesMeta) {
        if (shortcut.preventDefault !== false) {
          event.preventDefault();
        }
        shortcut.handler();
        break;
      }
    }
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}