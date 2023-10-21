let currentGesture =  null;
let gestureStartTime = null;
let gestureSelectionTimeout = null;
 
const socket = io.connect('http://127.0.0.1:5000');

socket.on('connect', () => {
    socket.emit('start_gesture_recognition');
});



socket.on('gesture_update', (data) => {
    handleRecognizedGesture(data);
    // Display the recognized gesture on your frontend
    //document.getElementById('your_text_element_id').textContent = data.gesture;
});

function handleRecognizedGesture(recognized_gesture) {
    // If the gesture has changed, reset the timers and state
    if (currentGesture !== recognized_gesture) {
        currentGesture = recognized_gesture;
        gestureStartTime = new Date().getTime();
        if (gestureSelectionTimeout) {
            clearTimeout(gestureSelectionTimeout);
        }
    } else {
        // Check if the gesture has been consistent for 3 seconds (3000 milliseconds)
        if (new Date().getTime() - gestureStartTime >= 2000) {
            // Select the gesture
            selectMenuItem(recognized_gesture);
            currentGesture = null;
            gestureStartTime = null;
        }
    }
}
function selectMenuItem(gesture) {
    try {
        // Reset borders of all icons to ensure only one is selected
        const allIcons = document.querySelectorAll('.menu-icon');
        allIcons.forEach(icon => {
            icon.style.border = "none";  // Remove any border
        });

        const iconElement = document.querySelector(`[data-gesture="${gesture}"]`);
        if (iconElement) {
            iconElement.style.border = "5px solid green";
            
            setTimeout(() => {
            // Display the selected item below the video feed
            const selectedItemElement = document.getElementById('selected-item');
            //const itemImageSrc = `{{ url_for('static', filename='icon${gesture}.png') }}`; 
            selectedItemElement.innerHTML = `<img src="static/icon${gesture}.png" alt="Selected Item Image" width="100" height="100">`;
    
            
            // // Remove current menu icons and update with new icons
             const menuIconsContainer = document.querySelector('.menu-icons');
            // menuIconsContainer.innerHTML = '';  // Clear current icons
            
            // Clear the current icons from the container
            while (menuIconsContainer.firstChild) {
            menuIconsContainer.removeChild(menuIconsContainer.firstChild);
            }

            // // Add new icons representing quantity (as an example, add 3 new icons)
            for (let i = 1; i <= 5; i++) {
                const quantityIcon = document.createElement('img');
                quantityIcon.src = `${BASE_URL}quantity${i}.png`;
                quantityIcon.alt = `Quantity ${i}`;
                quantityIcon.classList.add('menu-icon');
                quantityIcon.setAttribute('data-gesture', `${i}`);
                menuIconsContainer.appendChild(quantityIcon);
            }
            //document.getElementById('quantity-icons').style.display = "grid";
        }, 2000);  // 2 seconds delay
        } else {
            console.error("No icon found for gesture:", gesture);
        }
    } catch (error) {
        console.error("Error selecting menu item:", error);
    }
}


