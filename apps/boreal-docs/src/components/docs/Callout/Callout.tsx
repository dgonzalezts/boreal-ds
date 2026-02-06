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
 * @param props - The component props
 * @param props.variant - The variant of the callout, determining its style (info, tip, warning, error)
 * @param props.icon - An optional icon to display alongside the callout content
 * @param props.children - The content to be displayed inside the callout
 * @returns A styled callout box component
 *
 * @example
 * ```tsx
 * import { Callout } from '@/components/docs';
 *
 * <Callout variant="info" icon="ℹ️">
 *   This is an informational message.
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
