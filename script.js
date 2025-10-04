// Kelime verileri vocabulary-data.js dosyasından yükleniyor

// Mevcut seviye (varsayılan A2)
let currentLevel = 'a2';

// DOM elementleri
const vocabularyGrid = document.getElementById('vocabulary-grid');
const modal = document.getElementById('word-modal');
const modalImage = document.getElementById('modal-image');
const modalWord = document.getElementById('modal-word');
const modalDefinition = document.getElementById('modal-definition');
const closeBtn = document.querySelector('.close');

// Sayfa yüklendiğinde çalışacak fonksiyon
document.addEventListener('DOMContentLoaded', function() {
    setupLevelSelector();
    renderVocabularyGrid();
    setupEventListeners();
    updateWordCounter();
});

// Seviye seçici ayarları
function setupLevelSelector() {
    const levelButtons = document.querySelectorAll('.level-button');
    const levelIndicator = document.getElementById('current-level');
    
    levelButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Aktif sınıfı güncelle
            levelButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Seviyeyi güncelle
            currentLevel = this.dataset.level;
            
            // Seviye göstergesini güncelle
            if (currentLevel === 'a2') {
                levelIndicator.textContent = 'A2 Key';
                vocabularyData = vocabularyDataA2;
            } else if (currentLevel === 'b1') {
                levelIndicator.textContent = 'B1 Preliminary';
                vocabularyData = vocabularyDataB1;
            }
            
            // Sayfayı yeniden render et
            renderVocabularyGrid();
            updateWordCounter();
            
            // Quiz sıfırla
            if (typeof resetQuiz === 'function') {
                resetQuiz();
            }
        });
    });
}

// Kelime kartlarını oluştur ve ekrana yerleştir
function renderVocabularyGrid() {
    vocabularyGrid.innerHTML = '';
    
    // Verileri karıştır (shuffle)
    const shuffledData = shuffleArray([...vocabularyData]);
    
    shuffledData.forEach((item, index) => {
        const wordCard = document.createElement('div');
        wordCard.className = 'word-card';
        wordCard.setAttribute('data-index', index);
        wordCard.setAttribute('data-word', item.word);
        wordCard.setAttribute('data-definition', item.definition);
        
        wordCard.innerHTML = `
            <img src="${item.image}" alt="${item.word}" loading="lazy">
        `;
        
        vocabularyGrid.appendChild(wordCard);
    });
}

// Array'i karıştır (Fisher-Yates shuffle algoritması)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Event listener'ları ayarla
function setupEventListeners() {
    // Kelime kartlarına tıklama eventi
    vocabularyGrid.addEventListener('click', function(e) {
        const wordCard = e.target.closest('.word-card');
        if (wordCard) {
            const word = wordCard.getAttribute('data-word');
            const definition = wordCard.getAttribute('data-definition');
            const imgSrc = wordCard.querySelector('img').src;
            
            showModal(word, definition, imgSrc);
        }
    });
    
    // Modal kapatma eventi
    closeBtn.addEventListener('click', closeModal);
    
    // Modal dışına tıklayınca kapatma
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // ESC tuşu ile kapatma
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Ses butonu olayı
    const audioButton = document.getElementById('audio-button');
    if (audioButton) {
        audioButton.addEventListener('click', function() {
            const word = modalWord.textContent;
            if (word) {
                playWordAudio(word);
            }
        });
    }
}

// Modal'ı göster
function showModal(word, definition, imageSrc) {
    // İçeriği temizle ve yeniden ayarla
    modalWord.innerHTML = word.toUpperCase();
    modalDefinition.innerHTML = definition;
    modalImage.src = imageSrc;
    modalImage.alt = word;
    
    // Modal'ı göster
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Modal'ı kapat
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Scroll'u tekrar aktif et
}

// Yeni kelime ekleme fonksiyonu (Gelecekte kullanabilirsiniz)
function addNewWord(word, definition, imageUrl) {
    vocabularyData.push({
        word: word,
        definition: definition,
        image: imageUrl
    });
    renderVocabularyGrid();
}

// Kelimeleri karıştır ve yeniden render et
function shuffleWords() {
    renderVocabularyGrid();
}

