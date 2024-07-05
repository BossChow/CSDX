"use strict";

let blockedSites = ["csdn.net", "csdn.com"];
let isEnabled = true; // 默认设置为启用状态
let removedCount = 0;

function hideBlockedResults() {
  const searchResults = document.querySelectorAll("#search .g, #search .rc");
  let newRemovedCount = 0;

  searchResults.forEach((result) => {
    const link = result.querySelector("a[data-ved]");
    if (link && link.href) {
      const url = new URL(link.href);
      if (
        isEnabled &&
        blockedSites.some(
          (site) => url.hostname === site || url.hostname.endsWith("." + site)
        )
      ) {
        result.style.display = "none";
        newRemovedCount++;
      } else {
        result.style.display = "";
      }
    }
  });

  removeEmptySpaces();

  if (newRemovedCount !== removedCount) {
    removedCount = newRemovedCount;
    updateBadge(removedCount);
  }
}

function removeEmptySpaces() {
  // 保持原有实现
}

function updateBadge(count) {
  chrome.runtime.sendMessage({ action: "updateBadge", count: count });
}

function loadSettings() {
  chrome.storage.sync.get(["blockedSites", "isEnabled"], (result) => {
    if (result.blockedSites) blockedSites = result.blockedSites;
    if (result.isEnabled !== undefined) isEnabled = result.isEnabled;
    applyBlockingState();
  });
}

function applyBlockingState() {
  hideBlockedResults(); // 这将处理启用和禁用两种状态
}

chrome.storage.onChanged.addListener((changes, namespace) => {
  let needsUpdate = false;
  if (changes.blockedSites) {
    blockedSites = changes.blockedSites.newValue;
    needsUpdate = true;
  }
  if (changes.isEnabled !== undefined) {
    isEnabled = changes.isEnabled.newValue;
    needsUpdate = true;
  }
  if (needsUpdate) {
    applyBlockingState();
  }
});

const observer = new MutationObserver((mutations) => {
  for (let mutation of mutations) {
    if (mutation.type === "childList") {
      applyBlockingState();
      break;
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });

loadSettings();
