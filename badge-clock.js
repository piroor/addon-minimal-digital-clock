'use strict';

(function() {
	var CFG_DISP_FORMAT = "24";
	var TEXT_COLOR      = "#FFFFFF";
	var BG_COLOR        = "#000000";
	const ICON_SIZE     = 24;

	function updateClock() {
		const date = new Date();
		const mm = date.getMinutes().toString().padStart(2, "0");
		let hour_value = date.getHours();
		if (CFG_DISP_FORMAT == "12") {
			if (hour_value >= 12) {
				hour_value -= 12;
			}
			if (hour_value == 0) {
				hour_value = 12;
			}
		}
		const hh = hour_value.toString().padStart(2, "0");

		browser.browserAction.setIcon(generateIconDetails(hh, mm));
		browser.browserAction.setTitle({title:date.toLocaleDateString()});
	}

	function getNextTimeout() {
		const now = Date.now();
		const min1 = (60 * 1000);
		const next = ((now + (min1 - 1)) / min1) | 0;
		return ((next * min1) - now) + 500; // add delay 0.5 s
	};

	function callback() {
		updateClock();
		setTimeout(callback, getNextTimeout());
	};

	function generateIconURL(hh, mm) {
		const svg = `
			<?xml version="1.0" encoding="utf-8"?>
			<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
			<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24">
			<path fill="#0D1419" style="opacity:0.2;" d="M24,16.774c0,0.779-0.638,1.417-1.417,1.417H1.418C0.638,18.191,0,17.554,0,16.774V9.227 C0,8.447,0.638,7.81,1.418,7.81h21.165C23.362,7.81,24,8.447,24,9.227V16.774z"/>
			<path d="M24,15.774c0,0.779-0.638,1.417-1.417,1.417H1.418C0.638,17.191,0,16.554,0,15.774V8.227C0,7.447,0.638,6.81,1.418,6.81 h21.165C23.362,6.81,24,7.447,24,8.227V15.774z" fill="${BG_COLOR}"/>
			<text transform="matrix(1 0 0 1 0.5527 15.2773)" fill="${TEXT_COLOR}" font-size="7.5">${hh}:${mm}</text>
			</svg>
		`.trim();
		return `data:image/svg+xml,${escape(svg)}`;
	}

	function generateIconDetails(hh, mm) {
		const details = {path:{}};
		details.path[ICON_SIZE] = generateIconURL(hh, mm);
		return details;
	}

	browser.storage.onChanged.addListener(function(changes, areaName) {
		if (areaName == "local") {
			if (changes.display_format) {
				CFG_DISP_FORMAT = changes.display_format.newValue;
			}
			if (changes.text_color) {
				TEXT_COLOR = changes.text_color.newValue;
			}
			if (changes.background_color) {
				BG_COLOR = changes.background_color.newValue;
			}
			updateClock();
		}
	});

	// read configs
	browser.storage.local.get({
		display_format: "24",
		text_color: TEXT_COLOR,
		background_color: BG_COLOR
	}).then(function(result) {
			CFG_DISP_FORMAT = result.display_format;
			TEXT_COLOR      = result.text_color;
			BG_COLOR        = result.background_color;

			callback();
		},
		function(error) { console.log(`Error: ${error}`); }
	);
})();
