function get(keys) {
  return new Promise(resolve => chrome.storage.local.get(keys, resolve));
}

function set(items) {
  return new Promise(resolve => chrome.storage.local.set(items, resolve));
}

async function clear() {
  //return new Promise(resolve => chrome.storage.local.clear(resolve));
  await set({ currIdx: -1, apps: [] });
}

function query(queryInfo) {
  return new Promise(resolve => chrome.tabs.query(queryInfo, resolve));
}

function update(updateProperties) {
  return new Promise(resolve => chrome.tabs.update(updateProperties, resolve));
}

// Functions related to apps
export async function getAllApps() {
  const { apps } = await get(['apps']);
  return apps;
}

export async function appendApp() {
  const [tab] = await query({active: true, currentWindow: true});
  const url = tab.url;

  const { apps = [] } = await get(['apps']);
  apps.push(url);
  await set({ apps });

  console.log('[+] Saved: ' + url);

  const { currIdx } = await get(['currIdx']);
  if (currIdx == -1) {
    await set({currIdx: 0});
  }
  
  return url;
}

export async function loadApp(idx) {
  const apps = await getAllApps();
  await update({ url: apps[idx] });
}

export async function loadCurrApp() {
  const { currIdx } = await get(['currIdx']);
  if (currIdx == -1) {
    return;
  }
  await loadApp(currIdx);
}

export async function prevApp() {
  let { currIdx } = await get(['currIdx']);
  if (currIdx == -1) {
    return;
  }

  currIdx = currIdx - 1;
  currIdx = currIdx < 0 ? 0 : currIdx;
  await set({ currIdx });
  await loadApp(currIdx);
}

export async function nextApp() {
  let { currIdx } = await get(['currIdx']);
  if (currIdx == -1) {
    return;
  }

  currIdx = currIdx + 1;
  const currLength = (await getAllApps()).length;
  currIdx = currIdx >= currLength ? currLength - 1 : currIdx;
  await set({ currIdx });
  await loadApp(currIdx);
}

export async function start() {
  //await loadApp(0);
}



document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('clear').addEventListener('click', clear);
  document.getElementById('save').addEventListener('click', appendApp);
  document.getElementById('load-app').addEventListener('click', loadCurrApp);
  document.getElementById('previous').addEventListener('click', prevApp);
  document.getElementById('next').addEventListener('click', nextApp);
});
