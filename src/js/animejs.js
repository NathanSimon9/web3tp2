// Mission Timer
let missionTime = 0;

function updateMissionTimer() {
    missionTime++;
    const hours = Math.floor(missionTime / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((missionTime % 3600) / 60).toString().padStart(2, '0');
    const seconds = (missionTime % 60).toString().padStart(2, '0');
    
    const timerElement = document.getElementById('missionTimer');
    if (timerElement) {
        timerElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
}

setInterval(updateMissionTimer, 1000);

// CPU Usage Animation
function animateCPU() {
    const cpuElement = document.getElementById('cpuUsage');
    if (cpuElement) {
        const usage = Math.floor(40 + Math.random() * 20);
        cpuElement.textContent = usage + '%';
    }
}

setInterval(animateCPU, 3000);

// Active Targets Counter
function animateTargets() {
    const targetsElement = document.getElementById('activeTargets');
    if (targetsElement) {
        const targets = Math.floor(12 + Math.random() * 6);
        targetsElement.textContent = targets;
    }
}

setInterval(animateTargets, 5000);

// Notification System
const notifications = [
    'Système initialisé • Tous les modules opérationnels',
    'Nouvelle menace détectée • Secteur Alpha-7',
    'Analyse tactique mise à jour • Niveau de confiance: 94%',
    'Scan global complété • 15 cibles identifiées',
    'Connexion établie avec satellite de surveillance',
    'Mise à jour de l\'intelligence artificielle en cours',
    'Optimisation du réseau neural • Performance +12%'
];

let currentNotification = 0;

function updateNotification() {
    const notificationElement = document.getElementById('notification');
    if (notificationElement) {
        const textElement = notificationElement.querySelector('span');
        if (textElement) {
            textElement.style.opacity = '0';
            
            setTimeout(() => {
                currentNotification = (currentNotification + 1) % notifications.length;
                textElement.textContent = notifications[currentNotification];
                textElement.style.opacity = '1';
            }, 300);
        }
    }
}

setInterval(updateNotification, 8000);

// Activity Graph Animation
window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('activityGraph');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const dataPoints = 40;
    let activityData = Array(dataPoints).fill(0).map(() => Math.random() * 80 + 20);
    
    function drawGraph() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 4; i++) {
            const y = (canvas.height / 4) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        // Draw graph line
        const pointSpacing = canvas.width / (dataPoints - 1);
        
        // Gradient fill
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(0, 255, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
        
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        
        activityData.forEach((value, index) => {
            const x = index * pointSpacing;
            const y = canvas.height - (value / 100) * canvas.height;
            ctx.lineTo(x, y);
        });
        
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Draw line
        ctx.beginPath();
        activityData.forEach((value, index) => {
            const x = index * pointSpacing;
            const y = canvas.height - (value / 100) * canvas.height;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ffff';
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // Draw points
        activityData.forEach((value, index) => {
            const x = index * pointSpacing;
            const y = canvas.height - (value / 100) * canvas.height;
            
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#00ffff';
            ctx.fill();
        });
    }
    
    function updateGraph() {
        // Shift data left and add new point
        activityData.shift();
        activityData.push(Math.random() * 80 + 20);
        drawGraph();
    }
    
    drawGraph();
    setInterval(updateGraph, 2000);
});

// Animate progress bars on load
window.addEventListener('DOMContentLoaded', () => {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach((bar, index) => {
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.transition = 'width 1s ease';
            bar.style.width = bar.getAttribute('style').match(/width:\s*(\d+)%/)?.[1] + '%' || '0%';
        }, 100 + index * 100);
    });
});

// Tactical data random updates
function updateTacticalData() {
    const threatElement = document.querySelector('.data-value.threat');
    const opportunityElement = document.querySelector('.data-value.opportunity');
    const zoneElement = document.querySelector('.data-value.neutral');
    
    if (threatElement) {
        const threats = Math.floor(8 + Math.random() * 8);
        threatElement.textContent = threats;
    }
    
    if (opportunityElement) {
        const opportunities = Math.floor(5 + Math.random() * 8);
        opportunityElement.textContent = opportunities;
    }
    
    if (zoneElement) {
        const zones = Math.floor(55 + Math.random() * 20);
        zoneElement.textContent = zones + '%';
    }
}

setInterval(updateTacticalData, 7000);

// Evaluation Bar
let currentEval = 0;
let targetEval = 0;

function initEvaluationBar() {
    const barFillWhite = document.getElementById('barFillWhite');
    const barFillBlack = document.getElementById('barFillBlack');
    const barValue = document.getElementById('barValue');
    
    if (!barFillWhite || !barFillBlack || !barValue) {
        console.error('❌ Éléments de la barre non trouvés');
        return;
    }
    
    console.log('✅ Barre d\'évaluation initialisée');
    
    function updateBar() {
        // Smooth interpolation
        const diff = targetEval - currentEval;
        currentEval += diff * 0.08;
        
        // Convert evaluation to percentage (range -10 to +10 -> 0% to 100%)
        const percentage = Math.max(0, Math.min(100, ((currentEval + 10) / 20) * 100));
        
        barFillWhite.style.height = percentage + '%';
        barFillBlack.style.height = (100 - percentage) + '%';
        
        // Update value display
        const displayValue = currentEval.toFixed(1);
        barValue.textContent = currentEval >= 0 ? '+' + displayValue : displayValue;
        
        // Update color
        barValue.classList.remove('positive', 'negative');
        if (currentEval > 0.3) {
            barValue.classList.add('positive');
        } else if (currentEval < -0.3) {
            barValue.classList.add('negative');
        }
    }
    
    function changeTarget() {
        targetEval = (Math.random() - 0.5) * 12; // Range -6 to +6
    }
    
    setInterval(updateBar, 50);
    setInterval(changeTarget, 4000);
    
    // Initial change
    changeTarget();
}

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(initEvaluationBar, 500);
});

console.log('🚀 Dashboard futuriste initialisé');