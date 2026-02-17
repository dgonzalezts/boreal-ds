import { readFileSync as fsReadFileSync, existsSync as fsExistsSync } from 'fs';
import { resolve } from 'path';
import { CemChangelog } from '@wc-toolkit/changelog';

interface Config {
  packageName: string;
  distTag: string;
}

interface ReleaseItConfig {
  npm?: { tag?: string };
}

interface ChangelogResult {
  changelog: {
    breakingChanges: Record<string, unknown>;
    featureChanges: Record<string, unknown>;
  };
}

export interface FsDeps {
  readFileSync: (path: string, encoding: BufferEncoding) => string;
  existsSync: (path: string) => boolean;
}

const defaultFsDeps: FsDeps = {
  readFileSync: fsReadFileSync,
  existsSync: fsExistsSync,
};

export function readConfig(packageRoot: string, deps: FsDeps = defaultFsDeps): Config {
  const pkgPath = resolve(packageRoot, 'package.json');
  const releaseItPath = resolve(packageRoot, '.release-it.json');
  const { readFileSync } = deps;

  let packageName: string;
  let releaseItConfig: ReleaseItConfig;

  try {
    ({ name: packageName } = JSON.parse(readFileSync(pkgPath, 'utf-8')) as { name: string });
  } catch {
    throw new Error(`Failed to read package.json at ${pkgPath}`);
  }

  try {
    releaseItConfig = JSON.parse(readFileSync(releaseItPath, 'utf-8')) as ReleaseItConfig;
  } catch {
    throw new Error(`Failed to read .release-it.json at ${releaseItPath}`);
  }

  return {
    packageName,
    distTag: releaseItConfig.npm?.tag ?? 'latest',
  };
}

export async function fetchPublishedCem(packageName: string, distTag: string): Promise<unknown | null> {
  const url = `https://unpkg.com/${packageName}@${distTag}/custom-elements.json`;

  try {
    const response = await fetch(url);

    if (response.status === 404) {
      console.log('--- CEM Comparison skipped (no prior published CEM) ---');
      return null;
    }

    if (!response.ok) {
      console.warn(`--- CEM Comparison skipped (unpkg responded with ${response.status}) ---`);
      return null;
    }

    return await response.json();
  } catch {
    console.warn('--- CEM Comparison skipped (network error fetching published CEM) ---');
    return null;
  }
}

export function readLocalCem(packageRoot: string, deps: FsDeps = defaultFsDeps): unknown {
  const localCemPath = resolve(packageRoot, 'custom-elements.json');
  const { readFileSync, existsSync } = deps;

  if (!existsSync(localCemPath)) {
    throw new Error('custom-elements.json not found. Run the build before releasing.');
  }

  try {
    return JSON.parse(readFileSync(localCemPath, 'utf-8'));
  } catch {
    throw new Error('custom-elements.json exists but contains invalid JSON.');
  }
}

export function printReport(result: ChangelogResult, publishedVersion: string): void {
  const { breakingChanges, featureChanges } = result.changelog;
  const hasBreaking = Object.keys(breakingChanges).length > 0;
  const hasFeatures = Object.keys(featureChanges).length > 0;

  console.log(`\n--- CEM Comparison Report (vs published ${publishedVersion}) ---`);

  if (!hasBreaking && !hasFeatures) {
    console.log('No component API changes detected.');
  } else {
    if (hasBreaking) {
      console.log('\n⚠ Breaking changes:');
      console.log(JSON.stringify(breakingChanges, null, 2));
    }
    if (hasFeatures) {
      console.log('\n+ Feature changes:');
      console.log(JSON.stringify(featureChanges, null, 2));
    }
  }

  console.log('--- End of CEM Report ---\n');
}

export async function main(packageRoot?: string, deps: FsDeps = defaultFsDeps): Promise<void> {
  const root = packageRoot ?? process.cwd();
  const { packageName, distTag } = readConfig(root, deps);
  const localManifest = readLocalCem(root, deps);
  const publishedManifest = await fetchPublishedCem(packageName, distTag);

  if (publishedManifest === null) {
    return;
  }

  try {
    const result = new CemChangelog({}).compareManifests(
      publishedManifest,
      localManifest,
    ) as ChangelogResult;

    printReport(result, distTag);
  } catch {
    console.warn('--- CEM Comparison skipped (comparison failed unexpectedly) ---');
  }
}

if (process.env['JEST_WORKER_ID'] === undefined) {
  main().catch((err: Error) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  });
}
