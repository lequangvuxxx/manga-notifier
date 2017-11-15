
var bookmarkContain, notificationContain;
function buildBookmark(tab, sites) {
	bookmarkContain = {tab, sites, html:$('div.container').html()};

	$('#name').val(tab.title).focus().select();

	for(const site in sites) {
		if (tab.url.startsWith(site)) {
			$('#options').html(
				'<button> Hủy </button>' +
				'<button class="green">Xác nhận</button>'
			)
			$('#options > button.green')
				.click(() => {
					chrome.runtime.sendMessage({
						type:"NewBookmark",
						name: $('#name').val(),
						url: tab.url,
						site
					})
				})
			return;
		}
	}
	return $('#options').html('<p class="warning">Hiện tại chưa hỗ trợ trang này!</p>')
}

window.addEventListener('DOMContentLoaded', () => {
	chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
		chrome.storage.local.get('supported-sites', data => {
			buildBookmark(tabs[0], data['supported-sites'].details);
		})
	})
	$('#notification').click(function() {
		$('div.nav > ul > li').removeClass('active');
		$(this.parentNode).addClass('active');

		if(notificationContain)
			return $('div.container').html(notificationContain);

		chrome.runtime.sendMessage({type:"GetNotification"},(res)=> {
			notificationContain = res;
			$('div.container').html(notificationContain);
		})
	})
	$('#bookmark').click(function() {
		$('div.nav > ul > li').removeClass('active');
		$(this.parentNode).addClass('active');
		if(bookmarkContain) {
			$('div.container').html(bookmarkContain.html);
			buildBookmark(
				bookmarkContain.tab,
				bookmarkContain.sites
			);
		}
	})
})