// Local storage'dan veri yükle (ileride kullanabilirsiniz)
function loadFromLocalStorage() {
    const savedData = localStorage.getItem('vocabularyData');
    if (savedData) {
        vocabularyData = JSON.parse(savedData);
        renderVocabularyGrid();
    }
}

// Local storage'a veri kaydet (ileride kullanabilirsiniz)
function saveToLocalStorage() {
    localStorage.setItem('vocabularyData', JSON.stringify(vocabularyData));
}

// Kelime sayacı fonksiyonu
function updateWordCounter() {
    // Toplam kelime sayısı (mevcut seviye için)
    const totalWords = vocabularyData.length;
    document.getElementById('word-count').textContent = totalWords;
    
    // Eğer B1 seviyesindeyse ve kelime yoksa, sayacı gizle
    if (currentLevel === 'b1' && vocabularyData.length === 0) {
        document.querySelector('.word-counter').style.display = 'none';
        return;
    } else {
        document.querySelector('.word-counter').style.display = 'block';
    }
    
    // B1 seviyesindeyse, B1 kelimelerini harflere göre say
    if (currentLevel === 'b1') {
        // Tüm sayaçları sıfırla
        const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'y'];
        const letterCounts = {};
        
        // Her harfi sıfırla
        letters.forEach(letter => {
            letterCounts[letter] = 0;
        });
        
        // B1 kelimelerini say
        vocabularyDataB1.forEach(item => {
            const firstLetter = item.word.charAt(0).toLowerCase();
            if (letterCounts.hasOwnProperty(firstLetter)) {
                letterCounts[firstLetter]++;
            }
        });
        
        // Sayaçları güncelle
        letters.forEach(letter => {
            const element = document.getElementById(`count-${letter}`);
            if (element) {
                element.textContent = letterCounts[letter];
            }
        });
        return;
    }
    
    // A2 seviyesi için mevcut mantık
    const countA = vocabularyDataA ? vocabularyDataA.length : 0;
    const countB = vocabularyDataB ? vocabularyDataB.length : 0;
    const countC = vocabularyDataC ? vocabularyDataC.length : 0;
    const countD = vocabularyDataD ? vocabularyDataD.length : 0;
    const countE = typeof vocabularyDataE !== 'undefined' ? vocabularyDataE.length : 0;
    const countF = typeof vocabularyDataF !== 'undefined' ? vocabularyDataF.length : 0;
    const countG = typeof vocabularyDataG !== 'undefined' ? vocabularyDataG.length : 0;
    const countH = typeof vocabularyDataH !== 'undefined' ? vocabularyDataH.length : 0;
    
    document.getElementById('count-a').textContent = countA;
    document.getElementById('count-b').textContent = countB;
    document.getElementById('count-c').textContent = countC;
    document.getElementById('count-d').textContent = countD;
    if (document.getElementById('count-e')) {
        document.getElementById('count-e').textContent = countE;
    }
    if (document.getElementById('count-f')) {
        document.getElementById('count-f').textContent = countF;
    }
    if (document.getElementById('count-g')) {
        document.getElementById('count-g').textContent = countG;
    }
    if (document.getElementById('count-h')) {
        document.getElementById('count-h').textContent = countH;
    }
    
    // I kategorisi
    const countI = typeof vocabularyDataI !== 'undefined' ? vocabularyDataI.length : 0;
    if (document.getElementById('count-i')) {
        document.getElementById('count-i').textContent = countI;
    }
    
    // J kategorisi
    const countJ = typeof vocabularyDataJ !== 'undefined' ? vocabularyDataJ.length : 0;
    if (document.getElementById('count-j')) {
        document.getElementById('count-j').textContent = countJ;
    }
    
    // K kategorisi
    const countK = typeof vocabularyDataK !== 'undefined' ? vocabularyDataK.length : 0;
    if (document.getElementById('count-k')) {
        document.getElementById('count-k').textContent = countK;
    }
    
    // L kategorisi
    const countL = typeof vocabularyDataL !== 'undefined' ? vocabularyDataL.length : 0;
    if (document.getElementById('count-l')) {
        document.getElementById('count-l').textContent = countL;
    }
    
    // M kategorisi
    const countM = typeof vocabularyDataM !== 'undefined' ? vocabularyDataM.length : 0;
    if (document.getElementById('count-m')) {
        document.getElementById('count-m').textContent = countM;
    }
    
    // N kategorisi
    const countN = typeof vocabularyDataN !== 'undefined' ? vocabularyDataN.length : 0;
    if (document.getElementById('count-n')) {
        document.getElementById('count-n').textContent = countN;
    }
    
    // O kategorisi
    const countO = typeof vocabularyDataO !== 'undefined' ? vocabularyDataO.length : 0;
    if (document.getElementById('count-o')) {
        document.getElementById('count-o').textContent = countO;
    }
    
    // P kategorisi
    const countP = typeof vocabularyDataP !== 'undefined' ? vocabularyDataP.length : 0;
    if (document.getElementById('count-p')) {
        document.getElementById('count-p').textContent = countP;
    }
    
    // Q kategorisi
    const countQ = typeof vocabularyDataQ !== 'undefined' ? vocabularyDataQ.length : 0;
    if (document.getElementById('count-q')) {
        document.getElementById('count-q').textContent = countQ;
    }
    
    // R kategorisi
    const countR = typeof vocabularyDataR !== 'undefined' ? vocabularyDataR.length : 0;
    if (document.getElementById('count-r')) {
        document.getElementById('count-r').textContent = countR;
    }
    
    // S kategorisi
    const countS = typeof vocabularyDataS !== 'undefined' ? vocabularyDataS.length : 0;
    if (document.getElementById('count-s')) {
        document.getElementById('count-s').textContent = countS;
    }
    
    // T kategorisi
    const countT = typeof vocabularyDataT !== 'undefined' ? vocabularyDataT.length : 0;
    if (document.getElementById('count-t')) {
        document.getElementById('count-t').textContent = countT;
    }
    
    // U kategorisi
    const countU = typeof vocabularyDataU !== 'undefined' ? vocabularyDataU.length : 0;
    if (document.getElementById('count-u')) {
        document.getElementById('count-u').textContent = countU;
    }
    
    // V kategorisi
    const countV = typeof vocabularyDataV !== 'undefined' ? vocabularyDataV.length : 0;
    if (document.getElementById('count-v')) {
        document.getElementById('count-v').textContent = countV;
    }
    
    // W kategorisi
    const countW = typeof vocabularyDataW !== 'undefined' ? vocabularyDataW.length : 0;
    if (document.getElementById('count-w')) {
        document.getElementById('count-w').textContent = countW;
    }
    
    // Y kategorisi
    const countY = typeof vocabularyDataY !== 'undefined' ? vocabularyDataY.length : 0;
    if (document.getElementById('count-y')) {
        document.getElementById('count-y').textContent = countY;
    }
}

