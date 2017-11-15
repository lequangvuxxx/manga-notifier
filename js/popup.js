
window.addEventListener('DOMContentLoaded', () => {

	chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {

		let tab = tabs[0];
		$('#name').val(tab.title).focus().select();
	})
})