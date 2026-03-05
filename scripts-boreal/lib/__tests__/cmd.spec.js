import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Cmd } from '../cmd.js';
import path from 'node:path';
import fs from 'node:fs';

vi.mock('execa', () => ({ execa: vi.fn() }));

vi.mock('../logger.js', () => ({ Logger: { log: vi.fn() } }));

describe('Cmd', () => {
  let execaMock;
  let loggerMock;

  beforeEach(async () => {
    const execaModule = await import('execa');
    const loggerModule = await import('../logger.js');
    execaMock = execaModule.execa;
    loggerMock = loggerModule.Logger;
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('run', () => {
    it('shoud execute a command with execa', async () => {
      execaMock.mockResolvedValueOnce({});
      await Cmd.run('npm', ['install'], '/test/dir');

      expect(execaMock).toHaveBeenCalledWith('npm', ['install'], {
        cwd: '/test/dir',
        stdio: 'inherit',
      });
    });

    it('shold log info message before running command', async () => {
      execaMock.mockResolvedValueOnce({});
      await Cmd.run('npm', ['install'], '/test/dir');

      expect(loggerMock.log).toHaveBeenCalledWith(
        'info',
        expect.stringContaining('Running command')
      );
    });

    it('Should trow and log error when command fails', async () => {
      const error = new Error('Command failed');
      execaMock.mockRejectedValueOnce(error);

      await expect(Cmd.run('npm', ['install'], '/test/dir')).rejects.toThrow('Command failed');

      expect(loggerMock.log).toHaveBeenCalledWith(
        'error',
        expect.stringContaining('Command failed')
      );
    });
  });

  describe('tgzName', () => {
    it('should return trimmed tgz filename from npm pack', async () => {
      execaMock.mockResolvedValueOnce({ stdout: 'my-package-1.0.0.tgz \n' });
      const result = await Cmd.tgzName('/source/dir');
      expect(result).toBe('my-package-1.0.0.tgz');
      expect(execaMock).toHaveBeenCalledWith('pnpm', ['pack', '--silent'], {
        cwd: '/source/dir',
      });
    });

    it('should throw and log error when pnpm pack fails', async () => {
      const error = new Error('pnpm pack failed');
      execaMock.mockRejectedValueOnce(error);

      await expect(Cmd.tgzName('/source/dir')).rejects.toThrow('pnpm pack failed');
      expect(loggerMock.log).toHaveBeenCalledWith(
        'error',
        expect.stringContaining('pnpm pack failed')
      );
    });
  });

  describe('packTo', () => {
    let existsSyncSpy;
    let rmSyncSpy;
    let renameSyncSpy;

    beforeEach(() => {
      existsSyncSpy = vi.spyOn(fs, 'existsSync');
      rmSyncSpy = vi.spyOn(fs, 'rmSync').mockImplementation(() => {});
      renameSyncSpy = vi.spyOn(fs, 'renameSync').mockImplementation(() => {});
    });

    afterEach(() => {
      existsSyncSpy.mockRestore();
      rmSyncSpy.mockRestore();
      renameSyncSpy.mockRestore();
    });

    it('should pack and move tgz to target directory', async () => {
      execaMock.mockResolvedValueOnce({ stdout: 'my-package-1.0.0.tgz' });
      existsSyncSpy.mockReturnValueOnce(true);

      const result = await Cmd.packTo('/source', '/target');

      expect(result.tgzName).toBe('my-package-1.0.0.tgz');
      expect(result.to).toBe(path.join('/target', 'my-package-1.0.0.tgz'));
      expect(renameSyncSpy).toHaveBeenCalledWith(
        path.join('/source', 'my-package-1.0.0.tgz'),
        path.join('/target', 'my-package-1.0.0.tgz')
      );
    });

    it('should remove existing tgz before moving', async () => {
      execaMock.mockResolvedValueOnce({ stdout: 'my-package-1.0.0.tgz' });
      existsSyncSpy.mockReturnValueOnce(true);

      await Cmd.packTo('/source', '/target');

      expect(rmSyncSpy).toHaveBeenCalledWith(path.join('/target', 'my-package-1.0.0.tgz'));
    });

    it('should not remove tgz if it does not exist', async () => {
      execaMock.mockResolvedValueOnce({ stdout: 'my-package-1.0.0.tgz' });
      existsSyncSpy.mockReturnValueOnce(false);

      await Cmd.packTo('/source', '/target');

      expect(rmSyncSpy).not.toHaveBeenCalled();
    });

    it('should log success message after packing and moving', async () => {
      execaMock.mockResolvedValueOnce({ stdout: 'my-package-1.0.0.tgz' });
      existsSyncSpy.mockReturnValueOnce(false);

      await Cmd.packTo('/source', '/target');

      expect(loggerMock.log).toHaveBeenCalledWith(
        'success',
        expect.stringContaining('Packed & Moved to')
      );
    });

    it('should throw and log error when packing or moving fails', async () => {
      const error = new Error('Pack or move failed');
      execaMock.mockRejectedValueOnce(error);

      await expect(Cmd.packTo('/source', '/target')).rejects.toThrow('Pack or move failed');
      expect(loggerMock.log).toHaveBeenCalledWith(
        'error',
        expect.stringContaining('Pack or move failed')
      );
    });
  });
});
