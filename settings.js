// get preferences from local storage
document.addEventListener("DOMContentLoaded",
	() => {
		browser.storage.local.get("settings").then(
		  	function setCurrentPreferences(storage) {
                if(storage.hasOwnProperty('settings')) {        
					document.querySelector("#passwordsLength").value = storage.settings.passwordsLength || 20;
					document.querySelector("#cryptoSeed").value = storage.settings.cryptoSeed;
					document.querySelector("#username").value = storage.settings.username;
				}
			},
			function onError(error) {
				document.querySelector("#message").innerText = error;
				document.querySelector("#message").className = 'error';
				document.querySelectorAll("#settings input").forEach(
					(element) => {
						element.disabled = true;
					}
				);
			}
		);
	}
);

// autosave settings
document.querySelector("#saveButton").addEventListener("click", 
	(e) => {
		e.preventDefault();
		let settings = {
			passwordsLength: document.querySelector("#passwordsLength").value,
			cryptoSeed: document.querySelector("#cryptoSeed").value,
			username: document.querySelector("#username").value
		};
		browser.storage.local.set({
			settings: settings
		}).then(
			() => {
				document.querySelector("#message").innerText = 'settings saved';
				document.querySelector("#message").className = '';
				setTimeout(
					() => {
						document.querySelector("#message").innerText = '';
					}, 2000);
			},
			(error) => {
				document.querySelector("#message").innerText = error;
				document.querySelector("#message").className = 'error';
			}
		);
	}
);

// show/hide info 1
document.querySelector("#showInfo1").addEventListener("click",
	(e) => {
		e.preventDefault();
		document.querySelector("#info1").className =
			document.querySelector("#info1").className == "info" ?
			"info hidden" :
			"info";
	}
);

// show/hide info 2
document.querySelector("#showInfo2").addEventListener("click",
	(e) => {
		e.preventDefault();
		document.querySelector("#info2").className =
			document.querySelector("#info2").className == "info" ?
			"info hidden" :
			"info";
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
