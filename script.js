document.addEventListener("DOMContentLoaded", () => {
    const bgPath = 'assets/images/backgrounds/';
    const ext = '.png';
    let validImages = [];
    let currentIndex = 1;

    // Helper to check if image exists
    function checkImage(index) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = `${bgPath}${index}${ext}`;
        });
    }

    // Auto-discover sequentially named images
    async function init() {
        while (true) {
            const exists = await checkImage(currentIndex);
            if (exists) {
                validImages.push(`${bgPath}${currentIndex}${ext}`);
                currentIndex++;
            } else {
                break; // Stop at first missing number
            }
        }

        // If no numbered images found, fallback or start
        if (validImages.length === 0) {
            // Check if there's a default bg.png just in case
            validImages.push('assets/images/backgrounds/1.png');
        }

        startCarousel();
    }

    let carouselIndex = 0;

    // Logic to show images sequentially
    function getNextImage() {
        const img = validImages[carouselIndex];
        carouselIndex = (carouselIndex + 1) % validImages.length;
        return img;
    }

    let bg1 = document.getElementById('bg1');
    let bg2 = document.getElementById('bg2');
    let currentBg = bg1;

    function startCarousel() {
        if (validImages.length === 1) {
            // Only one image, no need for intervals
            bg1.style.backgroundImage = `url('${validImages[0]}')`;
            bg1.classList.add('active');
            return;
        }

        // Setup first image
        const firstImage = getNextImage();
        bg1.style.backgroundImage = `url('${firstImage}')`;
        bg1.classList.add('active');

        // Start interval
        setInterval(() => {
            const nextImage = getNextImage();
            
            let nextBg = currentBg === bg1 ? bg2 : bg1;
            
            nextBg.style.backgroundImage = `url('${nextImage}')`;
            nextBg.classList.add('active');
            currentBg.classList.remove('active');
            
            currentBg = nextBg;
        }, 5000); // Change background every 5 seconds
    }

    // Server Status Fetcher
    async function fetchServerStatus() {
        const dot = document.getElementById('server-dot');
        const text = document.getElementById('server-text');
        
        try {
            const response = await fetch('https://srvstat.minespark.org/general/play.mediumrp.ru:25575');
            const data = await response.json();

            if (data.online) {
                dot.classList.remove('offline');
                text.classList.remove('offline');
                text.innerHTML = `${data.players.online} <span class="max">/ ${data.players.max}</span>`;
            } else {
                dot.classList.add('offline');
                text.classList.add('offline');
                text.innerHTML = 'Оффлайн';
            }
        } catch (error) {
            dot.classList.add('offline');
            text.classList.add('offline');
            text.innerHTML = 'Ошибка связи';
            console.error('Ошибка при получении статуса сервера:', error);
        }
    }

    // Call status immediately and set interval for updates (every 30 seconds)
    fetchServerStatus();
    setInterval(fetchServerStatus, 30000);

    init();
});