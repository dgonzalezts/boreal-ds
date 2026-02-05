import React from 'react';
import styles from './Callout.module.css';

export interface CalloutProps {
  variant: 'info' | 'tip' | 'warning' | 'error';
  icon?: string;
  children: React.ReactNode;
}

/**
 * A React component that renders a styled callout box for highlighting important information in Storybook documentation
 *
 * Note: This is a React-based documentation component, not a Stencil-based Boreal web component.
 * Can be used in: MDX files only (not compatible with TSX files configured for Lit template rendering)
 *
 * @example
 * ```mdx
 * import { Callout } from '@/_storybook/components';
 *
 * <Callout variant="info" icon="ℹ️">
 *   This is an informational message.
 * </Callout>
 *
 * <Callout variant="warning" icon="⚠️">
 *   <p>Warning: This action cannot be undone.</p>
 * </Callout>
 *
 * <Callout variant="tip" icon="💡">
 *   Pro tip: Use dynamic links for better maintainability.
 * </Callout>
 * ```
 */
export const Callout = ({ variant, icon, children }: CalloutProps) => {
  return (
    <div className={`${styles.callout} ${styles[variant]}`}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <div className={styles.content}>{children}</div>
    </div>
  );
};
