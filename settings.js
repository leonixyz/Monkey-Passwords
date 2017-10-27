// get preferences from local storage
document.addEventListener("DOMContentLoaded", function restoreSettings() {
	browser.storage.local.get("settings").then(
	  	function setCurrentPreferences(storage) {
			document.querySelector("#passwordsLength").value = storage.settings.passwordsLength || 20;
			document.querySelector("#cryptoSeed").value = storage.settings.cryptoSeed;
		},
		function onError(error) {
			document.querySelector("#errorMessage").innerText = error;
		}
	);
});

// autosave settings
document.querySelector(".autosave").addEventListener("change", function saveSettings(e) {
	console.log(document.querySelector("#cryptoSeed").value);
	e.preventDefault();
	let settings = {
		passwordsLength: document.querySelector("#passwordsLength").value,
		cryptoSeed: document.querySelector("#cryptoSeed").value,
	};
	browser.storage.local.set({
		settings: settings
	});
	console.log();
});

// show/hide settings
document.querySelector("#showSettings").addEventListener("change", function toggleSettings(e) {
	e.preventDefault();
	if(e.target.checked) {
		document.querySelector("#settings").className = "";
	}
	else {
		document.querySelector("#settings").className = "hidden";
	}
});
