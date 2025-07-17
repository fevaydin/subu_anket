const appState = {
  birimMemnuniyet: null,
  cinsiyetSayaci: null,
  sehirMemnuniyet: null,
  sehirSayaclari: null,
  calisanSayisiAraliklari: null,
  ifadeMem: [],
};

const ifadeOranlari = [];
const ifadeMem = [];
appState.ifadeMem = ifadeMem;

function getAnketKeyAndSheetIndex() {
  const path = window.location.pathname;
  if (path.includes("isveren"))
    return { anketKey: "arti_bir_isveren", sheetIndex: 1 };
  if (path.includes("personel"))
    return { anketKey: "arti_bir_personel", sheetIndex: 2 };
  if (path.includes("mezun"))
    return { anketKey: "mezun_memnuniyeti", sheetIndex: 0 };
  return { anketKey: "arti_bir_ogrenci", sheetIndex: 0 };
}

function getFilteredRows(worksheet, range, anketKey, birimParam) {
  if (!birimParam) return null;
  const birimStnNo = anketBilgileri[anketKey].birimStnNo;
  const filteredRows = [];
  for (let r = range.s.r + 1; r <= range.e.r; r++) {
    const cell = worksheet[XLSX.utils.encode_cell({ c: birimStnNo, r })];
    const birim = (cell?.v ?? "").toString().trim();
    if (birim === birimParam) filteredRows.push(r);
  }
  return filteredRows;
}

async function analysisExcel() {
  const { anketKey, sheetIndex } = getAnketKeyAndSheetIndex();
  window.anketKey = anketKey;
  const dataYolu = anketBilgileri[anketKey].excelYolu;
  window.dataYolu = dataYolu;
  const response = await fetch(dataYolu);
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const worksheet = workbook.Sheets[workbook.SheetNames[sheetIndex]];
  const range = XLSX.utils.decode_range(worksheet["!ref"]);

  // Birim parametresi
  let birimParam = null;
  try {
    const urlParams = new URLSearchParams(window.location.search);
    birimParam = urlParams.get("birim");
  } catch (e) {}

  // Katılımcı sayısı
  let filteredRows = getFilteredRows(worksheet, range, anketKey, birimParam);
  const katilimciSayisi = filteredRows
    ? filteredRows.length
    : range.e.r - range.s.r;
  const katilimciElem = document.getElementById("katilimci-sayisi");
  if (katilimciElem)
    katilimciElem.textContent = "Katılımcı Sayısı: " + katilimciSayisi;

  // Tablo ve analizler
  const anketBilgi = anketBilgileri[anketKey];
  let soruNo = 1;
  for (let grupIndex = 0; grupIndex < anketBilgi.grupBas.length; grupIndex++) {
    const grupBasSutun = anketBilgi.grupBas[grupIndex];
    const grupSonSutun = anketBilgi.grupSon[grupIndex];
    const grupIfadeSayisi = grupSonSutun - grupBasSutun + 1;
    createGrupTablo(
      worksheet,
      range,
      anketBilgi,
      grupIndex,
      filteredRows,
      soruNo
    );
    soruNo += grupIfadeSayisi;
  }

  createGenelTablo(worksheet, range, anketBilgi, filteredRows);
  yuksekAlanHesapla();

  // Şehir analizleri
  const { sehirSayaclari, sehirMemnuniyet } = sehirHesapla(
    worksheet,
    range,
    filteredRows
  );
  appState.sehirSayaclari = sehirSayaclari;
  appState.sehirMemnuniyet = sehirMemnuniyet;

  // Birim analizleri
  appState.birimMemnuniyet = birimHesapla(worksheet, range, filteredRows);
  if (typeof drawHBarChart === "function") drawHBarChart();

  // Çalışan sayısı (işveren)
  if (anketKey === "arti_bir_isveren") {
    appState.calisanSayisiAraliklari = calisanSayisiAraliklari(
      worksheet,
      range,
      filteredRows
    );
    if (typeof drawBarChartCalisanSayilari === "function")
      drawBarChartCalisanSayilari();
  }

  // Cinsiyet (personel/mezun)
  if (anketKey === "arti_bir_personel" || anketKey === "mezun_memnuniyeti") {
    appState.cinsiyetSayaci = cinsiyetSayaciHesapla(
      worksheet,
      range,
      filteredRows
    );
    if (typeof drawPieChartCinsiyet === "function") drawPieChartCinsiyet();
  }
}
window.addEventListener("DOMContentLoaded", analysisExcel);

