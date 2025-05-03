// Always-Active Chrome Extension Background Script
chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
    });
});

const log = (...args) => chrome.storage.local.get({ log: false }, prefs => prefs.log && console.log(...args));

const notify = async (tabId, title, symbol = 'E') => {
  tabId = tabId || (await chrome.tabs.query({ active: true, lastFocusedWindow: true }))[0].id;
  chrome.action.setBadgeText({ tabId, text: symbol });
  chrome.action.setTitle({ tabId, title });
};

const activate = async () => {
  if (activate.busy) return;
  activate.busy = true;

  try {
    await chrome.scripting.unregisterContentScripts();

    const props = {
      matches: ['*://*/*'],
      allFrames: true,
      matchOriginAsFallback: true,
      runAt: 'document_start'
    };

    await chrome.scripting.registerContentScripts([
      {
        ...props,
        id: 'main',
        js: ['data/inject/main.js'],
        world: 'MAIN'
      },
      {
        ...props,
        id: 'isolated',
        js: ['data/inject/isolated.js'],
        world: 'ISOLATED'
      }
    ]);
  } catch (e) {
    notify(undefined, 'Blocker Registration Failed: ' + e.message);
    console.error('Blocker Registration Failed', e);
  }

  for (const c of activate.actions) c();
  activate.actions.length = 0;
  activate.busy = false;
};

chrome.runtime.onStartup.addListener(activate);
chrome.runtime.onInstalled.addListener(activate);
activate();
activate.actions = [];

/* Simple icon click feedback */
chrome.action.onClicked.addListener(tab => {
  notify(tab.id, 'Extension is always active globally', '✓');
});

/* Messaging support */
chrome.runtime.onMessage.addListener((request, sender, response) => {
  if (request.method === 'check') {
    log('check event from', sender.tab);
  } else if (request.method === 'change') {
    log('page visibility state is changed', sender.tab);
  } else if (request.method === 'set-icon') {
    chrome.action.setIcon({
      tabId: sender.tab.id,
      path: {
        '16': '/data/icons/suite_16.png',
        '32': '/data/icons/suite_38.png',
        '48': '/data/icons/suite_48.png'
      }
    });
  }
});
