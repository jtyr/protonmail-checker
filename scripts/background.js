// Open a new tab or activate the first tab when clicked on the extension icon
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.query(
        {url: 'https://protonmail.ch/*'},
        function(tab_list) {
            if (tab_list.length == 0) {
                chrome.tabs.create({url: 'https://protonmail.ch/inbox'});
            } else {
                chrome.tabs.update(tab_list[0].id, {active: true});
            }
        }
    );
});


// Listen for messages from the Content Script
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action && request.action == 'count') {
            // Change the extension icon and badge
            setIcon(request.color, request.count, request.tooltip);
        } else if (request.action && request.action == 'notif') {
            // Show notification if supported
            if (Notification && localStorage.getItem('notif_desktop') == 'true') {
                // Create a simple text notification
                var n = new Notification(request.title, request.opts);

                setTimeout(
                    n.close.bind(n),
                    (localStorage.getItem('notif_timeout') || 10) * 1000);
            } else {
                console.log('Desktop notifications not supported!');
            }

            // Play sound
            if (localStorage.getItem('notif_sound') == 'true') {
                    try {
                        var sound = new Audio('sounds/notif.mp3');
                        sound.play();
                    } catch(e) {
                        console.log('Sound error!')
                    }
            }
        }
    }
);


// Set the extension icon and badge
function setIcon(color, count, tooltip) {
    var icon = '';
    var badge_color = '#FF0000';

    if (color == 'gray') {
        icon = 'g';
        badge_color = '#D0D0D0';
    }

    chrome.browserAction.setIcon({path: 'icons/icon-48' + icon + '.png'});
    chrome.browserAction.setTitle({title: tooltip});
    chrome.browserAction.setBadgeText({text: count});
    chrome.browserAction.setBadgeBackgroundColor({color: badge_color});
}


// Change the extension icon and badge when there is no ProtonMail tab open
function checkTabs() {
    chrome.tabs.query(
        {url: 'https://protonmail.ch/*'},
        function(array) {
            var found = false;

            for (var i=0; i<array.length; i++) {
                var url = array[i].url;

                if (url.match(/^https:\/\/protonmail\.ch\/(archive|compose|contacts|login|login\/unlock|settings)$/) ||
                    url.match(/^https:\/\/protonmail\.ch\/(drafts|inbox|label|m|outbox|spam|starred|trash)(\/.*|)$/) ||
                    url.match(/^https:\/\/protonmail\.ch\/search\?.*/)) {

                    found = true;
                    break;
                }
            }

            if (! found) {
                setIcon('gray', 'X', 'No ProtonMail tab found');
            }
        }
    );

    // Check for the open tab every 2 seconds
    setTimeout(checkTabs, 2000);
}


// Show options after installation
function install_notice() {
    if (localStorage.getItem('install_time')) {
        return;
    }

    var now = new Date().getTime();
    localStorage.setItem('install_time', now);
    chrome.tabs.create({url: '../html/options.html'});
}


install_notice();
checkTabs();