// Quiz değişkenleri
let currentQuestion = null;
let score = 0;
let answeredQuestions = [];
let recentQuestions = []; // Son 50 soruyu takip etmek için
const RECENT_QUESTIONS_LIMIT = 50; // Aynı kelime 50 sorudan sonra tekrar sorulabilir

// Review Quiz değişkenleri
let wrongAnswers = JSON.parse(localStorage.getItem('wrongAnswers') || '[]');
let reviewCurrentQuestion = null;
let reviewScore = 0;
let isReviewMode = false;

// Tab değiştirme fonksiyonu
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Tüm tabları ve içerikleri pasif yap
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Tıklanan tabı aktif yap
            button.classList.add('active');
            
            // İlgili içeriği göster
            if (targetTab === 'vocabulary') {
                document.getElementById('vocabulary-grid').classList.add('active');
                isReviewMode = false;
                showWordCounter();
            } else if (targetTab === 'quiz') {
                document.getElementById('quiz-container').classList.add('active');
                isReviewMode = false;
                hideWordCounter();
                startNewQuestion();
            } else if (targetTab === 'review') {
                document.getElementById('review-container').classList.add('active');
                isReviewMode = true;
                hideWordCounter();
                initReviewQuiz();
            }
        });
    });
}

// Kelime sayacını gizle/göster
function hideWordCounter() {
    const wordCounter = document.querySelector('.word-counter');
    if (wordCounter) {
        wordCounter.style.display = 'none';
    }
}

