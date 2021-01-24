import { set, get, query, update, clear } from "./utils.js";


// Functions related to apps
export async function getAllApps() {
  const { apps } = await get(['apps']);
  return apps;
}

export async function appendApp() {
  const [tab] = await query({active: true, currentWindow: true});
  const site = [tab.url, tab.title];

  const { apps = [] } = await get(['apps']);
  apps.push(site);
  await set({ apps });

  console.log('[+] Saved: ' + site);

  const { currIdx } = await get(['currIdx']);
  if (currIdx == -1) {
    await set({currIdx: 0});
  }

  return site;
}

export async function loadApp(idx) {
  const apps = await getAllApps();
  await update({ url: apps[idx][0] });
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

export async function removeApp(){
  
}

export async function start() {
  //await loadApp(0);
}

chrome.storage.onChanged.addListener(async changes => {
  const { apps = [], currIdx } = await get(['apps', 'currIdx']);

  if ('currIdx' in changes) {
    renderAppList(apps, changes['currIdx'].newValue);
  }

  if ('apps' in changes){
    renderAppList(changes['apps'].newValue, currIdx);
  }
});

function renderAppList(appSites, currIdx) {
	const appList = document.getElementById('app-list');
	while (appList.firstChild) {
	  appList.removeChild(appList.lastChild);
	}

	for (let i=0; i < appSites.length; i++) {
	  const appItem = document.createElement('li');
	  appItem.innerHTML = appSites[i][1];
    appItem.addEventListener('click', async () => {
      await set({ currIdx: i });
      await loadApp(i);
    });
    if (i == currIdx) {
      appItem.classList.add("highlight");
    }
	  appList.appendChild(appItem);
	}
}

async function sendAutofillMessage() {
  const [tab] = await query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, 'autofill');
}

document.addEventListener('DOMContentLoaded', async () => {
  //document.getElementById('clear').addEventListener('click', clear);
  document.getElementById('save').addEventListener('click', appendApp);
  document.getElementById('start').addEventListener('click', loadCurrApp);
  document.getElementById('previous').addEventListener('click', prevApp);
  document.getElementById('next').addEventListener('click', nextApp);
  document.getElementById('autofill').addEventListener('click', sendAutofillMessage);

  const { apps = [], currIdx } = await get(['apps', 'currIdx']);
  renderAppList(apps, currIdx);
});
