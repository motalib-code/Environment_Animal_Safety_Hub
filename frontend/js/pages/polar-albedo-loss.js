document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSimulator();
});

// Navigation Tab Logic
function initNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('.content-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and sections
            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Add active class to clicked tab and corresponding section
            tab.classList.add('active');
            const sectionId = tab.dataset.section;
            document.getElementById(sectionId).classList.add('active');
        });
    });
}

// Albedo Simulator Logic
function initSimulator() {
    const tempSlider = document.getElementById('tempSlider');
    const currentTemp = document.getElementById('currentTemp');
    const iceLayer = document.getElementById('iceLayer');
    const iceExtentVal = document.getElementById('iceExtentVal');
    const albedoVal = document.getElementById('albedoVal');
    const heatVal = document.getElementById('heatVal');
    const simMessage = document.getElementById('simMessage');

    // Base values (at 0°C rise relative to simulator start)
    const baseIceSize = 80; // % width/height
    const baseIceArea = 4.5; // Million km² (approx minimum extent)
    const baseAlbedo = 0.65;
    const baseHeat = 20; // % absorbed

    tempSlider.addEventListener('input', (e) => {
        const tempRise = parseFloat(e.target.value);
        currentTemp.textContent = `+${tempRise.toFixed(1)}°C`;

        // Calculate impacts
        // For every 1°C rise, ice shrinks significantly
        // This is a simplified model for visualization
        const meltFactor = tempRise * 15; // Percentage points of size lost
        const newSize = Math.max(0, baseIceSize - meltFactor);

        // Update visual ice size
        iceLayer.style.width = `${newSize}%`;
        iceLayer.style.height = `${newSize}%`;

        // Update data values
        const sizeRatio = newSize / baseIceSize;
        const newIceArea = (baseIceArea * sizeRatio).toFixed(2);

        // Albedo drops as ice disappears (ocean is dark)
        // Ice albedo ~0.8, Ocean ~0.1. Mixed calculation.
        // Simple linear approximation for the demo
        const newAlbedo = (baseAlbedo * sizeRatio + 0.1 * (1 - sizeRatio)).toFixed(2);

        // Heat absorption increases as albedo drops
        // Inverse relationship
        const newHeat = Math.round(baseHeat + (meltFactor * 1.5));

        // Update DOM
        iceExtentVal.textContent = `${newIceArea}M km²`;
        albedoVal.textContent = newAlbedo;
        heatVal.textContent = `+${newHeat}%`;

        // Update message based on thresholds
        if (tempRise < 1.5) {
            simMessage.textContent = "Significant loss of summer sea ice. Ecosystems stressed.";
            simMessage.style.color = "#ccc";
            heatVal.className = "value";
        } else if (tempRise < 3.0) {
            simMessage.textContent = "CRITICAL WARNING: Blue Ocean Event likely. Massive feedback loop activation.";
            simMessage.style.color = "#ff851b";
            heatVal.className = "value warning";
        } else {
            simMessage.textContent = "CATASTROPHIC: Year-round ice collapse. Irreversible warming acceleration.";
            simMessage.style.color = "#ff4136";
            heatVal.className = "value warning";
        }
    });
}

function takeAction() {
    alert("Thank you for your interest! Redirecting to the Community Action Hub...");
    window.location.href = "../../community-action-hub.html"; // Adjust path as needed
}
