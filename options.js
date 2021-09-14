'use strict';

(function() {
	function initOptions(result) {
		let radio_buttons = document.querySelectorAll('input[name=dispfmt]');
		for (let i = 0; i < radio_buttons.length; i++) {
			radio_buttons[i].checked = (radio_buttons[i].value == result.display_format);
			radio_buttons[i].addEventListener("change", function(e) {
				if (radio_buttons[i].checked) {
					browser.storage.local.set({"display_format": radio_buttons[i].value});
				}
			});
		}

		let textcolor_picker = document.querySelector('input[name=textcolor]');
		textcolor_picker.value = result.text_color;
		textcolor_picker.addEventListener("change", function(e) {
			browser.storage.local.set({"text_color": e.currentTarget.value});
		});

		let bgcolor_picker = document.querySelector('input[name=bgcolor]');
		bgcolor_picker.value = result.background_color;
		bgcolor_picker.addEventListener("change", function(e) {
			browser.storage.local.set({"background_color": e.currentTarget.value});
		});
	}

	function onError(error) {
		console.log(`Error: ${error}`);
	}

	document.addEventListener("DOMContentLoaded",  function() {
		browser.storage.local.get({
			display_format: "24",
			text_color: "#FFFFFF",
			background_color: "#000000"
		}).then(initOptions, onError);
	});
})();
