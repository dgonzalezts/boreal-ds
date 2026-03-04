import { CONFIG } from '../lib/conf.js';
import { Logger } from '../lib/logger.js';
import { Cmd } from '../lib/cmd.js';
import { installPack } from '../lib/install.js';

const run = Cmd.run;
const packTo = Cmd.packTo;

/**
 * Create a tgz pack for web components and copy it to wrapper/app.
 * @param {'vue'|'react'|'angular'} framework
 * @returns {Promise<string>}
 */
const createPackWebComponent = async framework => {
  Logger.log('info', '\nCreating Pack for Web Components Library');
  const { tgzName } = await packTo(
    CONFIG.webcomponents.wrapperRoute,
    CONFIG[framework].wrapperRoute
  );
  await packTo(CONFIG.webcomponents.wrapperRoute, CONFIG[framework].app);

  Logger.log('success', 'Creating Pack for Web Components Library');
  return tgzName;
};

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
  await run('pnpm', ['build'], CONFIG[framework].wrapperRoute);

  Logger.log('success', 'Building Wrapper Library...');
};

/**
 * Create a tgz pack for the framework wrapper and move it to the demo app.
 * @param {'vue'|'react'|'angular'} framework
 * @returns {Promise<string>}
 */
const createPackWrapper = async framework => {
  Logger.log('info', 'Packing Wrapper');
  const { tgzName: tgzNameWrapper } = await packTo(
    CONFIG[framework].wrapperRoute,
    CONFIG[framework].app
  );

  Logger.log('success', 'OK create pack for Wrapper');
  return tgzNameWrapper;
};

/**
 * Install the wrapper pack in the demo app and run dev or build depending on mode.
 * @param {string} tgzNameWrapper
 * @param {'vue'|'react'|'angular'} framework
 * @param {boolean} isCi
 * @returns {Promise<void>}
 */
const installWrapperApp = async (tgzNameWrapper, framework, isCi) => {
  await installPack(CONFIG[framework].app, tgzNameWrapper, CONFIG[framework].wrapperName);

  Logger.log('success', 'Installed wrapper in app');

  if (isCi) {
    Logger.log('info', 'Running build validation...');
    await run('pnpm', ['build'], CONFIG[framework].app);
    Logger.log('success', 'Pipeline completed successfully — artifact validation passed');
  } else {
    Logger.log('success', 'Pipeline completed successfully — starting demo app...');
    await run('pnpm', ['dev'], CONFIG[framework].app);
  }
};

(async () => {
  try {
    const framework = process.argv[2];
    const isCi = process.argv.includes('--ci');

    if (!framework || !CONFIG[framework]) {
      Logger.log('error', '\n Please provide a valid framework: vue, react, angular \n');
      process.exit(1);
    }

    Logger.log('title', `\n Validate Pack for Boreal DS Web Components \n`);

    const tgzName = await createPackWebComponent(framework);

    await buildWrapper(tgzName, framework);
    const tgzNameWrapper = await createPackWrapper(framework);

    await installWrapperApp(tgzNameWrapper, framework, isCi);
  } catch (error) {
    Logger.log('error', '\n Pipeline failed. Stopping execution.', error);
    if (error.shortMessage) Logger.log('error', error.shortMessage);
    process.exit(1);
  }
})();
