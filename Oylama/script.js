let currentStep = 1;
const totalSteps = ADAYLAR_DATA.length;
let deviceFingerprint = null;

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
    // Cihaz parmak izini al
    deviceFingerprint = await getDeviceFingerprint();
    console.log('Cihaz ID:', deviceFingerprint);
    
    // Kullanıcı daha önce oy verdiyse kontrol et
    checkIfAlreadyVoted();
    
    // Form sorularını oluştur
    generateQuestions();
});

// Kullanıcının daha önce oy verip vermediğini kontrol et
function checkIfAlreadyVoted() {
    const voted = localStorage.getItem('bbo_voted_' + deviceFingerprint);
    
    if (voted === 'true') {
        // Kullanıcı zaten oy vermiş
        document.getElementById('welcomePage').innerHTML = `
            <div>
                <h2>⚠️ Daha Önce Oy Kullandınız!</h2>
                <p>Bu cihazdan daha önce oy kullanılmış.</p>
                <p>Her cihaz sadece bir kez oy kullanabilir.</p>
                <p>Katılımınız için teşekkür ederiz! 🎉</p>
                <br>
                <button onclick='window.open("https://www.biletimgo.com/etkinlik/bogazici-bilisim-odulleri-20670", "_blank")'>🎟️ Bilet Al!</button>
            </div>
        `;
        document.getElementById('step1').style.display = 'none';
    }
}

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
            input.name = kategori.formEntry;
            input.value = aday.isim;
            input.required = true;
            
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

    // İleri giderken cevap kontrolü yap
    if (direction > 0 && !isQuestionAnswered(currentStep)) {
        alert("Lütfen bir adayı oylayın.");
        return;
    }

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
        form.addEventListener('submit', function(event) {        
            event.preventDefault();
            
            // Tüm soruların cevaplandığını kontrol et
            for (let i = 1; i <= totalSteps; i++) {
                if (!isQuestionAnswered(i)) {
                    alert("Lütfen tüm kategoriler için oy kullanın.");
                    return;
                }
            }

            // Formu Google Forms'a gönder
            const formData = new FormData(this);
            const googleFormURL = 'https://docs.google.com/forms/d/e/1FAIpQLSdcaZmp11i_oN44F9S_uVY0DYp-TDGHd5yRzBeytLrdurHpSA/formResponse';
            
            fetch(googleFormURL, {
                method: 'POST',
                body: formData,
                mode: 'no-cors'
            }).then(() => {
                // Oy kullanıldı olarak işaretle
                localStorage.setItem('bbo_voted_' + deviceFingerprint, 'true');
                localStorage.setItem('bbo_vote_date_' + deviceFingerprint, new Date().toISOString());
                
                // Teşekkür mesajı göster
                document.getElementById('multiStepForm').innerHTML = `
                    <div class="thank-you-container" style="display: block;">
                        <h2>🎉 Teşekkürler!</h2>
                        <p>Oy kullandığınız için çok teşekkür ederiz!</p>
                        <p>14 Aralık'taki zirvemize de bekleriz! 🙌</p>
                        <br>
                        <button onclick='window.open("https://www.biletimgo.com/etkinlik/bogazici-bilisim-odulleri-20670", "_blank")'>🎟️ Bilet Al!</button>
                    </div>
                `;
            }).catch((error) => {
                console.error('Form gönderme hatası:', error);
                alert('Oy gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
            });
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
