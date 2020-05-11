// Listen to messages sent from other parts of the extension.

chrome.browserAction.onClicked.addListener((tab) => {
  chrome.windows.create({
    type: "popup",
    url: chrome.runtime.getURL("popup.html"),
    width: 1000,
    height: 700,
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // onMessage must return "true" if response is async.
  let isResponseAsync = false;

  if (request.popupMounted) {
    console.log("eventPage notified that Popup.tsx has mounted.");
  }

  return isResponseAsync;
});
