// ===== GLOBAL VARIABLES =====
let currentIcon = null;
let isAdminAuthenticated = false;
const ADMIN_PASSWORD = "admin123";
let pendingAdminAction = null;
let weatherData = null;
let isWeatherAppOpen = false;
let runningApps = [];

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
        setInterval(fetchWeatherData, 600000);

        loadInitialIcons();
        autoArrangeIcons();
        window.addEventListener('resize', autoArrangeIcons);

    } catch (error) {
        console.error('Initialization error:', error);
    }
});

// ===== CORE APP & UI FUNCTIONS =====

function updateTime() {
    const timeDisplay = document.getElementById('timeDisplay');
    if (timeDisplay) {
        const now = new Date();
        timeDisplay.textContent = now.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit' });
    }
}

function toggleStartMenu() {
    const startMenu = document.getElementById('startMenu');
    if (startMenu) startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
}

function hideAllMenus() {
    document.getElementById('startMenu').style.display = 'none';
    document.getElementById('contextMenu').style.display = 'none';
}

function addAppToTaskbar(appId, appName, iconUrl, focusHandler) {
    if (runningApps.find(app => app.id === appId)) {
        if (focusHandler) focusHandler();
        return;
    }
    runningApps.push({ id: appId, name: appName, icon: iconUrl, handler: focusHandler });
    updateTaskbar();
}

function removeAppFromTaskbar(appId) {
    runningApps = runningApps.filter(app => app.id !== appId);
    updateTaskbar();
}

function updateTaskbar() {
    const container = document.getElementById('runningApps');
    container.innerHTML = '';
    runningApps.forEach(app => {
        const button = document.createElement('button');
        button.className = 'app-button';
        if (app.handler) button.onclick = app.handler;
        button.innerHTML = `<img src="${app.icon}" width="16" height="16" alt="${app.name}"><span>${app.name}</span>`;
        container.appendChild(button);
    });
}

function setupModalDragging(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    const header = modal.querySelector('.modal-header');
    if (!header) return;
    let isDragging = false, offset = { x: 0, y: 0 };
    header.onmousedown = (e) => {
        if (e.target.classList.contains('modal-close')) return;
        isDragging = true;
        offset = { x: e.clientX - modal.offsetLeft, y: e.clientY - modal.offsetTop };
        header.style.cursor = 'grabbing';
    };
    document.onmousemove = (e) => {
        if (!isDragging) return;
        let newX = e.clientX - offset.x;
        let newY = e.clientY - offset.y;
        modal.style.left = `${Math.max(0, newX)}px`;
        modal.style.top = `${Math.max(0, newY)}px`;
    };
    document.onmouseup = () => {
        isDragging = false;
        header.style.cursor = 'move';
    };
}


// ===== EVENT LISTENERS =====
function setupEventListeners() {
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.start-button') && !e.target.closest('.start-menu')) {
            document.getElementById('startMenu').style.display = 'none';
        }
        if (!e.target.closest('.desktop-icon') && !e.target.closest('.context-menu')) {
            document.getElementById('contextMenu').style.display = 'none';
        }
    });

    const desktop = document.getElementById('desktop');
    desktop.addEventListener('contextmenu', (e) => {
        if (e.target === desktop) {
            currentIcon = null;
            showContextMenu(e);
        }
    });
}

function showContextMenu(e) {
    e.preventDefault();
    hideAllMenus();
    const contextMenu = document.getElementById('contextMenu');
    contextMenu.style.display = 'block';
    contextMenu.style.left = `${e.clientX}px`;
    contextMenu.style.top = `${e.clientY}px`;
}

