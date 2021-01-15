<h1 align="center">
  <img width="500px" src="assets/readme-banner.png">

  ![AUR Version][aur] ![GitHub top language][gtl] ![License][l]
</h1>

[aur]: https://img.shields.io/aur/version/todoist-electron
[gtl]: https://img.shields.io/github/languages/top/KryDos/todoist-linux
[l]: https://img.shields.io/github/license/KryDos/todoist-linux

<h5 align="center"> This app is just an <a href="https://electronjs.org/">Electron wrapper</a> for Todoist's <a href="https://todoist.com/app">web version</a>.

This app works with both Windows and Linux.

</h5>

## Project is Archived

I don't have time to support it anymore plus Todoist guys released an official Linux App. Feel free to fork the repo or contact me for any questions.

**Thanks to all the contributors who helped me to support this app. Love you!**

## Link to Official Linux app

Doist recently released the official app as a snap package. [Visit this page to install the Official Todoist app](https://snapcraft.io/todoist).

## Installation

### Arch Linux

The package is available in AUR. You can install it with:

```sh
trizen -S todoist-electron
```

Thanks to [@HadiLatifi](https://github.com/HadiLatifi) for help with the AUR package.

### Gentoo Linux

To emerge ebuild in first you should add [this](https://github.com/wellWINeo/wellWINeo_overlay) overlay to `repos.conf`, sync and after it you'll be able to do it.

P.S. The original version of the ebuild was taken from [here](https://gitlab.einfach.org/r900/r900-overlay/-/tree/master/net-im%2Ftodoist-bin), but unfortunately, it's for the old version and I've modified it a bit for the newer version.

**NOTE:** For security issues, I recommend you mask all packages (`*/*::<overlay_name>`) and unmask only `net-im/todoist-bin`.

### Other systems

1. Go to [Releases](https://github.com/KryDos/todoist-linux/releases) page and get the RPM/DEB/EXE package.

2. Most of the time, a simple double-click on the downloaded package should start its installation (use shell commands otherwise).

Alternatively, you can also download the `todoist-linux.zip` package from [Releases page](https://github.com/KryDos/todoist-linux/releases) that can run on any Linux distro.

## Keyboard Shortcuts

- <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>A</kbd> - Quickly add a Task
- <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>Q</kbd> - Show or Hide Todoist window
- <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>R</kbd> - Refresh Todoist window content
- <kbd>Alt</kbd> + <kbd>F4</kbd> - Quit Todoist
- <kbd>F11</kbd> - Toggle Full-screen view

- Any other possible shortcuts are available and usable directly from within the app itself.

Global shortcuts are configurable via `$XDG_CONFIG_HOME/.todoist-linux.json` file (which is located in `~/.config` by default).
The file is simple JSON with descriptive keys and values that represents shortcuts and their keybindings.

Use [this page from Electron docs](https://electronjs.org/docs/api/accelerator#available-modifiers) to get a better understanding of what other modifiers (keys) exist that you can use.

## Additional Configuration

Same config file `.todoist-linux.json` has other options to configure the app:

- `tray-icon` - tray icon to use. Possible options: `icon.png`, `icon_monochrome.png`, `null` (to hide tray icon completely)
- `minimize-to-tray` - default is `true`. When window is minimized it goes to the tray.
- `close-to-tray` - default is `true`. When window is closed the app is minimized to the tray.
- `start-in-tray` - default is `false`. App is started in tray.

## Why?

The main reason I don't like having the [Todoist web version](https://todoist.com/app) opened is that I can't easily <kbd>Alt</kbd> + <kbd>Tab</kbd> to it.

And I also really wanted to have global keyboard shortcuts, so I can quickly add a task to Todoist.

The initial inspiration I took from [this](https://github.com/kamhix/todoist-linux) brilliant project of the same web version. Unfortunately, it doesn't seem to be maintained anymore and has some issues with Tray functionality on latest Ubuntu.

## Build Instructions

The build process is simple:

1. Clone the repo using:

    ```sh
    git clone https://github.com/krydos/todoist-linux
    ```

2. Ensure NPM is installed with:

    ```sh
    sudo apt-get install npm
    ```

3. Install other project dependencies by running the following command in the project root directory:

    ```sh
    make env
    ```

4. Now, to run the app, you can run the following command in the project root directory (or `npm run start` in the `src` directory).

    ```sh
    make up
    ```

### Building Packages

After making your changes, you can simply use any of the below commands to build 64-bit distribution packages.

```sh
make build-rpm # builds RPM packages for Fedora/CentOS/RHEL/SuSE
make build-deb # builds Debian packages for Debian/Ubuntu
make build-pacman # builds PACMAN packages for Arch/Manjaro
make build-win # builds Windows EXE
make build-linux # builds both Debian and RPM packages
make build-all # builds all packages
```

## Contributing

No rules for contributing. Just send a pull request. :)
