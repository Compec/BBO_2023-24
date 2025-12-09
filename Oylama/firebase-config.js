// ══════════════════════════════════════════════════════════
// FIREBASE CONFIGURATION
// ══════════════════════════════════════════════════════════
// Firebase Console'dan aldığın config bilgilerini buraya yapıştır
// https://console.firebase.google.com/ → Project Settings → Your apps

 const firebaseConfig = {
    apiKey: "AIzaSyDppvWCZaWMnJrXylSVMG9QOfJ-p7gOoyg",
    authDomain: "flutter-acee7.firebaseapp.com",
    projectId: "flutter-acee7",
    storageBucket: "flutter-acee7.firebasestorage.app",
    messagingSenderId: "784153859610",
    appId: "1:784153859610:web:2144d9c6ccedfa62e163a3",
    measurementId: "G-N2BKPYBVWL"
  };


// ══════════════════════════════════════════════════════════
// KURULUM TALİMATLARI
// ══════════════════════════════════════════════════════════
/*
1. Firebase Console'a git: https://console.firebase.google.com/
2. Yeni proje oluştur veya mevcut projeyi seç
3. "Web App" ekle (</> simgesi)
4. Config bilgilerini kopyala ve yukarıya yapıştır
5. Firestore Database'i etkinleştir:
   - Build → Firestore Database → Create Database
   - "Start in production mode" seç
   - Region seç (europe-west1 önerilir)
   
6. Firestore Rules'ı güncelle:
   
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Votes collection - sadece yazma izni
       match /votes/{document=**} {
         allow read: if false;  // Kimse okuyamaz
         allow write: if true;  // Herkes yazabilir
       }
       
       // Device votes - cihaz kontrolü için
       match /device_votes/{deviceId} {
         allow read: if request.auth == null;  // Herkes okuyabilir
         allow write: if request.auth == null; // Herkes yazabilir
       }
     }
   }

7. Index oluştur (performans için):
   - Firestore → Indexes → Create Index
   - Collection ID: device_votes
   - Field: deviceId (Ascending)
   - Query scope: Collection
*/