// ===== ICON MANAGEMENT =====
function loadInitialIcons() {
    const desktop = document.getElementById('desktop');
    desktop.innerHTML = '';

    const initialIcons = [
        { name: 'PayCom Online', url: 'https://www.paycomonline.net/v4/ee/web.php/app/login', id: 'paycom', iconUrl: 'https://icons.duckduckgo.com/ip3/paycomonline.net.ico' },
        { name: 'Slack', url: 'https://slack.com/', id: 'slack', iconUrl: 'https://icons.duckduckgo.com/ip3/slack.com.ico' },
        { name: 'Lifeflight OLS', url: 'https://andersoncounty911_sc.transport.net/#/home/dashboard?facilityId=52109&operation=upcomingTrips', id: 'lifeflight', iconUrl: 'https://icons.duckduckgo.com/ip3/med-trans.net.ico' },
        { name: 'IAED EMD', url: 'https://learn.emergencydispatch.org/academy/my_learning/dashboard', id: 'iaed', iconUrl: 'https://icons.duckduckgo.com/ip3/emergencydispatch.org.ico' },
        { name: 'Vanguard', url: 'https://vanguard.emsanyware.com/', id: 'vanguard', iconUrl: 'https://icons.duckduckgo.com/ip3/emsanyware.com.ico' },
        { name: 'Priority Ambulance', url: 'https://priorityambulance.com/', id: 'priority', iconUrl: 'https://icons.duckduckgo.com/ip3/priority.com.ico' },
        { name: 'Daily Truck Form', url: 'https://forms.microsoft.com/pages/responsepage.aspx?id=Zh-exeJVn0SAfe_1FF9Zi2FaRW6gaHhKjeF02t2Aq8tURFAwVDVVUEVVRzZRODNTNkgyUFJNMDBHSS4u', id: 'truck-form', iconUrl: 'https://raw.githubusercontent.com/sndjy1986/_traichu/refs/heads/main/form.png' },
        { name: 'North Campus Map', url: 'https://anmed.org/sites/default/files/2024-08/anmed-north-campus-map-v5.pdf', id: 'anmed-map', iconUrl: 'https://icons.duckduckgo.com/ip3/anmed.org.ico' },
        { name: 'SC DOT Camera\'s', url: 'https://www.511sc.org/#zoom=11.5&lon=-82.55&lat=34.58', id: 'scdot', iconUrl: 'https://icons.duckduckgo.com/ip3/511sc.org.ico' },
        { name: 'Saved Reports', url: 'https://drive.google.com/drive/folders/1Qzn_8PrPBanI6P5IC9Jovt3qDSLiJH9v?usp=drive_link', id: 'saved-reports', iconUrl: 'https://raw.githubusercontent.com/sndjy1986/windows-98/refs/heads/main/folder.png' },
        { name: 'Priority Support', url: 'https://support.priorityambulance.com/helpdesk/WebObjects/Helpdesk.woa', id: 'priority-support', iconUrl: 'https://raw.githubusercontent.com/sndjy1986/_traichu/refs/heads/main/support.JPG' },
        { name: 'Google Voice', url: 'https://voice.google.com/u/0/messages', id: 'gvoice', iconUrl: 'https://icons.duckduckgo.com/ip3/voice.google.com.ico' }
    ];

    initialIcons.forEach(createIconElement);
}

function createIconElement(iconData) {
    const iconEl = document.createElement('div');
    iconEl.className = 'desktop-icon';
    iconEl.dataset.id = iconData.id;
    iconEl.dataset.url = iconData.url;

    iconEl.innerHTML = `<img src="${iconData.iconUrl}" alt="${iconData.name}" onerror="this.onerror=null;this.src='https://win98icons.alexmeub.com/icons/png/file_lines-0.png';"><span>${iconData.name}</span>`;

    iconEl.addEventListener('dblclick', () => {
        if (iconData.url && iconData.url !== '#') window.open(iconData.url, '_blank');
    });
    iconEl.addEventListener('contextmenu', (e) => {
        e.stopPropagation();
        e.preventDefault();
        currentIcon = iconEl;
        showContextMenu(e);
    });
    document.getElementById('desktop').appendChild(iconEl);
}

