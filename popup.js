document.addEventListener("DOMContentLoaded", () => {
  const enableToggle = document.getElementById("enableToggle");
  const blockedSitesTextarea = document.getElementById("blockedSites");
  const saveButton = document.getElementById("saveButton");
  const statusDiv = document.getElementById("status");
  const closeButton = document.getElementById("closeButton");

  // 加载当前设置
  chrome.storage.sync.get(["isEnabled", "blockedSites"], (result) => {
    enableToggle.checked = result.isEnabled !== false;
    if (result.blockedSites) {
      blockedSitesTextarea.value = result.blockedSites.join("\n");
    } else {
      // 如果没有保存的设置，使用预置的域名
      const defaultBlockedSites = ["csdn.net", "csdn.com"];
      blockedSitesTextarea.value = defaultBlockedSites.join("\n");
      // 保存默认设置
      chrome.storage.sync.set({ blockedSites: defaultBlockedSites });
    }
  });

  // 切换开关时自动保存
  enableToggle.addEventListener("change", () => {
    saveSettings();
  });

  // 保存设置
  function saveSettings() {
    const isEnabled = enableToggle.checked;
    const blockedSites = blockedSitesTextarea.value
      .split("\n")
      .map((site) => site.trim())
      .filter(Boolean);

    chrome.storage.sync.set({ isEnabled, blockedSites }, () => {
      statusDiv.textContent = "设置已保存";
      setTimeout(() => {
        statusDiv.textContent = "";
      }, 2000);
    });
  }

  // 保存按钮仍然保留，用于保存屏蔽网站列表
  saveButton.addEventListener("click", saveSettings);

  // 关闭按钮功能
  closeButton.addEventListener("click", () => {
    window.close();
  });
});
