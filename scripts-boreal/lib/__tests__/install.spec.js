import { describe, it, expect, vi, beforeEach } from 'vitest';
import { installPack } from '../install.js';

vi.mock('../cmd.js', () => ({ Cmd: { run: vi.fn() } }));
vi.mock('../logger.js', () => ({ Logger: { log: vi.fn() } }));

describe('install', () => {
  let cmdMock;
  let loggerMock;

  beforeEach(async () => {
    const cmdModule = await import('../cmd.js');
    const loggerModule = await import('../logger.js');
    cmdMock = cmdModule.Cmd;
    loggerMock = loggerModule.Logger;
    vi.clearAllMocks();
  });

  describe('installPack', () => {
    it('should remove package first if uninstallName is provided', async () => {
      cmdMock.run.mockResolvedValue();

      await installPack('/test/dir', 'pkg.tgz', '@boreal-ds/web-components');

      expect(cmdMock.run).toHaveBeenNthCalledWith(
        1,
        'pnpm',
        ['remove', '@boreal-ds/web-components'],
        '/test/dir'
      );
      expect(cmdMock.run).toHaveBeenNthCalledWith(2, 'pnpm', ['add', './pkg.tgz'], '/test/dir');
    });

    it('should not remove if uninstallName is not provided', async () => {
      cmdMock.run.mockResolvedValue();

      await installPack('/test/dir', 'pkg.tgz');

      expect(cmdMock.run).not.toHaveBeenCalledWith(
        'pnpm',
        ['remove', expect.any(String)],
        '/test/dir'
      );
      expect(cmdMock.run).toHaveBeenCalledWith('pnpm', ['add', './pkg.tgz'], '/test/dir');
    });

    it('should log info before removing', async () => {
      cmdMock.run.mockResolvedValue();

      await installPack('/test/dir', 'pkg.tgz', '@boreal-ds/web-components');

      expect(loggerMock.log).toHaveBeenCalledWith(
        'info',
        expect.stringContaining('@boreal-ds/web-components')
      );
    });

    it('should log info before installing', async () => {
      cmdMock.run.mockResolvedValue();

      await installPack('/test/dir', 'pkg.tgz');

      expect(loggerMock.log).toHaveBeenCalledWith(
        'info',
        expect.stringContaining('pkg.tgz')
      );
    });
  });
});
