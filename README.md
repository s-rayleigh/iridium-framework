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

3. Select the required modules in the [config](config.js).

4. Build iridium-framework with `gulp`:
```sh
$ gulp build
```
Built version will be in `assembly` directory.
## Examples
Examples of using project are in `examples` directory. Every html file in that directory demonstrate work of appropriate module.
## Modules
* core - Contains common methods.
* breakpoints - Standard breakpoints for making adaptive UI.
* net - Methods for working with the network.
* builder - Creating HTML structures from javascript objects.
* url_data - Storing data in the URL fragment identifier.
* tooltips - Tooltips on focus or mouse hover.
* combobox - Input field with dropdown list.
* svg - Tools for working with SVG.
* data_list - List wrapper with page navigation support.
* touchable - Small tool that set class to element after obtaining focus.

Also there are modules waiting for refactoring and not ready to use:
* notification
* file_uploader
* gallery
* form_validation
## Copyright and license
Copyright 2019 Vladislav Pashaiev.

Code of the Iridium Framework project distributed under the terms of LGPL-3.0 license.

See [COPYING](COPYING) and [COPYING.LESSER](COPYING.LESSER) for details.