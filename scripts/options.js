// List of checkboxes
var inputs = ['notif_desktop', 'notif_sound', 'notif_timeout'];

// Saves options to localStorage
function save_options() {
    for (var i = 0; i<inputs.length; i++) {
        var n = document.getElementById(inputs[i]);

        if (n.type == 'checkbox') {
            localStorage[inputs[i]] = n.checked;
        } else if (n.type == 'text') {
            localStorage[inputs[i]] = n.value;
        }
    }

    // Update status to let user know options were saved
    toggleMessage(true);
    setTimeout(function() {
        toggleMessage(false);
    }, 1000);
}

// Toggle visibility of Save button and message field
function toggleMessage(status) {
    msg = document.getElementById('msg');
    save = document.getElementById('save');

    if (status) {
        save.style.display = 'none';
        msg.style.display = 'inline';
    } else {
        save.style.display = 'inline';
        msg.style.display = 'none';
    }
}

// Restores select box state to saved value from localStorage
function restore_options() {
    for (var i = 0; i<inputs.length; i++) {
        if (inputs[i] in localStorage) {
            var val = localStorage[inputs[i]];

            var elem = document.getElementById(inputs[i]);
            if (elem.type == 'checkbox') {
              if (val == 'true') {
                  elem.checked = true;
              } else {
                  elem.checked = false;
              }
            } else if (elem.type == 'text') {
                elem.value = val;
            }
        }
    }

    // Set save button event listener
    document.getElementById('save').addEventListener('click', save_options);
}

// Run when document is fully loaded
window.addEventListener('load', restore_options);
