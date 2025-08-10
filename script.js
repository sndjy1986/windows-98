let draggedIcon = null;
let currentIcon = null;
let iconCounter = 0;
let isAdminAuthenticated = false;
const ADMIN_PASSWORD = "admin123";
let pendingAdminAction = null;
let weatherData = null;
let isWeatherAppOpen = false;
let isSolitaireAppOpen = false;
let runningApps = [];
let isMobile = window.innerWidth <= 768;

// Weather API configuration
const WEATHER_API_KEY = "8b093586dd2c02084b20747b888d3cfa";
const WEATHER_LOCATION = "Anderson,SC,US";

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    try {
        updateTime();
        setInterval(updateTime, 1000);
        setupEventListeners();
        setupModalDragging('weatherModal');
        setupModalDragging('solitaireModal');
        setupModalDragging('adminModal');
        setupModalDragging('iconModal');
        fetchWeatherData();
        setInterval(fetchWeatherData, 600000); // Update weather every 10 minutes
        
        // Load icons from a predefined list or local storage
        loadInitialIcons();
        handleResize();
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', () => {
            setTimeout(handleResize, 100);
        });

    } catch (error) {
        console.error('Initialization error:', error);
    }
});

// ===== CORE APP & UI FUNCTIONS =====

function updateTime() {
    try {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: true,
            hour: 'numeric',
            minute: '2-digit'
        });
        const timeDisplay = document.getElementById('timeDisplay');
        if (timeDisplay) {
            timeDisplay.textContent = timeString;
        }
    } catch (error) {
        console.error('Time update error:', error);
    }
}

function toggleStartMenu() {
    const startMenu = document.getElementById('startMenu');
    if (startMenu) {
        const isVisible = startMenu.style.display === 'block';
        startMenu.style.display = isVisible ? 'none' : 'block';
    }
}

function hideAllMenus() {
    document.getElementById('startMenu').style.display = 'none';
    document.getElementById('contextMenu').style.display = 'none';
}

function addAppToTaskbar(appId, appName, iconUrl, focusHandler) {
    if (runningApps.find(app => app.id === appId)) {
        focusHandler();
        return;
    }

    const app = { id: appId, name: appName, icon: iconUrl, handler: focusHandler };
    runningApps.push(app);
    updateTaskbar();
}

function removeAppFromTaskbar(appId) {
    runningApps = runningApps.filter(app => app.id !== appId);
    updateTaskbar();
}

function updateTaskbar() {
    const runningAppsContainer = document.getElementById('runningApps');
    runningAppsContainer.innerHTML = '';

    runningApps.forEach(app => {
        const appButton = document.createElement('button');
        appButton.className = 'app-button';
        appButton.onclick = app.handler;
        
        const iconImg = document.createElement('img');
        iconImg.src = app.icon;
        iconImg.width = 16;
        iconImg.height = 16;
        
        const appNameSpan = document.createElement('span');
        appNameSpan.textContent = app.name;

        appButton.appendChild(iconImg);
        appButton.appendChild(appNameSpan);
        runningAppsContainer.appendChild(appButton);
    });
}

function setupModalDragging(modalId) {
    const modal = document.getElementById(modalId);
    const header = modal.querySelector('.modal-header');
    let isDragging = false;
    let offset = { x: 0, y: 0 };

    header.onmousedown = function(e) {
        if (e.target.classList.contains('modal-close')) return;
        isDragging = true;
        offset.x = e.clientX - modal.offsetLeft;
        offset.y = e.clientY - modal.offsetTop;
        header.style.cursor = 'grabbing';
    };

    document.onmousemove = function(e) {
        if (!isDragging) return;
        let newX = e.clientX - offset.x;
        let newY = e.clientY - offset.y;
        
        // Constrain to viewport
        const maxX = window.innerWidth - modal.offsetWidth;
        const maxY = window.innerHeight - modal.offsetHeight;

        modal.style.left = Math.max(0, Math.min(newX, maxX)) + 'px';
        modal.style.top = Math.max(0, Math.min(newY, maxY)) + 'px';
    };

    document.onmouseup = function() {
        isDragging = false;
        header.style.cursor = 'move';
    };
}


// ===== ICON MANAGEMENT =====

