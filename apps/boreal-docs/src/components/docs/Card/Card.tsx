import React from 'react';
import styles from './Card.module.css';

export interface CardProps {
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * A React component that groups related documentation content with visual hierarchy
 *
 * Note: This is a React-based documentation component, not a Stencil-based Boreal web component.
 * Can be used in: MDX files only (not compatible with TSX files configured for Lit template rendering)
 *
 * @param props - The component props
 * @param props.title - The title of the card
 * @param props.children - The content to be displayed inside the card
 * @param props.variant - The visual variant of the card (default, outlined, elevated)
 * @param props.size - The size of the card (sm, md, lg)
 * @param props.className - Additional CSS class names to apply to the card
 * @return A styled card component
 *
 * @example
 * ```tsx
 * import { Card } from '@/components/docs';
 *
 * <Card title="Usage Guidelines" variant="default" size="md">
 *   Follow these best practices when using this component.
 * </Card>
 * ```
 */
export const Card = ({
  title,
  children,
  variant = 'default',
  size = 'md',
  className = '',
}: CardProps) => {
  const variantClass = styles[variant] || styles.default;
  const sizeClass = styles[size] || styles.md;

  return (
    <div className={`${styles.card} ${variantClass} ${sizeClass} ${className}`}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.content}>{children}</div>
    </div>
  );
};
