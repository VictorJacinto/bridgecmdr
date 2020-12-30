
# BridgeCmdr

A/V switch and monitor controller

`TODO: This file needs updating again, Laravel Mix, AppImage, Electron Builder, and no more TSX` 

## NOTICE

BridgeCmdr 2.0 and later will not carry over settings from version 1.0, this is due to the method by which snap package
handle their configuration.  If you wish to keep your settings, you will have to copy your `$HOME/.config/BridgeCmdr`
folder into `$HOME/snap/bridgecmdr/current/.config`.

## License

### BridgeCmdr

Copyright ©2019-2020 Matthew Holder

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.  If not, see
<https://www.gnu.org/licenses/>.

`SPDX-License-Identifier: GPL-3.0-or-later`

## Installation

To install BridgeCmdr on the Raspberry Pi, all you need to use is `snap install bridgecmdr --classic`.  If `snap` is not
installed, install it with `sudo apt install snapd`.

### System Requirements

- Raspberry Pi 3 Model B or better with a running desktop environment.
- Touchscreen or mouse and monitor.
- `snapd`.
- Keyboard during set up.

I've only tested this software on a Raspberry Pi 3 Model B+. In general, I would recommend at minimal a Raspberry Pi 3
Model B or better. Which would include every configuration of the Raspberry Pi 4 Model B. It may run on other models,
but this has not been tested.

You will also need a touchscreen, such as the official Raspberry Pi touchscreen, or a mouse and screen. You will also
need a keyboard while setting up your configuration, but it is not needed during day-to-day use.

You may also need additional USB-to-serial adapters or a serial HAT. Some supported monitors and switches can be
controlled over ethernet. For those you will need an ethernet cable; and if you have more than one such device, an
ethernet hub or switch. See [Wiki](https://github.com/6XGate/bridgecmdr/wiki) for more information on how to connect to
supported monitors and switches.

## Updates

Updates are handled by `snap`, so using `snap refresh` will take care of that process.

## Tools, Frameworks, Libraries, and Assets

BridgeCmdr uses the following libraries and frameworks which are available under their respective license.

| Framework/Library                                                        | License                                                                       |
|--------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| [Electron](https://electronjs.org/)                                      | [MIT](https://github.com/electron/electron/blob/master/LICENSE)               |
| [Vue.js](https://vuejs.org/)                                             | [MIT](https://github.com/vuejs/vue/blob/master/LICENSE)                       |
| [Bulma](https://bulma.io/)                                               | [MIT](https://github.com/jgthms/bulma/blob/master/LICENSE)                    |
| [Buefy](https://buefy.org/)                                              | [MIT](https://github.com/buefy/buefy/blob/dev/LICENSE)                        |
| [PouchDB](https://pouchdb.com/)                                          | [Apache 2.0](https://github.com/pouchdb/pouchdb/blob/master/LICENSE)          |
| [SerialPort](https://serialport.io/)                                     | [MIT](https://github.com/serialport/node-serialport/blob/master/LICENSE)      |
| [VeeValidate](https://logaretm.github.io/vee-validate/)                  | [MIT](https://github.com/logaretm/vee-validate/blob/master/LICENSE)           |
| [Lodash](https://lodash.com/)                                            | [MIT](https://github.com/lodash/lodash/blob/master/LICENSE)                   |
| [Node UUID](https://github.com/kelektiv/node-uuid)                       | [MIT](https://github.com/kelektiv/node-uuid/blob/master/LICENSE.md)           |
| [electron-unhandled](https://github.com/sindresorhus/electron-unhandled) | [MIT](https://github.com/sindresorhus/electron-unhandled/blob/master/license) |
| [vue-tsx-support](https://github.com/wonderful-panda/vue-tsx-support)    | [MIT](https://github.com/wonderful-panda/vue-tsx-support/blob/master/LICENSE) |
| [vue-typed-mixins](https://github.com/ktsn/vue-typed-mixins)             | [MIT](https://github.com/ktsn/vue-typed-mixins/blob/master/LICENSE)           |
| [type-fest](https://github.com/sindresorhus/type-fest)                   | [MIT](https://github.com/sindresorhus/type-fest/blob/master/license)          |

Other dependencies not listed are part of one of the above packages and share the same license.

BridgeCmdr also uses the [Material Design Icons](https://dev.materialdesignicons.com/) font and SVG graphics which are
licensed under the [SIL Open Font License](https://github.com/Templarian/MaterialDesign/blob/master/LICENSE) v1.0.

Finally, the following tools or libraries were used to build BridgeCmdr.

- [cross-env](https://github.com/kentcdodds/cross-env).
- [read-package-json](https://github.com/npm/read-package-json).
- [TypeScript](https://www.typescriptlang.org/).
- [ESLint](https://eslint.org/) with the following third-party plug-ins;
    - [ESLint Import Plug-in](https://github.com/benmosher/eslint-plugin-import),
    - [ESLint Promise Plug-in](https://github.com/xjamundx/eslint-plugin-promise),
    - [ESLint Node Plug-in](https://github.com/mysticatea/eslint-plugin-node),
- [WebPack](https://webpack.js.org/) with the following third-party plug-ins;
    - [Babel Loader](https://github.com/babel/babel-loader),
    - [TypeScript Loader](https://github.com/TypeStrong/ts-loader),
    - [Resolve URL Loader](https://github.com/bholloway/resolve-url-loader),
    - [Node Externals](https://github.com/liady/webpack-node-externals),
    - [HTML WebPack Plug-in](https://github.com/jantimon/html-webpack-plugin),
    - [Dart Sass](https://sass-lang.com/dart-sass) with the following third-party plug-ins;
        - [Node Fibers](https://github.com/laverdet/node-fibers)
- [Electron Builder](https://www.electron.build/).
- [PHPStorm](https://www.jetbrains.com/phpstorm/) yet no PHP code was harmed in the making of this software.

Other tools or licenses not listed are part of one of the above packages.

## Building

### Development

If you want to help with the development of BridgeCmdr, downloading, building, then running the project on a GNU/Linux
based operating system is required. The following steps will get you set up on a Debian-base operating system.

1. QEmu: `sudo apt install qemu-user-static`
2. Docker: `sudo apt install docker.io`
3. ARM support in Docker: `docker run --rm --privileged multiarch/qemu-user-static:register`

1. Install the `build-essential` package; `sudo apt install build-essential -y`
2. Acquire the source:
    - **Preferred**, Fork the [GitHub repository](https://github.com/6XGate/bridgecmdr), you may then issue pull
      requests back to the official source code. Also start personal branches from `develop`.
    - Download the [source](https://github.com/6XGate/bridgecmdr/archive/develop.zip) and extract it.
3. Open a terminal clone and go to the folder into which source was cloned or extracted.
4. Install the node packages; `npm ci`
5. Build the user interface source; `npm run prod` or `npm run dev`

You should now be able to run the program with `npm run start`.

### Creating the Installer

To package or build the installer, you will need to follow the above steps to acquire a working copy of the source
code on a Raspberry Pi running Raspbian/Raspberry Pi OS, the only supported operating system.  Packaging the installer
requires a Raspberry Pi 4 Model B with 2 GiB or more of RAM.

1. Install the node packages; `npm ci`
2. Build the installer package; `npm run dist`

#### The Package

You should now have a snap package `.snap` in the `dist` folder. This package can be installed with `snap` on
the Raspberry Pi.  `snap install <package path> --classic --dangerous`.