function loadInitialIcons() {
    const initialIcons = [
        { name: 'My Computer', emoji: '🖥️', url: '#', id: 'my-computer', iconUrl: 'https://win98icons.alexmeub.com/icons/png/computer_explorer-5.png' },
        { name: 'Recycle Bin', emoji: '🗑️', url: '#', id: 'recycle-bin', iconUrl: 'https://win98icons.alexmeub.com/icons/png/recycle_bin_full-2.png' },
        { name: 'My Documents', emoji: '📁', url: '#', id: 'my-documents', iconUrl: 'https://win98icons.alexmeub.com/icons/png/directory_closed-4.png' },
    ];
    
    initialIcons.forEach(createIconElement);
    autoArrangeIcons();
}

function createIconElement(iconData) {
    const iconEl = document.createElement('div');
    iconEl.className = 'desktop-icon';
    iconEl.dataset.id = iconData.id;
    iconEl.dataset.url = iconData.url;

    iconEl.innerHTML = `
        <img src="${iconData.iconUrl}" alt="${iconData.name}">
        <span>${iconData.name}</span>
    `;

    iconEl.addEventListener('dblclick', () => {
        if (iconData.url && iconData.url !== '#') {
            window.open(iconData.url, '_blank');
        }
    });

    iconEl.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        currentIcon = iconEl;
        showContextMenu(e);
    });
    
    document.getElementById('desktop').appendChild(iconEl);
}

function autoArrangeIcons() {
    const desktop = document.getElementById('desktop');
    const icons = Array.from(desktop.children);
    const iconHeight = 85; 
    const iconWidth = 85; 
    const paddingTop = 10;
    const paddingLeft = 10;
    const iconsPerCol = Math.floor((desktop.clientHeight - paddingTop) / iconHeight);

    icons.forEach((icon, index) => {
        const col = Math.floor(index / iconsPerCol);
        const row = index % iconsPerCol;
        icon.style.top = `${paddingTop + row * iconHeight}px`;
        icon.style.left = `${paddingLeft + col * iconWidth}px`;
    });
}

function handleResize() {
    isMobile = window.innerWidth <= 768;
    autoArrangeIcons();
}


// ===== SOLITAIRE GAME LOGIC =====
const SOLITAIRE_SUITS = ["H", "D", "C", "S"];
const SOLITAIRE_VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"];

let sol_stock = [], sol_waste = [], sol_foundations = [[], [], [], []], sol_tableau = [[], [], [], [], [], [], []];
let sol_draggedInfo = null;

function openSolitaireApp() {
    const modal = document.getElementById('solitaireModal');
    if (modal.style.display === 'flex') {
        // Bring to front logic can be added here
        return;
    }
    modal.style.display = 'flex';
    addAppToTaskbar('solitaire', 'Solitaire', 'https://win98icons.alexmeub.com/icons/png/card_deck.png', () => {});
    initSolitaire();
}

function closeSolitaireApp() {
    document.getElementById('solitaireModal').style.display = 'none';
    removeAppFromTaskbar('solitaire');
}

function initSolitaire() {
    sol_stock = [];
    sol_waste = [];
    sol_foundations = [[], [], [], []];
    sol_tableau = Array(7).fill().map(() => []);

    const deck = SOLITAIRE_SUITS.flatMap(suit => SOLITAIRE_VALUES.map(value => ({ suit, value, faceUp: false })));
    deck.sort(() => Math.random() - 0.5);

    for (let i = 0; i < 7; i++) {
        for (let j = i; j < 7; j++) {
            sol_tableau[j].push(deck.pop());
        }
    }
    sol_tableau.forEach(pile => {
        if (pile.length > 0) pile[pile.length - 1].faceUp = true;
    });
    
    sol_stock = deck;
    renderSolitaireBoard();
}

function renderSolitaireBoard() {
    // Render Tableau
    sol_tableau.forEach((pile, i) => {
        const pileEl = document.querySelector(`.tableau[data-tableau-index="${i}"]`);
        pileEl.innerHTML = '';
        pile.forEach((card, j) => {
            const cardEl = createCardElement(card, 'tableau', i, j);
            cardEl.style.top = `${j * 20}px`; // Cascade effect
            pileEl.appendChild(cardEl);
        });
    });
    
    // Render Foundations
    sol_foundations.forEach((pile, i) => {
        const pileEl = document.querySelector(`.foundation[data-foundation-index="${i}"]`);
        pileEl.innerHTML = '';
        if (pile.length > 0) {
            pileEl.appendChild(createCardElement(pile[pile.length - 1], 'foundation', i));
        }
    });

    // Render Stock & Waste
    const stockEl = document.getElementById('stock-pile');
    stockEl.innerHTML = '';
    if (sol_stock.length > 0) stockEl.appendChild(createCardElement({ faceUp: false }, 'stock'));
    
    const wasteEl = document.getElementById('waste-pile');
    wasteEl.innerHTML = '';
    if (sol_waste.length > 0) wasteEl.appendChild(createCardElement(sol_waste[sol_waste.length - 1], 'waste'));
}

