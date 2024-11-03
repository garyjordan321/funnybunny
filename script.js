const images = document.querySelectorAll('.bouncing-image');

images.forEach(image => {
    let posX = Math.random() * (window.innerWidth - 100);
    let posY = Math.random() * (window.innerHeight - 100);
    let velocityX = (Math.random() * 3) + 2; // Set random horizontal speed between 2 and 5
    let velocityY = (Math.random() * 3) + 2; // Set random vertical speed between 2 and 5
    let isFlung = false; // Track if the image has been flung
    let flungDuration = 0; // Duration the image has been flung
    const flungTimeLimit = 2000; // Time limit for bouncing before slowdown (in milliseconds)
    const baseSpeed = 2; // Define a base speed for the images to slow down to

    image.style.left = posX + 'px';
    image.style.top = posY + 'px';

    function updatePosition() {
        posX += velocityX;
        posY += velocityY;

        // Bounce off walls
        if (posX + 100 >= window.innerWidth || posX <= 0) {
            velocityX *= -1; // Reverse horizontal direction
            posX = Math.max(0, Math.min(posX, window.innerWidth - 100)); // Keep within bounds
        }
        // Bounce off floor and ceiling
        if (posY + 100 >= window.innerHeight || posY <= 0) {
            velocityY *= -1; // Reverse vertical direction
            posY = Math.max(0, Math.min(posY, window.innerHeight - 100)); // Keep within bounds
        }

        // If flung duration has exceeded the limit, start slowing down
        if (isFlung) {
            flungDuration += 20; // Increment the flung duration by the update interval
            if (flungDuration >= flungTimeLimit) {
                // Gradually reduce the velocity after the bounce time is over
                const slowingFactor = 0.98; // Gradual slowdown
                velocityX *= slowingFactor; // Gradual slowdown for horizontal velocity
                velocityY *= slowingFactor; // Gradual slowdown for vertical velocity
                
                // If velocities are very small, snap to the base speed
                if (Math.abs(velocityX) < baseSpeed && Math.abs(velocityY) < baseSpeed) {
                    velocityX = baseSpeed * (velocityX < 0 ? -1 : 1); // Ensure it retains direction
                    velocityY = baseSpeed * (velocityY < 0 ? -1 : 1); // Ensure it retains direction
                }
            }
        }

        image.style.left = posX + 'px';
        image.style.top = posY + 'px';
    }

    setInterval(updatePosition, 20); // Update position every 20 milliseconds

    let isDragging = false;
    let offsetX, offsetY;
    let initialMouseX, initialMouseY; // Store initial mouse position for fling calculation

    // Prevent default drag behavior on the image
    image.addEventListener('dragstart', (event) => {
        event.preventDefault();
    });

    // Click and drag functionality
    image.addEventListener('mousedown', (event) => {
        isDragging = true;
        offsetX = event.clientX - posX;
        offsetY = event.clientY - posY;

        // Store initial mouse position for fling calculation
        initialMouseX = event.clientX;
        initialMouseY = event.clientY;

        // Prevent default behavior when mousing down
        event.preventDefault();
    });

    window.addEventListener('mousemove', (event) => {
        if (isDragging) {
            posX = event.clientX - offsetX;
            posY = event.clientY - offsetY;

            // Ensure the image stays within the bounds
            if (posX < 0) posX = 0;
            if (posX + 100 > window.innerWidth) posX = window.innerWidth - 100;
            if (posY < 0) posY = 0;
            if (posY + 100 > window.innerHeight) posY = window.innerHeight - 100;

            image.style.left = posX + 'px';
            image.style.top = posY + 'px';
        }
    });

    window.addEventListener('mouseup', (event) => {
        if (isDragging) {
            isDragging = false;

            // Calculate fling velocity based on mouse movement with adjusted sensitivity
            const flingVelocityX = (event.clientX - initialMouseX) * 0.15; // Reduced fling velocity sensitivity
            const flingVelocityY = (event.clientY - initialMouseY) * 0.15;

            // Apply fling velocity to image
            velocityX = flingVelocityX;
            velocityY = flingVelocityY;

            // Set flung state to true
            isFlung = true;
            flungDuration = 0; // Reset the flung duration
        }
    });
});
