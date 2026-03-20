# Changelog

## [0.1.0-alpha.4](https://bitbucket.c11.telesign.com/7999/dev/boreal-ds/compare/@telesign/boreal-react@0.1.0-alpha.3...@telesign/boreal-react@0.1.0-alpha.4) (2026-03-18)

### Features

* **web-components:** Added basic structure for button component ([97271ce](https://bitbucket.c11.telesign.com/7999/dev/boreal-ds/commit/97271ce738b4925426529e8ef93c5597cebf1a8b))
* **web-components:** Added default variatn with primary, default and error styles ([bb1fb98](https://bitbucket.c11.telesign.com/7999/dev/boreal-ds/commit/bb1fb989bcb60a98d2176e66608091a63a3dddca))
* **web-components:** Added icon slot, badge slot, disclosure and loading state ([40789c2](https://bitbucket.c11.telesign.com/7999/dev/boreal-ds/commit/40789c2426cccddc9eea341dc581e2afcb9e45d9))
* **web-components:** Added styles, form internal, click events logic ([5b36305](https://bitbucket.c11.telesign.com/7999/dev/boreal-ds/commit/5b3630525900cce6f27ff574af3dc713919dd780))
* **web-components:** Added styling for all variants, sizes and colors ([80825de](https://bitbucket.c11.telesign.com/7999/dev/boreal-ds/commit/80825de7c285ec0b8ecad06998994590ae6b173d))
* **web-components:** Fix basic test and solve accidentally changed file ([e8dd1c8](https://bitbucket.c11.telesign.com/7999/dev/boreal-ds/commit/e8dd1c85507c2fadb44704064723b0033bf0dded))

### Bug Fixes

* **react:** update type definitions and exports ([ee52ee5](https://bitbucket.c11.telesign.com/7999/dev/boreal-ds/commit/ee52ee563582028df2ef39c9eadcf6928f282a24))
* **web-components:** update component exports to include types on build ([57682f0](https://bitbucket.c11.telesign.com/7999/dev/boreal-ds/commit/57682f0377674d97d72823d92227fecdf974f419))
* **web-components:** update styling and type import in 'bds-button' component ([de58265](https://bitbucket.c11.telesign.com/7999/dev/boreal-ds/commit/de582652e825f4d6f3a4ffb8d0bca2b4c38242e9))

### Reverts

* **web-components:** Deleted additional files to config ([616b0fd](https://bitbucket.c11.telesign.com/7999/dev/boreal-ds/commit/616b0fdb750f8d3a9b75005b68ab4d46771a6672))

## [0.1.0-alpha.3](https://bitbucket.c11.telesign.com/7999/dev/boreal-ds/compare/@telesign/boreal-react@0.1.0-alpha.2...@telesign/boreal-react@0.1.0-alpha.3) (2026-03-16)

### Features

* **docs:** add chromatic for storybook publishing ([67c25d1](https://bitbucket.c11.telesign.com/7999/dev/boreal-ds/commit/67c25d1c3204ef3b4dcb1e8223e6b2f438946d3d))
* **docs:** add chromatic project token to .env.example and update .gitignore ([775055b](https://bitbucket.c11.telesign.com/7999/dev/boreal-ds/commit/775055bde8f1ca8df5cf9fe495514b12a2f5e9f6))
* **docs:** add release and publish instructions for storybook deployment ([f8081f3](https://bitbucket.c11.telesign.com/7999/dev/boreal-ds/commit/f8081f349460567b032946721b38db112ebb37b6))
* **docs:** update README with deployment instructions for chromatic ([8a3972c](https://bitbucket.c11.telesign.com/7999/dev/boreal-ds/commit/8a3972cf5c528851dfb395671e46ec2cbf65d717))
* **react:** add README for React wrapper integration ([8aef765](https://bitbucket.c11.telesign.com/7999/dev/boreal-ds/commit/8aef765e48469574678c068d93071cd08aaa8146))
* **vue:** add README for Vue wrapper integration ([ddf076b](https://bitbucket.c11.telesign.com/7999/dev/boreal-ds/commit/ddf076b1604aa79e7f425ba445eee9fc3ec2cbee))
* **vue:** initialize vue test app for testing wrapper ([214d4a7](https://bitbucket.c11.telesign.com/7999/dev/boreal-ds/commit/214d4a79aefcb32091baa19363192fd356d40710))
* **web-components:** add README for web components package ([481f813](https://bitbucket.c11.telesign.com/7999/dev/boreal-ds/commit/481f81361389edb291aec5ab7e7a83e075bab37e))
* **workspace:** add 'storybook-static' to build outputs ([6effbf5](https://bitbucket.c11.telesign.com/7999/dev/boreal-ds/commit/6effbf5454988224e42d3bb160ad8ae355d54646))
* **workspace:** add docs deployment script ([178d360](https://bitbucket.c11.telesign.com/7999/dev/boreal-ds/commit/178d360bc00538fe80d992899b296010f81d539d))
* **workspace:** add vue wrapper scripts at root package.json file ([be53c70](https://bitbucket.c11.telesign.com/7999/dev/boreal-ds/commit/be53c70b926dc63a246531f64eeecde35b0809ac))
* **workspace:** update 'deploy:docs' script to read chromatic env variable ([327fb77](https://bitbucket.c11.telesign.com/7999/dev/boreal-ds/commit/327fb77afbab920d3c737f5364730268c7c33b5b))

### Bug Fixes

* **scripts:** vue wrapper app path ([319ec35](https://bitbucket.c11.telesign.com/7999/dev/boreal-ds/commit/319ec35a7349c8447af8fea2b018471c411188c3))
* **vue:** dependency allocation for the vue output target ([e3e726b](https://bitbucket.c11.telesign.com/7999/dev/boreal-ds/commit/e3e726b0fbee1a3cf628cae9b9a4ddb0444bf71b))

## [0.1.0-alpha.2](https://bitbucket.c11.telesign.com/7999/dev/boreal-ds/compare/@telesign/boreal-react@0.1.0-alpha.1...@telesign/boreal-react@0.1.0-alpha.2) (2026-03-11)

### Bug Fixes

* **release:** use publishPackageManager pnpm to replace workspace protocol ([b0d47e0](https://bitbucket.c11.telesign.com/7999/dev/boreal-ds/commit/b0d47e04e6df8809361c4d73ac3251b7c130b374))

## [0.1.0-alpha.1](https://bitbucket.c11.telesign.com/7999/dev/boreal-ds/compare/@telesign/boreal-react@0.1.0-alpha.0...@telesign/boreal-react@0.1.0-alpha.1) (2026-03-10)

### Bug Fixes

* **release:** use pnpm publish to replace workspace protocol in wrappers ([1876e84](https://bitbucket.c11.telesign.com/7999/dev/boreal-ds/commit/1876e843249a8e331188ade1cc3f3b001bb27b87))

All notable changes to `@telesign/boreal-react` are documented in this file.

## 0.1.0-alpha.0 (2026-03-10)

First alpha release. React output-target wrapper generated from `@telesign/boreal-web-components` via `@stencil/react-output-target`.
