# 📚 Cambridge A2 İngilizce Kelime Öğrenme Sitesi

Bu site, Cambridge A2 seviyesindeki İngilizce kelimeleri görsel hafıza yöntemiyle öğrenmenize yardımcı olur.

## 🚀 Nasıl Kullanılır

1. `index.html` dosyasını bir web tarayıcısında açın
2. Ekranda gördüğünüz görsellere tıklayın
3. Açılan popup'ta kelimenin İngilizce tanımını okuyun
4. Görsel ve kelime arasında bağlantı kurmaya çalışın

## 📁 Dosya Yapısı

- `index.html` - Ana HTML dosyası
- `style.css` - Tasarım ve stil dosyası
- `script.js` - JavaScript işlevsellik dosyası
- `vocabulary-data.js` - Kelime verileri dosyası

## ➕ Yeni Kelime Ekleme

Yeni kelimeler eklemek için `vocabulary-data.js` dosyasını düzenleyin:

```javascript
const vocabularyDataA = [
    {
        word: "abandon",
        definition: "To leave someone or something behind",
        image: "images/abandon.jpg"
    },
    // Diğer kelimeler...
];
```

## 🖼️ Görsel Ekleme

Görselleri `images/` klasörüne koyun ve dosya yolunu `vocabulary-data.js`'te belirtin.

## 📱 Özellikler

- ✅ Responsive tasarım (mobil uyumlu)
- ✅ Görseller karışık sırada gösterilir
- ✅ Modal popup ile kelime detayları
- ✅ Hover efektleri
- ✅ Klavye kısayolları (ESC ile kapatma)
- ✅ Temiz ve modern tasarım

## 🎯 İpuçları

- Her kelime için net ve anlaşılır görseller seçin
- Görseller 200x200px boyutunda olmalı
- Kelime tanımları kısa ve açık olmalı
- Düzenli olarak kelimeleri tekrar edin

İyi çalışmalar! 🎓