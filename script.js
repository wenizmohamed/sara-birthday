// Sara's Birthday Website - Made with love by Weni

document.addEventListener('DOMContentLoaded', function() {
    const intro = document.getElementById('intro');
    const main = document.getElementById('main');
    const enterBtn = document.getElementById('enterBtn');
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.nav-arrow.prev');
    const nextBtn = document.querySelector('.nav-arrow.next');
    const finalMessage = document.getElementById('finalMessage');

    let currentSlide = 0;
    let isPlaying = false;
    let autoSlideInterval;

    // Enter button - Start the experience
    enterBtn.addEventListener('click', function() {
        intro.classList.add('hidden');
        main.classList.remove('hidden');

        // AUTOPLAY music immediately - Alex Warren "Ordinary"
        bgMusic.volume = 0.7;
        bgMusic.currentTime = 0;

        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
                musicToggle.classList.add('playing');
                console.log('Music playing - Ordinary by Alex Warren');
            }).catch(err => {
                // If autoplay fails, show a message
                console.log('Click anywhere to start music');
                document.body.addEventListener('click', function playOnClick() {
                    bgMusic.play();
                    isPlaying = true;
                    musicToggle.classList.add('playing');
                    document.body.removeEventListener('click', playOnClick);
                }, { once: true });
            });
        }

        // Start auto-slide
        startAutoSlide();
    });

    // Music toggle
    musicToggle.addEventListener('click', function() {
        if (isPlaying) {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
        } else {
            bgMusic.play();
            musicToggle.classList.add('playing');
        }
        isPlaying = !isPlaying;
    });

    // Slide navigation
    function showSlide(index) {
        // Handle bounds
        if (index >= slides.length) {
            // Show final message
            finalMessage.classList.add('visible');
            return;
        }
        if (index < 0) index = 0;

        currentSlide = index;

        // Update slides
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) slide.classList.add('active');
        });

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.remove('active');
            if (i === index) dot.classList.add('active');
        });
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        finalMessage.classList.remove('visible');
        showSlide(currentSlide - 1);
    }

    // Auto-slide
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000); // Change every 5 seconds
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Event listeners
    nextBtn.addEventListener('click', function() {
        nextSlide();
        resetAutoSlide();
    });

    prevBtn.addEventListener('click', function() {
        prevSlide();
        resetAutoSlide();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            finalMessage.classList.remove('visible');
            showSlide(index);
            resetAutoSlide();
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            nextSlide();
            resetAutoSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoSlide();
        }
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide(); // Swipe left = next
            } else {
                prevSlide(); // Swipe right = prev
            }
            resetAutoSlide();
        }
    }

    // Close final message on click
    finalMessage.addEventListener('click', function() {
        finalMessage.classList.remove('visible');
        showSlide(0); // Go back to start
        resetAutoSlide();
    });

    // Create more floating hearts dynamically
    function createHeart() {
        const heart = document.createElement('span');
        heart.innerHTML = '&#10084;';
        heart.className = 'heart';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
        heart.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
        heart.style.opacity = Math.random() * 0.5 + 0.2;

        const container = document.querySelector('.floating-hearts');
        if (container) {
            container.appendChild(heart);
            setTimeout(() => heart.remove(), 8000);
        }
    }

    // Spawn hearts periodically
    setInterval(createHeart, 2000);
});