function createGrupTablo(
  worksheet,
  range,
  ogrenciBilgi,
  grupIndex,
  filteredRows,
  soruNoBaslangic
) {
  const grupBasSutun = ogrenciBilgi.grupBas[grupIndex];
  const grupSonSutun = ogrenciBilgi.grupSon[grupIndex];
  const grupIfadeler = ogrenciBilgi.ifadeler.slice(
    grupBasSutun - ogrenciBilgi.grupBas[0],
    grupSonSutun - ogrenciBilgi.grupBas[0] + 1
  );
  const grupAdi = ogrenciBilgi.boyutlar[grupIndex];

  const theadHTML = `
    <tr>
      <th style="width: 400px;" rowspan="2" colspan="2">${grupAdi}</th>
      <th style="width: 80px;" colspan="2" class="red">Kesinlikle Katılmıyorum</th>
      <th style="width: 80px;" colspan="2" class="orange">Katılmıyorum</th>
      <th style="width: 80px;" colspan="2" class="yellow">Ne Katılıyorum Ne Katılmıyorum</th>
      <th style="width: 80px;" colspan="2" class="light-green">Katılıyorum</th>
      <th style="width: 80px;" colspan="2" class="green">Kesinlikle Katılıyorum</th>
      <th style="width: 40px;" rowspan="2" class="blue">Ortalama</th>
      <th style="width: 40px;" rowspan="2" class="blue">%</th>
    </tr>
    <tr>
      <th style="width: 40px;" class="red">Frekans</th><th style="width: 40px;" class="red">%</th>
      <th style="width: 40px;" class="orange">Frekans</th><th style="width: 40px;" class="orange">%</th>
      <th style="width: 40px;" class="yellow">Frekans</th><th style="width: 40px;" class="yellow">%</th>
      <th style="width: 40px;" class="light-green">Frekans</th><th style="width: 40px;" class="light-green">%</th>
      <th style="width: 40px;" class="green">Frekans</th><th style="width: 40px;" class="green">%</th>
    </tr>
  `;

  const tbody = [];
  let genelCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let genelTotal = 0;

  for (let i = 0; i < grupIfadeler.length; i++) {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let toplam = 0;
    const rowRange =
      filteredRows ||
      Array.from(
        { length: range.e.r - range.s.r },
        (_, idx) => range.s.r + 1 + idx
      );
    for (const r of rowRange) {
      const cell =
        worksheet[XLSX.utils.encode_cell({ c: grupBasSutun + i, r })];
      if (cell && [1, 2, 3, 4, 5].includes(Number(cell.v))) {
        counts[cell.v]++;
        toplam++;
      }
    }
    const percents = [1, 2, 3, 4, 5].map((v) =>
      toplam ? +((counts[v] / toplam) * 100).toFixed(2) : 0
    );
    ifadeOranlari.push(percents);
    const ortalama = toplam
      ? (
          [1, 2, 3, 4, 5].reduce((sum, v) => sum + v * counts[v], 0) / toplam
        ).toFixed(2)
      : "0.00";
    const yuzdeSkor = (
      ([1, 2, 3, 4, 5].reduce((sum, v) => sum + v * counts[v], 0) / toplam) *
      20
    ).toFixed(2);
    ifadeMem.push(yuzdeSkor);

    [1, 2, 3, 4, 5].forEach((v) => (genelCounts[v] += counts[v]));
    genelTotal += toplam;

    tbody.push(`
      <tr>
        <td style="width: 20px;">${soruNoBaslangic + i}</td>
        <td style="width: 380px;">${grupIfadeler[i]}</td>
        <td style="width: 40px;" class="red">${counts[1]}</td>
        <td style="width: 40px;" class="red">${percents[0]}</td>
        <td style="width: 40px;" class="orange">${counts[2]}</td>
        <td style="width: 40px;" class="orange">${percents[1]}</td>
        <td style="width: 40px;" class="yellow">${counts[3]}</td>
        <td style="width: 40px;" class="yellow">${percents[2]}</td>
        <td style="width: 40px;" class="light-green">${counts[4]}</td>
        <td style="width: 40px;" class="light-green">${percents[3]}</td>
        <td style="width: 40px;" class="green">${counts[5]}</td>
        <td style="width: 40px;" class="green">${percents[4]}</td>
        <td style="width: 40px;" class="blue">${ortalama}</td>
        <td style="width: 40px;" class="blue">${yuzdeSkor}</td>
      </tr>
    `);
  }

  const genelPercents = [1, 2, 3, 4, 5].map((v) =>
    genelTotal ? +((genelCounts[v] / genelTotal) * 100).toFixed(2) : 0
  );
  const genelOrtalama = genelTotal
    ? (
        [1, 2, 3, 4, 5].reduce((sum, v) => sum + v * genelCounts[v], 0) /
        genelTotal
      ).toFixed(2)
    : "0.00";
  const genelYuzdeSkor = (
    ([1, 2, 3, 4, 5].reduce((sum, v) => sum + v * genelCounts[v], 0) /
      genelTotal) *
    20
  ).toFixed(2);

  const tablo = document.getElementById("grupTablo" + grupIndex);
  if (tablo) {
    tablo.querySelector("thead").innerHTML = theadHTML;
    tablo.querySelector("tbody").innerHTML = tbody.join("");
    tablo.querySelector("tfoot").innerHTML = `
      <tr>
        <td style="width: 400px;" colspan="2"><strong>Toplam</strong></td>
        <td style="width: 40px;" class="red">${genelCounts[1]}</td>
        <td style="width: 40px;" class="red">${genelPercents[0]}</td>
        <td style="width: 40px;" class="orange">${genelCounts[2]}</td>
        <td style="width: 40px;" class="orange">${genelPercents[1]}</td>
        <td style="width: 40px;" class="yellow">${genelCounts[3]}</td>
        <td style="width: 40px;" class="yellow">${genelPercents[2]}</td>
        <td style="width: 40px;" class="light-green">${genelCounts[4]}</td>
        <td style="width: 40px;" class="light-green">${genelPercents[3]}</td>
        <td style="width: 40px;" class="green">${genelCounts[5]}</td>
        <td style="width: 40px;" class="green">${genelPercents[4]}</td>
        <td style="width: 40px;" class="blue">${genelOrtalama}</td>
        <td style="width: 40px;" class="blue">${genelYuzdeSkor}</td>
      </tr>
    `;
  }
}

