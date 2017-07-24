# Iridium Framework
Iridium Framework &mdash; модульный набор фронтэнд инструментов для создания веб-приложений.

В настоящее время на стадии разработки.
## Модули
* core - Ядро. Содержит базовые функции.
* net - Ajax.
* builder - Создание HTML элементов из javascript кода.
* svg - Работа с SVG.
* touchable

Остальные модули в данный момент находятся в разработке.
## Сборка из исходников
1. Убедитесть, что у вас установлены:
	* `nodejs`
	* `npm`
	* `gulp`
	* `git`
2. Клонируйте [репозиторий] при помощи `git`:
```sh
$ git clone https://github.com/s-rayleigh/iridium-framework.git
$ cd iridium-framework
```
[репозиторий]: https://github.com/s-rayleigh/iridium-framework
3. Укажите требуемые модули в файле `config.json`.
4. Соберите iridium-framework при помощи `gulp`:
```sh
$ gulp build
```
Собранный проект окажется в директории `dist`.
Директория `dist/modules` содержит отдельные файлы модулей для подключения на страницу.
## Примеры
Примеры использования проекта находятся в директории `examples`. Каждый html файл в директории демонстрирует работу модуля с аналогичным файлу названием.

## Копирайт и лицензия
Копирайт 2017 Пашаев Владислав.

Код Iridium Framework распостраняется на основании лицензии LGPL-3.0.

Смотри [COPYING](COPYING) и [COPYING.LESSER](COPYING.LESSER) для подробностей.