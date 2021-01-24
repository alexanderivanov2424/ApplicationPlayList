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
    appItem.className = "app-list-element";
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


async function removeCurrentApp(){

}


async function scrollAppList(){

}

async function togglePlayPause() {
  let { isApplying = false } = await get('isApplying');
  isApplying = !isApplying;
  const playPause = document.getElementById('start');
  if (isApplying) {
    const [tab] = await query({ active: true, currentWindow: true });
    await set({ priorPage: tab.url });
    playPause.src = 'media/pause.svg';
    playPause.style.left = '0px';
    await loadCurrApp();
  } else {
    playPause.src = 'media/start.svg';
    playPause.style.left = '3px';
    const { priorPage } = await get('priorPage');
    await update({ url: priorPage });
  }
  await set({ isApplying });
}

document.addEventListener('DOMContentLoaded', async () => {
  //document.getElementById('clear').addEventListener('click', clear);
  document.getElementById('save').addEventListener('click', appendApp);
  document.getElementById('start').addEventListener('click', togglePlayPause);
  document.getElementById('previous').addEventListener('click', prevApp);
  document.getElementById('next').addEventListener('click', nextApp);
  document.getElementById('autofill').addEventListener('click', sendAutofillMessage);
  document.getElementById('done').addEventListener('click', removeCurrentApp);

  document.getElementById('autofill').addEventListener("scroll", scrollAppList);

  const { apps = [], currIdx } = await get(['apps', 'currIdx']);
  renderAppList(apps, currIdx);
  const { isApplying = false } = await get('isApplying');
  const playPause = document.getElementById('start');
  playPause.src = isApplying ? 'media/pause.svg' : 'media/start.svg';
  playPause.style.left = isApplying ? '0px' : '3px';
});