function showWordCounter() {
    const wordCounter = document.querySelector('.word-counter');
    if (wordCounter) {
        wordCounter.style.display = 'block';
    }
}

// Quiz'i sıfırla
function resetQuiz() {
    score = 0;
    answeredQuestions = 0;
    recentQuestions = [];
    if (document.getElementById('quiz-score')) {
        document.getElementById('quiz-score').textContent = `Puan: ${score}/${answeredQuestions}`;
    }
    startNewQuestion();
}

// Quiz fonksiyonları
function startNewQuestion() {
    // Tüm butonları temizle
    const options = document.querySelectorAll('.quiz-option');
    options.forEach(option => {
        option.classList.remove('correct', 'incorrect');
        option.disabled = false;
    });
    
    // Next butonunu gizle
    document.querySelector('.next-question-btn').style.display = 'none';
    
    // Telaffuz göstergesini gizle
    const indicator = document.getElementById('pronunciation-indicator');
    if (indicator) {
        indicator.style.display = 'none';
    }
    
    // Son 20 soruda sorulmamış kelimeleri filtrele
    const availableQuestions = vocabularyData.filter(word => 
        !recentQuestions.some(recent => recent.word === word.word)
    );
    
    // Eğer tüm kelimeler son 20 soruda sorulduysa, en eski 5 soruyu listeden çıkar
    if (availableQuestions.length === 0) {
        recentQuestions.splice(0, 5);
        return startNewQuestion(); // Yeniden başlat
    }
    
    // Rastgele bir kelime seç
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[randomIndex];
    
    // Bu soruyu recent listesine ekle
    recentQuestions.push(currentQuestion);
    
    // Recent listesi limitini aş, en eskiyi çıkar
    if (recentQuestions.length > RECENT_QUESTIONS_LIMIT) {
        recentQuestions.shift();
    }
    
    // Görseli göster
    document.getElementById('quiz-image').src = currentQuestion.image;
    
    // 4 şık oluştur (1 doğru, 3 yanlış)
    const correctAnswer = currentQuestion.word;
    const allOptions = [correctAnswer];
    
    // 3 yanlış cevap ekle
    while (allOptions.length < 4) {
        const randomWord = vocabularyData[Math.floor(Math.random() * vocabularyData.length)].word;
        if (!allOptions.includes(randomWord)) {
            allOptions.push(randomWord);
        }
    }
    
    // Şıkları karıştır
    const shuffledOptions = shuffleArray([...allOptions]);
    
    // Şıkları yerleştir
    options.forEach((option, index) => {
        option.textContent = shuffledOptions[index];
        option.onclick = () => checkAnswer(option, shuffledOptions[index] === correctAnswer);
    });
}

// Cevabı kontrol et
function checkAnswer(button, isCorrect) {
    const options = document.querySelectorAll('.quiz-option');
    
    // Tüm butonları devre dışı bırak
    options.forEach(option => {
        option.disabled = true;
    });
    
    if (isCorrect) {
        button.classList.add('correct');
        score++;
        document.getElementById('score').textContent = score;
        
        // Doğru cevap verildiğinde kelimeyi seslendir
        speakWord(currentQuestion.word);
    } else {
        button.classList.add('incorrect');
        // Doğru cevabı göster
        options.forEach(option => {
            if (option.textContent === currentQuestion.word) {
                option.classList.add('correct');
            }
        });
        
        // Yanlış cevabı kaydet
        if (!isReviewMode) {
            addWrongAnswer(currentQuestion);
        }
    }
    
    // Next butonunu göster
    document.querySelector('.next-question-btn').style.display = 'block';
}