function autoArrangeIcons() {
    const desktop = document.getElementById('desktop');
    const icons = Array.from(desktop.children);
    const iconHeight = 85, iconWidth = 85, paddingTop = 10, paddingLeft = 10;
    if (desktop.clientHeight <= 0) return;
    const iconsPerCol = Math.floor((desktop.clientHeight - paddingTop) / iconHeight);
    if (iconsPerCol <= 0) return;
    icons.forEach((icon, index) => {
        const col = Math.floor(index / iconsPerCol);
        const row = index % iconsPerCol;
        icon.style.top = `${paddingTop + row * iconHeight}px`;
        icon.style.left = `${paddingLeft + col * iconWidth}px`;
    });
}

// ===== SOLITAIRE GAME LOGIC =====
const SOLITAIRE_SUITS = { H: "red", D: "red", C: "black", S: "black" };
const SOLITAIRE_VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"];
let sol_stock = [], sol_waste = [], sol_foundations = [[], [], [], []], sol_tableau = [[], [], [], [], [], [], []];
let sol_draggedInfo = null;

function openSolitaireApp() {
    hideAllMenus();
    const modal = document.getElementById('solitaireModal');
    modal.style.display = 'flex';
    addAppToTaskbar('solitaire', 'Solitaire', 'https://win98icons.alexmeub.com/icons/png/card_deck.png', () => modal.style.display = 'flex');
    initSolitaire();
}

function closeSolitaireApp() {
    document.getElementById('solitaireModal').style.display = 'none';
    removeAppFromTaskbar('solitaire');
}

function initSolitaire() {
    sol_stock = []; sol_waste = [];
    sol_foundations = [[], [], [], []];
    sol_tableau = [[], [], [], [], [], [], []];
    const deck = Object.keys(SOLITAIRE_SUITS).flatMap(s => SOLITAIRE_VALUES.map(v => ({ suit: s, value: v, faceUp: false }))).sort(() => Math.random() - 0.5);
    for (let i = 0; i < 7; i++) {
        for (let j = i; j < 7; j++) {
            sol_tableau[j].push(deck.pop());
        }
    }
    sol_tableau.forEach(p => { if (p.length) p[p.length - 1].faceUp = true; });
    sol_stock = deck;
    renderSolitaireBoard();
}

function renderSolitaireBoard() {
    // Render Tableau Piles
    sol_tableau.forEach((pile, i) => {
        const pileEl = document.querySelector(`.tableau[data-tableau-index="${i}"]`);
        pileEl.innerHTML = '';
        pile.forEach((card, j) => {
            const cardEl = createSolitaireCard(card, 'tableau', i, j);
            cardEl.style.top = `${j * 25}px`;
            pileEl.appendChild(cardEl);
        });
    });
    // Render Foundation Piles
    sol_foundations.forEach((pile, i) => {
        const pileEl = document.querySelector(`.foundation[data-foundation-index="${i}"]`);
        pileEl.innerHTML = '';
        if (pile.length) pileEl.appendChild(createSolitaireCard(pile[pile.length - 1], 'foundation', i));
    });
    // Render Stock and Waste Piles
    document.getElementById('stock-pile').innerHTML = sol_stock.length ? createSolitaireCard({ faceUp: false }, 'stock').outerHTML : '';
    document.getElementById('waste-pile').innerHTML = sol_waste.length ? createSolitaireCard(sol_waste[sol_waste.length - 1], 'waste').outerHTML : '';
}

function createSolitaireCard(card, source, pIndex = -1, cIndex = -1) {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    if (card.faceUp) {
        let val = card.value === 'T' ? '10' : card.value;
        cardEl.style.backgroundImage = `url('https://deckofcardsapi.com/static/img/${val}${card.suit}.png')`;
        cardEl.draggable = true;
        cardEl.addEventListener('dragstart', (e) => {
            sol_draggedInfo = { card, source, pIndex, cIndex };
            e.dataTransfer.setData('text/plain', ''); // Necessary for Firefox
        });
    } else {
        cardEl.classList.add('back');
    }
    return cardEl;
}

// New helper functions for game rules
function getCardColor(card) { return SOLITAIRE_SUITS[card.suit]; }
function getCardRank(card) { return SOLITAIRE_VALUES.indexOf(card.value); }

/**
 * Handles all game logic for dropping a card onto a pile.
 * @param {object} targetInfo - Information about the pile the card was dropped on.
 */
