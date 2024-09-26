// Arka plan işlemleri için gerekli kodlar buraya gelecek
chrome.runtime.onInstalled.addListener(() => {
    console.log('Instagram İçerik İndirici eklentisi yüklendi.');
  });
  
  // İndirme işlemini gerçekleştirecek fonksiyon
  function indiriciyi_baslat(url, dosya_adi) {
    chrome.downloads.download({
      url: url,
      filename: dosya_adi,
      saveAs: true
    });
  }
  
  // Content script'ten gelen mesajları dinle
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "indir") {
      indiriciyi_baslat(request.url, request.dosya_adi);
    }
  });
  
  // Sekme güncellendiğinde içerikleri yeniden işle
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url.includes('instagram.com')) {
      chrome.tabs.sendMessage(tabId, { action: "icerik_bul" });
    }
  });