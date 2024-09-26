// İndirme butonunu oluştur ve ekle
function indirmeButonuEkle(element, url, dosyaAdi) {
  const buton = document.createElement('button');
  buton.innerText = 'İndir';
  buton.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 9999;
    background-color: #0095f6;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    font-size: 14px;
    cursor: pointer;
  `;
  
  buton.addEventListener('click', (e) => {
    e.stopPropagation();
    chrome.runtime.sendMessage({
      action: "indir",
      url: url,
      dosya_adi: dosyaAdi
    });
  });

  element.style.position = 'relative';
  element.appendChild(buton);
}

// Sayfadaki içerikleri bul ve indirme butonlarını ekle
function icerikleriIsle() {
  // Fotoğraflar için
  document.querySelectorAll('article img').forEach((img, index) => {
    if (!img.closest('.buton-eklendi')) {
      const src = img.src;
      const dosyaAdi = `instagram_resim_${index + 1}.jpg`;
      indirmeButonuEkle(img.parentElement, src, dosyaAdi);
      img.closest('article').classList.add('buton-eklendi');
    }
  });

  // Videolar ve Reels için
  document.querySelectorAll('article video').forEach((video, index) => {
    if (!video.closest('.buton-eklendi')) {
      const src = video.src || (video.querySelector('source') ? video.querySelector('source').src : null);
      if (src) {
        const dosyaAdi = `instagram_video_${index + 1}.mp4`;
        indirmeButonuEkle(video.parentElement, src, dosyaAdi);
        video.closest('article').classList.add('buton-eklendi');
      }
    }
  });
}

// Sayfa yüklendiğinde ve kaydırma yapıldığında içerikleri işle
window.addEventListener('load', icerikleriIsle);
window.addEventListener('scroll', icerikleriIsle);

// Dinamik içerik yüklemelerini izle
const observer = new MutationObserver(icerikleriIsle);
observer.observe(document.body, { childList: true, subtree: true });

// Arka plan script'inden gelen mesajları dinle
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "icerik_bul") {
    icerikleriIsle();
    sendResponse({success: true});
  }
});