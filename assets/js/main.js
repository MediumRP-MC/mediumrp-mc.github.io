document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.copy-ip-btn');
    const ip = 'mc.mediumrp.ru';

    buttons.forEach(button => {
        const originalText = button.textContent;
        
        button.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(ip);
                button.textContent = 'Скопировано';
                setTimeout(() => button.textContent = originalText, 3000);
            } catch (err) {
                alert('Не удалось скопировать IP. Скопируйте вручную: ' + ip);
            }
        });
    });

    initBackgrounds();
});

async function initBackgrounds() {
    const bgWrapper = document.querySelector('.absolute.w-full.h-dvh.-z-10.overflow-hidden');
    if (!bgWrapper) return;
    
    bgWrapper.innerHTML = '';

    const availableBackgrounds = [];
    let i = 1;

    const checkImage = (url) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    };

    const checkExtensions = async (index) => {
        const exts = ['png', 'jpg', 'jpeg', 'webp'];
        for (let ext of exts) {
            const url = `assets/images/backgrounds/${index}.${ext}`;
            const exists = await checkImage(url);
            if (exists) return url;
        }
        return null;
    };

    while (i <= 50) {
        const url = await checkExtensions(i);
        if (url) {
            availableBackgrounds.push(url);
            i++;
        } else {
            break;
        }
    }

    if (availableBackgrounds.length === 0) return;

    let playlist = [...availableBackgrounds];
    let currentIndex = -1;

    function shuffle(array) {
        let currentIdx = array.length, randomIndex;
        while (currentIdx > 0) {
            randomIndex = Math.floor(Math.random() * currentIdx);
            currentIdx--;
            [array[currentIdx], array[randomIndex]] = [array[randomIndex], array[currentIdx]];
        }
        return array;
    }

    shuffle(playlist);

    let activeLayer = null;

    function switchBackground() {
        currentIndex = (currentIndex + 1) % playlist.length;
        
        if (currentIndex === 0 && activeLayer !== null) {
            const last = playlist[playlist.length - 1];
            shuffle(playlist);
            if (playlist[0] === last && playlist.length > 1) {
                [playlist[0], playlist[1]] = [playlist[1], playlist[0]];
            }
        }
        
        const imageUrl = playlist[currentIndex];
        
        const newLayer = document.createElement('div');
        newLayer.className = 'background-container';
        newLayer.style.backgroundImage = `url('${imageUrl}')`;
        
        bgWrapper.appendChild(newLayer);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                newLayer.classList.add('active');
            });
        });

        if (activeLayer) {
            const layerToRemove = activeLayer;
            setTimeout(() => {
                if (layerToRemove.parentNode) {
                    layerToRemove.parentNode.removeChild(layerToRemove);
                }
            }, 2500);
        }

        activeLayer = newLayer;
    }

    switchBackground();
    setInterval(switchBackground, 10000);
}
