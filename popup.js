// Popup açıldığında çalışacak kodlar
document.addEventListener('DOMContentLoaded', () => {
    // Aktif sekmedeki içerikleri bul
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: "icerik_bul"}, (response) => {
        if (response && response.icerikler) {
          icerikler_goster(response.icerikler);
        }
      });
    });
  });
  
  function icerikler_goster(icerikler) {
    const iceriklerDiv = document.getElementById('icerikler');
    iceriklerDiv.innerHTML = ''; // Önceki içeriği temizle

    if (icerikler.length === 0) {
      iceriklerDiv.textContent = 'İndirilebilir içerik bulunamadı.';
      return;
    }

    icerikler.forEach((icerik, index) => {
      const icerikElementi = document.createElement('div');
      icerikElementi.className = 'icerik';

      const bilgi = document.createElement('span');
      bilgi.textContent = `${icerik.tip.charAt(0).toUpperCase() + icerik.tip.slice(1)} ${index + 1}`;
      icerikElementi.appendChild(bilgi);

      const indirButonu = document.createElement('button');
      indirButonu.textContent = 'İndir';
      indirButonu.addEventListener('click', () => {
        chrome.runtime.sendMessage({
          action: "indir",
          url: icerik.url,
          dosya_adi: icerik.dosya_adi
        });
      });
      icerikElementi.appendChild(indirButonu);

      iceriklerDiv.appendChild(icerikElementi);
    });
  }

  // Sayfadaki değişiklikleri dinle
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "icerikler_guncellendi") {
      icerikler_goster(request.icerikler);
    }
  });