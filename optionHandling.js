import { set, get, clear } from "./utils.js";

let optionsForm = null;

////"male", "female", "non-binary", "other", "no-say",
//const FIELDS = ["fname","lname", "gender", "email", "website", "linkedin",
//  "phone-num", "address", "zipcode", "country", "state", "birth-date",
//  "education", "major", "hear-about", "pronouns"];

function formOptions() {
  const options = {};
  const formData = new FormData(optionsForm);
  formData.forEach((value, key) => options[key] = value);
  return options;
}

async function saveOptions() {
  const options = formOptions();
  await set({ options });
  await saveRadio('gender');
}

export async function getOptions() {
  const { options } = await get("options");
  return options;
}

async function loadOptions() {
  const { options } = await get("options");

  for (const [key, value] of Object.entries(options)) {
    const input = document.getElementById(key);
    if (input) {
      input.value = value;
    }
  }
  await loadRadio('gender');
}

async function saveRadio(key) {
  let value = null;
  const radios = document.querySelectorAll(`input[name=${key}]`);
  for (const radio of radios) {
    if (radio.checked) {
      value = radio.value;
    }
  }
  await set({ [key]: value });
}

async function loadRadio(key) {
  const { [key]: value = null } = await get(key);
  const radios = document.querySelectorAll(`input[name=${key}]`);
  for (const radio of radios) {
    radio.checked = radio.value === value;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  optionsForm = document.forms['options-form'];
  console.log(optionsForm);
  document.getElementById('save-options').addEventListener('click', saveOptions);
  document.getElementById('clear').addEventListener('click', clear);
});

window.onload = loadOptions;
