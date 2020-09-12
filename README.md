# resources.co - a web console

[![pipeline status](https://gitlab.com/ResourcesCo/resources/badges/develop/pipeline.svg)](https://gitlab.com/ResourcesCo/resources/-/pipelines)

![brief screencast](https://gh-media.resources.co/resourcesco-butterfly-demo-2.gif)

## web app

It's a Next.js web app. Run `yarn dev` to run the development server or
`yarn build` to build it.

## desktop app

To build and run the desktop app:

```bash
yarn desktop:start
```

This runs builds in the repository root (`./`) and in `./packages/desktop`.
To understand how it works, see the scripts in `package.json` of both the
Next.js app (in `./`) and the desktop app (in `./packages/desktop`).

To package the desktop app into a `.app` inside a `.zip` for OS X
(requires `APPLE_ID`, `APPLE_ID_PASSWORD` `CSC_LINK`, and `CSC_KEY_PASSWORD`
to be defined for it to be signed for distribution):

```bash
yarn desktop:make
```
