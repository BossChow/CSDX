document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("blockedSites");
  const saveButton = document.getElementById("saveButton");
  const status = document.getElementById("status");

  chrome.storage.sync.get("blockedSites", (result) => {
    textarea.value = result.blockedSites
      ? result.blockedSites.join("\n")
      : "csdn.net";
  });

  saveButton.addEventListener("click", () => {
    const blockedSites = textarea.value
      .split("\n")
      .map((site) => site.trim())
      .filter(Boolean)
      .map((site) => site.toLowerCase());
    chrome.storage.sync.set({ blockedSites }, () => {
      status.textContent = "设置已保存";
      setTimeout(() => {
        status.textContent = "";
      }, 3000);
    });
  });
});
