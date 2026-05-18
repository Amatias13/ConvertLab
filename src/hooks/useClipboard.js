/**
 * useClipboard — custom hook that wraps navigator.clipboard.writeText
 * and automatically fires a toast notification on success.
 *
 * WHY a hook: The copy + toast pattern was repeated across 20+ tool
 * components. Centralising it in a hook removes all that duplication
 * and ensures consistent UX (same toast duration, same wording).
 *
 * Usage:
 *   const { copy } = useClipboard()
 *   copy('text to copy')          // shows "Copied" toast
 *   copy('text', 'Custom label') // shows "Custom label" toast
 */
import { useCallback } from 'react'
import { useApp } from '../context/AppContext'

/**
 * Returns a `copy(text, label?)` function that writes to the clipboard
 * and fires a toast notification.
 */
export function useClipboard() {
  const { showToast } = useApp()

  const copy = useCallback((text, label = 'Copied') => {
    navigator.clipboard.writeText(String(text))
    showToast(label)
  }, [showToast])

  return { copy }
}
