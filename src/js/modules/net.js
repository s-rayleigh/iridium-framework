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
 * @copyright 2019 Vladislav Pashaiev
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
	JSON: 'json',
	XML: 'xml',
	TEXT: 'text'
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
 * @param {string} url URL to send the request to.
 * @param {object} [parameters] Request parameters.
 * @param {FormData|object} [parameters.data] Request data. FormData can be only used with POST request.
 * @param {Iridium.Net.Method} [parameters.method = POST] Request method.
 * @param {Iridium.Net.DataType} [parameters.dataType = JSON] Type of the response data.
 * @param {RequestSuccess} [parameters.success] Success request callback.
 * @param {RequestError} [parameters.error] Request error callback.
 * @param {string} [parameters.user = null] User name for authentication purposes.
 * @param {string} [parameters.password = null] Password for authentication purposes.
 * @param {int} [parameters.timeout = 0] Timeout of the request in milliseconds.
 */
Iridium.Net.request = function(url, parameters)
{
	if(Iridium.empty(url))
	{
		throw new Error('Argument "url" should not be empty.');
	}

	var _      = this,
		params = {
			method: _.Method.POST,
			dataType: _.DataType.JSON,
			user: null,
			password: null,
			timeout: 0
		};

	Iridium.merge(params, parameters);

	var fd = params.data instanceof FormData;

	if(params.method === _.Method.GET)
	{
		if(fd)
		{
			throw new Error('FormData cannot be used with GET request.');
		}

		url += (Iridium.stringContains('?', url) ? '&' : '?') + _.objectURLEncode(params.data);
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

	if(params.method === _.Method.POST && !fd)
	{
		params.data = _.objectURLEncode(params.data);
		httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	}

	httpRequest.send(params.method === _.Method.POST ? params.data : null);
};

/**
 * Sends a POST request.
 * @param {string} url URL to send the request to.
 * @param {FormData|object} [data] Request data.
 * @param {RequestSuccess} [success] Success request callback.
 * @param {Iridium.Net.DataType} [dataType = JSON] Type of the response data.
 * @param {RequestError} [error] Request error callback.
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
 * @param {string} url URL to send the request to.
 * @param {object} [data] Request data.
 * @param {RequestSuccess} [success] Success request callback.
 * @param {Iridium.Net.DataType} [dataType = JSON] Type of the response data.
 * @param {RequestError} [error] Request error callback.
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
