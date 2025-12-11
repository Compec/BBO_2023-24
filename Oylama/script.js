let currentStep = 1;
const totalSteps = ADAYLAR_DATA.length;
let deviceFingerprint = null;
let db = null;

// Firebase'i başlat
function initFirebase() {
    try {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        console.log('✅ Firebase başlatıldı');
    } catch (error) {
        console.error('❌ Firebase başlatma hatası:', error);
        alert('Veritabanı bağlantısı kurulamadı. Lütfen sayfayı yenileyin.');
    }
}

// Cihaz parmak izini al
async function getDeviceFingerprint() {
    try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        return result.visitorId;
    } catch (error) {
        console.error('Fingerprint alınamadı:', error);
        // Fallback: LocalStorage'dan rastgele ID oluştur
        let fallbackId = localStorage.getItem('bbo_device_id');
        if (!fallbackId) {
            fallbackId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('bbo_device_id', fallbackId);
        }
        return fallbackId;
    }
}

// Sayfa yüklendiğinde çalışacak
document.addEventListener('DOMContentLoaded', async function() {
    // Firebase'i başlat
    initFirebase();
    
    // Cihaz parmak izini al
    deviceFingerprint = await getDeviceFingerprint();
    console.log('Cihaz ID:', deviceFingerprint);
    
    // Form sorularını oluştur
    generateQuestions();
});



// Formun başlaması
function startForm() {
    document.getElementById('welcomePage').classList.remove('active');
    document.getElementById('step1').classList.add('active');
    document.getElementById('nextButton').disabled = false;
    updateNavigationButtons();
}

// Soruları dinamik olarak oluştur
function generateQuestions() {
    const container = document.getElementById('questionsContainer');
    
    ADAYLAR_DATA.forEach((kategori, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-container';
        questionDiv.id = 'question' + (index + 1);
        
        if (index === 0) {
            questionDiv.classList.add('active');
        }
        
        // Başlık
        const h2 = document.createElement('h2');
        h2.textContent = kategori.kategori;
        questionDiv.appendChild(h2);
        
        // Adaylar listesi
        const candidateList = document.createElement('div');
        candidateList.className = 'candidate-list';
        
        kategori.adaylar.forEach((aday, adayIndex) => {
            const candidateDiv = document.createElement('div');
            candidateDiv.className = 'candidate';
            
            const inputId = `q${index + 1}c${adayIndex + 1}`;
            const input = document.createElement('input');
            input.type = 'radio';
            input.id = inputId;
            input.name = kategori.kategoriId;
            input.value = aday.isim;
            input.required = false;
            
            const label = document.createElement('label');
            label.htmlFor = inputId;
            
            const img = document.createElement('img');
            img.src = aday.fotograf;
            img.alt = aday.isim;
            if (aday.stil) {
                img.style.cssText = aday.stil;
            }
            
            label.appendChild(img);
            label.appendChild(document.createElement('br'));
            label.appendChild(document.createTextNode(aday.isim));
            
            // Tüm kareye tıklanabilir yap
            candidateDiv.onclick = function() {
                input.checked = true;
            };
            
            candidateDiv.appendChild(input);
            candidateDiv.appendChild(label);
            candidateList.appendChild(candidateDiv);
        });
        
        questionDiv.appendChild(candidateList);
        container.appendChild(questionDiv);
    });
}

// Navigasyon butonlarını güncelle
function updateNavigationButtons() {
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const submitButton = document.getElementById('submitButton');
    
    // Geri butonu - ilk soruda gizli
    if (prevButton) {
        prevButton.style.display = currentStep === 1 ? 'none' : 'inline-block';
    }
    
    // İleri ve Gönder butonları
    if (nextButton) {
        nextButton.style.display = currentStep === totalSteps ? 'none' : 'inline-block';
    }
    if (submitButton) {
        submitButton.style.display = currentStep === totalSteps ? 'inline-block' : 'none';
    }
}

