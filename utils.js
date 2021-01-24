export function get(keys) {
  return new Promise(resolve => chrome.storage.local.get(keys, resolve));
}

export function set(items) {
  return new Promise(resolve => chrome.storage.local.set(items, resolve));
}

export function query(queryInfo) {
  return new Promise(resolve => chrome.tabs.query(queryInfo, resolve));
}

export function update(updateProperties) {
  return new Promise(resolve => chrome.tabs.update(updateProperties, resolve));
}

export async function clear() {
  await set({ currIdx: -1, apps: [] });
}
