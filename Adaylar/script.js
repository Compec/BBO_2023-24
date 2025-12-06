// Adayları dinamik olarak yükle
document.addEventListener('DOMContentLoaded', function() {
    const mainElement = document.querySelector('main');
    
    if (!mainElement) {
        console.error('Main element bulunamadı!');
        return;
    }
    
    // Her kategori için HTML oluştur
    ADAYLAR_DATA.forEach(kategori => {
        const kategoriDiv = document.createElement('div');
        kategoriDiv.className = 'kategori';
        
        // Kategori başlığı
        const baslikDiv = document.createElement('div');
        baslikDiv.className = 'kategoribasligi';
        baslikDiv.textContent = kategori.kategori;
        kategoriDiv.appendChild(baslikDiv);
        
        // Adaylar container
        const containerDiv = document.createElement('div');
        containerDiv.className = 'tripleimagecontainer';
        
        // Her aday için HTML oluştur
        kategori.adaylar.forEach(aday => {
            const adayDiv = document.createElement('div');
            adayDiv.className = 'imgcontainer';
            
            const img = document.createElement('img');
            img.src = aday.fotograf;
            img.className = 'adaygorseli';
            img.loading = 'lazy';
            img.alt = aday.isim;
            if (aday.stil) {
                img.style.cssText = aday.stil;
            }
            
            const isimP = document.createElement('p');
            isimP.className = 'adayismi';
            isimP.textContent = aday.isim;
            
            adayDiv.appendChild(img);
            adayDiv.appendChild(isimP);
            containerDiv.appendChild(adayDiv);
        });
        
        kategoriDiv.appendChild(containerDiv);
        mainElement.appendChild(kategoriDiv);
    });
});
