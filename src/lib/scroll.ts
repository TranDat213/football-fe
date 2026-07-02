/**
 * Smoothly scrolls an element to its bottom.
 */
export const scrollToBottom = (
  element: HTMLElement | null,
  smooth: boolean = true
) => {
  if (!element) return;
  
  element.scrollTo({
    top: element.scrollHeight,
    behavior: smooth ? "smooth" : "auto",
  });
};
