// Bar grafiği
function drawBarChart() {
  // window.genelYuzdeSkor yüklendiyse kullan
  var yVal = window.genelYuzdeSkor ? Number(window.genelYuzdeSkor) : 0;
  Plotly.newPlot(
    "grafikGenelMemnuniyet",
    [
      {
        x: [""],
        y: [yVal],
        type: "bar",
        width: [0.3],
        marker: { color: "rgba(54, 162, 235, 1)" },
        text: [Math.round(yVal)],
        textposition: "outside",
        textfont: {
          color: "black",
          size: 14,
        },
      },
    ],
    {
      yaxis: {
        range: [0, 109],
        showgrid: true,
        gridcolor: "rgba(200, 200, 200, 0.75)",
      },
      title: {
        text: "Genel Memnuniyet Oranı",
        font: {
          size: 18,
          color: "#000000",
          family: "Arial, sans-serif",
        },
      },
    }
  );
}

// window.genelYuzdeSkor yüklendiğinde veya DOMContentLoaded'da çalıştır
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    if (window.genelYuzdeSkor !== undefined) {
      drawBarChart();
    } else {
      // analysis.js yüklenip window.genelYuzdeSkor set edilince tekrar dene
      var interval = setInterval(function () {
        if (window.genelYuzdeSkor !== undefined) {
          drawBarChart();
          clearInterval(interval);
        }
      }, 100);
    }
  });
} else {
  if (window.genelYuzdeSkor !== undefined) {
    drawBarChart();
  } else {
    var interval = setInterval(function () {
      if (window.genelYuzdeSkor !== undefined) {
        drawBarChart();
        clearInterval(interval);
      }
    }, 100);
  }
}
// Radar grafiği (polar chart)
function drawRadarChart() {
  if (
    !appState.ifadeMem ||
    !Array.isArray(appState.ifadeMem) ||
    appState.ifadeMem.length === 0
  )
    return;
  const radarLabels = appState.ifadeMem.map((_, i) => "s" + (i + 1));
  const radarValues = appState.ifadeMem.map((v) => Number(v) || 0);
  const closedLabels = [...radarLabels, radarLabels[0]];
  const closedValues = [...radarValues, radarValues[0]];
  const closedTextValues = [
    ...radarValues.map((v) => Math.round(v).toString()),
    "",
  ];
  Plotly.newPlot(
    "grafikRadar",
    [
      {
        type: "scatterpolar",
        r: closedValues,
        theta: closedLabels,
        mode: "markers+text+lines",
        text: closedTextValues,
        textfont: {
          color: "black",
          size: 12,
        },
        textposition: "top right",
        name: "Memnuniyet Yüzdeleri",
        marker: {
          color: "rgba(54, 162, 235, 1)",
          size: 10,
        },
      },
    ],
    {
      polar: {
        gridshape: "linear",
        radialaxis: {
          visible: true,
          range: [50, 100],
          tickangle: 90,
          angle: 90,
        },
        angularaxis: {
          rotation: 90,
          direction: "clockwise",
        },
      },
      title: {
        text: "Radar Grafiği",
        font: {
          size: 18,
          color: "black",
          family: "Arial, sans-serif",
        },
      },
    }
  );
}

// ifadeMem hazır olduğunda veya DOMContentLoaded'da çalıştır
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    if (appState.ifadeMem && appState.ifadeMem.length > 0) {
      drawRadarChart();
    } else {
      var intervalRadar = setInterval(function () {
        if (appState.ifadeMem && appState.ifadeMem.length > 0) {
          drawRadarChart();
          clearInterval(intervalRadar);
        }
      }, 100);
    }
  });
} else {
  if (appState.ifadeMem && appState.ifadeMem.length > 0) {
    drawRadarChart();
  } else {
    var intervalRadar = setInterval(function () {
      if (appState.ifadeMem && appState.ifadeMem.length > 0) {
        drawRadarChart();
        clearInterval(intervalRadar);
      }
    }, 100);
  }
}
// Pasta grafiği
function drawPieChart() {
  // Sadece öğrenci ve işveren sayfalarında çalışsın
  const path = window.location.pathname;
  if (!(path.includes("ogrenci") || path.includes("isveren"))) return;

  var labels = ["Sakarya", "İstanbul", "Kocaeli", "Diğer"];
  var values = [0, 0, 0, 0];
  if (appState.sehirSayaclari) {
    values = labels.map(function (label) {
      return appState.sehirSayaclari[label] || 0;
    });
  }
  Plotly.newPlot(
    "grafikIlPasta",
    [
      {
        type: "pie",
        labels: labels,
        values: values,
        textinfo: "label+percent",
        textfont: {
          color: "white",
          family: "Arial Black, sans-serif",
          size: 12,
        },
        marker: {
          colors: ["#4285F4", "#FF6D01", "#34A853", "#FBBC04"],
        },
      },
    ],
    {
      title: {
        text: "Uygulama Yapılan İl",
        font: {
          size: 18,
          color: "#000000",
          family: "Arial, sans-serif",
        },
      },
    }
  );
}

