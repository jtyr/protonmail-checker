// Error counter
var error = 0;


// Get the count of unread e-mails from the page
function getCount() {
  var elem = $('#topMenu li:nth-child(1)');

  if (elem.length) {
    var unread = $(elem).attr('data-unread');

    if (parseInt(unread)) {
      sendCountMessage(unread, 'There is unread message');
    } else {
      sendCountMessage('', 'There is no unread message');
    }

    error = 0;
  } else {
      // Show '?' only after 5 error checks
      if (error > 4) {
        sendCountMessage('?', 'Problem to read ProtonMail Inbox');
      } else {
        error++;
      }
  }

  setTimeout(getCount, 2000);
}

getCount();


// Send the count to the background script to set the extension icon and badge
function sendCountMessage(count, tooltip) {
  chrome.runtime.sendMessage({count: count, tooltip: tooltip});
}