function yuksekAlanHesapla() {
  const yAlanlar = { y: [], o: [], d: [] };
  const besAlan = { y: [], o: [], d: [] };

  for (let i = 0; i < ifadeOranlari.length; i++) {
    const oranlar = ifadeOranlari[i];
    yAlanlar["y"].push((oranlar[3] || 0) + (oranlar[4] || 0));
    yAlanlar["o"].push(oranlar[2] || 0);
    yAlanlar["d"].push((oranlar[0] || 0) + (oranlar[1] || 0));
  }

  Object.entries(yAlanlar).forEach(([key, values]) => {
    const indexedValues = values.map((v, idx) => ({
      soru: idx + 1,
      oran: Math.round(v),
    }));
    indexedValues.sort((a, b) => b.oran - a.oran);
    besAlan[key] = indexedValues.slice(0, 5);
  });

  const ozelTablo = document.getElementById("ozelTablo");
  if (ozelTablo) {
    ozelTablo.innerHTML = "";

    // Yüksek memnuniyet alanları (y)
    let ySoruNoRow = `<tr><th style="width: 300px;" rowspan="2">Memnuniyetin yüksek olduğu alanlar</th><th style="width: 200px;">Soru No</th>`;
    let yYuzdeRow = `<tr><th style="width: 200px;">%</th>`;
    for (let i = 4; i >= 0; i--) {
      const item = besAlan.y[i];
      ySoruNoRow += `<td style="width: 100px;" class="y${5 - i}">${
        item.soru
      }</td>`;
      yYuzdeRow += `<td style="width: 100px;">${item.oran}</td>`;
    }
    ySoruNoRow += "</tr>";
    yYuzdeRow += "</tr>";
    ozelTablo.innerHTML += ySoruNoRow + yYuzdeRow;

    // Kararsızların yüksek olduğu alanlar (o)
    let oSoruNoRow = `<tr><th style="width: 300px;" rowspan="2">Kararsızların yüksek olduğu alanlar</th><th style="width: 200px;">Soru No</th>`;
    let oYuzdeRow = `<tr><th style="width: 200px;">%</th>`;
    for (let i = 4; i >= 0; i--) {
      const item = besAlan.o[i];
      oSoruNoRow += `<td style="width: 100px;" class="o${5 - i}">${
        item.soru
      }</td>`;
      oYuzdeRow += `<td style="width: 100px;">${item.oran}</td>`;
    }
    oSoruNoRow += "</tr>";
    oYuzdeRow += "</tr>";
    ozelTablo.innerHTML += oSoruNoRow + oYuzdeRow;

    // İyileştirme uygulanabilir alanlar (d)
    let dSoruNoRow = `<tr><th style="width: 300px;" rowspan="2">İyileştirme uygulanabilir alanlar</th><th style="width: 200px;">Soru No</th>`;
    let dYuzdeRow = `<tr><th style="width: 200px;">%</th>`;
    for (let i = 4; i >= 0; i--) {
      const item = besAlan.d[i];
      dSoruNoRow += `<td style="width: 100px;" class="d${5 - i}">${
        item.soru
      }</td>`;
      dYuzdeRow += `<td style="width: 100px;">${item.oran}</td>`;
    }
    dSoruNoRow += "</tr>";
    dYuzdeRow += "</tr>";
    ozelTablo.innerHTML += dSoruNoRow + dYuzdeRow;
  }

  return { yAlanlar, besAlan };
}