// window.sehirSayaclari hazır olduğunda veya DOMContentLoaded'da çalıştır
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    const path = window.location.pathname;
    if (
      (path.includes("ogrenci") || path.includes("isveren")) &&
      appState.sehirSayaclari
    ) {
      drawPieChart();
    } else {
      var intervalPie = setInterval(function () {
        if (
          (path.includes("ogrenci") || path.includes("isveren")) &&
          appState.sehirSayaclari
        ) {
          drawPieChart();
          clearInterval(intervalPie);
        }
      }, 100);
    }
  });
} else {
  const path = window.location.pathname;
  if (
    (path.includes("ogrenci") || path.includes("isveren")) &&
    appState.sehirSayaclari
  ) {
    drawPieChart();
  } else {
    var intervalPie = setInterval(function () {
      if (
        (path.includes("ogrenci") || path.includes("isveren")) &&
        appState.sehirSayaclari
      ) {
        drawPieChart();
        clearInterval(intervalPie);
      }
    }, 100);
  }
}

// Yatay çubuk grafiği
function drawHBarChart() {
  // URL'den birim parametresi al
  let birimParam = null;
  try {
    const urlParams = new URLSearchParams(window.location.search);
    birimParam = urlParams.get("birim");
  } catch (e) {}

  if (!appState.birimMemnuniyet) return;
  var birimler = Object.keys(appState.birimMemnuniyet);
  birimler.sort((a, b) => a.localeCompare(b, "tr", { sensitivity: "base" }));
  var birimlerTitleCase = birimler.map(function (birim) {
    var ad = birim
      .split(" ")
      .map(function (kelime) {
        if (kelime.toUpperCase() === "VE") {
          return kelime.toLocaleLowerCase("tr-TR");
        } else if (kelime.toUpperCase() === "MYO") {
          return kelime.toUpperCase();
        }
        return (
          kelime.charAt(0).toLocaleUpperCase("tr-TR") +
          kelime.slice(1).toLocaleLowerCase("tr-TR")
        );
      })
      .join(" ");

    // 30 karakterden uzun ise en yakın boşluktan böl
    if (ad.length > 30) {
      var idx = ad.lastIndexOf(" ", 30);
      if (idx > 0) {
        ad = ad.slice(0, idx) + "<br>" + ad.slice(idx + 1);
      } else {
        ad = ad.slice(0, 30) + "<br>" + ad.slice(30);
      }
    }
    return ad;
  });
  var oranlar = birimler.map(function (birim) {
    return appState.birimMemnuniyet[birim];
  });
  var oranText = oranlar.map(function (v) {
    return Math.round(v);
  });
  // Sıralamayı ters çevir
  birimlerTitleCase.reverse();
  oranlar.reverse();
  oranText.reverse();

  // Dinamik sol margin hesapla (her 10 karakter için 10px, max 200px)
  var maxBirimUzunlugu = Math.max(
    ...birimlerTitleCase.map((ad) => ad.replace(/<br>/g, "").length)
  );
  var dynamicMargin = Math.min(200, 10 + maxBirimUzunlugu * 7); // 7px/karakter + 10px boşluk

  Plotly.newPlot(
    "grafikBirimMemnuniyet",
    [
      {
        y: birimlerTitleCase,
        x: oranlar,
        type: "bar",
        width: 0.75,
        orientation: "h",
        mode: "text",
        text: oranText,
        textposition: "outside",
        textfont: {
          color: "black",
          size: 14,
        },
        marker: { color: "rgba(54, 162, 235, 1)" },
      },
    ],
    {
      xaxis: {
        range: [0, 109],
        side: "top",
        showgrid: true,
        gridcolor: "rgba(200, 200, 200, 0.75)",
        dtick: 10,
      },
      padding: { r: 20, t: 0, b: 0, l: 0 },
      margin: { l: dynamicMargin, r: 0 },
      title: {
        text: birimParam
          ? "Programlar Memnuniyet Oranları"
          : "Akademik Birimler Memnuniyet Oranları",
        font: {
          size: 18,
          color: "#000000",
          family: "Arial, sans-serif",
        },
      },
    }
  );
}

