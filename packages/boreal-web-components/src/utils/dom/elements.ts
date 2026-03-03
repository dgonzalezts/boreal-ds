/**
 * Detects whether a slot has assigned content in the host element's light DOM.
 *
 * Whitespace-only text nodes and comment nodes are ignored — only element nodes
 * and non-empty text nodes are considered meaningful slot content.
 *
 * @param el - The host element to query.
 * @param slotName - Named slot to check. Omit to check the default slot.
 * @returns `true` if the slot has meaningful content, `false` otherwise.
 */
export function hasSlotContent(el: HTMLElement, slotName?: string): boolean {
  if (slotName !== undefined) {
    return el.querySelector(`[slot="${slotName}"]`) !== null;
  }
  return Array.from(el.childNodes).some(node => {
    if (node instanceof Element) return node.slot === '';
    if (node.nodeType === Node.TEXT_NODE) return node.textContent?.trim() !== '';
    return false;
  });
}