function createGenelTablo(worksheet, range, ogrenciBilgi, filteredRows) {
  const baslangicSutun = ogrenciBilgi.grupBas[0];
  const bitisSutun = ogrenciBilgi.grupSon[ogrenciBilgi.grupSon.length - 1];
  const genelCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let genelTotal = 0;

  const rowRange =
    filteredRows ||
    Array.from(
      { length: range.e.r - range.s.r },
      (_, idx) => range.s.r + 1 + idx
    );
  for (let c = baslangicSutun; c <= bitisSutun; c++) {
    for (const r of rowRange) {
      const cell = worksheet[XLSX.utils.encode_cell({ c, r })];
      if (cell && [1, 2, 3, 4, 5].includes(Number(cell.v))) {
        genelCounts[cell.v]++;
        genelTotal++;
      }
    }
  }

  const genelPercents = [1, 2, 3, 4, 5].map((v) =>
    genelTotal ? +((genelCounts[v] / genelTotal) * 100).toFixed(2) : 0
  );
  const genelOrtalama = genelTotal
    ? (
        [1, 2, 3, 4, 5].reduce((sum, v) => sum + v * genelCounts[v], 0) /
        genelTotal
      ).toFixed(2)
    : "0.00";
  const genelYuzdeSkor = (
    ([1, 2, 3, 4, 5].reduce((sum, v) => sum + v * genelCounts[v], 0) /
      genelTotal) *
    20
  ).toFixed(2);
  window.genelYuzdeSkor = genelYuzdeSkor;

  const theadHTML = `
    <tr>
      <th style="width: 400px;" rowspan="2" colspan="1">Genel</th>
      <th style="width: 80px;" colspan="2" class="red">Kesinlikle Katılmıyorum</th>
      <th style="width: 80px;" colspan="2" class="orange">Katılmıyorum</th>
      <th style="width: 80px;" colspan="2" class="yellow">Ne Katılıyorum Ne Katılmıyorum</th>
      <th style="width: 80px;" colspan="2" class="light-green">Katılıyorum</th>
      <th style="width: 80px;" colspan="2" class="green">Kesinlikle Katılıyorum</th>
      <th style="width: 40px;" rowspan="2" class="blue">Ortalama</th>
      <th style="width: 40px;" rowspan="2" class="blue">%</th>
    </tr>
    <tr>
      <th style="width: 40px;" class="red">Frekans</th><th style="width: 40px;" class="red">%</th>
      <th style="width: 40px;" class="orange">Frekans</th><th style="width: 40px;" class="orange">%</th>
      <th style="width: 40px;" class="yellow">Frekans</th><th style="width: 40px;" class="yellow">%</th>
      <th style="width: 40px;" class="light-green">Frekans</th><th style="width: 40px;" class="light-green">%</th>
      <th style="width: 40px;" class="green">Frekans</th><th style="width: 40px;" class="green">%</th>
    </tr>
  `;

  const tablo = document.getElementById("genelTablo");
  if (tablo) {
    tablo.querySelector("thead").innerHTML = theadHTML;
    tablo.querySelector("tfoot").innerHTML = `
      <tr>
        <td style="width: 400px;"><strong>Toplam</strong></td>
        <td style="width: 40px;" class="red">${genelCounts[1]}</td>
        <td style="width: 40px;" class="red">${genelPercents[0]}</td>
        <td style="width: 40px;" class="orange">${genelCounts[2]}</td>
        <td style="width: 40px;" class="orange">${genelPercents[1]}</td>
        <td style="width: 40px;" class="yellow">${genelCounts[3]}</td>
        <td style="width: 40px;" class="yellow">${genelPercents[2]}</td>
        <td style="width: 40px;" class="light-green">${genelCounts[4]}</td>
        <td style="width: 40px;" class="light-green">${genelPercents[3]}</td>
        <td style="width: 40px;" class="green">${genelCounts[5]}</td>
        <td style="width: 40px;" class="green">${genelPercents[4]}</td>
        <td style="width: 40px;" class="blue">${genelOrtalama}</td>
        <td style="width: 40px;" class="blue">${genelYuzdeSkor}</td>
      </tr>
    `;
  }
}

