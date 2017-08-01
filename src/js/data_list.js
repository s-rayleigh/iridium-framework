/**
 * Iridium DataList.
 * This file is part of Iridium Framework project.
 *
 * Iridium Framework is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Iridium Framework is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Iridium Framework. If not, see <http://www.gnu.org/licenses/>.
 *
 * @author rayleigh <rayleigh@protonmail.com>
 * @copyright 2017 Vladislav Pashaiev
 * @license LGPL-3.0+
 * @module data_list
 * @requires Iridium
 * @requires Iridium.Net
 * @version 0.1-indev
 */

/**
 * List load callback function.
 * @callback ListLoadCallback
 * @param {Array} list List.
 */

/**
 * Callback function that caled before list load.
 * @callback ListLoadBeginCallback
 * @param {object} postData Data that will be sended with request of the list.
 */

if(Iridium && Iridium.Net)
{
	/**
	 * Creates new DataList.
	 * Used to obtain lists from the server.
	 * Supports page navigation and livereload.
	 *
	 * @param {object} [parameters] Parameters.
	 * @param {string} [parameters.url] URL of the list.
	 * @param {boolean} [parameters.pageNav=false] Use page navigation.
	 * @param {object} [parameters.postData] Data that will be sended with request of the list.
	 *
	 * @param {object} [parameters.resultMap] Contains names of the parameters for obtain result data.
	 * @param {string} [parameters.resultMap.pages=pages] Name of the parameter of total pages number.
	 * @param {string} [parameters.resultMap.page=page] Name of the parameter of current page number.
	 * @param {string} [parameters.resultMap.list=list] Name of the parameter of list.
	 *
	 * @param {object} [parameters.pageNavMap] Contains names of the parameters for page navigation.
	 * @param {string} [parameters.pageNavMap.page=page] Name of the parameter of page number to go to.
	 * @param {string} [parameters.pageNavMap.move=move] Name of the parameter of move direction.
	 * DataList sends -1 to go backward and 1 to go forward.
	 *
	 * @param {ListLoadBeginCallback} [parameters.onLoadBegin] Callback function that called before every list load.
	 * @param {ListLoadCallback} [parameters.onLoad] Callback function that called after every list load.
	 *
	 * @constructor
	 */
	Iridium.DataList = function(parameters)
	{
		var _ = this,
			params = {
				url: '',
				pageNav: false,
				postData: {},
				resultMap: {
					pages: 'pages',
					page: 'page',
					list: 'list',
				},
				pageNavMap: {
					page: 'page',
					move: 'move'
				}
			},
			data = [],
			page = 0,
			pages = 0,
			move = 0,
			reloadIntervId = 0;

		Iridium.merge(params, parameters);

		Object.defineProperties(_, {
			'list': {
				get: function() { return data; }
			},
			'url': {
				get: function() { return params.url; },
				set: function(val) { params.url = val; }
			},
			'page': {
				get: function() { return page; }
			},
			'pages': {
				get: function() { return pages; }
			}
		});

		/**
		 * Loads list.
		 * @param {ListLoadCallback} [callback] Callback that will be called after list load.
		 */
		this.load = function(callback)
		{
			if(Iridium.empty(params.url))
			{
				throw new Error('URL must be defined.');
			}

			var postData = Iridium.clone(params.postData);

			if(params.pageNav)
			{
				Iridium.merge(postData, {
					[params.pageNavMap.page]: page,
					[params.pageNavMap.move]: move
				});
			}

			if(typeof params.onLoadBegin === 'function')
			{
				params.onLoadBegin(postData);
			}

			Iridium.Net.post(params.url, postData, function(resultData)
			{
				// Retrieve page navigation data
				if(params.pageNav)
				{
					page = resultData[params.resultMap.page];
					pages = resultData[params.resultMap.pages];
					move = 0;
				}

				data = resultData[params.resultMap.list];

				if(typeof params.onLoad === 'function')
				{
					params.onLoad(data);
				}

				if(typeof callback === 'function')
				{
					callback(data);
				}
			},
			Iridium.Net.DataType.JSON);
		};

		/**
		 * Sets post data that will be sended along with request.
		 * @param data Post data.
		 */
		this.setPostData = function(data)
		{
			params.postData = data;
		};

		/**
		 * Enables live reload.
		 * When enabled, reloads list every interval.
		 * @param {int} [interval=1000] Interval in milliseconds.
		 */
		this.liveReload = function(interval)
		{
			interval = interval || 1000;
			reloadIntervId = setInterval(_.load, interval);
		};

		/**
		 * Stops live reload.
		 */
		this.stopLiveReload = function()
		{
			clearInterval(reloadIntervId);
		};

		/**
		 * Moves one page forward on next list load.
		 */
		this.nextPage = function()
		{
			move = 1;
		};

		/**
		 * Moves one page backward on next list load.
		 */
		this.prevPage = function()
		{
			move = -1;
		};

		/**
		 * Moves to the first page on next list load.
		 */
		this.firstPage = function()
		{
			page = 0;
			move = 0;
		};

		/**
		 * Move to the last page on next list load.
		 */
		this.lastPage = function()
		{
			page = pages;
			move = 0;
		};

		/**
		 * Moves to the specified page on next list load.
		 * @param {int} pageNum Number of the page.
		 */
		this.toPage = function(pageNum)
		{
			move = 0;
			page = pageNum;
		};

		/**
		 * Clears list.
		 */
		this.clearData = function()
		{
			if(data)
			{
				data.length = 0;
			}
		};
	}
}
else
{
	console.error('Iridium Framework Core and Net must be included to be able to use Iridium DataList.');
}