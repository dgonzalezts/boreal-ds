import { readConfig, fetchPublishedCem, readLocalCem, main, printReport } from './check-cem-changes';
import { CemChangelog } from '@wc-toolkit/changelog';

const PACKAGE_ROOT = '/fake/root';
const PACKAGE_NAME = '@test/pkg';
const VALID_PACKAGE_JSON = JSON.stringify({ name: PACKAGE_NAME });
const VALID_RELEASE_IT_JSON = JSON.stringify({ npm: { tag: 'alpha' } });
const VALID_CEM = { schemaVersion: '1.0.0', modules: [] };

const makeFsDeps = (overrides?: { readFileSync?: jest.Mock; existsSync?: jest.Mock }) => ({
  readFileSync: jest.fn(),
  existsSync: jest.fn(),
  ...overrides,
});

describe('readConfig', () => {
  it('returns packageName and distTag from valid config files', () => {
    const deps = makeFsDeps({
      readFileSync: jest.fn().mockReturnValueOnce(VALID_PACKAGE_JSON).mockReturnValueOnce(VALID_RELEASE_IT_JSON),
    });

    expect(readConfig(PACKAGE_ROOT, deps as any)).toEqual({
      packageName: PACKAGE_NAME,
      distTag: 'alpha',
    });
  });

  it('defaults distTag to "latest" when npm.tag is absent from .release-it.json', () => {
    const deps = makeFsDeps({
      readFileSync: jest.fn().mockReturnValueOnce(VALID_PACKAGE_JSON).mockReturnValueOnce(JSON.stringify({})),
    });

    expect(readConfig(PACKAGE_ROOT, deps as any).distTag).toBe('latest');
  });

  it('reads distTag from npm.tag in .release-it.json', () => {
    const deps = makeFsDeps({
      readFileSync: jest
        .fn()
        .mockReturnValueOnce(JSON.stringify({ name: 'test-pkg' }))
        .mockReturnValueOnce(JSON.stringify({ npm: { tag: 'beta' } })),
    });

    expect(readConfig(PACKAGE_ROOT, deps as any).distTag).toBe('beta');
  });

  it('throws with descriptive message when package.json cannot be read', () => {
    const deps = makeFsDeps({
      readFileSync: jest.fn().mockImplementationOnce(() => {
        throw new Error('ENOENT');
      }),
    });

    expect(() => readConfig(PACKAGE_ROOT, deps as any)).toThrow('Failed to read package.json');
  });

  it('throws with descriptive message when .release-it.json cannot be read', () => {
    const deps = makeFsDeps({
      readFileSync: jest
        .fn()
        .mockReturnValueOnce(VALID_PACKAGE_JSON)
        .mockImplementationOnce(() => {
          throw new Error('ENOENT');
        }),
    });

    expect(() => readConfig(PACKAGE_ROOT, deps as any)).toThrow('Failed to read .release-it.json');
  });
});

describe('fetchPublishedCem', () => {
  let logSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    warnSpy.mockRestore();
  });

  it('returns null and logs skip message when package is not yet published (404)', async () => {
    global.fetch = jest.fn().mockResolvedValue({ status: 404, ok: false }) as any;

    const result = await fetchPublishedCem(PACKAGE_NAME, 'alpha');

    expect(result).toBeNull();
    expect(logSpy).toHaveBeenCalledWith('--- CEM Comparison skipped (no prior published CEM) ---');
  });

  it('returns null and warns when unpkg returns a non-404 error status', async () => {
    global.fetch = jest.fn().mockResolvedValue({ status: 503, ok: false }) as any;

    const result = await fetchPublishedCem(PACKAGE_NAME, 'alpha');

    expect(result).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith('--- CEM Comparison skipped (unpkg responded with 503) ---');
  });

  it('returns null and warns on network error', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network failure')) as any;

    const result = await fetchPublishedCem(PACKAGE_NAME, 'alpha');

    expect(result).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith('--- CEM Comparison skipped (network error fetching published CEM) ---');
  });

  it('returns parsed JSON manifest on success', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      ok: true,
      json: jest.fn().mockResolvedValue(VALID_CEM),
    }) as any;

    expect(await fetchPublishedCem(PACKAGE_NAME, 'alpha')).toEqual(VALID_CEM);
  });
});

