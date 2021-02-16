# Redwood

> **WARNING:** RedwoodJS software has not reached a stable version 1.0 and should not be considered suitable for production use. In the "make it work; make it right; make it fast" paradigm, Redwood is in the later stages of the "make it work" phase.

## Getting Started
- [Tutorial](https://redwoodjs.com/tutorial/welcome-to-redwood): getting started and complete overview guide.
- [Docs](https://redwoodjs.com/docs/introduction): using the Redwood Router, handling assets and files, list of command-line tools, and more.
- [Redwood Community](https://community.redwoodjs.com): get help, share tips and tricks, and collaborate on everything about RedwoodJS.

### Setup

We use Yarn as our package manager. To get the dependencies installed, just do this in the root directory:

```terminal
yarn install
```

### Fire it up

```terminal
yarn redwood dev
```

Your browser should open automatically to `http://localhost:8910` to see the web app. Lambda functions run on `http://localhost:8911` and are also proxied to `http://localhost:8910/.redwood/functions/*`.

# App

## Home

List of cards representing projects, with some preloaded. They can have things nested underneath them.
Each project will have some permissions associated with it, that can also be tied to a user.

### Creating a new project

A type of page can be selected, and before creating it, it can ask for options. Pages can have subpages.
Parent pages have some control over subpages.

An early one would be a file editor. It would have access to storage. The storage can be on
the filesystem, in the case of a serverful environment. Or, on a serverless environment, it can
be in the database or on a cloud storage provider. It would be given a root. It could be a local
working copy of a repository, and it could be given only access to files that haven't been
.gitignore'd. These could be in a separate app.

- a modal with forms
- use dark/light mode of the system by default, but customizable
- by default don't override the system's accent colors
- use CodeMirror 6 for good mobile support, but make it configurable to use others like Monaco Editor
- use code splitting - have things load up instantly
