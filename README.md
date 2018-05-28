# Iridium Framework
Iridium Framework is a modular open source toolset for creating web applications.

Currently in development stage.
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
3. Choose required modules in the file [config.js](config.js).
4. Build iridium-framework with `gulp`:
```sh
$ gulp build
```
Built version will be in `assembly` directory.
## Examples
Examples of using project are in `examples` directory. Every html file in that directory demonstrate work of appropriate module.
## Modules
* core - Contains basic functions.
* net - Methods for working with the network.
* builder - Creating HTML structures from javascript objects.
* svg - Tools for working with SVG.
* touchable
* tooltips - Tooltips.
* data_list

Other modules are in development.
## Copyright and license
Copyright 2017 Vladislav Pashaiev.

Code of the Iridium Framework project distributed under the terms of LGPL-3.0 license.

See [COPYING](COPYING) and [COPYING.LESSER](COPYING.LESSER) for details.