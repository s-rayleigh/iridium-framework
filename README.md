# Iridium Framework
Iridium Framework is a modular frontent toolset for creating web applications.
Currently in development stage.
## Modules
* core - Contains basic functions.
* net - Ajax.
* builder - Creating HTML elements from javascript code.
* svg - Work with SVG.
* touchable

Other modules are in development.
## Build from sources
1. Make sure you have installed:
	* `nodejs`
	* `npm`
	* `gulp`
	* `git`
2. Clone [repository] with `git`:
```sh
$ git clone https://github.com/s-rayleigh/iridium-framework.git
$ cd iridium-framework
```
[repository]: https://github.com/s-rayleigh/iridium-framework
3. Choose required modules in the file `config.json`.
4. Build iridium-framework with `gulp`:
```sh
$ gulp build
```
Built version will be in `dist` directory.
Directory `dist/modules` contains separate module files for including into the page.
## Examples
Examples of using project are in `examples` directory. Every html file in that directory demonstrate work of appropriate module.

## Copyright and license
Copyright 2017 Vladislav Pashaiev.

Code of the Iridium Framework project distributed under the terms of LGPL-3.0 license.

See [COPYING](COPYING) and [COPYING.LESSER](COPYING.LESSER) for details.