function sehirHesapla(worksheet, range, filteredRows) {
  const sehirSayaclari = { Sakarya: 0, İstanbul: 0, Kocaeli: 0, Diğer: 0 };
  const sehirHaritasi = {
    sakarya: "Sakarya",
    istanbul: "İstanbul",
    i̇stanbul: "İstanbul",
    kocaeli: "Kocaeli",
  };

  const sehirCevaplari = {
    Sakarya: [],
    İstanbul: [],
    Kocaeli: [],
    Diğer: [],
  };

  const rowRange =
    filteredRows ||
    Array.from(
      { length: range.e.r - range.s.r },
      (_, idx) => range.s.r + 1 + idx
    );
  for (const r of rowRange) {
    const cell = worksheet[XLSX.utils.encode_cell({ c: 7, r })];
    const il = (cell?.v ?? "").toString().trim().toLowerCase();
    const sehirAnahtari = sehirHaritasi[il] || "Diğer";
    sehirSayaclari[sehirAnahtari]++;

    const cevaplar = [];
    for (
      let c = 0;
      c < worksheet["!ref"].split(":")[1].replace(/\D/g, "") * 1;
      c++
    ) {
      const cevapCell = worksheet[XLSX.utils.encode_cell({ c, r })];
      if (
        cevapCell &&
        ["1", "2", "3", "4", "5", 1, 2, 3, 4, 5].includes(cevapCell.v)
      ) {
        cevaplar.push(Number(cevapCell.v));
      }
    }
    sehirCevaplari[sehirAnahtari].push(...cevaplar);
  }

  const sehirMemnuniyet = {};
  for (const sehir in sehirCevaplari) {
    const cevaplar = sehirCevaplari[sehir];
    const toplam = cevaplar.length;
    if (toplam > 0) {
      const memSkor = (cevaplar.reduce((sum, v) => sum + v, 0) / toplam) * 20;
      sehirMemnuniyet[sehir] = Number(memSkor.toFixed(2));
    } else {
      sehirMemnuniyet[sehir] = 0;
    }
  }

  return { sehirSayaclari, sehirMemnuniyet };
}

