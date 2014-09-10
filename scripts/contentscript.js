var error = 0;


// Get the count of unread e-mails from the page
function getCount() {
  var elem = $('#topMenu li:nth-child(1)');

  if (elem.length) {
    var unread = $(elem).attr('data-unread');

    if (parseInt(unread)) {
      sendCountMessage(unread);
    } else {
      sendCountMessage('');
    }

    error = 0;
  } else {
      // Show '?' only after 5 error checks
      if (error > 4) {
        sendCountMessage('?');
      } else {
        error++;
      }
  }

  setTimeout(getCount, 2000);
}

getCount();


// Send the count to the background script to set the extension icon and badge
function sendCountMessage(str) {
  chrome.runtime.sendMessage({count: str});
}
