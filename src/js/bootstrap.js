/**
 * ============================================
 * BOOTSTRAP.JS - Fonctionnalités Bootstrap
 * ============================================
 * Ce fichier gère toutes les interactions Bootstrap:
 * - Tooltips
 * - Modals
 * - Toggle des panneaux
 * - Composants Bootstrap
 */

console.log('🅱️ Initialisation des composants Bootstrap...');

// ==================== INITIALISATION TOOLTIPS ====================
document.addEventListener('DOMContentLoaded', () => {
  // Initialiser tous les tooltips Bootstrap
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => {
    return new bootstrap.Tooltip(tooltipTriggerEl, {
      placement: 'bottom',
      trigger: 'hover',
      customClass: 'hud-tooltip'
    });
  });
  console.log('✅ Tooltips Bootstrap initialisés:', tooltipList.length);
});

// ==================== GESTION DU TOGGLE VIEW ====================
document.addEventListener('DOMContentLoaded', () => {
  const globalViewBtn = document.getElementById('globalView');
  const masterViewBtn = document.getElementById('masterView');
  const globalContainer = document.getElementById('globalContainer');
  const masterProfile = document.getElementById('masterProfile');

  if (globalViewBtn && masterViewBtn) {
    globalViewBtn.addEventListener('change', () => {
      if (globalViewBtn.checked) {
        globalContainer.classList.remove('d-none');
        masterProfile.classList.add('d-none');
        console.log('📊 Vue: Global');
        
        // Jouer un son si Tone.js est disponible
        if (window.playUISound) {
          window.playUISound('switch');
        }
      }
    });

    masterViewBtn.addEventListener('change', () => {
      if (masterViewBtn.checked) {
        globalContainer.classList.add('d-none');
        masterProfile.classList.remove('d-none');
        console.log('👤 Vue: Master Profile');
        
        if (window.playUISound) {
          window.playUISound('switch');
        }
      }
    });
  }
});

// ==================== MODAL PIÈCES ====================
document.addEventListener('DOMContentLoaded', () => {
  const pieceCards = document.querySelectorAll('.piece-card');
  const modal = document.getElementById('pieceModal');
  
  if (modal) {
    const bsModal = new bootstrap.Modal(modal);
    const modalTitle = document.getElementById('modalPieceName');
    const modalDescription = document.getElementById('modalPieceDescription');
    const modalViewer = document.getElementById('modalPieceViewer');

    const pieceDescriptions = {
      king: {
        name: 'ROI',
        description: 'Le Roi est la pièce la plus importante du jeu. Sa capture signifie la fin de la partie. Il peut se déplacer d\'une case dans toutes les directions.',
        value: '∞',
        movements: 'Une case dans toutes les directions'
      },
      queen: {
        name: 'REINE',
        description: 'La Reine est la pièce la plus puissante. Elle combine les mouvements de la Tour et du Fou.',
        value: '9 points',
        movements: 'Lignes droites et diagonales, sans limite de distance'
      },
      bishop: {
        name: 'FOU',
        description: 'Le Fou se déplace en diagonale sur les cases de sa couleur de départ.',
        value: '3 points',
        movements: 'Diagonales uniquement, sans limite de distance'
      },
      knight: {
        name: 'CAVALIER',
        description: 'Le Cavalier est la seule pièce qui peut sauter par-dessus les autres. Il se déplace en "L".',
        value: '3 points',
        movements: 'En forme de L (2+1 cases)'
      },
      rook: {
        name: 'TOUR',
        description: 'La Tour se déplace en ligne droite horizontalement ou verticalement.',
        value: '5 points',
        movements: 'Lignes droites (horizontales et verticales)'
      },
      pawn: {
        name: 'PION',
        description: 'Le Pion avance d\'une case (ou deux depuis sa position initiale) et capture en diagonale.',
        value: '1 point',
        movements: 'Avance d\'une case, capture en diagonale'
      }
    };

    pieceCards.forEach(card => {
      card.addEventListener('click', () => {
        const pieceType = card.dataset.piece;
        const pieceInfo = pieceDescriptions[pieceType];
        
        if (pieceInfo) {
          modalTitle.textContent = pieceInfo.name;
          modalDescription.innerHTML = `
            <div class="mb-3">
              <p class="text-cyan mb-2">${pieceInfo.description}</p>
            </div>
            <div class="row g-2">
              <div class="col-6">
                <div class="data-card">
                  <span class="data-label">VALEUR</span>
                  <span class="data-value text-cyan">${pieceInfo.value}</span>
                </div>
              </div>
              <div class="col-6">
                <div class="data-card">
                  <span class="data-label">MOUVEMENTS</span>
                  <span class="data-value text-cyan" style="font-size: 11px;">${pieceInfo.movements}</span>
                </div>
              </div>
            </div>
          `;
          
          // Créer une copie ZDog dans le modal
          if (window.createModalZdog) {
            window.createModalZdog(modalViewer, pieceType);
          }
          
          bsModal.show();
          
          if (window.playUISound) {
            window.playUISound('click');
          }
        }
      });
    });
  }
});