function handleSolitaireDrop(targetInfo) {
    if (!sol_draggedInfo) return;

    const { card: draggedCard, source: fromSource, pIndex: fromPIndex, cIndex: fromCIndex } = sol_draggedInfo;
    const { source: toSource, pIndex: toPIndex } = targetInfo;

    let moved = false;
    
    // --- Move TO FOUNDATION ---
    if (toSource === 'foundation') {
        const targetPile = sol_foundations[toPIndex];
        const topCard = targetPile.length > 0 ? targetPile[targetPile.length - 1] : null;

        // Rule: Must be an Ace on an empty foundation
        if (!topCard && getCardRank(draggedCard) === 0) {
            moved = true;
        }
        // Rule: Must be same suit and next rank
        if (topCard && topCard.suit === draggedCard.suit && getCardRank(draggedCard) === getCardRank(topCard) + 1) {
            moved = true;
        }
        
        if(moved){
            const cardToMove = (fromSource === 'tableau' ? sol_tableau[fromPIndex] : sol_waste).pop();
            targetPile.push(cardToMove);
        }
    }

    // --- Move TO TABLEAU ---
    if (toSource === 'tableau') {
        const targetPile = sol_tableau[toPIndex];
        const topCard = targetPile.length > 0 ? targetPile[targetPile.length - 1] : null;

        // Rule: Must be a King on an empty pile
        if (!topCard && getCardRank(draggedCard) === 12) {
            moved = true;
        }
        // Rule: Must be opposite color and descending rank
        if (topCard && getCardColor(topCard) !== getCardColor(draggedCard) && getCardRank(draggedCard) === getCardRank(topCard) - 1) {
            moved = true;
        }

        if(moved){
            let cardsToMove = [];
            if(fromSource === 'tableau'){
                cardsToMove = sol_tableau[fromPIndex].splice(fromCIndex);
            } else { // from waste
                cardsToMove = [sol_waste.pop()];
            }
            targetPile.push(...cardsToMove);
        }
    }

    // --- Flip card on source pile if move was successful ---
    if (moved && fromSource === 'tableau') {
        const sourcePile = sol_tableau[fromPIndex];
        if (sourcePile.length > 0) {
            sourcePile[sourcePile.length - 1].faceUp = true;
        }
    }

    renderSolitaireBoard();
    sol_draggedInfo = null;

    // --- Check for win condition ---
    if (sol_foundations.every(p => p.length === 13)) {
        setTimeout(() => alert("Congratulations, You've Won!"), 100);
    }
}

// Add event listeners to piles
document.querySelectorAll('.pile').forEach(p => {
    p.addEventListener('dragover', e => e.preventDefault());
    p.addEventListener('drop', e => {
        e.preventDefault();
        const tClass = e.currentTarget.classList;
        let tInfo = {};
        if (tClass.contains('tableau')) tInfo = { source: 'tableau', pIndex: parseInt(e.currentTarget.dataset.tableauIndex) };
        if (tClass.contains('foundation')) tInfo = { source: 'foundation', pIndex: parseInt(e.currentTarget.dataset.foundationIndex) };
        if (tInfo.source) handleSolitaireDrop(tInfo);
    });
});

document.getElementById('stock-pile').addEventListener('click', () => {
    if (sol_stock.length > 0) {
        const card = sol_stock.pop();
        card.faceUp = true;
        sol_waste.push(card);
    } else if (sol_waste.length > 0) {
        sol_stock = sol_waste.reverse().map(c => ({ ...c, faceUp: false }));
        sol_waste = [];
    }
    renderSolitaireBoard();
});


