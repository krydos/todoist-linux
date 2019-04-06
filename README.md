# Todoist Linux

This app is just an [Electron wrapper](https://electronjs.org/) for Todoist's [web version](https://todoist.com/app).

This app works with both Windows and Linux.

# Installation

1. Go to [Releases](https://github.com/KryDos/todoist-linux/releases) page and get the RPM/DEB/EXE package.

2. Most of the time, a simple double-click on the downloaded package should start it's installation (use commands otherwise).

Alternatively, You can also download the `todoist-linux.zip` package that can run on any linux distro.

## Keyboard Shortcuts

* Ctrl+Alt+A - Quickly add a Task
* Ctrl+Alt+Q - Show or Hide Todoist window
* Ctrl+Alt+R - Refresh Todoist window content
* Alt+F4     - Quit Todoist
* F11        - Toggle Full-screen view

* Any other possible shortcuts are available and usable directly from within the app itself.

Global shortcuts are configurable via `$XDG_CONFIG_HOME/.todoist-linux.json` file (which is `~/.config` by default).
The file is simple JSON with descriptive keys and values that represents shortcuts and their keybindings.

Use [this page from Electron docs](https://electronjs.org/docs/api/accelerator#available-modifiers) to get a better understanding of what other modifiers (keys) exist that you can use.

## Why?

The main reason I don't like having the [Todoist web version](https://todoist.com/app) opened is that I can't easily ALT+TAB to it.

And I also really wanted to have global keyboard shortcuts so I can quickly add a task to Todoist.

The initial inspiration I took from [this](https://github.com/kamhix/todoist-linux) brilliant project of the same web version. Unfortunately, it doesn't seem to be maintained anymore and has some issues with Tray functionality on latest Ubuntu.

## Build Instructions

The build process is very simple:

1. Clone the repo using `$ git clone https://github.com/krydos/todoist-linux`.

2. Install project dependencies by running `$ make env` in project root directory.

3.  Now, to run the app, you can do `$ make up` in the project root directory (or `$ npm run start` in the `src` directory).

### Building Packages

After making your changes, you can simply use any of the below commands to build 64-bit distribution packages.

1. Run `$ make build-rpm` to build `.rpm` packages (for Fedora/CentOS/RHEL/SuSE).
2. Run `$ make build-deb` to build `.deb` packages (for Debian/Ubuntu and derivatives).
3. Run `$ make build-win` to build Windows `.exe` files.
4. Run `$ make build-linux` to build both `.DEB` and `.RPM` packages.
5. Run `$ make build-all` to build packages for both Windows and Linux (basically all the above).

# Contributing

No rules for contributing. Just send a pull request :)
