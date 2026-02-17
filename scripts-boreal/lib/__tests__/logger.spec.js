import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Logger } from '../logger.js';
describe('Logger', () => {
  let consoleSpy;
  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => {
    consoleSpy.mockRestore();
  });
  it('should log info messages', () => {
    Logger.log('info', 'test info message');
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
  it('should log warn messages', () => {
    Logger.log('warn', 'test warn message');
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
  it('should log error messages', () => {
    Logger.log('error', 'test error message');
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
  it('should log success messages', () => {
    Logger.log('success', 'test success message');
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
  it('should log title messages', () => {
    Logger.log('title', 'test title message');
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
  it('should strip leading newlines from message', () => {
    Logger.log('info', '\n\ntest message');
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const callArgs = consoleSpy.mock.calls[0][0];
    expect(callArgs).not.toMatch(/^\s*\n/);
  });
  it('should pass additional arguments to console.log', () => {
    const extraArg = { data: 'test' };
    Logger.log('info', 'test message', extraArg);
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy.mock.calls[0][1]).toBe(extraArg);
  });
});
