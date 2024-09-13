// Getting elements
const actionCheckboxes = document.querySelectorAll('.action-checkbox');
const modifierCheckboxes = document.querySelectorAll('.modifier-checkbox');
const totalEchoesDisplay = document.getElementById('total-echoes');
const totalMultiplierDisplay = document.getElementById('total-multiplier');
const rankDisplay = document.getElementById('rank');
const powerInput = document.getElementById('power-input');

// Variables to store Echo values
let totalEchoes = 0;
let powerEchoes = 0;

// Tooltip functionality
let tooltip = document.createElement('div');
tooltip.classList.add('tooltip');
document.body.appendChild(tooltip);

function showTooltip(event) {
    const description = event.target.dataset.description;
    if (description) {
        tooltip.textContent = description;
        tooltip.style.display = 'block';
        updateTooltipPosition(event);
    }
}

function hideTooltip() {
    tooltip.style.display = 'none';
}

function updateTooltipPosition(event) {
    tooltip.style.left = `${event.pageX + 10}px`;
    tooltip.style.top = `${event.pageY + 10}px`;
}

// Add hover event listeners to modifier checkboxes with descriptions
modifierCheckboxes.forEach(checkbox => {
    if (checkbox.dataset.description) {
        checkbox.addEventListener('mouseenter', showTooltip);
        checkbox.addEventListener('mousemove', updateTooltipPosition);
        checkbox.addEventListener('mouseleave', hideTooltip);
    }
});

// Update the total Echoes based on actions completed
function updateTotalEchoes() {
    totalEchoes = 0; // Reset the total Echoes to start fresh

    // Loop through all action checkboxes and sum their Echo values if checked
    actionCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            totalEchoes += parseFloat(checkbox.dataset.echo) || 0;
        }
    });

    // Add the power Echoes
    totalEchoes += powerEchoes;

    // Apply the multiplier
    const totalMultiplier = calculateTotalMultiplier();
    const finalEchoes = totalEchoes * totalMultiplier;

    // Update displays
    totalEchoesDisplay.textContent = finalEchoes.toFixed(2); // Show final calculated echoes
    totalMultiplierDisplay.textContent = `x${totalMultiplier.toFixed(1)} (Final: ${finalEchoes.toFixed(2)})`;

    // Update rank display
    updateRank(finalEchoes); // Use finalEchoes to determine rank
}

// Calculate the total multiplier based on selected modifiers
function calculateTotalMultiplier() {
    let totalMultiplier = 1.0;

    modifierCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            totalMultiplier += parseFloat(checkbox.dataset.modifier) || 0;
        }
    });

    return totalMultiplier;
}

// Update power Echoes based on the power input value
function updatePowerEchoes() {
    let powerLevel = parseFloat(powerInput.value) || 0; // Ensure power input is valid number

    // Cap the powerLevel to a maximum of 20
    if (powerLevel > 20) {
        powerLevel = 20;
        powerInput.value = 20; // Update the input field value
    }

    powerEchoes = powerLevel * 0.75; // 0.75 Echo per power
    updateTotalEchoes(); // Recalculate the echoes whenever power input changes
}

// Update the rank based on final Echoes after applying the multiplier
function updateRank(finalEchoes) {
    let rank = 'E';

    if (finalEchoes >= 441) {
        rank = 'W';
    } else if (finalEchoes >= 140) {
        rank = 'S';
    } else if (finalEchoes >= 112) {
        rank = 'A';
    } else if (finalEchoes >= 87) {
        rank = 'B';
    } else if (finalEchoes >= 60) {
        rank = 'C';
    } else if (finalEchoes >= 30) {
        rank = 'D';
    }

    rankDisplay.textContent = rank;
}

// Add event listeners to all action checkboxes
actionCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateTotalEchoes);
});

// Add event listeners to all modifier checkboxes
modifierCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateTotalEchoes);
});

// Add event listener to the power input field to update automatically
powerInput.addEventListener('input', updatePowerEchoes);

// Reset functionality - clear all data and redirect to registration page
const resetButton = document.getElementById('reset-button');
resetButton.addEventListener('click', function() {
    localStorage.removeItem('characterName');
    localStorage.removeItem('characterRace');
    window.location.href = 'register.html'; // Redirect to registration page
});

// Upload progress functionality - image upload and display
const uploadButton = document.getElementById('upload-progress-button');
const uploadInput = document.getElementById('upload-input');
const uploadedImage = document.getElementById('uploaded-image');
const progressDetails = document.getElementById('progress-details');

uploadButton.addEventListener('click', function() {
    uploadInput.click(); // Trigger file input
});

uploadInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedImage.src = e.target.result;
            uploadedImage.style.display = 'block'; // Show the uploaded image
        };
        reader.readAsDataURL(file); // Convert the image file to base64 and display it

        // Display progress details with character name, rank, and echoes
        const characterName = localStorage.getItem('characterName');
        const characterRace = localStorage.getItem('characterRace');
        const totalEchoes = totalEchoesDisplay.textContent;
        const rank = rankDisplay.textContent;

        progressDetails.textContent = `
            Character Name: ${characterName}
            Race: ${characterRace}
            Total Echoes: ${totalEchoes}
            Rank: ${rank}
        `;
    }
});
