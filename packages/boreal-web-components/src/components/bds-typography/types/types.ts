import { ALIGNMENT } from '@/types/alignment';
import { SIZES } from '@/types/size';
import { STATES } from '@/types/states';

export type TagElement = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div' | 'a' | 'label';
export type Variant = 'display' | 'heading' | 'subheading' | 'label' | 'helper' | 'link' | 'code' | 'caption';
export type State = (typeof STATES)[keyof typeof STATES];
export type Size = (typeof SIZES)[keyof typeof SIZES];
export type Alignment = (typeof ALIGNMENT)[keyof typeof ALIGNMENT];
