// Tüm anket türleri ve sekme yapılandırması
const allTabConfig = {
  arti_bir: {
    label: "+1 Memnuniyet Anketleri",
    tabs: [
      {
        key: "ogrenci",
        label: "Öğrenci",
        sheetIndex: 0,
        birimStnNo: anketBilgileri["arti_bir_ogrenci"].birimStnNo,
        page: "../../pages/+1/ogrenci.html",
        dataYolu: anketBilgileri["arti_bir_ogrenci"].excelYolu,
      },
      {
        key: "isveren",
        label: "İşveren",
        sheetIndex: 1,
        birimStnNo: anketBilgileri["arti_bir_isveren"].birimStnNo,
        page: "../../pages/+1/isveren.html",
        dataYolu: anketBilgileri["arti_bir_isveren"].excelYolu,
      },
      {
        key: "personel",
        label: "Öğretim Elemanı",
        sheetIndex: 2,
        birimStnNo: anketBilgileri["arti_bir_personel"].birimStnNo,
        page: "../../pages/+1/personel.html",
        dataYolu: anketBilgileri["arti_bir_personel"].excelYolu,
      },
    ],
  },
  mezun: {
    label: "Mezun Memnuniyeti Anketi",
    tabs: [
      {
        key: "mezun",
        label: "Mezun",
        sheetIndex: 0,
        birimStnNo: 27, // 28. sütun, index 27
        page: "../../pages/mezun/mezun.html",
        dataYolu: anketBilgileri["mezun_memnuniyeti"].excelYolu,
      },
    ],
  },
  // Diğer anket türleri buraya eklenebilir
};

// URL'den hangi anket türü ve sekmesi seçildiğini al
function getSelectedSurvey() {
  const params = new URLSearchParams(window.location.search);
  // Örn: ?anket=mezun&tab=mezun
  const anket = params.get("anket") || "arti_bir";
  const tab = params.get("tab") || "ogrenci";
  return { anket, tab };
}

// Excel'den ilgili sayfanın birim listesini oku
async function getBirimler(dataYolu, sheetIndex, birimStnNo) {
  const response = await fetch(dataYolu);
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const worksheet = workbook.Sheets[workbook.SheetNames[sheetIndex]];
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  const birimlerSet = new Set();
  for (let r = range.s.r + 1; r <= range.e.r; r++) {
    const cell = worksheet[XLSX.utils.encode_cell({ c: birimStnNo, r })];
    const birim = (cell?.v ?? "").toString().trim();
    if (birim) birimlerSet.add(birim);
  }
  return Array.from(birimlerSet).sort((a, b) =>
    a.localeCompare(b, "tr", { sensitivity: "base" })
  );
}

// Sekmeleri oluştur
function renderTabs(anketKey, selectedTabKey) {
  const tablarDiv = document.getElementById("tablar");
  tablarDiv.innerHTML = "";
  const tabList = allTabConfig[anketKey].tabs;
  tabList.forEach((tab) => {
    const btn = document.createElement("button");
    btn.className = "tab-btn" + (tab.key === selectedTabKey ? " active" : "");
    btn.dataset.type = tab.key;
    btn.textContent = tab.label;
    btn.onclick = function () {
      // URL parametresini güncelle
      const params = new URLSearchParams(window.location.search);
      params.set("anket", anketKey);
      params.set("tab", tab.key);
      window.location.search = params.toString();
    };
    tablarDiv.appendChild(btn);
  });
}

// Birimleri ve SUBÜ linkini göster
async function renderBirimler(anketKey, tabKey) {
  const tabList = allTabConfig[anketKey].tabs;
  const tab = tabList.find((t) => t.key === tabKey) || tabList[0];

  // Başlık güncelle
  document.getElementById("header-title").textContent =
    allTabConfig[anketKey].label;

  // SUBÜ linkini güncelle
  const subuLink = document.getElementById("subu-link");
  subuLink.href = tab.page;
  subuLink.querySelector("span").textContent = "SUBÜ";

  // Birim listesini yükle
  const birimListesiUl = document.getElementById("birim-listesi");
  birimListesiUl.innerHTML =
    '<li class="birim-item"><div class="loading-text">Yükleniyor...</div></li>';

  const birimler = await getBirimler(
    tab.dataYolu,
    tab.sheetIndex,
    tab.birimStnNo
  );
  birimListesiUl.innerHTML = "";

  if (birimler.length === 0) {
    birimListesiUl.innerHTML = `
          <li class="birim-item">
            <div class="empty-state">
              <div class="empty-state-icon">📋</div>
              <div>Birim bulunamadı.</div>
            </div>
          </li>
        `;
    return;
  }

  // Birimleri 5'lik gruplara böl
  const columnCount = Math.ceil(birimler.length / 5);
  const columns = [];
  for (let i = 0; i < columnCount; i++) {
    columns.push(birimler.slice(i * 5, (i + 1) * 5));
  }

  // Sütunları oluştur
  columns.forEach((columnBirimler) => {
    const columnDiv = document.createElement("div");
    columnDiv.className = "birim-column";

    columnBirimler.forEach((birim) => {
      const a = document.createElement("a");
      a.className = "birim-link";
      a.innerHTML = `<span>${birim}</span>`;
      a.href = "#";
      a.onclick = function (e) {
        e.preventDefault();
        window.location.href = tab.page + "?birim=" + encodeURIComponent(birim);
      };
      columnDiv.appendChild(a);
    });

    birimListesiUl.appendChild(columnDiv);
  });
}

// Sayfa açılışında doğru sekme ve birimleri göster
(function () {
  const { anket, tab } = getSelectedSurvey();
  // Sekmeleri oluştur
  renderTabs(anket, tab);
  // Birimleri göster
  renderBirimler(anket, tab);
})();
