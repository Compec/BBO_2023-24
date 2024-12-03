let currentStep = 1;
const totalSteps = 18;

function startForm() {
    document.getElementById('welcomePage').classList.remove('active');
    document.getElementById('step1').classList.add('active');
    document.getElementById('nextButton').disabled = false;
}

function navigate(direction) {
    const currentQuestion = document.getElementById('question' + currentStep);

    if (!isQuestionAnswered(currentStep)) {
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
      
    nextButton.style.display = currentStep === totalSteps ? "none" : "inline-block";
    submitButton.style.display = currentStep === totalSteps ? "inline-block" : "none";
    }
      
    document.getElementById('multiStepForm').addEventListener('submit', function(event) {        
        event.preventDefault();
        
        for (let i = 1; i <= totalSteps; i++) {
            if (!isQuestionAnswered(i)) {
                alert("Lütfen tüm kategoriler için oy kullanın.");
                return;
            }
        }

        const formData = new FormData(this);
        const googleFormURL = 'https://docs.google.com/forms/d/e/1FAIpQLSdcaZmp11i_oN44F9S_uVY0DYp-TDGHd5yRzBeytLrdurHpSA/formResponse';
        
        fetch(googleFormURL, {
          method: 'POST',
          body: formData
        });
        document.getElementById('multiStepForm').innerHTML = `
        <div class="thank-you-message">
          <br><br>
          <h2>Teşekkürler! 🎉</h2>
          <p>Oy kullandığınız için çok teşekkür ederiz! 🥳 Yanıtınız başarıyla kaydedildi ve büyük bir katkı sağladınız! 🙌</p>
          <br><br>
        </div>
        `;
  });

function isQuestionAnswered(step) {
    const question = document.getElementById('question' + step);
    const selectedOption = question.querySelector('input[type="radio"]:checked');
    return selectedOption !== null;
}

function updateProgressBar() {
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");
    const progress = (currentStep - 1) / (totalSteps - 1) * 100;
    progressBar.style.width = progress + "%";
    progressText.textContent = `Soru ${currentStep} / ${totalSteps}`;
}
