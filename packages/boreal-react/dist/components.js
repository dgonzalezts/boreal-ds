'use client';
import { MyComponent as MyComponentElement, defineCustomElement as defineMyComponent } from "@boreal-ds/web-components/components/my-component.js";
import { createComponent } from '@stencil/react-output-target/runtime';
import React from 'react';
export const MyComponent = createComponent({
    tagName: 'my-component',
    elementClass: MyComponentElement,
    react: React,
    events: {},
    defineCustomElement: defineMyComponent
});
//# sourceMappingURL=components.js.map