// appState.birimMemnuniyet hazır olduğunda veya DOMContentLoaded'da çalıştır
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    if (appState.birimMemnuniyet) {
      drawHBarChart();
    } else {
      var intervalBirim = setInterval(function () {
        if (appState.birimMemnuniyet) {
          drawHBarChart();
          clearInterval(intervalBirim);
        }
      }, 100);
    }
  });
} else {
  if (appState.birimMemnuniyet) {
    drawHBarChart();
  } else {
    var intervalBirim = setInterval(function () {
      if (appState.birimMemnuniyet) {
        drawHBarChart();
        clearInterval(intervalBirim);
      }
    }, 100);
  }
}

// Bar grafiği2
function drawBarChartCalisanSayilari() {
  if (
    !appState.calisanSayisiAraliklari ||
    !appState.calisanSayisiAraliklari.araliklar ||
    !appState.calisanSayisiAraliklari.sayac
  )
    return;
  var labels = appState.calisanSayisiAraliklari.araliklar;
  var values = appState.calisanSayisiAraliklari.sayac;
  Plotly.newPlot(
    "grafikCalisanSayilari",
    [
      {
        x: labels,
        y: values,
        type: "bar",
        width: 0.5,
        marker: { color: "rgba(54, 162, 235, 1)" },
        text: values,
        textposition: "outside",
        textfont: {
          color: "black",
          size: 14,
        },
      },
    ],
    {
      yaxis: {
        showgrid: true,
        gridcolor: "rgba(200, 200, 200, 0.75)",
      },
      title: {
        text: "İş Yerinde Çalışan Personel Sayısı",
        font: {
          size: 18,
          color: "#000000",
        },
      },
    }
  );
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    if (appState.calisanSayisiAraliklari) {
      drawBarChartCalisanSayilari();
    } else {
      var intervalCalisan = setInterval(function () {
        if (appState.calisanSayisiAraliklari) {
          drawBarChartCalisanSayilari();
          clearInterval(intervalCalisan);
        }
      }, 100);
    }
  });
} else {
  if (appState.calisanSayisiAraliklari) {
    drawBarChartCalisanSayilari();
  } else {
    var intervalCalisan = setInterval(function () {
      if (appState.calisanSayisiAraliklari) {
        drawBarChartCalisanSayilari();
        clearInterval(intervalCalisan);
      }
    }, 100);
  }
}

// Bar grafiği3
function drawBarChartSehirMemnuniyetleri() {
  // Sadece işveren sayfasında çalışsın
  if (!window.location.pathname.includes("isveren")) return;

  if (!appState.sehirMemnuniyet || typeof appState.sehirMemnuniyet !== "object")
    return;
  var labels = ["Sakarya", "İstanbul", "Kocaeli", "Diğer"];
  var values = labels.map(function (label) {
    return appState.sehirMemnuniyet[label] || 0;
  });
  const filteredData = labels.reduce(
    (acc, label, index) => {
      if (values[index] !== 0) {
        acc.labels.push(label);
        acc.values.push(values[index]);
      }
      return acc;
    },
    { labels: [], values: [] }
  );

  const filteredLabels = filteredData.labels;
  const filteredValues = filteredData.values;
  Plotly.newPlot(
    "grafikSehirMemnuniyetleri",
    [
      {
        x: filteredLabels,
        y: filteredValues,
        type: "bar",
        width: 0.5,
        marker: { color: "rgba(54, 162, 235, 1)" },
        text: filteredValues.map((v) => Math.round(v)),
        textposition: "outside",
        textfont: {
          color: "black",
          size: 14,
        },
      },
    ],
    {
      yaxis: {
        range: [0, 109],
        showgrid: true,
        gridcolor: "rgba(200, 200, 200, 0.75)",
      },
      title: {
        text: "Uygulama Yapılan İllerde Memnuniyet Oranı",
        font: {
          size: 18,
          color: "#000000",
        },
      },
    }
  );
}

