
function updateSupportedSites() {
    $.get('https://github.com/lequangvuxxx/manga-notifier/raw/master/supported-sites.json?raw=True')
        .done(dat => {
            const data = JSON.parse(dat);
            siteDetails = data;
            chrome.storage.local.set({'supported-sites': data});
        })
}
chrome.runtime.onInstalled.addListener((dt) => {
    if(dt.reason == 'install')
        updateSupportedSites();
})

var siteDetails;
(function () {
    chrome.storage.local.get('supported-sites', dat => {
        siteDetails = dat['supported-sites'].details
    })
})();

chrome.runtime.onMessage.addListener((request, sender, response) => {

    if(!request.type) return;
    if(request.type == "GetNotification") {
        //chrome.tabs.create({ url: chrome.runtime.getURL("index.html")});
    } else
    if(request.type == "NewBookmark") {
        const url  = request.url;
        const site = request.site;
        const name = request.name;
        const thumbnail = siteDetails[site].thumbnail;

        $.get(url)
            .done(page => {
                const img = $(page).find(thumbnail);
                if(img.length == 0) return;
                const imgSrc = img.attr('src');
                createThumbnail(imgSrc, newBookmark(name, url, site))
            })
    }
})

function createThumbnail(url, callback) {
    $.get('http://uploads.im/api?upload='+url+'&resize_width=100&thumb_width=50&format=json')
        .done(
            res => callback(res.data.img_url)
        )
}

function newBookmark(name, url, site) {
    return function(thumbnail) {
        chrome.storage.local.get('bookmarks', res => {
            const bookmarks = res.bookmarks || [];
            bookmarks.push({
                url,
                name,
                site,
                thumbnail
            })
            chrome.storage.local.set({bookmarks});
        })
    }
}

function getNotification() {
    chrome.storage.local.get(data => {
        if(data.hasOwnProperty('bookmarks')) {
            let newNotis  = 0;
            let checkedBM = 0;
            const totalBM = data.bookmarks.length;
            data.bookmarks.forEach(item =>
                checkForUpdate(item, gotNew => {

                    checkedBM++;

                    if(!gotNew) return;

                    newNotis++;
                    addToNoti(item, gotNew);

                    if(checkedBM < totalBM) return;

                    if(newNotis == 0) newNotis = "";
                    chrome.browserAction.setBadgeBackgroundColor({color: "#115100"});
                    chrome.browserAction.setBadgeText({text: newNotis});
                })
            );
        }
    })
	setTimeout(getNotification, 1000*60*2);
}
getNotification();

function checkForUpdate({site, url}, callback) {

    const listSel = siteDetails[site].list;

    $.get(url)
    .done(page => {

        const list = $(page).find(listSel);
        console.log(list);
        if(list.length == 0) return;

        const lastedChap = site + list[0].href;
        console.log(lastedChap);
        chrome.history.getVisited({url: lastedChap}, arr => {
            callback(arr.length == 0 ? false : list[0].title);
        });
    })
}

function addToNoti(bookmark, newInfo) {

}