function createCardElement(card, source, pileIndex = -1, cardIndex = -1) {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    if (card.faceUp) {
        let value = card.value === 'T' ? '10' : card.value;
        const cardCode = `${value}${card.suit}`;
        cardEl.style.backgroundImage = `url('https://deckofcardsapi.com/static/img/${cardCode}.png')`;
        cardEl.draggable = true;
        cardEl.addEventListener('dragstart', (e) => onDragStart(e, { card, source, pileIndex, cardIndex }));
    } else {
        cardEl.classList.add('back');
    }
    return cardEl;
}

function onDragStart(e, info) {
    sol_draggedInfo = info;
    e.dataTransfer.setData('text/plain', ''); 
}
// Add drop listeners to piles
document.querySelectorAll('.pile').forEach(pile => {
    pile.addEventListener('dragover', e => e.preventDefault());
    pile.addEventListener('drop', e => {
        e.preventDefault();
        const targetClass = e.currentTarget.classList;
        let targetInfo;
        if(targetClass.contains('tableau')) targetInfo = { source: 'tableau', pileIndex: e.currentTarget.dataset.tableauIndex };
        if(targetClass.contains('foundation')) targetInfo = { source: 'foundation', pileIndex: e.currentTarget.dataset.foundationIndex };
        handleDrop(targetInfo);
    });
});

function handleDrop(targetInfo) {
    // **This is where the full, complex rule validation for Solitaire would go.**
    // For this example, we'll implement a very basic tableau-to-tableau move.
    
    if (sol_draggedInfo.source === 'tableau' && targetInfo.source === 'tableau') {
        const fromPileArr = sol_tableau[sol_draggedInfo.pileIndex];
        const toPileArr = sol_tableau[targetInfo.pileIndex];
        const cardsToMove = fromPileArr.slice(sol_draggedInfo.cardIndex);

        // Basic validation: move to empty pile if King, or onto opposite color and one rank higher.
        // This is still simplified and needs more robust checks.
        
        sol_tableau[targetInfo.pileIndex].push(...cardsToMove);
        sol_tableau[sol_draggedInfo.pileIndex].splice(sol_draggedInfo.cardIndex);

        // Flip new top card
        if (sol_tableau[sol_draggedInfo.pileIndex].length > 0) {
            sol_tableau[sol_draggedInfo.pileIndex][sol_draggedInfo.pileIndex.length -1].faceUp = true;
        }
    }
    renderSolitaireBoard();
    sol_draggedInfo = null;
}

document.getElementById('stock-pile').addEventListener('click', () => {
    if (sol_stock.length > 0) {
        const card = sol_stock.pop();
        card.faceUp = true;
        sol_waste.push(card);
    } else if (sol_waste.length > 0) {
        sol_stock = sol_waste.reverse().map(c => ({...c, faceUp: false}));
        sol_waste = [];
    }
    renderSolitaireBoard();
});

// ===== WEATHER APP =====