// window.sehirMemnuniyet hazır olduğunda veya DOMContentLoaded'da çalıştır
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    if (
      window.location.pathname.includes("isveren") &&
      appState.sehirMemnuniyet
    ) {
      drawBarChartSehirMemnuniyetleri();
    } else {
      var intervalSehir = setInterval(function () {
        if (
          window.location.pathname.includes("isveren") &&
          appState.sehirMemnuniyet
        ) {
          drawBarChartSehirMemnuniyetleri();
          clearInterval(intervalSehir);
        }
      }, 100);
    }
  });
} else {
  if (
    window.location.pathname.includes("isveren") &&
    appState.sehirMemnuniyet
  ) {
    drawBarChartSehirMemnuniyetleri();
  } else {
    var intervalSehir = setInterval(function () {
      if (
        window.location.pathname.includes("isveren") &&
        appState.sehirMemnuniyet
      ) {
        drawBarChartSehirMemnuniyetleri();
        clearInterval(intervalSehir);
      }
    }, 100);
  }
}

// Pasta grafiği2
function drawPieChartCinsiyet() {
  // Sadece personel sayfasında çalışsın
  if (
    !(
      window.location.pathname.includes("personel") ||
      window.location.pathname.includes("mezun")
    )
  )
    return;

  var labels = ["Erkek", "Kadın"];
  var values = [0, 0];
  if (appState.cinsiyetSayaci) {
    // E ve K'yı Erkek ve Kadın'a eşle
    values = [
      (appState.cinsiyetSayaci["E"] || 0) +
        (appState.cinsiyetSayaci["Erkek"] || 0),
      (appState.cinsiyetSayaci["K"] || 0) +
        (appState.cinsiyetSayaci["Kadın"] || 0),
    ];
  }
  Plotly.newPlot(
    "grafikCinsiyet",
    [
      {
        type: "pie",
        labels: labels,
        values: values,
        textinfo: "label+percent",
        textfont: {
          color: "white",
          family: "Arial Black, sans-serif",
          size: 12,
        },
        marker: {
          colors: ["#4285F4", "#FF6D01"],
        },
      },
    ],
    {
      title: {
        text: "Cinsiyet Dağılımı",
        font: {
          size: 18,
          color: "#000000",
          family: "Arial, sans-serif",
        },
      },
    }
  );
}

// appState.cinsiyetSayaci hazır olduğunda veya DOMContentLoaded'da çalıştır
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    if (
      (window.location.pathname.includes("personel") ||
        window.location.pathname.includes("mezun")) &&
      appState.cinsiyetSayaci
    ) {
      drawPieChartCinsiyet();
    } else {
      var intervalPie = setInterval(function () {
        if (
          (window.location.pathname.includes("personel") ||
            window.location.pathname.includes("mezun")) &&
          appState.cinsiyetSayaci
        ) {
          drawPieChartCinsiyet();
          clearInterval(intervalPie);
        }
      }, 100);
    }
  });
} else {
  if (
    (window.location.pathname.includes("personel") ||
      window.location.pathname.includes("mezun")) &&
    appState.cinsiyetSayaci
  ) {
    drawPieChartCinsiyet();
  } else {
    var intervalPie = setInterval(function () {
      if (
        (window.location.pathname.includes("personel") ||
          window.location.pathname.includes("mezun")) &&
        appState.cinsiyetSayaci
      ) {
        drawPieChartCinsiyet();
        clearInterval(intervalPie);
      }
    }, 100);
  }
}

// Bar grafiği4
function drawBarChartFakulteMyo() {
  // Sadece işveren, öğrenci ve personel sayfalarında ve birim seçili değilse çalışsın
  const path = window.location.pathname;
  if (
    !(
      path.includes("isveren") ||
      path.includes("ogrenci") ||
      path.includes("personel")
    )
  )
    return;
  try {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("birim")) return;
  } catch (e) {}

  if (
    !appState.fakulteMyoHesapla ||
    typeof appState.fakulteMyoHesapla !== "object"
  )
    return;

  // fakulteMyoHesapla fonksiyonundan gelen memnuniyet oranlarını kullan
  var labels = ["Fakülte", "MYO"];
  var values = [
    appState.fakulteMyoHesapla.fakulte
      ? appState.fakulteMyoHesapla.fakulte.memnuniyet
      : 0,
    appState.fakulteMyoHesapla.myo
      ? appState.fakulteMyoHesapla.myo.memnuniyet
      : 0,
  ];

  Plotly.newPlot(
    "grafikTurMemnuniyetleri",
    [
      {
        x: labels,
        y: values,
        type: "bar",
        width: 0.5,
        marker: { color: "rgba(54, 162, 235, 1)" },
        text: values.map((v) => Math.round(v)),
        textposition: "outside",
        textfont: {
          color: "black",
          size: 14,
        },
      },
    ],
    {
      yaxis: {
        range: [0, 109],
        showgrid: true,
        gridcolor: "rgba(200, 200, 200, 0.75)",
      },
      title: {
        text: "7+1 / 3+1 Memnuniyet Oranları",
        font: {
          size: 18,
          color: "#000000",
        },
      },
    }
  );
}

