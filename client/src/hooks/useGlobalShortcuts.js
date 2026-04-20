import { useEffect, useRef } from "react";

function normalizeKey(key) {
  return String(key || "").toLowerCase();
}

export function isTypingTarget(target) {
  if (!(target instanceof HTMLElement)) return false;

  const tagName = target.tagName.toLowerCase();
  return (
    target.isContentEditable ||
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select"
  );
}

export function useGlobalShortcuts(shortcuts) {
  const pressedKeysRef = useRef(new Set());

  useEffect(() => {
    function handleKeyDown(event) {
      const key = normalizeKey(event.key);
      pressedKeysRef.current.add(key);

      for (const shortcut of shortcuts) {
        if (!shortcut?.enabled) continue;
        if (!shortcut.combo?.length) continue;
        if (!shortcut.allowInInputs && isTypingTarget(event.target)) continue;

        const matches = shortcut.combo.every((comboKey) =>
          pressedKeysRef.current.has(normalizeKey(comboKey)),
        );

        if (!matches) continue;

        if (shortcut.preventDefault !== false) {
          event.preventDefault();
        }

        shortcut.handler?.(event);
        break;
      }
    }

    function handleKeyUp(event) {
      pressedKeysRef.current.delete(normalizeKey(event.key));
    }

    function handleBlur() {
      pressedKeysRef.current.clear();
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [shortcuts]);
}
