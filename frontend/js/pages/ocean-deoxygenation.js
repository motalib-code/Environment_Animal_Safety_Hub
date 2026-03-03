document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSimulator();
});

// Navigation Logic
function initNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('.content-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            tab.classList.add('active');
            const sectionId = tab.dataset.section;
            document.getElementById(sectionId).classList.add('active');
        });
    });
}

// Simulator Logic
function initSimulator() {
    const nutrientSlider = document.getElementById('nutrientSlider');
    const tempSlider = document.getElementById('tempSlider');
    const nutrientVal = document.getElementById('nutrientVal');
    const currentTemp = document.getElementById('currentTemp');

    // Output Elements
    const algaeLayer = document.getElementById('algaeLayer');
    const oceanTank = document.getElementById('oceanTank');
    const fishes = document.querySelectorAll('.fish');
    const algaeVal = document.getElementById('algaeVal');
    const oxygenVal = document.getElementById('oxygenVal');
    const statusVal = document.getElementById('statusVal');
    const simMessage = document.getElementById('simMessage');

    function updateSimulation() {
        const nutrientLevel = parseInt(nutrientSlider.value);
        const tempRise = parseFloat(tempSlider.value);

        // Update Labels
        currentTemp.textContent = `+${tempRise.toFixed(1)}°C`;
        if (nutrientLevel < 30) nutrientVal.textContent = "Low";
        else if (nutrientLevel < 70) nutrientVal.textContent = "High";
        else nutrientVal.textContent = "Critical";

        // Calculate Effects
        // Nutrients drive Algae (0 to 1 opacity)
        // Temp amplifies algae growth slightly
        const algaeGrowth = (nutrientLevel / 100) * (1 + (tempRise * 0.1));
        const limitedAlgae = Math.min(algaeGrowth, 1).toFixed(2);

        // Update Algae Visual
        algaeLayer.style.opacity = limitedAlgae * 0.8; // Max opacity 0.8 so we can still see fish die

        // Oxygen Calculation (mg/L)
        // Base = 8.0
        // Minus Algae decay effect (major)
        // Minus Temp effect (solubility decreases)
        let oxygen = 8.0 - (algaeGrowth * 5) - (tempRise * 0.5);
        oxygen = Math.max(0, oxygen).toFixed(1);

        // Update Readouts
        oxygenVal.textContent = oxygen;
        if (limitedAlgae < 0.3) algaeVal.textContent = "Low";
        else if (limitedAlgae < 0.7) algaeVal.textContent = "Bloom";
        else algaeVal.textContent = "Massive";

        // Determine Status & Fish Health
        if (oxygen > 6.0) {
            statusVal.textContent = "Healthy";
            statusVal.className = "value safe";
            oceanTank.style.background = "linear-gradient(180deg, #0077b6 0%, #023e8a 100%)"; // Clear blue
            simMessage.textContent = "Ecosystem is healthy. Marine life thriving.";
            simMessage.style.color = "#aaa";
            reviveFish();
        } else if (oxygen > 2.0) {
            statusVal.textContent = "Hypoxic";
            statusVal.className = "value warning";
            oceanTank.style.background = "linear-gradient(180deg, #0a9396 0%, #001219 100%)"; // Murky green
            simMessage.textContent = "Warning: Low oxygen. Fish are stressed and fleeing.";
            simMessage.style.color = "#e9d8a6";
            reviveFish(); // Stressed but alive
        } else {
            statusVal.textContent = "Anoxic (Dead Zone)";
            statusVal.className = "value danger";
            oceanTank.style.background = "linear-gradient(180deg, #38b000 0%, #000000 100%)"; // Toxic green/black
            simMessage.textContent = "CRITICAL: Dead Zone formed. Mass die-off event.";
            simMessage.style.color = "#ae2012";
            killFish();
        }
    }

    function killFish() {
        fishes.forEach(fish => {
            fish.classList.add('dead');
        });
    }

    function reviveFish() {
        fishes.forEach(fish => {
            fish.classList.remove('dead');
        });
    }

    nutrientSlider.addEventListener('input', updateSimulation);
    tempSlider.addEventListener('input', updateSimulation);
}

function takeAction() {
    alert("Redirecting to Community Action Hub...");
    window.location.href = "../../community-action-hub.html";
}
