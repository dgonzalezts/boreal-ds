/**
 * Taken from StencilJS Ionic team
 * This helper pass the attributes passed to components directly to the inner element
 * e.g. <my-component aria-hidden="true">Text</my-component>
 * will pass the aria-hidden to the inner element inside my-component
 * <span { ...myComponentAttr }>Hidden</span>
 */

export interface Attributes {
  [key: string]: string;
}

export const inheritAttributes = (el: HTMLElement, attributes: readonly string[] = []): Attributes => {
  const attributeObject: Attributes = {};

  attributes.forEach(attr => {
    if (el.hasAttribute(attr)) {
      const value = el.getAttribute(attr);
      if (value !== null) {
        attributeObject[attr] = value;
      }
      el.removeAttribute(attr);
    }
  });

  return attributeObject;
};

const ariaAttributes: readonly string[] = [
  'role',
  'aria-activedescendant',
  'aria-atomic',
  'aria-autocomplete',
  'aria-braillelabel',
  'aria-brailleroledescription',
  'aria-busy',
  'aria-checked',
  'aria-colcount',
  'aria-colindex',
  'aria-colindextext',
  'aria-colspan',
  'aria-controls',
  'aria-current',
  'aria-describedby',
  'aria-description',
  'aria-details',
  'aria-disabled',
  'aria-errormessage',
  'aria-expanded',
  'aria-flowto',
  'aria-haspopup',
  'aria-hidden',
  'aria-invalid',
  'aria-keyshortcuts',
  'aria-label',
  'aria-labelledby',
  'aria-level',
  'aria-live',
  'aria-multiline',
  'aria-multiselectable',
  'aria-orientation',
  'aria-owns',
  'aria-placeholder',
  'aria-posinset',
  'aria-pressed',
  'aria-readonly',
  'aria-relevant',
  'aria-required',
  'aria-roledescription',
  'aria-rowcount',
  'aria-rowindex',
  'aria-rowindextext',
  'aria-rowspan',
  'aria-selected',
  'aria-setsize',
  'aria-sort',
  'aria-valuemax',
  'aria-valuemin',
  'aria-valuenow',
  'aria-valuetext',
];

export const inheritAriaAttributes = (el: HTMLElement, ignoreList?: readonly string[]): Attributes => {
  let attributesToInherit: readonly string[] = ariaAttributes;
  if (ignoreList && ignoreList.length > 0) {
    attributesToInherit = attributesToInherit.filter(attr => !ignoreList.includes(attr));
  }
  return inheritAttributes(el, attributesToInherit);
};
