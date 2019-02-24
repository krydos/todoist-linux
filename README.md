Todoist Linux
=============

The app is just an Electron wrapper on Todoist's web version.

Installation
------------

Go to [Releases](https://github.com/KryDos/todoist-linux/releases) page and get RPM/DEB/EXE file.

You can also download a package `todoist-linux.zip` that can be run on any linux distro.


Shortcuts
---------

* Ctrl+Alt+A - quick add a task
* Ctrl+Alt+Q - show or hide the app window
* Ctrl+Alt+R - refresh content on the page
* Alt+F4     - quit the app without hidding it to Tray
* F11        - toggle full screen mode
* All other Todoist's shortcuts exists from inside the app window

Global shortcuts are configurable via `$XDG_CONFIG_HOME/.todoist-linux.json` file (which is `~/.config` by default).
The file is simple JSON with descriptive keys and values that represends shortcuts.
Use this [page from Electron docs](https://electronjs.org/docs/api/accelerator#available-modifiers) to get more understanding on possible modifiers (keys) you can use.

Why???
-------
The main reason is I don't like to have web version opened since I can't easily ALT+TAB to it.

And I also really wanted to have global shortcuts to quick add a task.

The initial inspiration I got from [this](https://github.com/kamhix/todoist-linux) brilliant package of the same web version.
Unfortunately it doesn't seem maintained at the moment and has some issues with Tray functionality on latest Ubuntu.

Contribute/Build
----------------

The build process is very simple:

* run `npm install` in root folder
* run `npm install` in `src` folder

That's all. Now to run the app you can use `make up` command (in root folder) or `npm start` (in `src` directory).

There is also `make build-all` target. Check it out if you're interesting in building DEB or RPM package.

No rules for contributing. Just sent a pull request.
