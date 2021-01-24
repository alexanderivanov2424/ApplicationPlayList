import { set, get, clear } from "./utils.js";

//"male", "female", "non-binary", "other", "no-say",
const FIELDS = ["fname","lname", "gender", "email", "website", "linkedin",
  "phone-num", "address", "zipcode", "country", "state", "birth-date",
  "education", "major", "hear-about", "pronouns"];

async function saveOptions() {
  const options = {};
  // const optionsForm = document.forms["options-form"]
  for (const key of FIELDS) {
    // element = document.getElementById(key)
    options[key] = document.getElementById(key).value;
  }
  await set({ options });
}

export async function getOptions() {
  const { options } = await get("options");
  return options;
}

async function loadOptions() {
  const { options } = await get("options");
  const optionsForm = document.forms["options-form"]

  for (const key of FIELDS) {
    if(options[key]){
      console.log(key);
      const input = document.getElementById(key);
      if(input.type === "radio"){
        input.checked = True;
        // input.value = options[key];
      } else {
        input.value = options[key];
      }
      // if(options[key]){
      //   document.getElementById(key).value = options[key];
      // }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('save-options').addEventListener('click', saveOptions);
  document.getElementById('clear').addEventListener('click', clear);
});

window.onload = loadOptions;
