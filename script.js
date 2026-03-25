document.addEventListener("DOMContentLoaded", function() {
    
    const btnOpen = document.getElementById('open-invitation');
    const coverPage = document.getElementById('cover-page');
    const mainContent = document.getElementById('main-content');
    
    // Elemen Musik
    const bgMusic = document.getElementById('bg-music');
    const musicControl = document.getElementById('music-control');
    let isPlaying = false;
    let fadeInterval; // Variabel penampung interval agar tidak bertabrakan

    // --- FUNGSI FADE IN ---
    function fadeInAudio(audio, duration) {
        clearInterval(fadeInterval); // Bersihkan interval sebelumnya jika ada
        audio.volume = 0;
        audio.play().catch(e => console.log("Autoplay dicegah browser"));
        
        const step = 0.05;
        const intervalTime = duration / (1 / step);
        
        fadeInterval = setInterval(() => {
            if (audio.volume < 1.0 - step) {
                audio.volume += step;
            } else {
                audio.volume = 1.0;
                clearInterval(fadeInterval);
            }
        }, intervalTime);
    }

    // --- FUNGSI FADE OUT ---
    function fadeOutAudio(audio, duration) {
        clearInterval(fadeInterval);
        const step = 0.05;
        const intervalTime = duration / (audio.volume / step);
        
        fadeInterval = setInterval(() => {
            if (audio.volume > step) {
                audio.volume -= step;
            } else {
                audio.volume = 0;
                audio.pause();
                clearInterval(fadeInterval);
            }
        }, intervalTime);
    }

    // 6. Logika Ornamen Melayang
    const ornamentContainer = document.getElementById('floating-ornaments');
    const ornamentTypes = ['✨', '🍃', '🌸', '⭐'];

    function createOrnament() {
        if (!ornamentContainer) return;
        
        const ornament = document.createElement('div');
        ornament.className = 'floating-ornament';
        ornament.innerText = ornamentTypes[Math.floor(Math.random() * ornamentTypes.length)];
        
        const startX = Math.random() * 100;
        const drift = (Math.random() - 0.5) * 200;
        const duration = 10 + Math.random() * 20;
        const size = 15 + Math.random() * 20;

        ornament.style.left = `${startX}vw`;
        ornament.style.fontSize = `${size}px`;
        ornament.style.setProperty('--duration', `${duration}s`);
        ornament.style.setProperty('--drift', `${drift}px`);

        ornamentContainer.appendChild(ornament);

        setTimeout(() => {
            ornament.remove();
        }, duration * 1000);
    }

    // Mulai membuat ornamen setelah undangan dibuka
    function startOrnaments() {
        setInterval(createOrnament, 2000);
        // Buat beberapa di awal
        for(let i = 0; i < 5; i++) {
            setTimeout(createOrnament, Math.random() * 5000);
        }
    }

    // 1. Logika Buka Undangan & Autoplay Musik (dengan Fade In)
    btnOpen.addEventListener('click', function() {
        coverPage.classList.add('slide-up-out');
        mainContent.classList.remove('hidden');
        musicControl.classList.remove('hidden');

        startOrnaments(); // Mulai ornamen saat dibuka

        const lampion = document.querySelector('.lampion-ornament');
        if (lampion) {
            lampion.style.transition = 'opacity 0.5s ease'; // Efek memudar yang halus
            lampion.style.opacity = '0'; // Lampion menjadi transparan
            
            setTimeout(() => {
                lampion.style.display = 'none'; // Benar-benar dihilangkan dari layar setelah memudar
            }, 500);
        }
        
        // Panggil Fade In dengan durasi 2000ms (2 detik)
        fadeInAudio(bgMusic, 2000);
        isPlaying = true;

        setTimeout(() => {
            coverPage.style.display = 'none';
        }, 800);
    });

    // 2. Logika Toggle Play/Pause Musik (dengan Fade In/Out)
    musicControl.addEventListener('click', function() {
        if (isPlaying) {
            // Fade Out selama 1 detik sebelum pause
            fadeOutAudio(bgMusic, 1000);
            musicControl.classList.add('paused');
            document.getElementById('music-icon').innerText = '🔇';
        } else {
            // Fade In selama 1 detik saat play kembali
            fadeInAudio(bgMusic, 1000);
            musicControl.classList.remove('paused');
            document.getElementById('music-icon').innerText = '🎵';
        }
        isPlaying = !isPlaying;
    });

    // 3. Intersection Observer untuk Animasi Scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    // 4. Logika Copy Rekening ke Clipboard
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const rekNumber = this.getAttribute('data-rek');
            
            // API Clipboard modern
            navigator.clipboard.writeText(rekNumber).then(() => {
                const originalText = this.innerText;
                this.innerText = '✓ Berhasil Disalin!';
                this.classList.add('copied');
                
                // Kembalikan teks setelah 2 detik
                setTimeout(() => {
                    this.innerText = originalText;
                    this.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Gagal menyalin teks: ', err);
                alert('Gagal menyalin rekening. Silakan salin manual.');
            });
        });
    });

    // 5. Logika RSVP via WhatsApp
    const rsvpForm = document.getElementById('rsvp-form');
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('guest-name').value;
        const attendance = document.getElementById('attendance').value;
        const message = document.getElementById('message').value;
        
        // GANTI DENGAN NOMOR WA PENERIMA RSVP (Gunakan 62 di depan)
        const phoneNumber = "628115556180"; 
        
        // Format pesan
        const text = `Assalamu'alaikum,%0A%0ASaya *${name}*, ingin mengkonfirmasi bahwa saya *${attendance}* pada acara tasyakuran khitanan.%0A%0AUcapan/Doa:%0A"${message}"%0A%0ATerima kasih.`;
        
        const waURL = `https://wa.me/${phoneNumber}?text=${text}`;
        window.open(waURL, '_blank');
    });

});
