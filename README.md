# resources.co - a web console

[![pipeline status](https://gitlab.com/ResourcesCo/resources/badges/develop/pipeline.svg)](https://gitlab.com/ResourcesCo/resources/-/pipelines)

![brief screencast](https://gh-media.resources.co/resourcesco-butterfly-demo-2.gif)

## web app

It's a Next.js web app. Run `npm run dev` to run the development server or
`npm run build` to build it.

## desktop app

To build and run the desktop app:

```bash
npm run desktop:start
```

This runs builds in the repository root (`./`) and in `./packages/desktop`.
To understand how it works, see the scripts in `package.json` of both the
Next.js app (in `./`) and the desktop app (in `./packages/desktop`).

To package the desktop app into a `.app` inside a `.zip` for OS X
(requires `APPLE_ID`, `APPLE_ID_PASSWORD` `CSC_LINK`, and `CSC_KEY_PASSWORD`
to be defined for it to be signed for distribution):

```bash
npm run desktop:make
```

## building and publishing libraries

Install [npm-check-updates][ncu]:

```bash
npm i -g npm-check-updates
```

### vtv-model

First, update the version number in `packages/vtv-model/package.json`

```bash
nx build vtv-model
cd dist/packages/vtv-model
npm publish
```

### vtv

First, update the version number in `packages/vtv/package.json`

```bash
cd packages/vtv
ncu -u vtv-model
cd ../..
npm run vtv:build
cd dist/packages/vtv
npm publish
```

[ncu]: https://www.npmjs.com/package/npm-check-updates