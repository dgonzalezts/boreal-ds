/**
 * Ensure the given component instance has an auto-generated id if one wasn't provided.
 * Designed to be called from `componentWillLoad` on a Stencil component.
 */
export function createId(component: { idComponent?: string }) {
  if (!component.idComponent) component.idComponent = `bds-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Components can spread the result into their host.
 */
export function getBaseAttributes(component: { idComponent: string }) {
  createId(component);

  return {
    id: component.idComponent,
  };
}