// appState.fakulteMyoHesapla hazır olduğunda veya DOMContentLoaded'da çalıştır
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    const path = window.location.pathname;
    if (
      (path.includes("isveren") ||
        path.includes("ogrenci") ||
        path.includes("personel")) &&
      appState.fakulteMyoHesapla
    ) {
      drawBarChartFakulteMyo();
    } else {
      var intervalFakulteMyo = setInterval(function () {
        const path = window.location.pathname;
        if (
          (path.includes("isveren") ||
            path.includes("ogrenci") ||
            path.includes("personel")) &&
          appState.fakulteMyoHesapla
        ) {
          drawBarChartFakulteMyo();
          clearInterval(intervalFakulteMyo);
        }
      }, 100);
    }
  });
} else {
  const path = window.location.pathname;
  if (
    (path.includes("isveren") ||
      path.includes("ogrenci") ||
      path.includes("personel")) &&
    appState.fakulteMyoHesapla
  ) {
    drawBarChartFakulteMyo();
  } else {
    var intervalFakulteMyo = setInterval(function () {
      const path = window.location.pathname;
      if (
        (path.includes("isveren") ||
          path.includes("ogrenci") ||
          path.includes("personel")) &&
        appState.fakulteMyoHesapla
      ) {
        drawBarChartFakulteMyo();
        clearInterval(intervalFakulteMyo);
      }
    }, 100);
  }
}

// Pasta grafiği3
function drawBarChartFakulteMyoKatilim() {
  // Sadece personel, ogrenci veya isveren sayfasında ve appState.fakulteMyoHesapla varsa çalışsın
  const path = window.location.pathname;
  if (
    !(
      path.includes("personel") ||
      path.includes("ogrenci") ||
      path.includes("isveren")
    ) ||
    !appState.fakulteMyoHesapla
  )
    return;
  try {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("birim")) return;
  } catch (e) {}

  var labels = ["7+1", "3+1"];
  var values = [
    appState.fakulteMyoHesapla.fakulte
      ? appState.fakulteMyoHesapla.fakulte.katilimci
      : 0,
    appState.fakulteMyoHesapla.myo
      ? appState.fakulteMyoHesapla.myo.katilimci
      : 0,
  ];
  Plotly.newPlot(
    "grafikTurKatilimlari",
    [
      {
        type: "pie",
        labels: labels,
        values: values,
        textinfo: "label+percent",
        textfont: {
          color: "white",
          family: "Arial Black, sans-serif",
          size: 12,
        },
        marker: {
          colors: ["#4285F4", "#FF6D01"],
        },
      },
    ],
    {
      title: {
        text: "7+1 / 3+1 Katılımcı Dağılımı",
        font: {
          size: 18,
          color: "#000000",
          family: "Arial, sans-serif",
        },
      },
    }
  );
}

// appState.fakulteMyoHesapla hazır olduğunda veya DOMContentLoaded'da çalıştır
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    const path = window.location.pathname;
    if (
      (path.includes("personel") ||
        path.includes("ogrenci") ||
        path.includes("isveren")) &&
      appState.fakulteMyoHesapla
    ) {
      drawPieChartFakulteMyoKatilim();
    } else {
      var intervalPie = setInterval(function () {
        const path = window.location.pathname;
        if (
          (path.includes("personel") ||
            path.includes("ogrenci") ||
            path.includes("isveren")) &&
          appState.fakulteMyoHesapla
        ) {
          drawBarChartFakulteMyoKatilim();
          clearInterval(intervalPie);
        }
      }, 100);
    }
  });
} else {
  const path = window.location.pathname;
  if (
    (path.includes("personel") ||
      path.includes("ogrenci") ||
      path.includes("isveren")) &&
    appState.fakulteMyoHesapla
  ) {
    drawBarChartFakulteMyoKatilim();
  } else {
    var intervalPie = setInterval(function () {
      const path = window.location.pathname;
      if (
        (path.includes("personel") ||
          path.includes("ogrenci") ||
          path.includes("isveren")) &&
        appState.fakulteMyoHesapla
      ) {
        drawBarChartFakulteMyoKatilim();
        clearInterval(intervalPie);
      }
    }, 100);
  }
}
