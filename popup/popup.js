console.log("popup.js");
document.getElementById("getInfoBtn").addEventListener("click", () => {
  // 取得當前活躍分頁
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    // 顯示標題和 URL
    document.getElementById("pageTitle").textContent = tab.title;
    document.getElementById("pageUrl").textContent = tab.url;
    document.getElementById("result").style.display = "block";
  });
});