async function fetchWeatherData() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${WEATHER_LOCATION}&appid=${WEATHER_API_KEY}&units=imperial`);
        if(response.ok) {
            weatherData = await response.json();
            if (isWeatherAppOpen) populateWeatherApp();
        } else {
            console.error('Weather API error');
        }
    } catch (error) {
        console.error('Weather fetch error:', error);
    }
}

function openWeatherApp() {
    const modal = document.getElementById('weatherModal');
    if (modal.style.display === 'flex') return;
    
    isWeatherAppOpen = true;
    modal.style.display = 'flex';
    addAppToTaskbar('weather', 'Weather', 'https://win98icons.alexmeub.com/icons/png/weather-2.png', () => {});
    
    const loadingEl = document.getElementById('weatherLoading');
    const contentEl = document.getElementById('weatherContent');
    
    if (weatherData) {
        populateWeatherApp();
        loadingEl.style.display = 'none';
        contentEl.style.display = 'block';
    } else {
        loadingEl.style.display = 'block';
        contentEl.style.display = 'none';
    }
}

function closeWeatherApp() {
    isWeatherAppOpen = false;
    document.getElementById('weatherModal').style.display = 'none';
    removeAppFromTaskbar('weather');
}

function populateWeatherApp() {
    // This function would populate the weather modal with data
    // from the `weatherData` variable.
    console.log("Populating weather data:", weatherData);
}

// ===== EVENT LISTENERS & ADMIN AUTH (From original script) =====
// ... (Your existing code for these functions)
function setupEventListeners() {
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.start-button') && !e.target.closest('.start-menu')) {
            document.getElementById('startMenu').style.display = 'none';
        }
        if (!e.target.closest('.desktop-icon') && !e.target.closest('.context-menu')) {
             document.getElementById('contextMenu').style.display = 'none';
        }
    });

    const desktop = document.getElementById('desktop');
    if (desktop) {
        desktop.addEventListener('contextmenu', function(e) {
            if (e.target === this) {
                currentIcon = null;
                showContextMenu(e);
            }
        });
    }
}

function showContextMenu(e) {
    e.preventDefault();
    hideAllMenus();
    const contextMenu = document.getElementById('contextMenu');
    contextMenu.style.display = 'block';
    contextMenu.style.left = `${e.clientX}px`;
    contextMenu.style.top = `${e.clientY}px`;
}

function showContextMenu(e) {
    e.preventDefault();
    const contextMenu = document.getElementById('contextMenu');
    const startMenu = document.getElementById('startMenu');
    if (contextMenu) {
        contextMenu.style.display = 'block';
        contextMenu.style.left = e.clientX + 'px';
        contextMenu.style.top = e.clientY + 'px';
    }
    if (startMenu) {
        startMenu.style.display = 'none';
    }
}

function createIconElement(iconData) {
    const newIcon = document.createElement('div');
    newIcon.className = 'desktop-icon';
    newIcon.style.left = iconData.left || '15px';
    newIcon.style.top = iconData.top || '15px';
    newIcon.dataset.url = iconData.url;
    newIcon.dataset.icon = iconData.emoji;
    newIcon.dataset.id = iconData.id;
    
    newIcon.innerHTML = `
        <div class="icon-emoji">${iconData.emoji}</div>
        <span>${iconData.name}</span>
    `;

    const desktop = document.getElementById('desktop');
    if (desktop) {
        desktop.appendChild(newIcon);
    }

    newIcon.addEventListener('mousedown', handleMouseDown);
    newIcon.addEventListener('dblclick', handleDoubleClick);
    newIcon.addEventListener('contextmenu', handleRightClick);
}

// ===== ADMIN AUTHENTICATION =====
function requireAdminAuth(action) {
    if (isAdminAuthenticated) {
        action();
    } else {
        pendingAdminAction = action;
        const adminModal = document.getElementById('adminModal');
        if (adminModal) {
            adminModal.style.display = 'flex';
            const passwordField = document.getElementById('adminPassword');
            if (passwordField) {
                passwordField.focus();
            }
        }
    }
}

function checkAdminPassword() {
    const passwordField = document.getElementById('adminPassword');
    if (passwordField) {
        const enteredPassword = passwordField.value;
        if (enteredPassword === ADMIN_PASSWORD) {
            isAdminAuthenticated = true;
            closeAdminModal();
            if (pendingAdminAction) {
                pendingAdminAction();
                pendingAdminAction = null;
            }
        } else {
            alert('Incorrect password. Access denied.');
            passwordField.value = '';
        }
    }
}

function closeAdminModal() {
    const adminModal = document.getElementById('adminModal');
    const passwordField = document.getElementById('adminPassword');
    if (adminModal) {
        adminModal.style.display = 'none';
    }
    if (passwordField) {
        passwordField.value = '';
    }
}

// ===== ICON CRUD OPERATIONS =====
function addNewIcon() {
    const modalTitle = document.getElementById('modalTitle');
    const iconName = document.getElementById('iconName');
    const iconUrl = document.getElementById('iconUrl');
    const iconEmoji = document.getElementById('iconEmoji');
    const iconModal = document.getElementById('iconModal');

    if (modalTitle) modalTitle.textContent = 'Add New Icon';
    if (iconName) iconName.value = '';
    if (iconUrl) iconUrl.value = '';
    if (iconEmoji) iconEmoji.value = '🖥️';
    if (iconModal) iconModal.style.display = 'flex';
    hideAllMenus();
    currentIcon = null;
}

function editIcon(icon) {
    if (!icon) return;
    
    const modalTitle = document.getElementById('modalTitle');
    const iconName = document.getElementById('iconName');
    const iconUrl = document.getElementById('iconUrl');
    const iconEmoji = document.getElementById('iconEmoji');
    const iconModal = document.getElementById('iconModal');

    const nameElement = icon.querySelector('span');
    
    if (modalTitle) modalTitle.textContent = 'Edit Icon';
    if (iconName && nameElement) iconName.value = nameElement.textContent;
    if (iconUrl) iconUrl.value = icon.dataset.url || '';
    if (iconEmoji) iconEmoji.value = icon.dataset.icon || '🖥️';
    if (iconModal) iconModal.style.display = 'flex';
    hideAllMenus();
}

function deleteIcon(icon) {
    if (!icon) return;
    
    if (confirm('Are you sure you want to delete this icon?')) {
        icon.remove();
    }
    hideAllMenus();
}

function closeModal() {
    const iconModal = document.getElementById('iconModal');
    if (iconModal) {
        iconModal.style.display = 'none';
    }
}

function saveIcon() {
    const iconName = document.getElementById('iconName');
    const iconUrl = document.getElementById('iconUrl');
    const iconEmoji = document.getElementById('iconEmoji');

    if (!iconName || !iconUrl || !iconEmoji) {
        alert('Form elements not found.');
        return;
    }

    const name = iconName.value.trim();
    const url = iconUrl.value.trim();
    const emoji = iconEmoji.value;

    if (!name || !url) {
        alert('Please fill in all fields.');
        return;
    }

    if (currentIcon) {
        const nameElement = currentIcon.querySelector('span');
        const emojiElement = currentIcon.querySelector('.icon-emoji');
        if (nameElement) nameElement.textContent = name;
        if (emojiElement) emojiElement.textContent = emoji;
        currentIcon.dataset.url = url;
        currentIcon.dataset.icon = emoji;
    } else {
        const gridSize = 80;
        const col = Math.floor(iconCounter / 6);
        const row = iconCounter % 6;
        
        const iconData = {
            name: name,
            url: url,
            emoji: emoji,
            left: (15 + (col * gridSize)) + 'px',
            top: (15 + (row * gridSize)) + 'px',
            id: Math.random().toString(36).substr(2, 9)
        };
        
        createIconElement(iconData);
        iconCounter++;
    }

    closeModal();
}

// ===== IMPORT/EXPORT =====
function exportConfig() {
    try {
        const icons = [];
        document.querySelectorAll('.desktop-icon').forEach(icon => {
            const nameElement = icon.querySelector('span');
            const emojiElement = icon.querySelector('.icon-emoji');
            if (nameElement && emojiElement) {
                icons.push({
                    name: nameElement.textContent,
                    url: icon.dataset.url,
                    emoji: icon.dataset.icon,
                    left: icon.style.left,
                    top: icon.style.top,
                    id: icon.dataset.id || Math.random().toString(36).substr(2, 9)
                });
            }
        });

        const config = {
            icons: icons,
            exportDate: new Date().toISOString(),
            version: "1.0"
        };

        const dataStr = JSON.stringify(config, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'desktop-config.json';
        link.click();
        
        URL.revokeObjectURL(url);
        hideAllMenus();
    } catch (error) {
        console.error('Export error:', error);
        alert('Error exporting configuration.');
    }
}

function importConfig() {
    const importFile = document.getElementById('importFile');
    if (importFile) {
        importFile.click();
    }
    hideAllMenus();
}

function handleImportFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const config = JSON.parse(e.target.result);
            if (config.icons && Array.isArray(config.icons)) {
                document.querySelectorAll('.desktop-icon').forEach(icon => icon.remove());
                
                config.icons.forEach(iconData => {
                    createIconElement(iconData);
                });
                
                alert('Configuration imported successfully!');
            } else {
                alert('Invalid configuration file format.');
            }
        } catch (error) {
            console.error('Import error:', error);
            alert('Error reading configuration file: ' + error.message);
        }
    };
    reader.readAsText(file);
    
    event.target.value = '';
}

// ===== UTILITY FUNCTIONS =====
function hideAllMenus() {
    const contextMenu = document.getElementById('contextMenu');
    const startMenu = document.getElementById('startMenu');
    if (contextMenu) contextMenu.style.display = 'none';
    if (startMenu) startMenu.style.display = 'none';
}
