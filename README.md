# resources.co - a web console

TODO: write intro

![brief screencast](https://gh-media.resources.co/resourcesco-butterfly-demo-2.gif)

## web app

It's a Next.js web app. Run `yarn dev` to run the development server or
`yarn build` to build it.

## building the desktop app

To build the desktop app, copy `packages/desktop` so it is a **sibling** of the
directory containing this repo, and run `yarn build` inside of there. Otherwise
the `node_modules` folders will conflict with each other.