/**
 * Iridium gallery.
 * Part of the Iridium Framework.
 * @module gallery
 * @author rayleigh <rayleigh@protonmail.com>
 * @version 0.1 indev
 * @licence GPL-3.0
 */

/**
 *
 * @param {HTMLElement} element
 * @constructor
 */
function Gallery(element)
{
	if(!element) { return; }

	var gallery = this,
		links = element.querySelectorAll('a'),
		items = [],
		layout,
		currentIndex;

	for(var i = 0; i < links.length; i++)
	{
		var link = links[i],
			data = {
				link: link.href,
				header: link.dataset.irItemHeader || '',
				description: link.dataset.irItemDesc || ''
			};

		items.push(data);

		link.addEventListener('click', function(e)
		{
			e.preventDefault();

			if(!layout)
			{
				layout = createLayout();
			}

			fillLayout(this.data);
			currentIndex = this.index;
			gallery.show();
		}.bind({data: data, index: i}));
	}

	function createLayout()
	{
		//TODO: make lib for generating html

		var galleryPopup = document.createElement('div'),
			prevButton = document.createElement('button'),
			nextButton = document.createElement('button'),
			closeButton = document.createElement('button'),
			content = document.createElement('div'),
			header = document.createElement('div'),
			body = document.createElement('div'),
			footer = document.createElement('div'),
			headerText = document.createElement('span'),
			descText = document.createElement('span'),
			/** @type {Image} */
			nextImg = /** @type {Image} */ document.createElement('img'),
			/** @type {Image} */
			prevImg = /** @type {Image} */ document.createElement('img'),
			/** @type {Image} */
			crossImg = /** @type {Image} */ document.createElement('img');

		galleryPopup.className = 'ir-gallery-popup';
		prevButton.className = 'ir-gallery-prev';
		nextButton.className = 'ir-gallery-next';
		closeButton.className = 'ir-gallery-close';
		content.className = 'ir-gallery-content';
		header.className = 'ir-gallery-header';
		body.className = 'ir-gallery-body';
		footer.className = 'ir-gallery-footer';
		headerText.className = 'ir-gallery-header-text';
		descText.className = 'ir-gallery-item-desc';

		nextImg.src = 'styles/img/icons/next.svg';
		prevImg.src = 'styles/img/icons/prev.svg';
		crossImg.src = 'styles/img/icons/cross.svg';

		//TODO: optimize
		SVG.replaceImgByInline(nextImg);
		SVG.replaceImgByInline(prevImg);
		SVG.replaceImgByInline(crossImg);

		header.appendChild(headerText);
		header.appendChild(closeButton);
		footer.appendChild(descText);
		content.appendChild(header);
		content.appendChild(body);
		content.appendChild(footer);
		galleryPopup.appendChild(prevButton);
		galleryPopup.appendChild(content);
		galleryPopup.appendChild(nextButton);
		closeButton.appendChild(crossImg);
		prevButton.appendChild(prevImg);
		nextButton.appendChild(nextImg);

		closeButton.addEventListener('click', function(e)
		{
			e.preventDefault();
			gallery.hide();
		});

		galleryPopup.addEventListener('click', function(e)
		{
			if(e.target != this)
			{
				return;
			}

			e.preventDefault();
			gallery.hide();
		});

		prevButton.addEventListener('click', function(e)
		{
			e.preventDefault();
			currentIndex = ++currentIndex === items.length ? 0 : currentIndex;
			fillLayout(items[currentIndex]);
		});

		nextButton.addEventListener('click', function(e)
		{
			e.preventDefault();
			currentIndex = --currentIndex === -1 ? items.length - 1 : currentIndex;
			fillLayout(items[currentIndex]);
		});

		galleryPopup.style.display = 'none';
		document.body.appendChild(galleryPopup);

		return galleryPopup;
	}

	function fillLayout(data)
	{
		if(!layout)
		{
			return;
		}

		layout.getElementsByClassName('ir-gallery-header-text')[0].innerHTML = data.header;
		layout.getElementsByClassName('ir-gallery-item-desc')[0].innerHTML = data.description;

		var extension = data.link.split('.').pop().toLowerCase(),
			isImage = extension === 'png' || extension === 'jpg' || extension === 'jpeg';

		if(isImage)
		{
			var gc = layout.getElementsByClassName('ir-gallery-body')[0];

			while(gc.firstChild)
			{
				gc.removeChild(gc.firstChild);
			}

			var img = document.createElement('img');
			img.src = data.link;
			img.alt = data.header;

			gc.appendChild(img);
		}
		else
		{
			//TODO: ajax loader
		}
	}

	this.show = function()
	{
		if(!layout)
		{
			return;
		}

		//TODO: remove jQuery methods
		$(document.body).addClass('ir-gallery-body-overlap');

		layout.style.display = '';
	};

	this.hide = function()
	{
		//TODO: remove jQuery methods
		$(document.body).removeClass('ir-gallery-body-overlap');

		if(!layout)
		{
			return;
		}

		layout.style.display = 'none';
	};
}

//Initialization
window.addEventListener('load', function()
{
	var galleries = document.getElementsByClassName('iridium-gallery');
	for(var i = 0; i < galleries.length; i++)
	{
		new Gallery(galleries[i]);
	}
});