import { set, get, clear } from './utils.js';

let optionsForm = null;

function formOptions() {
  const formData = new FormData(optionsForm);
  return Object.fromEntries(formData);
}

async function saveOptions() {
  await set({ options: formOptions() });
}

export async function getOptions() {
  const { options = formOptions() } = await get('options');
  return options;
}

function getInput(key, value) {
  return document.querySelector(`[name="${key}"][value="${value || 'none'}"]`) || document.querySelector(`[name="${key}"]`);
}

async function loadOptions() {
  const { options = formOptions() } = await get('options');

  for (const [key, value] of Object.entries(options)) {
    const input = getInput(key, value);
    if (input.type === 'radio') {
      input.checked = true;
    } else {
      input.value = value;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  optionsForm = document.forms['options-form'];
  optionsForm.addEventListener('submit', e => e.preventDefault());
  document.getElementById('save-options').addEventListener('click', saveOptions);
  document.getElementById('clear').addEventListener('click', clear);
});

window.onload = loadOptions;