// Navigasyon
function navigate(direction) {
    const currentQuestion = document.getElementById('question' + currentStep);

    currentQuestion.classList.remove('active');
              
    currentStep += direction;
              
    if (currentStep < 1) {
        currentStep = 1;
    }
    
    if (currentStep > totalSteps) {
        currentStep = totalSteps;
    }
              
    const nextQuestion = document.getElementById('question' + currentStep);
    nextQuestion.classList.add('active');
      
    updateProgressBar();
    updateNavigationButtons();
    
    // Sayfayı yukarı kaydır
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Form gönderme
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('multiStepForm');
    if (form) {
        form.addEventListener('submit', async function(event) {        
            event.preventDefault();
            
            if (!db) {
                alert('⚠️ Veritabanı bağlantısı yok. Lütfen sayfayı yenileyin.');
                return;
            }
            
            // Tüm soruların cevaplandığını kontrol et
            for (let i = 1; i <= totalSteps; i++) {
                if (!isQuestionAnswered(i)) {
                    alert("Lütfen tüm kategoriler için oy kullanın.");
                    return;
                }
            }

            // Submit butonunu devre dışı bırak
            const submitBtn = document.getElementById('submitButton');
            if (!submitBtn) {
                console.error('Submit button bulunamadı');
                return;
            }
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = '📤 Gönderiliyor...';

            try {
                // Form verilerini topla
                const formData = new FormData(this);
                const answers = {};
                
                ADAYLAR_DATA.forEach(kategori => {
                    const answer = formData.get(kategori.kategoriId);
                    answers[kategori.kategori] = answer || 'Boş';
                });
                
                // Oy verisini Firestore'a kaydet
                const voteData = {
                    deviceId: deviceFingerprint,
                    answers: answers,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    voteDate: new Date(),
                    userAgent: navigator.userAgent,
                    screenResolution: `${window.screen.width}x${window.screen.height}`,
                    referrer: document.referrer || 'direct'
                };
                
                await db.collection('votes').add(voteData);
                console.log('✅ Oy kaydedildi');
                
                // Cihaz bilgisini güncelle - her oyda oy sayısını artır
                const deviceRef = db.collection('device_votes').doc(deviceFingerprint);
                const deviceDoc = await deviceRef.get();
                
                if (deviceDoc.exists) {
                    // Mevcut cihaz - oy sayısını artır
                    await deviceRef.update({
                        voteCount: firebase.firestore.FieldValue.increment(1),
                        lastVoteDate: firebase.firestore.FieldValue.serverTimestamp(),
                        lastVoteTimestamp: new Date()
                    });
                } else {
                    // Yeni cihaz - ilk oy
                    await deviceRef.set({
                        deviceId: deviceFingerprint,
                        voteCount: 1,
                        firstVoteDate: firebase.firestore.FieldValue.serverTimestamp(),
                        lastVoteDate: firebase.firestore.FieldValue.serverTimestamp(),
                        firstVoteTimestamp: new Date(),
                        lastVoteTimestamp: new Date(),
                        userAgent: navigator.userAgent
                    });
                }
                console.log('✅ Cihaz bilgisi güncellendi');
                
                // Teşekkür mesajı göster
                document.getElementById('multiStepForm').innerHTML = `
                    <div class="thank-you-container" style="display: block;">
                        <h2>🎉 Teşekkürler!</h2>
                        <p>Oy kullandığınız için çok teşekkür ederiz!</p>
                        <p>20 Aralık'taki zirvemize de bekleriz! 🙌</p>
                        <br>
                        <button onclick='window.open("https://www.biletimgo.com/etkinlik/bogazici-bilisim-odulleri-20670", "_blank")'>🎟️ Bilet Al!</button>
                    </div>
                `;
                
            } catch (error) {
                console.error('❌ Oy gönderme hatası:', error);
                
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                
                // Hata mesajı
                if (error.code === 'permission-denied') {
                    alert('⚠️ Yetki hatası: Veritabanına erişim reddedildi. Lütfen site yöneticisiyle iletişime geçin.');
                } else if (error.code === 'unavailable') {
                    alert('⚠️ Bağlantı hatası: İnternet bağlantınızı kontrol edip tekrar deneyin.');
                } else {
                    alert('⚠️ Oy gönderilirken bir hata oluştu. Lütfen tekrar deneyin.\n\nHata: ' + error.message);
                }
            }
        });
    }
});

// Sorunun cevaplanıp cevaplanmadığını kontrol et
function isQuestionAnswered(step) {
    const question = document.getElementById('question' + step);
    if (!question) return false;
    const selectedOption = question.querySelector('input[type="radio"]:checked');
    return selectedOption !== null;
}

// Progress bar'ı güncelle
function updateProgressBar() {
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");
    const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
    progressBar.style.width = progress + "%";
    progressText.textContent = `Soru ${currentStep} / ${totalSteps}`;
}
