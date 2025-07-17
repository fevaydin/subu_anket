function printDocument() {
  window.print();
}
window.addEventListener("message", function (event) {
  if (event.data === "print-command") {
    window.print();
  }
});

class AnketBilgi {
  constructor({
    anketAdi,
    baslik,
    excelYolu,
    excelSayfaAdi,
    birimStnNo,
    altBirimStnNo,
    grupBas,
    grupSon,
    boyutlar,
    ifadeler,
  }) {
    this.anketAdi = anketAdi;
    this.baslik = baslik;
    this.excelYolu = excelYolu;
    this.excelSayfaAdi = excelSayfaAdi;
    this.birimStnNo = birimStnNo;
    this.altBirimStnNo = altBirimStnNo;
    this.grupBas = grupBas;
    this.grupSon = grupSon;
    this.boyutlar = boyutlar;
    this.ifadeler = ifadeler;
  }
}

const anketBilgileri = {
  arti_bir_ogrenci: new AnketBilgi({
    anketAdi: "ogrenci",
    baslik: "+1 Öğrenci Memnuniyeti Anketi",
    excelYolu: "/assets/data/arti_bir.xlsx",
    excelSayfaAdi: "ogrenci",
    birimStnNo: 4,
    altBirimStnNo: 5,
    grupBas: [9, 16, 24],
    grupSon: [15, 23, 27],
    boyutlar: [
      "+1 EĞİTİM MODELİ İLE İLGİLİ SORULAR",
      "İŞ YERİ İLE İLGİLİ SORULAR",
      "ÖĞRETİM ELEMANI İLE İLGİLİ SORULAR",
    ],
    ifadeler: [
      "+1 Uygulamalı Eğitim Modeli beklentilerimi karşılamıştır.",
      "İşyeri Uygulamasına öngörülen sürede başladım.",
      "+1 Uygulamalı Eğitim Modeli hakkında bilgilendirme yapılmıştır.",
      "İşyeri Uygulamasıyla ilgili duyurulardan zamanında haberdar olmaktayım.",
      "İşyeri Uygulaması ile ilgili, birimimle kolaylıkla iletişim sağlayabilmekteyim.",
      "İşyeri Uygulama Raporu Yazım Kılavuzu yeterince açık ve anlaşılabilirdir.",
      "Yerleştirildiğim işyeri, öğrenim gördüğüm alanla ilgilidir.",
      "İşyeri Uygulaması yaptığım işletme, mesleki becerilerimi geliştirmiştir.",
      "İşyeri Uygulaması esnasında genellikle alanımla ilgili görevler yaptım.",
      "İşyerinin sunduğu imkânlar (servis-yemek-ücret vb.) yeterlidir.",
      "İş yeri, İş Güvenliği ve İşçi sağlığı açısından uygun şartlara sahiptir.",
      "İşyerinin, çalışma performansımı adil olarak değerlendirdiğini düşünüyorum.",
      "İşyeri personelinin iletişim ve yaklaşımlarından memnunum.",
      "Mezuniyet sonrası, İşyeri Uygulaması yaptığım işletmede çalışmak isterim.",
      "İşyeri Uygulaması, kariyer planlamamda etkili olmuştur.",
      "Danışman öğretim elemanı ile iletişimimiz yeterlidir.",
      "Danışman öğretim elemanı, karşılaşılan problemlerin giderilmesinde etkilidir.",
      "Danışman öğretim elemanı, çalışma performansımı adil olarak değerlendirmiştir.",
      "Danışman öğretim elemanının işyeri ziyareti sayısı yeterlidir.",
    ],
  }),
  arti_bir_isveren: new AnketBilgi({
    anketAdi: "isveren",
    baslik: "+1 İşveren Memnuniyeti Anketi",
    excelYolu: "/assets/data/arti_bir.xlsx",
    excelSayfaAdi: "isletme",
    birimStnNo: 4,
    altBirimStnNo: 5,
    grupBas: [14, 20, 25],
    grupSon: [19, 24, 29],
    boyutlar: [
      "+1 EĞİTİM MODELİ İLE İLGİLİ SORULAR",
      "ÖĞRETİM ELEMANI İLE İLGİLİ SORULAR",
      "ÖĞRENCİ İLE İLGİLİ SORULAR",
    ],
    ifadeler: [
      "+1 Uygulamalı Eğitim Modeli genel olarak beklentilerimi karşıladı.",
      "+1 Uygulamalı Eğitim Modeli hakkında bilgilendirme yapılmıştır.",
      "Öğrenci, öngörülen sürede İşyeri Uygulamasına başlamıştır.",
      "+1 Uygulamalı Eğitim Modeli, nitelikli işgücü ihtiyacımı gidermede etkilidir.",
      "+1 Uygulamalı Eğitim Modeli, Üniversite-Sanayi işbirliğine olumlu katkı sağlamıştır. ",
      "+1 Uygulamalı Eğitim Modeli otomasyon sistemi (MUYS), anlaşılabilir ara yüze sahiptir.",
      "Yerleştirilen öğrencinin okulundaki bölümüyle kolayca iletişim sağlanmaktadır.",
      "Öğrenciye not verilen “İşyeri Değerlendirme Formu” yeterlidir.",
      "Danışman öğretim elemanının işyerini ziyaret etmesinden memnunum.",
      "Danışman öğretim elemanı, modelin işleyişine katkı sağlamaktadır.",
      "Danışman öğretim elemanının işyeri ile iletişiminden memnunum.",
      "Öğrencinin teorik bilgisi İşyeri Uygulaması için yeterlidir.",
      "Öğrenci, işyerine kolaylıkla uyum sağlamıştır.",
      "Öğrenci, kendini geliştirme yönünde yeterli çabayı göstermiştir.",
      "İşyeri Uygulaması yapan öğrenciyi mezuniyet sonrası işe almak isterim.",
      "Gelecek dönemlerde yeni öğrenci talep etmek isterim.",
    ],
  }),
  arti_bir_personel: new AnketBilgi({
    anketAdi: "personel",
    baslik: "+1 Öğretim Elemanı Memnuniyeti Anketi",
    excelYolu: "/assets/data/arti_bir.xlsx",
    excelSayfaAdi: "personel",
    birimStnNo: 4,
    altBirimStnNo: 5,
    grupBas: [12, 18, 23],
    grupSon: [17, 22, 25],
    boyutlar: [
      "+1 EĞİTİM MODELİ İLE İLGİLİ SORULAR",
      "ÖĞRENCİ İLE İLGİLİ SORULAR",
      "İŞ YERİ İLE İLGİLİ SORULAR",
    ],
    ifadeler: [
      "+1 Uygulamalı Eğitim Modeli genel olarak yeterlidir.",
      "Öğrencinin iş yerine kabul ve yerleştirilme süreci düzenli yürütülmektedir. ",
      "+1 Uygulamalı Eğitim Modeli ile ilgili bilgilendirmelerden zamanında haberdar oldum.",
      "Sürecin işleyişinde kullanılan formlar (Kabul Formu, Değerlendirme Formları, Rapor Yazım Kılavuzu) yeterlidir. ",
      "MUYS (Mesleki Uygulamalar Yönetim Sistemi) otomasyon sistemi, kullanımı kolay ve anlaşılabilir bir ara yüze sahiptir.",
      "+1 Uygulamalı Eğitim Modeli, sektörle olan etkileşime katkı sağlamaktadır. ",
      "Öğrencinin İşyeri Uygulaması yaptığı işletme, alanıyla ilişkilidir. ",
      "Öğrencinin yerleştirildiği işyerinin, mesleki uygulama becerisi geliştirmesine katkı sağlamaktadır.",
      "İş yeri, İş Güvenliği ve İşçi sağlığı açısından uygun şartlara sahiptir. ",
      "İşyeri, öğrencinin performansını adil olarak değerlendirmiştir. ",
      "İşyeri Eğitimi Sorumlusu ile olan iletişimden memnunum.",
      "Uygulamadaki öğrenci ile süreç içerisinde etkin iletişim sağlanmıştır.",
      "İşyeri Uygulaması, öğrencinin kişisel gelişimi ve kariyer planlamasına katkı sağlamaktadır.",
      "İşyeri Uygulamasında başarı sağlamış öğrencilere iş tekliﬁ yapılmaktadır.",
    ],
  }),
  mezun_memnuniyeti: new AnketBilgi({
    anketAdi: "mezun",
    baslik: "Mezun Memnuniyeti Anketi",
    excelYolu: "/assets/data/mezun.xlsx",
    excelSayfaAdi: "Mezun Memnuniyeti Anketi",
    birimStnNo: 27,
    altBirimStnNo: 28,
    grupBas: [1],
    grupSon: [22],
    boyutlar: ["İFADELER"],
    ifadeler: [
      "Üniversitemi bilinçli olarak tercih ettim.",
      "Üniversite tercihimi yapmadan önce eğitim aldığım meslek ile ilgili bilgim vardı.",
      "Eğitim aldığım alan ile ilgili bilgileri iş hayatında kullanabilmekteyim.",
      "Mezun olduğum bölümün/programın eğitim düzeyi yeterlidir.",
      "Mezun olduğum bölümde/programda aldığım eğitim beklentilerimi karşıladı.",
      "Bölümün öğretim elemanları bana mesleğimin ve iş dünyasının gereksinimlerine dair önerilerde bulundu.",
      "Mesleğimle/Alanımla ilgili yeterli düzeyde yabancı dil bilgisine sahibim.",
      "Üniversite eğitimim boyunca ihtiyacım olan bilgileri araştırma ve edinme becerileri kazandım.",
      "Eğitimim sayesinde insanlarla iletişim kurma becerilerimi geliştirebildim.",
      "Almış olduğum eğitim sayesinde mesleki etik ve sorumluluk anlayışları edindim.",
      "Üniversitemi çevremdeki insanlara / üniversite adaylarına tavsiye ederim.",
      "Bu üniversiteden mezun olmaktan dolayı gurur duyuyorum.",
      "Tekrar tercih yapacak olsam üniversitemi ve aynı bölüm/programı tercih ederdim.",
      "Eğitimim boyunca üniversitem tarafından bana sunulan imkanların yeterli olduğunu düşünüyorum.",
      "+1 Uygulamalı Eğitim sayesinde sektöre katkıda bulunabileceğime inanmaktayım.",
      "+1 Uygulamalı Eğitim sayesinde iş hayatına daha deneyimli bir şekilde başlayacağım.",
      "Üniversitem, mezuniyetim sonrasında işe yerleşme sürecimde bana destek olmaktadır.",
      "Eğitimim boyunca üniversitemde gerçekleştirilen etkinlikler kariyer gelişimim konusunda bana yardımcı olmaktadır.",
      "Üniversitem ile rahatlıkla iletişim kurabilirim.",
      "Mezunlara yönelik yapılacak olan etkinliklere (kariyer günleri, mezunlar derneği vb.) katılım sağlamak isterim.",
      "Üniversitemle bağımın kopmasını istemem.",
      "Üniversiteme karşı bir aidiyet duygusu besliyorum.",
    ],
  }),
};
