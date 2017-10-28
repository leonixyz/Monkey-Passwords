// get preferences from local storage
document.addEventListener("DOMContentLoaded",
	() => {
		browser.storage.local.get("settings").then(
		  	function setCurrentPreferences(storage) {
				document.querySelector("#passwordsLength").value = storage.settings.passwordsLength || 20;
				document.querySelector("#cryptoSeed").value = storage.settings.cryptoSeed;
				document.querySelector("#username").value = storage.settings.username;
			},
			function onError(error) {
				document.querySelector("#errorMessage").innerText = error;
			}
		);
	}
);

// autosave settings
document.querySelector(".autosave").addEventListener("change", 
	(e) => {
		console.log(document.querySelector("#cryptoSeed").value);
		e.preventDefault();
		let settings = {
			passwordsLength: document.querySelector("#passwordsLength").value,
			cryptoSeed: document.querySelector("#cryptoSeed").value,
			username: document.querySelector("#username").value
		};
		browser.storage.local.set({
			settings: settings
		});
		console.log();
	}
);

// show/hide info
document.querySelector("#showInfo").addEventListener("click",
	(e) => {
		e.preventDefault();
		document.querySelector("#doc").className =
			document.querySelector("#doc").className == "" ?
			"hidden" :
			"";
	}
);

// show/hide settings
document.querySelector("#showSettings").addEventListener("change", 
	(e) => {
		e.preventDefault();
		if(e.target.checked) {
			document.querySelector("#settings").className = "";
		}
		else {
			document.querySelector("#settings").className = "hidden";
		}
	}
);
