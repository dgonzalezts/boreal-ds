import { title } from 'node:process';
import { CONFIG } from '../lib/conf.mjs';
import { Logger } from '../lib/logger.mjs';;
import { Cmd } from '../lib/cmd.mjs';
import { ensureNodeModules, installPack } from '../lib/install.mjs';

const run = Cmd.run;
const packTo = Cmd.packTo;

/**
 * Build the web components package.
 * @returns {Promise<void>}
 */
const buildWebComponent = async () => {
  Logger.log('info', '\nBuilding Web Components Library');
  await ensureNodeModules(CONFIG.webcomponents.wrapperRoute);
  await run('npm', ['run', 'build'], CONFIG.webcomponents.wrapperRoute);
  Logger.log('success', 'Building Web Components Library');
}

/**
 * Create a tgz pack for web components and copy it to wrapper/app.
 * @param {'vue'|'react'|'angular'} framework
 * @returns {Promise<string>}
 */
const createPackWebComponent = async (framework) => {
  Logger.log('info', '\nCreating Pack for Web Components Library');
  const { tgzName } = await packTo(CONFIG.webcomponents.wrapperRoute, CONFIG[framework].wrapperRoute);
  await packTo(CONFIG.webcomponents.wrapperRoute, CONFIG[framework].app);

  Logger.log('success', 'Creating Pack for Web Components Library');
  return tgzName;
}

/**
 * Install web components pack and build the framework wrapper.
 * @param {string} tgzNameComponent
 * @param {'vue'|'react'|'angular'} framework
 * @returns {Promise<void>}
 */
const buildWrapper = async (tgzNameComponent, framework) => {
  await installPack(
    CONFIG[framework].wrapperRoute,
    tgzNameComponent,
    CONFIG.webcomponents.wrapperName
  );

  Logger.log('info', 'Building Wrapper Library...');
  await run('npm', ['run', 'build'], CONFIG[framework].wrapperRoute);

  Logger.log('success', 'Building Wrapper Library...');

}

/**
 * Create a tgz pack for the framework wrapper and move it to the demo app.
 * @param {'vue'|'react'|'angular'} framework
 * @returns {Promise<string>}
 */
const createPackWrapper = async (framework) => {
  Logger.log('info', 'Packing Wrapper');
  const { tgzName: tgzNameWrapper } = await packTo(CONFIG[framework].wrapperRoute, CONFIG[framework].app);

  Logger.log('success', 'OK create pack for Wrapper');
  return tgzNameWrapper;
}

/**
 * Install the wrapper pack in the demo app and run dev.
 * @param {string} tgzNameWrapper
 * @param {'vue'|'react'|'angular'} framework
 * @returns {Promise<void>}
 */
const installWrapperApp = async (tgzNameWrapper, framework) => {
  await installPack(
    CONFIG[framework].app,
    tgzNameWrapper,
    CONFIG[framework].wrapperName
  );

  Logger.log('success', 'OK Installed Wrapper in App...');
  Logger.log('success', '\n Pipeline completed successfully! Starting Demo App...');
  await run('npm', ['run', 'dev'], CONFIG[framework].app);
}

/**
 * Run tests for the web components package.
 * @returns {Promise<void>}
 */
const TestWebComponents = async () => {
  console.log('Testing Web Components Library...', CONFIG.webcomponents.wrapperRoute);
  await ensureNodeModules(CONFIG.webcomponents.wrapperRoute);
  await run('npm', ['run', 'test'], CONFIG.webcomponents.wrapperRoute);
}

(async () => {
  try {
    const framework = process.argv[2];
    const enviroment = process.argv[3] || 'dev';

    if (!framework || !CONFIG[framework]) {
      Logger.log('error', '\n Please provide a valid framework: vue, react, angular \n');
      process.exit(1);
    }

    Logger.log('title', `\n Validate Test for Boreal DS Web Components \n`);

    try {
      await TestWebComponents();
      Logger.log('success', 'Tests passed successfully');
    } catch (error) {
      Logger.log('error', 'Tests failed');
      throw error;
    }

    Logger.log('title', `\n Starting ${enviroment} Pipeline for Boreal DS - ${title} \n`);

    await buildWebComponent();
    const tgzName = await createPackWebComponent(framework);

    await buildWrapper(tgzName, framework)
    const tgzNameWrapper = await createPackWrapper(framework);

    await installWrapperApp(tgzNameWrapper, framework);

  } catch (error) {
    Logger.log('error', '\n Pipeline failed. Stopping execution.', error);
    if (error.shortMessage) Logger.log('error', error.shortMessage);
    process.exit(1);
  }
})();
