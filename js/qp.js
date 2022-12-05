function requestFullScreen() {
	let element = document.documentElement;
	let requestMethod = element.requestFullScreen || //W3C
		element.webkitRequestFullScreen || //Chrome
		element.mozRequestFullScreen || //FireFox
		element.msRequestFullScreen; //IE11
	if (requestMethod) {
		requestMethod.call(element);
	} else if (typeof window.ActiveXObject !== "undefined") { //for Internet Explorer
		let wscript = new ActiveXObject("WScript.Shell");
		if (wscript !== null) {
			wscript.SendKeys("{F11}");
		}
	}
} 