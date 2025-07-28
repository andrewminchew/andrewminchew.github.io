document.addEventListener('DOMContentLoaded', () => {
    const box = document.querySelector('.box');
    const preloader = document.getElementById('preloader');
    const content = document.getElementById('content');

    let isDragging = false;
    let startX, startY;
    let currentRotateX = -15; // Initial rotation from CSS
    let currentRotateY = -30; // Initial rotation from CSS

    // Function to set the initial transform, ensuring it's applied correctly
    function applyInitialTransform() {
        box.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
    }

    // Call it once to apply the initial state
    applyInitialTransform();

    // --- Preloader Logic ---
    const imagePaths = [
        'images/face-front.jpg',
        'images/face-back.jpg',
        'images/face-right.jpg',
        'images/face-left.jpg',
        'images/face-top.jpg',
        'images/face-bottom.jpg'
    ];

    let imagesLoaded = 0;
    const totalImages = imagePaths.length;

    // Load images
    imagePaths.forEach(path => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            imagesLoaded++;
            if (imagesLoaded === totalImages) {
                // All images loaded, hide preloader
                preloader.style.opacity = '0';
                preloader.addEventListener('transitionend', () => {
                    preloader.style.display = 'none';
                    content.classList.remove('hidden'); // Show main content
                }, { once: true });
            }
        };
        img.onerror = () => {
            console.error(`Failed to load image: ${path}`);
            // Still count as loaded to avoid infinite preloader if an image fails
            imagesLoaded++;
            if (imagesLoaded === totalImages) {
                preloader.style.opacity = '0';
                preloader.addEventListener('transitionend', () => {
                    preloader.style.display = 'none';
                    content.classList.remove('hidden');
                }, { once: true });
            }
        };
    });

    // --- Drag Interaction Logic ---
    box.addEventListener('mousedown', (e) => {
        isDragging = true;
        box.classList.add('grabbing');
        startX = e.clientX;
        startY = e.clientY;
        e.preventDefault(); // Prevent default browser drag behavior
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        const sensitivity = 0.4; // Slightly reduced sensitivity for smoother control

        currentRotateY += deltaX * sensitivity;
        currentRotateX -= deltaY * sensitivity; // Negative for intuitive vertical drag

        box.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;

        startX = e.clientX;
        startY = e.clientY;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        box.classList.remove('grabbing');
    });

    // --- Touch Events for Mobile ---
    box.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) { // Only handle single touch for rotation
            isDragging = true;
            box.classList.add('grabbing');
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            e.preventDefault();
        }
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging || e.touches.length !== 1) return;

        const deltaX = e.touches[0].clientX - startX;
        const deltaY = e.touches[0].clientY - startY;

        const sensitivity = 0.4;

        currentRotateY += deltaX * sensitivity;
        currentRotateX -= deltaY * sensitivity;

        box.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;

        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', () => {
        isDragging = false;
        box.classList.remove('grabbing');
    });
});