// Kelimeyi seslendir fonksiyonu
function speakWord(word) {
    // Web Speech API desteğini kontrol et
    if ('speechSynthesis' in window) {
        // Telaffuz göstergesini göster
        const indicator = document.getElementById('pronunciation-indicator');
        if (indicator) {
            indicator.style.display = 'inline-flex';
        }
        
        // Önceki seslendirmeleri iptal et
        window.speechSynthesis.cancel();
        
        // Yeni seslendirme oluştur
        const utterance = new SpeechSynthesisUtterance(word);
        
        // İngilizce (US) olarak ayarla
        utterance.lang = 'en-US';
        
        // Ses hızı ve tonu ayarla
        utterance.rate = 0.9; // Biraz yavaşlat (0.1 - 10 arası)
        utterance.pitch = 1; // Normal ton (0 - 2 arası)
        utterance.volume = 1; // Tam ses (0 - 1 arası)
        
        // İngilizce ses varsa kullan
        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find(voice => 
            voice.lang.startsWith('en') && voice.name.includes('Female')
        ) || voices.find(voice => voice.lang.startsWith('en'));
        
        if (englishVoice) {
            utterance.voice = englishVoice;
        }
        
        // Seslendirme bittiğinde göstergeyi gizle
        utterance.onend = function() {
            if (indicator) {
                setTimeout(() => {
                    indicator.style.display = 'none';
                }, 500); // Yarım saniye bekle sonra gizle
            }
        };
        
        // Kelimeyi seslendir
        window.speechSynthesis.speak(utterance);
    }
}

// Next Question butonu için event listener
document.addEventListener('DOMContentLoaded', function() {
    const nextBtn = document.querySelector('.next-question-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', startNewQuestion);
    }
    
    // Tab sistemini kur
    setupTabs();
});

// Wrong Answers Management Functions
function addWrongAnswer(word) {
    // Check if word already exists in wrong answers
    const exists = wrongAnswers.some(w => w.word === word.word && w.definition === word.definition);
    if (!exists) {
        wrongAnswers.push({
            word: word.word,
            definition: word.definition,
            image: word.image,
            level: currentLevel
        });
        localStorage.setItem('wrongAnswers', JSON.stringify(wrongAnswers));
    }
}

function removeWrongAnswer(word) {
    wrongAnswers = wrongAnswers.filter(w => !(w.word === word.word && w.definition === word.definition));
    localStorage.setItem('wrongAnswers', JSON.stringify(wrongAnswers));
}

function clearWrongAnswers() {
    if (confirm('Are you sure you want to clear all wrong answers?')) {
        wrongAnswers = [];
        localStorage.setItem('wrongAnswers', JSON.stringify(wrongAnswers));
        updateWrongWordsCount();
        initReviewQuiz();
    }
}

function updateWrongWordsCount() {
    const countElement = document.getElementById('wrong-words-count');
    if (countElement) {
        // Filter wrong answers by current level
        const levelWrongAnswers = wrongAnswers.filter(w => w.level === currentLevel);
        countElement.textContent = levelWrongAnswers.length;
    }
}

// Review Quiz Functions
function initReviewQuiz() {
    updateWrongWordsCount();
    
    // Filter wrong answers by current level
    const levelWrongAnswers = wrongAnswers.filter(w => w.level === currentLevel);
    
    const reviewContent = document.getElementById('review-quiz-content');
    const noWordsMessage = document.getElementById('no-wrong-words');
    
    if (levelWrongAnswers.length === 0) {
        reviewContent.style.display = 'none';
        noWordsMessage.style.display = 'block';
    } else {
        reviewContent.style.display = 'block';
        noWordsMessage.style.display = 'none';
        reviewScore = 0;
        document.getElementById('review-score').textContent = reviewScore;
        startReviewQuestion();
    }
}

