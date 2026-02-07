import { css } from 'lit';

/*

Atom One Dark by Daniel Gamage
Original One Dark Syntax theme from https://github.com/atom/one-dark-syntax
Based on the highlight.js theme: https://highlightjs.org/
To change the theme, update the colors in the css variables
There are some themes refefences in the `node_modules/highlight.js/styles/` folder.


base:    #282c34
mono-1:  #abb2bf
mono-2:  #818896
mono-3:  #5c6370
hue-1:   #56b6c2
hue-2:   #61aeee
hue-3:   #c678dd
hue-4:   #98c379
hue-5:   #e06c75
hue-5-2: #be5046
hue-6:   #d19a66
hue-6-2: #e6c07b

*/
export const highlightJsStyles = css`
  :host {
    /* Base colors */
    --hljs-base: #282c34;
    --hljs-mono-1: #abb2bf;
    --hljs-mono-2: #818896;
    --hljs-mono-3: #5c6370;

    /* Hue colors */
    --hljs-hue-1: #56b6c2;
    --hljs-hue-2: #61aeee;
    --hljs-hue-3: #c678dd;
    --hljs-hue-4: #98c379;
    --hljs-hue-5: #e06c75;
    --hljs-hue-5-2: #be5046;
    --hljs-hue-6: #d19a66;
    --hljs-hue-6-2: #e6c07b;
  }

  pre code.hljs {
    display: block;
    overflow-x: auto;
    padding: 1em;
  }

  code.hljs {
    padding: 3px 5px;
  }

  .hljs {
    color: var(--hljs-mono-1);
    background: var(--hljs-base);
  }

  .hljs-comment,
  .hljs-quote {
    color: var(--hljs-mono-3);
    font-style: italic;
  }

  .hljs-doctag,
  .hljs-keyword,
  .hljs-formula {
    color: var(--hljs-hue-3);
  }

  .hljs-section,
  .hljs-name,
  .hljs-selector-tag,
  .hljs-deletion,
  .hljs-subst {
    color: var(--hljs-hue-5);
  }

  .hljs-literal {
    color: var(--hljs-hue-1);
  }

  .hljs-string,
  .hljs-regexp,
  .hljs-addition,
  .hljs-attribute,
  .hljs-meta .hljs-string {
    color: var(--hljs-hue-4);
  }

  .hljs-attr,
  .hljs-variable,
  .hljs-template-variable,
  .hljs-type,
  .hljs-selector-class,
  .hljs-selector-attr,
  .hljs-selector-pseudo,
  .hljs-number {
    color: var(--hljs-hue-6);
  }

  .hljs-symbol,
  .hljs-bullet,
  .hljs-link,
  .hljs-meta,
  .hljs-selector-id,
  .hljs-title {
    color: var(--hljs-hue-2);
  }

  .hljs-built_in,
  .hljs-title.class_,
  .hljs-class .hljs-title {
    color: var(--hljs-hue-6-2);
  }

  .hljs-emphasis {
    font-style: italic;
  }

  .hljs-strong {
    font-weight: bold;
  }

  .hljs-link {
    text-decoration: underline;
  }
`;
