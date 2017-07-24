
window.addEventListener('load', function()
{
	var builder = new Iridium.Builder({
		tag: 'form',
		action: 'index.php',
		class: 'test-form',
		'id': 'test_form',
		childs: [
			{
				class: 'input-group',
				childs: [
					{
						tag: 'label',
						html: 'Username',
						for: 'username'
					},
					{
						tag: 'input',
						id: 'username',
						name: 'username',
						placeholder: 'Enter username...'
					}
				]
			}
		]
	});

	document.body.appendChild(builder.build());
});