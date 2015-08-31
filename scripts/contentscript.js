// Error counter
var error = 0;


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
    } else {
      sendCountMessage('', 'blue', 'There is no unread message');
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

  setTimeout(getCount, 2000);
}

getCount();


// Send the count to the background script to set the extension icon and badge
function sendCountMessage(count, color, tooltip) {
  chrome.runtime.sendMessage({
    count: count,
    color: color,
    tooltip: tooltip
  });
}
