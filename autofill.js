function get(keys) {
  return new Promise(resolve => chrome.storage.local.get(keys, resolve));
}

function autofillForms(options) {
  const {
    fname,
    lname,
    email,
    website,
    linkedin,
    'phone-num': phoneNum,
    zipcode,
    address,
    country,
    state,
    city,
    education,
    'hear-about': hearAbout,
    pronouns,
    gender,
    race,
  } = options;

  for (const form of document.forms) {
    for (const input of form.elements) {
      const labels = input.labels;
      if (labels) {
        for (const label of labels) {
          const text = label.innerText;
          if (text.match(/first name/i)) {
            input.value = fname;
          } else if (text.match(/last name/i)) {
            input.value = lname;
          } else if (text.match(/full name/i)) {
            input.value = fname + ' ' + lname;
          } else if (text.match(/email/i)) {
            input.value = email;
          } else if (text.match(/website/i)) {
            input.value = website;
          } else if (text.match(/linkedin/i)) {
            input.value = linkedin;
          } else if (text.match(/phone/i)) {
            input.value = phoneNum;
          } else if (text.match(/zipcode/i)) {
            input.value = zipcode;
          } else if (text.match(/address/i)) {
            input.value = address;
          } else if (text.match(/country/i)) {
            input.value = country;
          } else if (text.match(/state/i)) {
            input.value = state;
          } else if (text.match(/city/i)) {
            input.value = city;
          } else if (text.match(/university/i)) {
            input.value = education;
          } else if (text.match(/education/i)) {
            input.value = education;
          } else if (text.match(/this job/i)) {
            input.value = hearAbout;
          } else if (text.match(/pronouns/i)) {
            input.value = pronouns;
          } else if (gender === 'male' && text.match(/\b(male|man)/i)) {
            input.checked = true;
          } else if (gender === 'female' && text.match(/female|woman/i)) {
            input.checked = true;
          } else if (gender === 'non-binary' && text.match(/non(-| )?binary/i)) {
            input.checked = true;
          } else if (race === 'white' && text.match(/white/i)) {
            input.checked = true;
          }
        }
      }
    }
  }
}

chrome.runtime.onMessage.addListener(async request => {
  if (request === 'autofill') {
    const { options } = await get('options');
    autofillForms(options);
  }
});
