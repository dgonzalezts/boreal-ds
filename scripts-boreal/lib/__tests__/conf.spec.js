import { describe, expect, it } from 'vitest';
import { CONFIG } from '../conf.js';
import path from 'node:path';

describe('CONFIG', () => {
  it('should export a CONFIG object', () => {
    expect(typeof CONFIG).toBe('object');
    expect(CONFIG).toBeDefined();
  });

  it('should have webcomponnents configuration', () => {
    expect(CONFIG.webcomponents).toBeDefined();
    expect(typeof CONFIG.webcomponents).toBe('object');
    expect(CONFIG.webcomponents.wrapperName).toBe('@boreal-ds/web-components');
    expect(CONFIG.webcomponents.wrapperRoute).toBeDefined();
  });

  it('should have vue configuration', () => {
    expect(CONFIG.vue).toBeDefined();
    expect(typeof CONFIG.vue).toBe('object');
    expect(CONFIG.vue.wrapperName).toBe('@boreal-ds/vue');
    expect(CONFIG.vue.wrapperRoute).toBeDefined();
    expect(CONFIG.vue.app).toBeDefined();
  });

  it('should have react configuration', () => {
    expect(CONFIG.react).toBeDefined();
    expect(typeof CONFIG.react).toBe('object');
    expect(CONFIG.react.wrapperName).toBe('@boreal-ds/react');
    expect(CONFIG.react.wrapperRoute).toBeDefined();
    expect(CONFIG.react.app).toBeDefined();
  });

  it('should have angular configuration', () => {
    expect(CONFIG.angular).toBeDefined();
    expect(typeof CONFIG.angular).toBe('object');
    expect(CONFIG.angular.wrapperName).toBe('@boreal-ds/angular');
    expect(CONFIG.angular.wrapperRoute).toBeDefined();
    expect(CONFIG.angular.app).toBeDefined();
  });

  it('should have absolute paths for all routes', () => {
    expect(path.isAbsolute(CONFIG.webcomponents.wrapperRoute)).toBe(true);
    expect(path.isAbsolute(CONFIG.vue.wrapperRoute)).toBe(true);
    expect(path.isAbsolute(CONFIG.react.wrapperRoute)).toBe(true);
    expect(path.isAbsolute(CONFIG.angular.wrapperRoute)).toBe(true);
    expect(path.isAbsolute(CONFIG.vue.app)).toBe(true);
    expect(path.isAbsolute(CONFIG.react.app)).toBe(true);
    expect(path.isAbsolute(CONFIG.angular.app)).toBe(true);
  });
});
