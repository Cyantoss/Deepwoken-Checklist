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
    totalEchoes = 0;

    // Loop through all action checkboxes and sum their Echo values
    actionCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            totalEchoes += parseFloat(checkbox.dataset.echo);
        }
    });

    // Add the power Echoes
    totalEchoes += powerEchoes;

    // Apply the multiplier
    const totalMultiplier = calculateTotalMultiplier();
    const finalEchoes = totalEchoes * totalMultiplier;

    // Update displays
    totalEchoesDisplay.textContent = totalEchoes.toFixed(2);
    totalMultiplierDisplay.textContent = `x${totalMultiplier.toFixed(1)} (Final: ${finalEchoes.toFixed(2)})`;

    // Update rank display
    updateRank(totalEchoes, finalEchoes);
}

// Calculate the total multiplier based on selected modifiers
function calculateTotalMultiplier() {
    let totalMultiplier = 1.0;

    modifierCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            totalMultiplier += parseFloat(checkbox.dataset.modifier);
        }
    });

    return totalMultiplier;
}

// Update power Echoes based on the power input value
function updatePowerEchoes() {
    let powerLevel = parseFloat(powerInput.value);

    // Cap the powerLevel to a maximum of 20
    if (powerLevel > 20) {
        powerLevel = 20;
        powerInput.value = 20; // Update the input field value
    }

    powerEchoes = powerLevel * 0.75; // 0.75 Echo per power
    updateTotalEchoes();
}

// Update the rank based on total Echoes and final Echoes with multiplier
function updateRank(totalEchoes, finalEchoes) {
    let rank = 'E';

    if (finalEchoes >= 441) {
        rank = 'W';
    } else if (totalEchoes === 140) {
        rank = 'S';
    } else if (totalEchoes >= 112) {
        rank = 'A';
    } else if (totalEchoes >= 87) {
        rank = 'B';
    } else if (totalEchoes >= 60) {
        rank = 'C';
    } else if (totalEchoes >= 30) {
        rank = 'D';
    }

    rankDisplay.textContent = rank;
}

// Add event listeners to all checkboxes
actionCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateTotalEchoes);
});

modifierCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateTotalEchoes);
});

// Add event listener to the power input field to update automatically
powerInput.addEventListener('input', updatePowerEchoes);
