function get(keys) {
  return new Promise(resolve => chrome.storage.local.get(keys, resolve));
}

async function getOptions() {
  const { options } = await get('options');
  return options;
}

function fillElementsWith(items) {
  for (const [id, value] of Object.entries(items)) {
    const element = document.getElementById(id);
    if (element) {
      element.value = value;
    }
  }
}

function autofillForms(options) {
  for (const form of document.forms) {
    for (const input of form.elements) {
      const labels = input.labels;
      if (labels) {
        for (const label of labels) {
          const text = label.innerHTML;
          if (text.match(/first name/i)) {
            input.value = options['fname'];
          } else if (text.match(/last name/i)) {
            input.value = options['lname'];
          } else if (text.match(/full name/i)) {
            input.value = options['fname'] + ' ' + options['lname'];
          }
        }
      }
    }
  }
}

chrome.runtime.onMessage.addListener(async request => {
  if (request === 'autofill') {
    const options = await getOptions();
    autofillForms(options);
  }
});
