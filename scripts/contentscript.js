// Error counter
var error = 0;

// Unread message counter
var prev_unread = -1;


// Send the count to the background script to set the extension icon and badge
function sendCountMessage(count, color, tooltip) {
    chrome.runtime.sendMessage({
        action: 'count',
        count: count,
        color: color,
        tooltip: tooltip
    });
}


// Get the count of unread e-mails from the page
function getCount() {
    // Current URL pathname
    var path = window.location.pathname;

    // Element containing the Inbox count
    var elem = $('#pm_sidebar > section > ul:nth-child(2) > li:nth-child(1) > a > em');

    if (path.match(/^\/login(\/unlock|)$/)) {
        sendCountMessage('X', 'gray', 'Waiting for login');
    } else if (elem.length) {
        var unread = $(elem).text().replace("(", "").replace(")", "");

        if (parseInt(unread)) {
            sendCountMessage(unread, 'blue', 'There is unread message');

            // Show notification if the number has increased
            if (prev_unread >= 0 && unread > prev_unread) {
                chrome.extension.sendMessage({
                        action: 'notif',
                        title: 'ProtonMail',
                        opts: {
                            body: 'New message has arrived...',
                            icon: 'icons/icon-48.png'
                        }
                });
            }

            // Keep the current number for the next run
            prev_unread = unread;
        } else {
            sendCountMessage('', 'blue', 'There is no unread message');
            prev_unread = 0;
        }
    }

    // Scan the count of unread messages every 2 seconds
    setTimeout(getCount, 2000);
}


getCount();