describe('readLocalCem', () => {
  it('throws when custom-elements.json does not exist', () => {
    const deps = makeFsDeps({ existsSync: jest.fn().mockReturnValue(false) });

    expect(() => readLocalCem(PACKAGE_ROOT, deps as any)).toThrow(
      'custom-elements.json not found. Run the build before releasing.',
    );
  });

  it('throws when custom-elements.json contains invalid JSON', () => {
    const deps = makeFsDeps({
      existsSync: jest.fn().mockReturnValue(true),
      readFileSync: jest.fn().mockReturnValue('not valid json'),
    });

    expect(() => readLocalCem(PACKAGE_ROOT, deps as any)).toThrow(
      'custom-elements.json exists but contains invalid JSON.',
    );
  });

  it('returns parsed manifest when custom-elements.json is valid', () => {
    const deps = makeFsDeps({
      existsSync: jest.fn().mockReturnValue(true),
      readFileSync: jest.fn().mockReturnValue(JSON.stringify(VALID_CEM)),
    });

    expect(readLocalCem(PACKAGE_ROOT, deps as any)).toEqual(VALID_CEM);
  });
});

describe('printReport', () => {
  let logSpy: jest.SpyInstance;

  const makeResult = (breakingChanges: Record<string, unknown> = {}, featureChanges: Record<string, unknown> = {}) => ({
    changelog: {
      breakingChanges,
      featureChanges,
    },
  });

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it("logs 'no changes detected' message when both change sets are empty", () => {
    printReport(makeResult(), 'alpha');

    expect(logSpy).toHaveBeenCalledWith('No component API changes detected.');
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('vs published alpha'));
  });

  it('logs breaking changes section when present', () => {
    const breakingChanges = { 'my-button': { removed: ['size'] } };

    printReport(makeResult(breakingChanges), 'alpha');

    expect(logSpy).toHaveBeenCalledWith('\n⚠ Breaking changes:');
    expect(logSpy).toHaveBeenCalledWith(JSON.stringify(breakingChanges, null, 2));
  });

  it('logs feature changes section when present', () => {
    const featureChanges = { 'my-button': { added: ['size'] } };

    printReport(makeResult({}, featureChanges), 'alpha');

    expect(logSpy).toHaveBeenCalledWith('\n+ Feature changes:');
    expect(logSpy).toHaveBeenCalledWith(JSON.stringify(featureChanges, null, 2));
  });

  it('logs both breaking and feature changes when present', () => {
    const breakingChanges = { 'my-button': { removed: ['size'] } };
    const featureChanges = { 'my-button': { added: ['size'] } };

    printReport(makeResult(breakingChanges, featureChanges), 'alpha');

    expect(logSpy).toHaveBeenCalledWith('\n⚠ Breaking changes:');
    expect(logSpy).toHaveBeenCalledWith(JSON.stringify(breakingChanges, null, 2));
    expect(logSpy).toHaveBeenCalledWith('\n+ Feature changes:');
    expect(logSpy).toHaveBeenCalledWith(JSON.stringify(featureChanges, null, 2));
  });
});

describe('main', () => {
  let logSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;
  let compareManifestsSpy: jest.SpyInstance;
  let deps: ReturnType<typeof makeFsDeps>;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    compareManifestsSpy = jest.spyOn(CemChangelog.prototype, 'compareManifests');

    deps = makeFsDeps({
      readFileSync: jest
        .fn()
        .mockReturnValueOnce(VALID_PACKAGE_JSON)
        .mockReturnValueOnce(VALID_RELEASE_IT_JSON)
        .mockReturnValueOnce(JSON.stringify(VALID_CEM)),
      existsSync: jest.fn().mockReturnValue(true),
    });
  });

  afterEach(() => {
    logSpy.mockRestore();
    warnSpy.mockRestore();
    compareManifestsSpy.mockRestore();
  });

  it('returns early without calling compareManifests when published CEM is not found', async () => {
    global.fetch = jest.fn().mockResolvedValue({ status: 404, ok: false }) as any;

    await main(PACKAGE_ROOT, deps as any);

    expect(compareManifestsSpy).not.toHaveBeenCalled();
  });

  it('warns and continues when compareManifests throws unexpectedly', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      ok: true,
      json: jest.fn().mockResolvedValue(VALID_CEM),
    }) as any;
    compareManifestsSpy.mockImplementation(() => {
      throw new Error('unexpected');
    });

    await main(PACKAGE_ROOT, deps as any);

    expect(warnSpy).toHaveBeenCalledWith('--- CEM Comparison skipped (comparison failed unexpectedly) ---');
  });
});
