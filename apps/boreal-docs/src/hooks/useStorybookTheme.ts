import { useState, useEffect } from 'react';

/**
 * A custom React hook that monitors and returns the current theme applied to the document body.
 *
 * This hook is specifically designed for Storybook environments where themes are managed
 * via the `data-theme` attribute on the document body element. It automatically detects
 * theme changes and provides the current theme value to consuming components.
 *
 * **Implementation Note:**
 * This hook uses MutationObserver to watch DOM changes rather than Storybook's `useGlobals` hook
 * because Storybook preview hooks (like `useGlobals`, `useArgs`) can only be called inside decorators
 * and story functions, not in regular React components rendered as story content.
 *
 * @see https://storybook.js.org/docs/addons/addons-api#useglobals
 *
 * @returns {string} The current theme name from the body's `data-theme` attribute,
 *                   or 'telesign' if no theme is set
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const theme = useStorybookTheme();
 *
 *   return (
 *     <div className={`component-${theme}`}>
 *       Current theme: {theme}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Using with conditional styling
 * function ThemedButton() {
 *   const theme = useStorybookTheme();
 *   const isDark = theme === 'dark';
 *
 *   return (
 *     <button style={{
 *       backgroundColor: isDark ? '#333' : '#fff',
 *       color: isDark ? '#fff' : '#333'
 *     }}>
 *       Themed Button
 *     </button>
 *   );
 * }
 * ```
 */
export const useStorybookTheme = (): string => {
  const [currentTheme, setCurrentTheme] = useState('telesign');

  useEffect(() => {
    /**
     * Updates the current theme state by reading the data-theme attribute from the body element
     */
    const updateTheme = () => {
      const body = document.querySelector('body');
      const theme = body?.getAttribute('data-theme') || 'telesign';
      setCurrentTheme(theme);
    };

    // Set initial theme value
    updateTheme();

    // Create a MutationObserver to watch for theme changes
    const observer = new MutationObserver(updateTheme);
    const body = document.querySelector('body');

    if (body) {
      // Observe changes to the data-theme attribute specifically
      observer.observe(body, {
        attributes: true,
        attributeFilter: ['data-theme'],
      });
    }

    // Cleanup: disconnect observer when component unmounts
    return () => observer.disconnect();
  }, []);

  return currentTheme;
};
