import { describe, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { ensureNodeModules, hasNodeModules, installPack } from '../install.js';

vi.mock('../cmd.js', () => ({ Cmd: { run: vi.fn() } }));
vi.mock('../logger.js', () => ({ Logger: { log: vi.fn() } }));

describe('install', () => {
  let existsSyncSpy;
  let cmdMock;
  let loggerMock;

  beforeEach(async () => {
    const cmdModule = await import('../cmd.js');
    const loggerModule = await import('../logger.js');
    cmdMock = cmdModule.Cmd;
    loggerMock = loggerModule.Logger;
    existsSyncSpy = vi.spyOn(fs, 'existsSync');
    vi.clearAllMocks();
  });

  afterEach(() => {
    existsSyncSpy.mockRestore();
  });

  describe('hasModules', () => {
    it('should return true if node_modules exists', () => {
      existsSyncSpy.mockReturnValueOnce(true);

      const result = hasNodeModules('/test/dir');

      expect(result).toBe(true);
      expect(existsSyncSpy).toHaveBeenCalledWith(path.join('/test/dir', 'node_modules'));
    });

    it('should return false if node_modules does not exist', () => {
      existsSyncSpy.mockReturnValueOnce(false);

      const result = hasNodeModules('/test/dir');

      expect(result).toBe(false);
      expect(existsSyncSpy).toHaveBeenCalledWith(path.join('/test/dir', 'node_modules'));
    });
  });

  describe('ensureNodeModules', () => {
    it('should not install dependencies if node_modules exists', async () => {
      existsSyncSpy.mockReturnValueOnce(true);

      await ensureNodeModules('/test/dir');
      expect(loggerMock.log).not.toHaveBeenCalledWith();
    });

    it('should install dependecies if node_modules does not exist', async () => {
      existsSyncSpy.mockReturnValueOnce(false);
      cmdMock.run.mockResolvedValueOnce();

      await ensureNodeModules('/test/dir');

      expect(cmdMock.run).toHaveBeenCalledWith('npm', ['install'], '/test/dir');
    });

    it('should log info message before installing dependencies', async () => {
      existsSyncSpy.mockReturnValueOnce(false);
      cmdMock.run.mockResolvedValueOnce();

      await ensureNodeModules('/test/dir');

      expect(loggerMock.log).toHaveBeenCalledWith(
        'info',
        expect.stringContaining('Installing dependencies')
      );
    });

    it('should log success message after installing dependencies', async () => {
      existsSyncSpy.mockReturnValueOnce(false);
      cmdMock.run.mockResolvedValueOnce();

      await ensureNodeModules('/test/dir');

      expect(loggerMock.log).toHaveBeenCalledWith(
        'success',
        expect.stringContaining('Dependencies installed')
      );
    });
  });

  describe('tgzName', () => {
    it('should ensure node_modules and install pack when node_modules doest not exist', async () => {
      existsSyncSpy.mockReturnValueOnce(false);
      cmdMock.run.mockResolvedValueOnce();

      await installPack('/test/dir', 'pkg.tgz');

      expect(cmdMock.run).toHaveBeenCalledWith('npm', ['install'], '/test/dir');
      expect(cmdMock.run).toHaveBeenCalledWith('npm', ['install', 'pkg.tgz'], '/test/dir');
    });

    it('should uninstall package first if node_modules exist and uninstallName is provided', async () => {
      existsSyncSpy.mockReturnValueOnce(true);
      cmdMock.run.mockResolvedValueOnce();

      await installPack('/test/dir', 'pkg.tgz', '@boreal-ds/web-components');

      expect(cmdMock.run).toHaveBeenNthCalledWith(
        1,
        'npm',
        ['uninstall', '@boreal-ds/web-components'],
        '/test/dir'
      );
      expect(cmdMock.run).toHaveBeenNthCalledWith(2, 'npm', ['install', 'pkg.tgz'], '/test/dir');
    });

    it('should not uninstall if uninstallName is not provided', async () => {
      existsSyncSpy.mockReturnValueOnce(true);
      cmdMock.run.mockResolvedValueOnce();

      await installPack('/test/dir', 'pkg.tgz');

      expect(cmdMock.run).not.toHaveBeenCalledWith(
        'npm',
        ['uninstall', expect.any(String)],
        '/test/dir'
      );
      expect(cmdMock.run).toHaveBeenCalledWith('npm', ['install', 'pkg.tgz'], '/test/dir');
    });

    it('should log info message during installation', async () => {
      existsSyncSpy.mockReturnValueOnce(false);
      cmdMock.run.mockResolvedValueOnce();

      await installPack('/test/dir', 'pkg.tgz', '@boreal-ds/web-components');

      expect(loggerMock.log).toHaveBeenCalledWith(
        'info',
        expect.stringContaining('Install pack pkg.tgz...')
      );
    });
  });
});
