/**
 * Iridium Net.
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
 * @copyright 2018 Vladislav Pashaiev
 * @license LGPL-3.0+
 * @module net
 * @requires Iridium
 */

/**
 * Success request callback function.
 * @callback RequestSuccess
 * @param {*} data Result data.
 */

/**
 * Request error callback function.
 * @callback RequestError
 * @param {Iridium.Net.RequestErrorType} type Error type.
 * @param {object} [data] Error data.
 */

if(Iridium)
{
	/**
	 * Iridium Net.
	 * Contains methods for working with the network.
	 * @namespace
	 */
	Iridium.Net = {};

	/**
	 * Request method.
	 */
	Iridium.Net.Method = {
		POST: 'POST',
		GET: 'GET',
		//TRACE: 'TRACE',
		//DELETE: 'DELETE',
		//PUT: 'PUT'
	};

	Object.freeze(Iridium.Net.Method);

	/**
	 * Request result data type.
	 */
	Iridium.Net.DataType = {
		/** @type {Iridium.Net.DataType}*/
		JSON: /** @type {Iridium.Net.DataType}*/'json',
		/** @type {Iridium.Net.DataType}*/
		XML: /** @type {Iridium.Net.DataType}*/'xml',
		/** @type {Iridium.Net.DataType}*/
		TEXT: /** @type {Iridium.Net.DataType}*/'text'
	};

	Object.freeze(Iridium.Net.DataType);

	/**
	 * Type of the request error.
	 */
	Iridium.Net.RequestErrorType = {
		HTTP: 'http',
		TIMEOUT: 'timeout',
		PARSE: 'parse'
	};

	Object.freeze(Iridium.Net.RequestErrorType);

	/**
	 * Transforms object to the urlencoded string.
	 * TODO: https://www.w3.org/TR/html5/forms.html#url-encoded-form-data
	 * @param {object} obj Object.
	 * @return {string} Urlencoded object.
	 */
	Iridium.Net.objectURLEncode = function(obj)
	{
		var result = '';

		for(var k in obj)
		{
			if(Array.isArray(obj[k]))
			{
				obj[k].forEach(function(item, i)
				{
					result += encodeURIComponent(k) + '[' + encodeURIComponent(i.toString()) + ']=' + encodeURIComponent(item) + '&';
				});
			}
			else
			{
				result += encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]) + '&';
			}
		}

		return result.slice(0, -1);
	};

	/**
	 * Sends request to the URL with specified parameters.
	 * @param {string} url URL.
	 * @param {object} [parameters] Request parameters.
	 * @param {object} [parameters.data] Request data.
	 * @param {Iridium.Net.Method} [parameters.method = POST] Request method.
	 * @param {Iridium.Net.DataType} [parameters.dataType = JSON] Type of the response data.
	 * @param {RequestSuccess} [parameters.success] Success request callback.
	 * @param {RequestError} [parameters.error] Request error callback.
	 * @param {string} [parameters.user]
	 * @param {string} [parameters.password]
	 * @param {int} [parameters.timeout = 0] Timeout of the request in milliseconds.
	 */
	Iridium.Net.request = function(url, parameters)
	{
		if(Iridium.empty(url))
		{
			throw new Error('Argument "url" should not be empty.');
		}

		var _ = this,
			params = {
			method: this.Method.POST,
			dataType: this.DataType.JSON,
			user: '',
			password: '',
			timeout: 0
		};

		Iridium.merge(params, parameters);

		//urlencode data
		params.data = this.objectURLEncode(params.data);

		if(params.method === this.Method.GET)
		{
			url += (Iridium.stringContains('?', url) ? '&' : '?') + params.data;
		}

		var httpRequest = new XMLHttpRequest();
		httpRequest.open(params.method, url, true, params.user, params.password);
		httpRequest.timeout = params.timeout;

		httpRequest.onreadystatechange = function()
		{
			if(httpRequest.readyState === 4)
			{
				if(httpRequest.status === 200)
				{
					var response;

					switch(params.dataType)
					{
						case _.DataType.JSON:
							try
							{
								response = JSON.parse(httpRequest.responseText);
							}
							catch(e)
							{
								if(typeof params.error === 'function')
								{
									params.error(_.RequestErrorType.PARSE, e);
								}

								return;
							}
							break;
						case _.DataType.XML:
							response = httpRequest.responseXML;
							break;
						case _.DataType.TEXT:
							response = httpRequest.responseText;
							break;
					}

					if(typeof params.success === 'function')
					{
						params.success(response);
					}
				}
				else
				{
					if(typeof params.error === 'function')
					{
						params.error(
							_.RequestErrorType.HTTP,
							{
								statusCode: httpRequest.status,
								statusText: httpRequest.statusText
							}
						);
					}
				}
			}
		};

		httpRequest.ontimeout = function()
		{
			if(typeof params.error === 'function')
			{
				params.error(_.RequestErrorType.TIMEOUT);
			}
		};

		if(params.method === this.Method.POST)
		{
			httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		}

		httpRequest.send(params.method === this.Method.POST ? params.data : null);
	};

	/**
	 * Sends a POST request.
	 * @param {string} url
	 * @param {object} [data]
	 * @param {RequestSuccess} [success]
	 * @param {Iridium.Net.DataType} [dataType]
	 * @param {RequestError} [error]
	 */
	Iridium.Net.post = function(url, data, success, dataType, error)
	{
		this.request(url, {
			method: /**@type Iridium.Net.Method*/this.Method.POST,
			data: data,
			success: success,
			dataType: dataType,
			error: error
		});
	};

	/**
	 * Sends a GET request.
	 * @param {string} url
	 * @param {object} [data]
	 * @param {RequestSuccess} [success]
	 * @param {Iridium.Net.DataType} [dataType]
	 * @param {RequestError} [error]
	 */
	Iridium.Net.get = function(url, data, success, dataType, error)
	{
		this.request(url, {
			method: /**@type Iridium.Net.Method*/this.Method.GET,
			data: data,
			success: success,
			dataType: dataType,
			error: error
		});
	};
}
else
{
	console.error('Iridium Core must be included to be able to use Iridium Net.');
}