function startReviewQuestion() {
    // Filter wrong answers by current level
    const levelWrongAnswers = wrongAnswers.filter(w => w.level === currentLevel);
    
    if (levelWrongAnswers.length === 0) {
        initReviewQuiz();
        return;
    }
    
    // Hide pronunciation indicator
    const pronunciationIndicator = document.getElementById('review-pronunciation-indicator');
    if (pronunciationIndicator) {
        pronunciationIndicator.style.display = 'none';
    }
    
    // Select random word from wrong answers
    const randomIndex = Math.floor(Math.random() * levelWrongAnswers.length);
    reviewCurrentQuestion = levelWrongAnswers[randomIndex];
    
    // Display image
    document.getElementById('review-quiz-image').src = reviewCurrentQuestion.image;
    
    // Create answer options
    const correctAnswer = reviewCurrentQuestion.word;
    const allWords = vocabularyData.filter(w => w.word !== correctAnswer);
    const wrongOptions = [];
    
    while (wrongOptions.length < 3 && allWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * allWords.length);
        wrongOptions.push(allWords[randomIndex].word);
        allWords.splice(randomIndex, 1);
    }
    
    const shuffledOptions = shuffleArray([correctAnswer, ...wrongOptions]);
    
    // Display options
    const optionButtons = document.querySelectorAll('.review-quiz-option');
    optionButtons.forEach((option, index) => {
        option.textContent = shuffledOptions[index];
        option.classList.remove('correct', 'incorrect');
        option.disabled = false;
        option.onclick = () => checkReviewAnswer(option, shuffledOptions[index] === correctAnswer);
    });
    
    // Hide next button
    document.querySelector('.review-next-question-btn').style.display = 'none';
}

function checkReviewAnswer(button, isCorrect) {
    const options = document.querySelectorAll('.review-quiz-option');
    
    // Disable all buttons
    options.forEach(option => {
        option.disabled = true;
    });
    
    if (isCorrect) {
        button.classList.add('correct');
        reviewScore++;
        document.getElementById('review-score').textContent = reviewScore;
        
        // Remove from wrong answers since they got it right
        removeWrongAnswer(reviewCurrentQuestion);
        updateWrongWordsCount();
        
        // Speak the word
        speakReviewWord(reviewCurrentQuestion.word);
    } else {
        button.classList.add('incorrect');
        // Show correct answer
        options.forEach(option => {
            if (option.textContent === reviewCurrentQuestion.word) {
                option.classList.add('correct');
            }
        });
    }
    
    // Show next button
    document.querySelector('.review-next-question-btn').style.display = 'block';
}

function speakReviewWord(word) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        const pronunciationIndicator = document.getElementById('review-pronunciation-indicator');
        
        utterance.onstart = () => {
            if (pronunciationIndicator) {
                pronunciationIndicator.style.display = 'flex';
            }
        };
        
        utterance.onend = () => {
            if (pronunciationIndicator) {
                setTimeout(() => {
                    pronunciationIndicator.style.display = 'none';
                }, 500);
            }
        };
        
        window.speechSynthesis.speak(utterance);
    }
}

// Event Listeners for Review Quiz
document.addEventListener('DOMContentLoaded', function() {
    // Clear wrong words button
    const clearBtn = document.getElementById('clear-wrong-words');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearWrongAnswers);
    }
    
    // Review next question button
    const reviewNextBtn = document.querySelector('.review-next-question-btn');
    if (reviewNextBtn) {
        reviewNextBtn.addEventListener('click', startReviewQuestion);
    }
});

// Ses çalma fonksiyonu
function playWordAudio(word) {
    // Web Speech API kullanarak kelimeyi seslendir
    if ('speechSynthesis' in window) {
        // Önceki konuşmayı durdur
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(word);
        
        // İngilizce seslendirme için dil ayarı
        utterance.lang = 'en-US';
        utterance.rate = 0.8; // Biraz daha yavaş konuş
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        // Ses butonuna loading efekti ekle
        const audioButton = document.getElementById('audio-button');
        if (audioButton) {
            audioButton.style.transform = 'scale(0.95)';
            audioButton.style.opacity = '0.7';
            
            utterance.onend = function() {
                audioButton.style.transform = '';
                audioButton.style.opacity = '';
            };
            
            utterance.onerror = function() {
                audioButton.style.transform = '';
                audioButton.style.opacity = '';
                console.log('Speech synthesis error');
            };
        }
        
        speechSynthesis.speak(utterance);
    } else {
        console.log('Speech synthesis not supported');
        alert('Bu tarayıcı ses özelliğini desteklemiyor.');
    }
}

// Konsol'dan kullanılabilecek yardımcı fonksiyonlar
window.addWord = addNewWord;
window.shuffleWords = shuffleWords;
window.saveWords = saveToLocalStorage;
window.loadWords = loadFromLocalStorage;