# resources.co - a web console

![brief screencast](https://gh-media.resources.co/resourcesco-butterfly-demo-2.gif)

## web app

It's a Next.js web app. Run `yarn dev` to run the development server or
`yarn build` to build it.

## desktop app

To build and run the desktop app:

```bash
cd packages/desktop
yarn install
yarn start
```

To package the desktop app into a `.app` inside a `.zip` for OS X (requires `APPLE_ID`, `APPLE_ID_PASSWORD` `CSC_LINK`, and `CSC_KEY_PASSWORD` to be defined for it to be signed for distribution):

```bash
cd packages/desktop
yarn make
```
