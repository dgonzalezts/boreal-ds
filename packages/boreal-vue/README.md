# Vue Wrapper for Boreal DS

A lightweight utility that wraps Boreal DS web components for seamless integration in Vue 3 applications.

## Overview

Using Boreal DS Vue wrappers over plain web components provides several advantages:

- **Type checking** — full TypeScript support with typed props and events
- **`v-model` support** — form control components work with Vue's two-way binding
- **Router integration** — compatible with Vue Router's `<router-link>`

## Installation

> [!TIP]
> Refer to the official Boreal DS documentation at [Boreal DS Storybook](https://release-current--69b1eb61625aa69a7886f854.chromatic.com/) for more details.

```sh
npm install @telesign/boreal-vue
```

> [!NOTE]
> `@telesign/boreal-web-components` is a dependency of this package and will be installed automatically. You do not need to install it separately.

## Setup

### Styles

Import the Boreal DS stylesheet in your application entry file:

```ts
// main.ts
import '@telesign/boreal-vue/css/boreal.css';
```

### Icon font

Add the Boreal DS icon font to the `<head>` of your `index.html`:

```html
<link
  rel="stylesheet"
  href="https://resources-borealds.s3.us-east-1.amazonaws.com/icons/current/boreal-styles.css"
/>
```

### Theming

Set the `data-theme` attribute on the `<body>` element to activate a brand theme:

```html
<body data-theme="proximus">
```

Available values: `connect` | `engage` | `protect` | `proximus`

## Usage

```vue
<script setup lang="ts">
import { BdsBanner } from '@telesign/boreal-vue';

const handleClose = () => {
  console.log('Banner closed');
};
</script>

<template>
  <BdsBanner variant="info" :enable-close="true" @close="handleClose">
    Welcome to Boreal DS
  </BdsBanner>
</template>
```