// ==================== BOUTON REFRESH ====================
document.addEventListener('DOMContentLoaded', () => {
  const refreshBtn = document.getElementById('refreshPieces');
  
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      // Animation de rotation
      refreshBtn.style.transform = 'rotate(360deg)';
      refreshBtn.style.transition = 'transform 0.6s ease';
      
      setTimeout(() => {
        refreshBtn.style.transform = 'rotate(0deg)';
      }, 600);
      
      // Réanimer les barres de progression
      const progressBars = document.querySelectorAll('.progress-bar');
      progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
          bar.style.width = width;
        }, 100);
      });
      
      // Notification
      if (window.showNotification) {
        window.showNotification('Données tactiques actualisées');
      }
      
      if (window.playUISound) {
        window.playUISound('refresh');
      }
      
      console.log('🔄 Refresh des pièces');
    });
  }
});

// ==================== RESPONSIVE PANEL TOGGLES ====================
document.addEventListener('DOMContentLoaded', () => {
  // Créer des boutons de toggle pour mobile si nécessaire
  const createMobileToggles = () => {
    if (window.innerWidth <= 768) {
      // Ajouter un bouton pour ouvrir le panneau gauche
      if (!document.getElementById('leftPanelToggle')) {
        const leftToggle = document.createElement('button');
        leftToggle.id = 'leftPanelToggle';
        leftToggle.className = 'btn btn-outline-cyan mobile-toggle left';
        leftToggle.innerHTML = '<i class="bi bi-list"></i>';
        leftToggle.style.cssText = 'position: fixed; left: 60px; top: 70px; z-index: 150;';
        document.body.appendChild(leftToggle);
        
        leftToggle.addEventListener('click', () => {
          document.querySelector('.left-panel').classList.toggle('open');
        });
      }
    }
  };
  
  createMobileToggles();
  window.addEventListener('resize', createMobileToggles);
});

// ==================== ANIMATIONS AU SCROLL DANS LES PANNEAUX ====================
document.addEventListener('DOMContentLoaded', () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  // Observer les sections intel
  document.querySelectorAll('.intel-section').forEach(section => {
    observer.observe(section);
  });
  
  // Observer les cartes de pièces
  document.querySelectorAll('.piece-card').forEach(card => {
    observer.observe(card);
  });
});

// ==================== HELPER: AFFICHER UNE NOTIFICATION ====================
window.showNotification = function(message) {
  const notif = document.querySelector('#notification span');
  if (notif) {
    notif.style.opacity = '0';
    setTimeout(() => {
      notif.textContent = message;
      notif.style.opacity = '1';
    }, 300);
  }
};

// ==================== HELPER: BASCULER VERS MASTER PROFILE ====================
window.switchToMasterView = function() {
  const masterViewBtn = document.getElementById('masterView');
  if (masterViewBtn) {
    masterViewBtn.checked = true;
    masterViewBtn.dispatchEvent(new Event('change'));
  }
};

window.switchToGlobalView = function() {
  const globalViewBtn = document.getElementById('globalView');
  if (globalViewBtn) {
    globalViewBtn.checked = true;
    globalViewBtn.dispatchEvent(new Event('change'));
  }
};

console.log('✅ Composants Bootstrap initialisés');
