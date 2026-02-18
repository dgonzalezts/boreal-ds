import { useOf } from '@storybook/addon-docs/blocks';
import type { ModuleExport } from 'storybook/internal/types';

interface StoryNameProps {
  of?: ModuleExport | 'story' | 'meta' | 'component';
}

/**
 * A React component that displays the name of a story.
 *
 * Note: This is a React-based documentation component, not a Stencil-based Boreal web component.
 * Can be used in: MDX files only (not compatible with TSX files configured for Lit template rendering)
 *
 * @param props - The component props
 * @param props.of - Optional reference to the story. If not provided, defaults to 'story'
 * @returns A heading element displaying the resolved story name
 *
 * @example
 * ```tsx
 * import { StoryName } from '@/components/docs';
 *
 * <StoryName of="MyStory" />
 * ```
 */
export const StoryName = ({ of }: StoryNameProps) => {
  const resolvedOf = useOf(of || 'story', ['story']);
  return <h3>{resolvedOf.story.name}</h3>;
};