function birimHesapla(worksheet, range, filteredRows) {
  let birimStnNo;
  if (filteredRows) {
    birimStnNo = anketBilgileri[anketKey].altBirimStnNo;
  } else {
    birimStnNo = anketBilgileri[anketKey].birimStnNo;
  }
  const ogrenciBilgi = anketBilgileri[anketKey];
  const baslangicSutun = ogrenciBilgi.grupBas[0];
  const bitisSutun = ogrenciBilgi.grupSon[ogrenciBilgi.grupSon.length - 1];

  const birimCevaplari = {};
  const rowRange =
    filteredRows ||
    Array.from(
      { length: range.e.r - range.s.r },
      (_, idx) => range.s.r + 1 + idx
    );
  for (const r of rowRange) {
    const birimCell = worksheet[XLSX.utils.encode_cell({ c: birimStnNo, r })];
    const birimAdi = (birimCell?.v ?? "").toString().trim();
    if (!birimAdi) continue;
    if (!birimCevaplari[birimAdi]) birimCevaplari[birimAdi] = [];

    for (let c = baslangicSutun; c <= bitisSutun; c++) {
      const cevapCell = worksheet[XLSX.utils.encode_cell({ c, r })];
      if (
        cevapCell &&
        [1, 2, 3, 4, 5, "1", "2", "3", "4", "5"].includes(cevapCell.v)
      ) {
        birimCevaplari[birimAdi].push(Number(cevapCell.v));
      }
    }
  }

  const birimMemnuniyet = {};
  for (const birim in birimCevaplari) {
    const cevaplar = birimCevaplari[birim];
    const toplam = cevaplar.length;
    if (toplam > 0) {
      const memSkor = (cevaplar.reduce((sum, v) => sum + v, 0) / toplam) * 20;
      birimMemnuniyet[birim] = Number(memSkor.toFixed(2));
    } else {
      birimMemnuniyet[birim] = 0;
    }
  }

  return birimMemnuniyet;
}

function calisanSayisiAraliklari(worksheet, range, filteredRows) {
  const araliklar = ["1-10", "11-100", "101-1000", "1001 ve üzeri"];
  const sayac = [0, 0, 0, 0];
  const rowRange =
    filteredRows ||
    Array.from(
      { length: range.e.r - range.s.r },
      (_, idx) => range.s.r + 1 + idx
    );
  for (const r of rowRange) {
    const cell = worksheet[XLSX.utils.encode_cell({ c: 8, r })];
    const value = cell?.v?.toString().replace(/\D/g, "");
    const n = Number(value);
    if (!isNaN(n) && n > 0) {
      if (n <= 10) sayac[0]++;
      else if (n <= 100) sayac[1]++;
      else if (n <= 1000) sayac[2]++;
      else sayac[3]++;
    }
  }
  return { araliklar, sayac };
}

function cinsiyetSayaciHesapla(worksheet, range, filteredRows) {
  let cinsiyetStnNo = 7;
  if (window.anketKey === "mezun_memnuniyeti") {
    cinsiyetStnNo = 25;
  }
  const sayac = {};
  const rowRange =
    filteredRows ||
    Array.from(
      { length: range.e.r - range.s.r },
      (_, idx) => range.s.r + 1 + idx
    );
  for (const r of rowRange) {
    const cell = worksheet[XLSX.utils.encode_cell({ c: cinsiyetStnNo, r })];
    const cinsiyet = (cell?.v ?? "").toString().trim();
    if (!cinsiyet) continue;
    sayac[cinsiyet] = (sayac[cinsiyet] || 0) + 1;
  }
  return sayac;
}
