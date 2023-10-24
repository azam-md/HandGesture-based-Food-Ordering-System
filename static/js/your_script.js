
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
let selectionCount = 0;

function handleRecognizedGesture(recognized_gesture) {
    if (selectionCount >= 2) return;  // If two items are already selected, don't process further

    if (currentGesture !== recognized_gesture) {
        currentGesture = recognized_gesture;
        gestureStartTime = new Date().getTime();
        if (gestureSelectionTimeout) {
            clearTimeout(gestureSelectionTimeout);
        }
    } else {
        if (new Date().getTime() - gestureStartTime >= 2000) {
            selectMenuItem(recognized_gesture);
            currentGesture = null;
            gestureStartTime = null;
            selectionCount++;
        }
    }
}



function selectMenuItem(gesture) {
    try {
        const iconElement = document.querySelector(`[data-gesture="${gesture}"]`);
        if (iconElement) {
            iconElement.style.border = "5px solid green";

            setTimeout(() => {
                const selectedItemElement = document.createElement('img');
                const ordered = document.createElement('img');
                if(selectionCount==1){
                    selectedItemElement.src = `${BASE_URL}icon${gesture}.png`;
                    //selectedItemElement.innerHTML = `<img src="static/icon${gesture}.png" alt="Selected Item Image" width="100" height="100">`;
                }
                else if(selectionCount==2){
                    selectedItemElement.src = `${BASE_URL}quantity${gesture}.png`;
                    //selectedItemElement.innerHTML = `<img src="static/quantity${gesture}.png" alt="Selected Item Image" width="100" height="100">`;
                    ordered.src=`${BASE_URL}ordered.png`;
                    ordered.width=100;
                    ordered.height=100;
                    const orderedImg=document.getElementById("ordered");
                    orderedImg.appendChild(ordered);
                }
                //selectedItemElement.classList.add('selected-item');  // Assuming you have some styling for selected items
                selectedItemElement.width=100;
                selectedItemElement.height=100;
                // Determine which container to append the selected item to
                const targetContainerID = selectionCount === 1 ? "selected-item-1" : "selected-item-2";
                const targetContainer = document.getElementById(targetContainerID);
                targetContainer.appendChild(selectedItemElement);
                if (selectionCount === 1) {
                    // If it's the first selection, update the menu icons for the next selection
                    const menuIconsContainer = document.querySelector('.menu-icons');
                    menuIconsContainer.innerHTML = "";

                    for (let i = 1; i <= 5; i++) { 
                        const newIcon = document.createElement('img');
                        newIcon.src = `${BASE_URL}quantity${i}.png`;
                        newIcon.alt = `Menu ${i}`;
                        newIcon.classList.add('menu-icon');
                        newIcon.setAttribute('data-gesture', `${i}`);
                        menuIconsContainer.appendChild(newIcon);
                    }
                }
                else if(selectionCount==2){
                    const menuIconsContainer = document.querySelector('.menu-icons');
                    menuIconsContainer.innerHTML = "";
                    const firstSelectedItem = document.getElementById('selected-item-1').firstChild.cloneNode(true);
                    firstSelectedItem.classList.add('menu-icon');
                    firstSelectedItem.alt=`Selected 1`;
                    const secondSelectedItem = document.getElementById('selected-item-2').firstChild.cloneNode(true);
                    secondSelectedItem.classList.add('menu-icon');
                    menuIconsContainer.appendChild(firstSelectedItem);
                    menuIconsContainer.appendChild(secondSelectedItem);
                    const thirdImage = document.createElement('img');
                    thirdImage.src = `${BASE_URL}ordered.png`; // replace 'thirdImage.png' with your third image's filename
                    thirdImage.width = 100;
                    thirdImage.height = 100;
                    thirdImage.classList.add('menu-icon');
                    menuIconsContainer.appendChild(thirdImage);
                    // Add a label  below the selected items
                    const parentContainer = document.querySelector(' .right-container'); // Assuming the container of the right menu has this id
                    const label = document.createElement('div');
                    label.className = 'label';
                    label.textContent = "ORDER PLACED";  // Change to whatever label text you want
                    if (parentContainer.lastChild) {
                        parentContainer.insertBefore(label, parentContainer.lastChild.nextSibling);
                    } else {
                        parentContainer.appendChild(label);
                    }
                }

            }, 2000);
        } else {
            console.error("No icon found for gesture:", gesture);
        }
    } catch (error) {
        console.error("Error selecting menu item:", error);
    }
}
