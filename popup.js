'use strict';

(function() {
	var LOCALE = undefined; // default locale
	var FORMAT_OPTIONS = [undefined, undefined];

	function updateClock() {
		const date = new Date();
		const dateString = date.toLocaleDateString(LOCALE, FORMAT_OPTIONS[0]);
		const timeString = date.toLocaleTimeString(LOCALE, FORMAT_OPTIONS[1]);
		document.querySelector("#dateDisp").textContent = dateString;
		document.querySelector("#timeDisp").textContent = timeString;
	}

	function getNextTimeout() {
		const now = Date.now();
		const sec1 = 1000;
		const next = ((now + (sec1 - 1)) / sec1) | 0;
		return ((next * sec1) - now) + 5; // add delay 5 ms
	};

	function callback() {
		updateClock();
		setTimeout(callback, getNextTimeout());
	};

	function checkLocaleStringFormat(display_format) {
		const dateOptions = {dateStyle: "full"};
		const timeOptions = {
			hour: "2-digit", minute: "2-digit", second: "2-digit",
			hour12: display_format == "12"};
		try {
			const date = new Date();
			const dateString = date.toLocaleDateString(LOCALE, dateOptions);
			const timeString = date.toLocaleTimeString(LOCALE, timeOptions);
		} catch(error) {
			console.log(`Error: ${error}`);
			return;
		}
		FORMAT_OPTIONS = [dateOptions, timeOptions]; // use options
	};

	function initStyle(result) {
		checkLocaleStringFormat(result.display_format);
		document.body.style.backgroundColor = result.background_color;
		document.body.style.color = result.text_color;
	}

	function onError(error) {
		console.log(`Error: ${error}`);
	}

	browser.storage.local.get({
		display_format: "24",
		text_color: "#FFFFFF",
		background_color: "#000000"
	}).then(initStyle, onError)
	.then(callback, onError);
})();
