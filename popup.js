document.addEventListener('DOMContentLoaded', () => {
  function get(keys) {
    return new Promise(resolve => chrome.storage.local.get(keys, resolve));
  }

  function set(items) {
    return new Promise(resolve => chrome.storage.local.set(items, resolve));
  }

  function clear() {
    return new Promise(resolve => chrome.storage.local.clear(resolve));
  }

  function getCurrent() {
    return new Promise(resolve => chrome.tabs.getCurrent(resolve));
  }

  function update(updateProperties) {
    return new Promise(resolve => chrome.tabs.update(updateProperties, resolve));
  }

  async function save() {
    const { data = [] } = await get(['data']);
    const tab = await getCurrent();
    const url = tab.url;
    data.push(url);
    await set({ data });
    console.log('[+] Saved: ' + url);
    return url;
  }

  async function load() {
    const { data } = await get(['data']);
    console.log('[+] Value currently is:', data);
    return data;
  }

  async function loadPage() {
    const data = await load();
    await update({ url: data[0] });
  }

  document.getElementById('clear').addEventListener('click', clear);
  document.getElementById('save').addEventListener('click', save);
  document.getElementById('load').addEventListener('click', load);
  document.getElementById('load-page').addEventListener('click', loadPage);
});
