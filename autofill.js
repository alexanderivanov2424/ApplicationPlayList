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

["fname","lname", "email", "website", "linkedin",
  "phone-num", "address", "zipcode", "country", "state", "city", "birth-date",
  "education", "major"];

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
          } else if (text.match(/email/i)) {
            input.value = options['email'];
          } else if (text.match(/website/i)) {
            input.value = options['website'];
          } else if (text.match(/linkedin/i)) {
            input.value = options['linkedin'];
          } else if (text.match(/phone/i)) {
            input.value = options['phone-num'];
          } else if (text.match(/zipcode/i)) {
            input.value = options['zipcode'];
          } else if (text.match(/address/i)) {
            input.value = options['address'];
          } else if (text.match(/country/i)) {
            input.value = options['country'];
          } else if (text.match(/state/i)) {
            input.value = options['state'];
          } else if (text.match(/city/i)) {
            input.value = options['city'];
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
