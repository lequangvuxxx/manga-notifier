
chrome.runtime.onInstalled.addListener((dt) => {
	if(dt.reason == "install") {
		chrome.storage.local.get((d)=>{
			if(!d.hasOwnProperty('supported-sites')) {
				chrome.storage.local.set('supported-sites', {});
			}
		})
	}
})

getNotifications();
function getNotifications() {

    chrome.storage.local.get(data => {

        if(!data.hasOwnProperty('bookmarks')) return;
        data.bookmarks.forEach(link => {
            console.log(link);

            // $.get(link)
            //     .done(page => {
            //
            //     })
            //     .fail(() => {
            //     })
            // chrome.browserAction.setBadgeBackgroundColor({color: "#115100"});
            // chrome.browserAction.setBadgeText({text:t});
        })
    })
	setTimeout(getNotifications, 1000*60*2);
}
