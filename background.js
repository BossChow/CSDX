chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateBadge") {
    if (request.count > 0) {
      chrome.action.setBadgeText({
        text: request.count.toString(),
        tabId: sender.tab.id,
      });
      chrome.action.setBadgeBackgroundColor({
        color: [0, 0, 0, 0],
        tabId: sender.tab.id,
      });
      chrome.action.setBadgeTextColor({
        color: "#FF0000",
        tabId: sender.tab.id,
      });
    } else {
      chrome.action.setBadgeText({ text: "", tabId: sender.tab.id });
    }
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    tab.url.includes("google.com/search")
  ) {
    chrome.action.setBadgeText({ text: "", tabId: tabId });
  }
});
