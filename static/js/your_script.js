setInterval(() => {
    fetch('/get_gesture')
    .then(response => response.json())
    .then(data => {
        const recognized_gesture = data.gesture;
        
        // Find the icon corresponding to the recognized gesture
        const iconElement = document.querySelector(`[data-gesture="${recognized_gesture}"]`);
        
        if (iconElement) {
            // Highlight or perform some visual change on the recognized icon
            iconElement.style.border = "3px solid red";
        }
    });
}, 1000);  // Check every second
