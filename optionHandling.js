import { set, get } from "./utils.js";

const FIELDS = ["fname","lname"];

async function saveOptions() {
  const options = {};
  for (const key of FIELDS) {
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
  for (const key of FIELDS) {
    document.getElementById(key).value = options[key];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('save-options').addEventListener('click', saveOptions);
});

window.onload = loadOptions;
