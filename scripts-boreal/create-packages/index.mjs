/* import { execa } from 'execa';
import fs from 'node:fs';
import { title } from 'node:process';
import { CONFIG, createLogger } from './config.mjs';
import path from 'node:path';

const run = async (command, args, cwd) => {
  createLogger('info', `\nRunning command in ${path.basename(cwd)}:`);
  await execa(command, args, { cwd, stdio: 'inherit' });
};

const packTo = async (sourceDir, targetDir) => {
  createLogger('info', `\nPacking from ${path.basename(sourceDir)} to ${path.basename(targetDir)}`,);
  const { stdout } = await execa('npm', ['pack', '--silent'], { cwd: sourceDir });
  const tgzName = stdout.trim();
  const from = path.join(sourceDir, tgzName);
  const to = path.join(targetDir, tgzName);
  if (fs.existsSync(to)) fs.rmSync(to);
  fs.renameSync(from, to);

  createLogger('success', `Packed & Moved to -> ${path.basename(targetDir)}/${tgzName}`);
  return { to, tgzName };
};

const buildWebComponent = async () => {
  createLogger('info', '\nBuilding Web Components Library');
  await run('npm', ['run', 'build'], CONFIG.webcomponents.wrapperRoute);
  createLogger('success', 'Building Web Components Library');
}

const createPackWebComponent = async (framework) => {
  createLogger('info', '\nCreating Pack for Web Components Library');
  const { tgzName } = await packTo(CONFIG.webcomponents.wrapperRoute, CONFIG[framework].wrapperRoute);
  await packTo(CONFIG.webcomponents.wrapperRoute, CONFIG[framework].app);

  createLogger('success', 'Creating Pack for Web Components Library');
  return tgzName;
}

const buildWrapper = async (tgzNameComponent, framework) => {
  createLogger('info', `Uninstall pack ${CONFIG.webcomponents.wrapperName}...`);
  await run('npm', ['uninstall', CONFIG.webcomponents.wrapperName], CONFIG[framework].wrapperRoute);

  createLogger('info', `Install pack ${CONFIG.webcomponents.wrapperName}...`);
  await run('npm', ['install', tgzNameComponent], CONFIG[framework].wrapperRoute);

  createLogger('info', 'Building Wrapper Library...');
  await run('npm', ['run', 'build'], CONFIG[framework].wrapperRoute);

  createLogger('success', 'Building Wrapper Library...');

}

const createPackWrapper = async (framework) => {
  createLogger('info', 'Packing Wrapper');
  const { tgzName: tgzNameWrapper } = await packTo(CONFIG[framework].wrapperRoute, CONFIG[framework].app);

  createLogger('success', 'OK create pack for Wrapper');
  return tgzNameWrapper;
}

const installWrapperApp = async (tgzNameWrapper, framework) => {
  createLogger('info', `Uninstall pack ${CONFIG[framework].wrapperName}...`);
  await run('npm', ['uninstall', CONFIG[framework].wrapperName], CONFIG[framework].app);

  createLogger('info', `Install pack ${CONFIG[framework].wrapperName}...`);
  await run('npm', ['install', tgzNameWrapper], CONFIG[framework].app);

  createLogger('success', 'OK Installed Wrapper in App...');
  createLogger('success', '\n Pipeline completed successfully! Starting Demo App...');
  await run('npm', ['run', 'dev'], CONFIG[framework].app);
}

const TestWebComponents = async () => {
  await run('npm', ['run', 'test'], CONFIG.webcomponents.wrapperRoute);
}

(async () => {
  try {
    const framework = process.argv[2];
    const enviroment = process.argv[3] || 'dev';

    if (!framework || !CONFIG[framework]) {
      createLogger('error', '\n Please provide a valid framework: vue, react, angular \n');
      process.exit(1);
    }

    createLogger('title', `\n Validate Test for Boreal DS Web Components \n`);

    try {
      await TestWebComponents();
      createLogger('success', 'Tests passed successfully');
    } catch (error) {
      createLogger('error', 'Tests failed');
      // throw error;
    }

    createLogger('title', `\n Starting ${enviroment} Pipeline for Boreal DS - ${title} \n`);

    await buildWebComponent();
    const tgzName = await createPackWebComponent(framework);

    await buildWrapper(tgzName, framework)
    const tgzNameWrapper = await createPackWrapper(framework);

    await installWrapperApp(tgzNameWrapper, framework);

  } catch (error) {
    createLogger('error', '\n Pipeline failed. Stopping execution.', error);
    if (error.shortMessage) createLogger('error', error.shortMessage);
    process.exit(1);
  }
})(); */