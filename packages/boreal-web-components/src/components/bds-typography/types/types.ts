import { ALIGNMENT } from '@/types/alignment';
import { STATES } from '@/types/states';

export type TagElement = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div' | 'a' | 'label';
export type Variant = 'display' | 'heading' | 'subheading' | 'label' | 'helper' | 'link' | 'code' | 'caption';
export type State = (typeof STATES)[keyof typeof STATES];
export type Alignment = (typeof ALIGNMENT)[keyof typeof ALIGNMENT];
