function setEvaluation(pieceId, valuePercent) {
    const container = document.getElementById(pieceId).parentElement;
    const fill = container.querySelector('.evaluation-fill');
    if (fill) {
        fill.style.height = valuePercent + '%';
    }
}

// Exemple : mettre 85% pour le roi
setEvaluation('piece-1', 85);
