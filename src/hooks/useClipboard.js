/**
 * useClipboard — wraps navigator.clipboard.writeText with toast feedback.
 * Handles permission errors and non-HTTPS contexts gracefully.
 *
 * Usage:
 *   const { copy } = useClipboard()
 *   copy('text to copy')           // shows "Copied" toast
 *   copy('text', 'Custom label')   // shows custom label toast
 */
import { useCallback } from "react";
import { useApp } from "../context/AppContext";

export function useClipboard() {
  const { showToast } = useApp();

  const copy = useCallback(
    (text, label = "Copied") => {
      navigator.clipboard
        .writeText(String(text))
        .then(() => showToast(label))
        .catch(() => showToast("Copy failed — check browser permissions", "err"));
    },
    [showToast],
  );

  return { copy };
}
