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
  var elem = $('#inbox-li > a > span.label.hidden-xs.hidden-sm');

  if (path.match(/^\/(login|locked)$/)) {
    sendCountMessage('X', 'gray', 'Waiting for login');
  } else if (elem.length) {
    var unread = $(elem).text();

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

    error = 0;
  } else {
    // Show '?' only after 5 error checks
    if (error > 4) {
      sendCountMessage('?', 'blue', 'Problem to read ProtonMail Inbox');
    } else {
      error++;
    }
  }

  // Scan the count of unread messages every 2 seconds
  setTimeout(getCount, 2000);
}


getCount();