// ===== WEATHER APP & ADMIN LOGIC (Full implementations from original script) =====
async function fetchWeatherData() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${WEATHER_LOCATION}&appid=${WEATHER_API_KEY}&units=imperial`);
        if (response.ok) {
            weatherData = await response.json();
            if (isWeatherAppOpen) populateWeatherApp();
        } else { console.error('Weather API error'); }
    } catch (error) { console.error('Weather fetch error:', error); }
}

function openWeatherApp() {
    hideAllMenus();
    const modal = document.getElementById('weatherModal');
    modal.style.display = 'flex';
    isWeatherAppOpen = true;
    addAppToTaskbar('weather', 'Weather', 'https://win98icons.alexmeub.com/icons/png/weather-2.png', () => modal.style.display = 'flex');
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
    if (!weatherData) return;
    document.getElementById('currentLocation').textContent = `${weatherData.name}, ${weatherData.sys.country}`;
    document.getElementById('currentWeatherIcon').textContent = getWeatherEmoji(weatherData.weather[0].main);
    document.getElementById('currentTemp').textContent = `${Math.round(weatherData.main.temp)}°F`;
    document.getElementById('currentCondition').textContent = weatherData.weather[0].description;
    document.getElementById('feelsLike').textContent = `${Math.round(weatherData.main.feels_like)}°F`;
    document.getElementById('humidity').textContent = `${weatherData.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${Math.round(weatherData.wind.speed)} mph`;
    document.getElementById('pressure').textContent = `${weatherData.main.pressure} mb`;
}

function getWeatherEmoji(condition) {
    const map = {'Clear':'☀️','Clouds':'☁️','Rain':'🌧️','Drizzle':'🌦️','Thunderstorm':'⛈️','Snow':'❄️','Mist':'🌫️','Fog':'🌫️','Haze':'🌫️'};
    return map[condition] || '🌤️';
}

function requireAdminAuth(action) {
    if (isAdminAuthenticated) { action(); return; }
    pendingAdminAction = action;
    const modal = document.getElementById('adminModal');
    if (modal) {
        modal.style.display = 'flex';
        document.getElementById('adminPassword').focus();
    }
}

function checkAdminPassword() {
    const passField = document.getElementById('adminPassword');
    if (!passField) return;
    if (passField.value === ADMIN_PASSWORD) {
        isAdminAuthenticated = true;
        closeAdminModal();
        if (pendingAdminAction) { pendingAdminAction(); pendingAdminAction = null; }
    } else {
        alert('Incorrect password. Access denied.');
        passField.value = '';
    }
}

function closeAdminModal() {
    const modal = document.getElementById('adminModal');
    if (modal) modal.style.display = 'none';
    document.getElementById('adminPassword').value = '';
}

function addNewIcon() {
    currentIcon = null;
    document.getElementById('modalTitle').textContent = 'Add New Icon';
    document.getElementById('iconName').value = '';
    document.getElementById('iconUrl').value = '';
    document.getElementById('iconModal').style.display = 'flex';
    hideAllMenus();
}

function editIcon(icon) {
    if (!icon) return;
    currentIcon = icon;
    document.getElementById('modalTitle').textContent = 'Edit Icon';
    document.getElementById('iconName').value = icon.querySelector('span').textContent;
    document.getElementById('iconUrl').value = icon.dataset.url;
    document.getElementById('iconModal').style.display = 'flex';
    hideAllMenus();
}

function deleteIcon(icon) {
    if (!icon) return;
    if (confirm('Are you sure you want to delete this icon?')) {
        icon.remove();
        autoArrangeIcons();
    }
    hideAllMenus();
}

function closeModal() {
    document.getElementById('iconModal').style.display = 'none';
}

function saveIcon() {
    const name = document.getElementById('iconName').value.trim();
    let url = document.getElementById('iconUrl').value.trim();
    if (!name || !url) { alert('Please fill in all fields.'); return; }
    if (!url.startsWith('http')) { url = 'https://' + url; }

    if (currentIcon) {
        currentIcon.querySelector('span').textContent = name;
        currentIcon.dataset.url = url;
        currentIcon.querySelector('img').src = `https://icons.duckduckgo.com/ip3/${new URL(url).hostname}.ico`;
    } else {
        const newIconData = { name, url, id: `custom-${Date.now()}`, iconUrl: `https://icons.duckduckgo.com/ip3/${new URL(url).hostname}.ico` };
        createIconElement(newIconData);
        autoArrangeIcons();
    }
    closeModal();
}
