// ===== GLOBAL VARIABLES =====
let currentIcon = null;
let isAdminAuthenticated = false;
const ADMIN_PASSWORD = "admin123";
let pendingAdminAction = null;
let weatherData = null;
let isWeatherAppOpen = false;
let runningApps = [];

const WEATHER_API_KEY = "8b093586dd2c02084b20747b888d3cfa";
const WEATHER_LOCATION = "Anderson,SC,US";

// ===== DESKTOP ICONS CONFIGURATION =====
const DESKTOP_ICONS = [
    { name: 'Windows Home', url: 'http://windows98.sndjy.us', id: 'windows-home', iconUrl: 'https://icons.duckduckgo.com/ip3/sndjy.us.org.ico' },
    { name: 'ESO', url: 'https://scheduling.esosuite.net/Login.aspx?DB=priorityambulance', id: 'eso', iconUrl: 'https://icons.duckduckgo.com/ip3/eso.org.ico' },
    { name: 'Vanguard', url: 'https://vanguard.emsanyware.com/', id: 'vanguard', iconUrl: 'https://icons.duckduckgo.com/ip3/emsanyware.com.ico' },
    { name: 'PayCom', url: 'https://www.paycomonline.net/v4/ee/web.php/app/login', id: 'paycom', iconUrl: 'https://icons.duckduckgo.com/ip3/paycomonline.net.ico' },
    { name: 'G-Drive', url: 'http://www.drive.google.com', id: 'gdrive', iconUrl: 'https://icons.duckduckgo.com/ip3/drive.google.com.ico' },
    { name: 'Priority', url: 'https://priorityambulance.com/', id: 'priority', iconUrl: 'https://icons.duckduckgo.com/ip3/priority.com.ico' },
    { name: 'WorkSheet', url: 'https://docs.google.com/spreadsheets/d/1H6C59UoF_g1QHSutXQCqBUUhfW4r2rLoNaTe0ZRQYSw/edit?usp=sharing', id: 'worksheet', iconUrl: 'https://icons.duckduckgo.com/ip3/drive.google.com.ico' },
    { name: 'Truck Sheet', url: 'https://forms.microsoft.com/pages/responsepage.aspx?id=Zh-exeJVn0SAfe_1FF9Zi2FaRW6gaHhKjeF02t2Aq8tURFAwVDVVUEVVRzZRODNTNkgyUFJNMDBHSS4u', id: 'truck-sheet', iconUrl: 'https://raw.githubusercontent.com/sndjy1986/_traichu/refs/heads/main/form.png' },
    { name: 'North Campus Map', url: 'https://anmed.org/sites/default/files/2024-08/anmed-north-campus-map-v5.pdf', id: 'anmed-map', iconUrl: 'https://icons.duckduckgo.com/ip3/anmed.org.ico' },
    { name: 'DOT Cams', url: 'https://www.511sc.org/#zoom=11.546860821896603&lon=-82.55557766187724&lat=34.58726185125286&dmsg&rest&cams&other&cong&wthr&acon&incd&trfc', id: 'dot-cams', iconUrl: 'https://icons.duckduckgo.com/ip3/511sc.org.ico' },
    { name: 'Truck Track', url: 'https://amm04.airlink.com/sierrawireless/', id: 'truck-track', iconUrl: 'https://icons.duckduckgo.com/ip3/tracker.com.ico' },
    { name: 'EMD Stuff', url: 'https://learn.emergencydispatch.org/academy/my_learning/dashboard', id: 'emd-stuff', iconUrl: 'https://icons.duckduckgo.com/ip3/emergencydispatch.org.ico' },
    { name: 'Work Support', url: 'https://support.priorityambulance.com/helpdesk/WebObjects/Helpdesk.woa', id: 'work-support', iconUrl: 'https://icons.duckduckgo.com/ip3/sndjy.us.com.ico' },
    { name: 'MyChart', url: 'https://mychart.anmedhealth.org/', id: 'mychart', iconUrl: 'https://icons.duckduckgo.com/ip3/mychart.anmedhealth.org.ico' },
    { name: 'Truck Timers', url: 'https://truck-5c2f62a8549e.herokuapp.com/', id: 'truck-timers', iconUrl: 'https://icons.duckduckgo.com/ip3/sndjy.us.ico' },
    { name: 'Small Server', url: 'https://dashboard.heroku.com/apps/truck/settings', id: 'small-server', iconUrl: 'https://icons.duckduckgo.com/ip3/heroku.com.ico' },
    { name: 'iCloud', url: 'https://www.icloud.com/', id: 'icloud', iconUrl: 'https://icons.duckduckgo.com/ip3/apple.com.ico' },
    { name: 'YouTube', url: 'https://www.youtube.com', id: 'youtube', iconUrl: 'https://icons.duckduckgo.com/ip3/youtube.com.ico' },
    { name: 'Telehack', url: 'https://telehack.com', id: 'telehack', iconUrl: 'https://icons.duckduckgo.com/ip3/telehack.com.ico' },
    { name: 'Google Maps', url: 'https://www.google.com/maps', id: 'google-maps', iconUrl: 'https://icons.duckduckgo.com/ip3/maps.google.com.ico' },
    { name: 'Cloudflare', url: 'https://cloudflare.com/', id: 'cloudflare', iconUrl: 'https://icons.duckduckgo.com/ip3/cloudflare.com.ico' },
    { name: 'Verizon', url: 'https://login.verizonwireless.com/accessmanager/public/c/fu/loginDisconnectedStart', id: 'verizon', iconUrl: 'https://icons.duckduckgo.com/ip3/verizonwireless.com.ico' },
    { name: 'Duke Energy', url: 'https://www.duke-energy.com/my-account/sign-in', id: 'duke-energy', iconUrl: 'https://icons.duckduckgo.com/ip3/duke-energy.com.ico' },
    { name: 'Amazon', url: 'http://www.amazon.com', id: 'amazon', iconUrl: 'https://icons.duckduckgo.com/ip3/amazon.com.ico' },
    { name: 'FoxCarolina', url: 'http://www.foxcarolina.com', id: 'foxcarolina', iconUrl: 'https://icons.duckduckgo.com/ip3/foxcarolina.com.ico' },
    { name: 'Remote Desk', url: 'https://remotedesktop.google.com/', id: 'remote-desk', iconUrl: 'https://icons.duckduckgo.com/ip3/remotedesktop.google.com.ico' },
    { name: 'Coroner Sched', url: 'https://drive.google.com/file/d/1i2Pybwtw5h-tDiBGzM1QLVQumYZx0Ubz/view?usp=drive_link', id: 'coroner-sched', iconUrl: 'https://icons.duckduckgo.com/ip3/dead.net.ico' },
    { name: 'Gmail', url: 'https://mail.google.com', id: 'gmail', iconUrl: 'https://icons.duckduckgo.com/ip3/gmail.google.com.ico' },
    { name: 'Slack', url: 'https://slack.com', id: 'slack', iconUrl: 'https://icons.duckduckgo.com/ip3/slack.com.ico' },
    { name: 'GitHub', url: 'https://github.com', id: 'github', iconUrl: 'https://icons.duckduckgo.com/ip3/github.com.ico' },
    { name: 'Education', url: 'https://login.k12.com/', id: 'education', iconUrl: 'https://icons.duckduckgo.com/ip3/k12.com.ico' },
    { name: 'Emergency Services', url: 'https://andersoncounty911_sc.transport.net/#/home/dashboard?facilityId=52109&operation=upcomingTrips', id: 'emergency', iconUrl: 'https://icons.duckduckgo.com/ip3/med-trans.net.ico' },
    { name: 'Gemini', url: 'https://gemini.google.com/app', id: 'gemini', iconUrl: 'https://icons.duckduckgo.com/ip3/gemini.google.com.ico' },
    { name: 'Calendar', url: 'calendar.html', id: 'calendar', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg' }
];

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
        setupWeatherTextDragging();
        
        // Show basic weather text first
        const weatherText = document.getElementById('weatherText');
        if (weatherText) {
            weatherText.innerHTML = 'Anderson, SC<br>Temp: 72°/45°<br>partly cloudy<br><br>3 Day Forecast<br>Tue: Sunny 75°/50°<br>Wed: Rain 68°/42°<br>Thu: Clear 78°/52°';
        }
        
        fetchWeatherData();
        setInterval(fetchWeatherData, 600000);
        loadInitialIcons();
        autoArrangeIcons();
        window.addEventListener('resize', autoArrangeIcons);
    } catch (error) {
        console.error('Initialization error:', error);
    }
});

// ===== EVENT LISTENERS SETUP =====
function setupEventListeners() {
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.start-button') && !e.target.closest('.start-menu')) {
            hideAllMenus();
        }
    });

    document.getElementById('desktop').addEventListener('contextmenu', (e) => {
        if (e.target === document.getElementById('desktop')) {
            currentIcon = null;
            showContextMenu(e);
        }
    });

    document.getElementById('startButton').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleStartMenu();
    });

    // Start menu items
    document.getElementById('startMenuSolitaire').addEventListener('click', openSolitaireApp);
    document.getElementById('startMenuWeather').addEventListener('click', openWeatherApp);
    document.getElementById('startMenuAddIcon').addEventListener('click', () => requireAdminAuth(addNewIcon));

    // Non-functional menu items
    ['startMenuPrograms', 'startMenuDocuments', 'startMenuSettings', 'startMenuFind', 'startMenuHelp', 'startMenuRun', 'startMenuExport', 'startMenuImport', 'startMenuShutdown'].forEach(id => {
        document.getElementById(id).addEventListener('click', hideAllMenus);
    });
    
    // Context menu
    document.getElementById('contextMenuAdd').addEventListener('click', () => requireAdminAuth(addNewIcon));
    document.getElementById('contextMenuEdit').addEventListener('click', () => requireAdminAuth(() => editIcon(currentIcon)));
    document.getElementById('contextMenuDelete').addEventListener('click', () => requireAdminAuth(() => deleteIcon(currentIcon)));
    document.getElementById('contextMenuArrange').addEventListener('click', () => {
        autoArrangeIcons();
        hideAllMenus();
    });
    
    // Modal Close Buttons
    document.getElementById('closeSolitaire').addEventListener('click', closeSolitaireApp);
    document.getElementById('closeWeather').addEventListener('click', closeWeatherApp);
    document.getElementById('closeAdmin').addEventListener('click', closeAdminModal);
    document.getElementById('closeIconModal').addEventListener('click', closeModal);
    
    // Admin Modal Buttons
    document.getElementById('adminOk').addEventListener('click', checkAdminPassword);
    document.getElementById('adminCancel').addEventListener('click', closeAdminModal);
    document.getElementById('adminPassword').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAdminPassword();
    });

    // Icon Edit Modal Buttons
    document.getElementById('iconOk').addEventListener('click', saveIcon);
    document.getElementById('iconCancel').addEventListener('click', closeModal);
}

// ===== CORE APP & UI FUNCTIONS =====
function updateTime() {
    try {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit' });
        document.getElementById('timeDisplay').textContent = timeString;
    } catch (error) { 
        console.error('Time update error:', error); 
    }
}

function toggleStartMenu() {
    const startMenu = document.getElementById('startMenu');
    startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
}

function hideAllMenus() {
    document.getElementById('startMenu').style.display = 'none';
    document.getElementById('contextMenu').style.display = 'none';
}

function showContextMenu(e) {
    e.preventDefault();
    hideAllMenus();
    const contextMenu = document.getElementById('contextMenu');
    contextMenu.style.display = 'block';
    contextMenu.style.left = `${e.clientX}px`;
    contextMenu.style.top = `${e.clientY}px`;
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
        button.innerHTML = `<img src="${app.icon}" width="16" height="16" alt=""><span>${app.name}</span>`;
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

function setupWeatherTextDragging() {
    const weatherText = document.getElementById('weatherText');
    if (!weatherText) return;
    let isDragging = false, offset = { x: 0, y: 0 };
    
    weatherText.onmousedown = (e) => {
        isDragging = true;
        const rect = weatherText.getBoundingClientRect();
        offset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        weatherText.style.cursor = 'grabbing';
    };
    
    document.onmousemove = (e) => {
        if (!isDragging) return;
        let newX = e.clientX - offset.x;
        let newY = e.clientY - offset.y;
        
        // Keep it positioned from the right side
        const viewportWidth = window.innerWidth;
        const elementWidth = weatherText.offsetWidth;
        const rightPosition = viewportWidth - newX - elementWidth;
        
        weatherText.style.right = Math.max(0, rightPosition) + 'px';
        weatherText.style.top = Math.max(0, newY) + 'px';
        weatherText.style.left = 'auto';
    };
    
    document.onmouseup = () => {
        isDragging = false;
        weatherText.style.cursor = 'move';
    };
}

// ===== ICON MANAGEMENT =====
function loadInitialIcons() {
    const desktop = document.getElementById('desktop');
    const icons = desktop.querySelectorAll('.desktop-icon');
    icons.forEach(icon => icon.remove());
    
    DESKTOP_ICONS.forEach(createIconElement);
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
    const icons = Array.from(desktop.querySelectorAll('.desktop-icon'));
    
    if (icons.length === 0) return;
    
    const iconHeight = 85;
    const iconWidth = 85; 
    const paddingTop = 10;
    const paddingLeft = 10;
    const desktopHeight = desktop.clientHeight;
    const desktopWidth = desktop.clientWidth;
    
    if (desktopHeight <= 0) return;
    
    const iconsPerCol = Math.floor((desktopHeight - paddingTop) / iconHeight);
    if (iconsPerCol <= 0) return;
    
    icons.forEach((icon, index) => {
        const col = Math.floor(index / iconsPerCol);
        const row = index % iconsPerCol;
        
        const leftPos = paddingLeft + (col * iconWidth);
        const topPos = paddingTop + (row * iconHeight);
        
        if (leftPos + iconWidth <= desktopWidth - 220) {
            icon.style.left = leftPos + 'px';
            icon.style.top = topPos + 'px';
            icon.style.position = 'absolute';
        }
    });
}

// ===== WEATHER APP LOGIC =====
async function fetchWeatherData() {
    try {
        const weatherText = document.getElementById('weatherText');
        if (weatherText) {
            weatherText.innerHTML = 'Anderson, SC<br>Temp: 72°/45°<br>partly cloudy<br><br>3 Day Forecast<br>Tue: Sunny 75°/50°<br>Wed: Rain 68°/42°<br>Thu: Clear 78°/52°';
        }
        
        const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Anderson,SC,US&appid=8b093586dd2c02084b20747b888d3cfa&units=imperial');
        if (response.ok) {
            weatherData = await response.json();
            updateWeatherText();
            if (isWeatherAppOpen) populateWeatherApp();
        } else { 
            console.error('Weather API error'); 
        }
    } catch (error) { 
        console.error('Weather fetch error:', error); 
    }
}

function updateWeatherText() {
    if (!weatherData) return;
    
    const weatherText = document.getElementById('weatherText');
    const current = weatherData;
    
    const currentTemp = Math.round(current.main.temp);
    const highTemp = Math.round(current.main.temp_max);
    const lowTemp = Math.round(current.main.temp_min);
    const condition = current.weather[0].description;
    
    weatherText.innerHTML = 'Anderson, SC<br>Temp: ' + highTemp + '°/' + lowTemp + '°<br>' + condition + '<br><br>3 Day Forecast<br>Tue: Sunny 75°/50°<br>Wed: Rain 68°/42°<br>Thu: Clear 78°/52°';
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
}

function getWeatherEmoji(condition) {
    const map = {'Clear':'☀️','Clouds':'☁️','Rain':'🌧️','Drizzle':'🌦️','Thunderstorm':'⛈️','Snow':'❄️','Mist':'🌫️','Fog':'🌫️','Haze':'🌫️'};
    return map[condition] || '🌤️';
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
    sol_tableau.forEach((pile, i) => {
        const pileEl = document.querySelector(`.tableau[data-tableau-index="${i}"]`);
        pileEl.innerHTML = '';
        pile.forEach((card, j) => {
            const cardEl = createSolitaireCard(card, 'tableau', i, j);
            cardEl.style.top = `${j * 25}px`;
            pileEl.appendChild(cardEl);
        });
    });
    sol_foundations.forEach((pile, i) => {
        const pileEl = document.querySelector(`.foundation[data-foundation-index="${i}"]`);
        pileEl.innerHTML = '';
        if (pile.length) pileEl.appendChild(createSolitaireCard(pile[pile.length - 1], 'foundation', i));
    });
    document.getElementById('stock-pile').innerHTML = sol_stock.length ? createSolitaireCard({ faceUp: false }, 'stock').outerHTML : '';
    document.getElementById('waste-pile').innerHTML = sol_waste.length ? createSolitaireCard(sol_waste[sol_waste.length - 1], 'waste').outerHTML : '';
}

function createSolitaireCard(card, source, pIndex, cIndex) {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    if (card.faceUp) {
        let val = card.value === 'T' ? '10' : card.value;
        cardEl.style.backgroundImage = `url('https://deckofcardsapi.com/static/img/${val}${card.suit}.png')`;
        cardEl.draggable = true;
        cardEl.addEventListener('dragstart', (e) => { sol_draggedInfo = { card, source, pIndex, cIndex }; e.dataTransfer.setData('text/plain', ''); });
    } else { cardEl.classList.add('back'); }
    return cardEl;
}

function getCardColor(card) { return SOLITAIRE_SUITS[card.suit]; }
function getCardRank(card) { return SOLITAIRE_VALUES.indexOf(card.value); }

function handleSolitaireDrop(targetInfo) {
    if (!sol_draggedInfo) return;
    const { card: draggedCard, source: fromSource, pIndex: fromPIndex, cIndex: fromCIndex } = sol_draggedInfo;
    const { source: toSource, pIndex: toPIndex } = targetInfo;
    let moved = false;
    if (toSource === 'foundation') {
        const targetPile = sol_foundations[toPIndex];
        const topCard = targetPile.length > 0 ? targetPile[targetPile.length - 1] : null;
        if (!topCard && getCardRank(draggedCard) === 0) { moved = true; }
        if (topCard && topCard.suit === draggedCard.suit && getCardRank(draggedCard) === getCardRank(topCard) + 1) { moved = true; }
        if (moved) {
            const cardToMove = (fromSource === 'tableau' ? sol_tableau[fromPIndex] : sol_waste).pop();
            targetPile.push(cardToMove);
        }
    }
    if (toSource === 'tableau') {
        const targetPile = sol_tableau[toPIndex];
        const topCard = targetPile.length > 0 ? targetPile[targetPile.length - 1] : null;
        if (!topCard && getCardRank(draggedCard) === 12) { moved = true; }
        if (topCard && getCardColor(topCard) !== getCardColor(draggedCard) && getCardRank(draggedCard) === getCardRank(topCard) - 1) { moved = true; }
        if (moved) {
            let cardsToMove = [];
            if (fromSource === 'tableau') { cardsToMove = sol_tableau[fromPIndex].splice(fromCIndex); }
            else { cardsToMove = [sol_waste.pop()]; }
            targetPile.push(...cardsToMove);
        }
    }
    if (moved && fromSource === 'tableau') {
        const sourcePile = sol_tableau[fromPIndex];
        if (sourcePile.length > 0) { sourcePile[sourcePile.length - 1].faceUp = true; }
    }
    renderSolitaireBoard();
    sol_draggedInfo = null;
    if (sol_foundations.every(p => p.length === 13)) { setTimeout(() => alert("Congratulations, You've Won!"), 100); }
}

// Event listeners for solitaire drag and drop
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
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
        
        const stockPile = document.getElementById('stock-pile');
        if (stockPile) {
            stockPile.addEventListener('click', () => {
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
        }
    }, 100);
});

// ===== ADMIN & ICON MANAGEMENT =====
function requireAdminAuth(action) {
    if (isAdminAuthenticated) { action(); return; }
    pendingAdminAction = action;
    const modal = document.getElementById('adminModal');
    if (modal) { modal.style.display = 'flex'; document.getElementById('adminPassword').focus(); }
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
}// ===== GLOBAL VARIABLES =====
let currentIcon = null;
let isAdminAuthenticated = false;
const ADMIN_PASSWORD = "admin123";
let pendingAdminAction = null;
let weatherData = null;
let isWeatherAppOpen = false;
let runningApps = [];

const WEATHER_API_KEY = "8b093586dd2c02084b20747b888d3cfa";
const WEATHER_LOCATION = "Anderson,SC,US";

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for all scripts to load
    setTimeout(() => {
        try {
            updateTime();
            setInterval(updateTime, 1000);
            setupEventListeners();
            setupModalDragging('weatherModal');
            setupModalDragging('solitaireModal');
            setupModalDragging('adminModal');
            setupModalDragging('iconModal');
            setupWeatherTextDragging();
            
            // Show basic weather text first
            const weatherText = document.getElementById('weatherText');
            if (weatherText) {
                weatherText.innerHTML = 'Anderson, SC<br>Temp: 72°/45°<br>partly cloudy<br><br>3 Day Forecast<br>Tue: Sunny 75°/50°<br>Wed: Rain 68°/42°<br>Thu: Clear 78°/52°';
            }
            
            fetchWeatherData();
            setInterval(fetchWeatherData, 600000);
            
            // Load icons and menus from separate files
            if (typeof loadInitialIcons === 'function') {
                loadInitialIcons();
                autoArrangeIcons();
            }
            
            window.addEventListener('resize', autoArrangeIcons);
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }, 100);
});

// ===== EVENT LISTENERS SETUP =====
function setupEventListeners() {
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.start-button') && !e.target.closest('.start-menu')) {
            if (typeof hideAllMenus === 'function') hideAllMenus();
        }
    });

    document.getElementById('desktop').addEventListener('contextmenu', (e) => {
        if (e.target === document.getElementById('desktop')) {
            currentIcon = null;
            if (typeof showContextMenu === 'function') showContextMenu(e);
        }
    });

    document.getElementById('startButton').addEventListener('click', (e) => {
        e.stopPropagation();
        if (typeof toggleStartMenu === 'function') toggleStartMenu();
    });

    // Setup start menu and context menu listeners
    if (typeof setupStartMenuListeners === 'function') setupStartMenuListeners();
    if (typeof setupContextMenuListeners === 'function') setupContextMenuListeners();
    
    // Modal Close Buttons
    document.getElementById('closeSolitaire').addEventListener('click', closeSolitaireApp);
    document.getElementById('closeWeather').addEventListener('click', closeWeatherApp);
    document.getElementById('closeAdmin').addEventListener('click', closeAdminModal);
    document.getElementById('closeIconModal').addEventListener('click', closeModal);
    
    // Admin Modal Buttons
    document.getElementById('adminOk').addEventListener('click', checkAdminPassword);
    document.getElementById('adminCancel').addEventListener('click', closeAdminModal);
    document.getElementById('adminPassword').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAdminPassword();
    });

    // Icon Edit Modal Buttons
    document.getElementById('iconOk').addEventListener('click', saveIcon);
    document.getElementById('iconCancel').addEventListener('click', closeModal);
}

// ===== CORE APP & UI FUNCTIONS =====
function updateTime() {
    try {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit' });
        document.getElementById('timeDisplay').textContent = timeString;
    } catch (error) { 
        console.error('Time update error:', error); 
    }
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
        button.innerHTML = `<img src="${app.icon}" width="16" height="16" alt=""><span>${app.name}</span>`;
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

function setupWeatherTextDragging() {
    const weatherText = document.getElementById('weatherText');
    if (!weatherText) return;
    let isDragging = false, offset = { x: 0, y: 0 };
    
    weatherText.onmousedown = (e) => {
        isDragging = true;
        const rect = weatherText.getBoundingClientRect();
        offset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        weatherText.style.cursor = 'grabbing';
    };
    
    document.onmousemove = (e) => {
        if (!isDragging) return;
        let newX = e.clientX - offset.x;
        let newY = e.clientY - offset.y;
        
        // Keep it positioned from the right side
        const viewportWidth = window.innerWidth;
        const elementWidth = weatherText.offsetWidth;
        const rightPosition = viewportWidth - newX - elementWidth;
        
        weatherText.style.right = Math.max(0, rightPosition) + 'px';
        weatherText.style.top = Math.max(0, newY) + 'px';
        weatherText.style.left = 'auto'; // Remove left positioning
    };
    
    document.onmouseup = () => {
        isDragging = false;
        weatherText.style.cursor = 'move';
    };
}

// ===== WEATHER APP LOGIC =====
async function fetchWeatherData() {
    try {
        // First show static version to ensure something displays
        const weatherText = document.getElementById('weatherText');
        if (weatherText) {
            weatherText.innerHTML = 'Anderson, SC<br>Temp: 72°/45°<br>partly cloudy<br><br>3 Day Forecast<br>Tue: Sunny 75°/50°<br>Wed: Rain 68°/42°<br>Thu: Clear 78°/52°';
        }
        
        const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Anderson,SC,US&appid=8b093586dd2c02084b20747b888d3cfa&units=imperial');
        if (response.ok) {
            weatherData = await response.json();
            updateWeatherText();
            if (isWeatherAppOpen) populateWeatherApp();
        } else { 
            console.error('Weather API error'); 
        }
    } catch (error) { 
        console.error('Weather fetch error:', error); 
    }
}

function updateWeatherText() {
    if (!weatherData) return;
    
    const weatherText = document.getElementById('weatherText');
    const current = weatherData;
    
    const currentTemp = Math.round(current.main.temp);
    const highTemp = Math.round(current.main.temp_max);
    const lowTemp = Math.round(current.main.temp_min);
    const condition = current.weather[0].description;
    
    weatherText.innerHTML = 'Anderson, SC<br>Temp: ' + highTemp + '°/' + lowTemp + '°<br>' + condition + '<br><br>3 Day Forecast<br>Tue: Sunny 75°/50°<br>Wed: Rain 68°/42°<br>Thu: Clear 78°/52°';
}

function openWeatherApp() {
    if (typeof hideAllMenus === 'function') hideAllMenus();
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
}

function getWeatherEmoji(condition) {
    const map = {'Clear':'☀️','Clouds':'☁️','Rain':'🌧️','Drizzle':'🌦️','Thunderstorm':'⛈️','Snow':'❄️','Mist':'🌫️','Fog':'🌫️','Haze':'🌫️'};
    return map[condition] || '🌤️';
}

// ===== SOLITAIRE GAME LOGIC =====
const SOLITAIRE_SUITS = { H: "red", D: "red", C: "black", S: "black" };
const SOLITAIRE_VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"];
let sol_stock = [], sol_waste = [], sol_foundations = [[], [], [], []], sol_tableau = [[], [], [], [], [], [], []];
let sol_draggedInfo = null;

function openSolitaireApp() {
    if (typeof hideAllMenus === 'function') hideAllMenus();
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
    sol_tableau.forEach((pile, i) => {
        const pileEl = document.querySelector(`.tableau[data-tableau-index="${i}"]`);
        pileEl.innerHTML = '';
        pile.forEach((card, j) => {
            const cardEl = createSolitaireCard(card, 'tableau', i, j);
            cardEl.style.top = `${j * 25}px`;
            pileEl.appendChild(cardEl);
        });
    });
    sol_foundations.forEach((pile, i) => {
        const pileEl = document.querySelector(`.foundation[data-foundation-index="${i}"]`);
        pileEl.innerHTML = '';
        if (pile.length) pileEl.appendChild(createSolitaireCard(pile[pile.length - 1], 'foundation', i));
    });
    document.getElementById('stock-pile').innerHTML = sol_stock.length ? createSolitaireCard({ faceUp: false }, 'stock').outerHTML : '';
    document.getElementById('waste-pile').innerHTML = sol_waste.length ? createSolitaireCard(sol_waste[sol_waste.length - 1], 'waste').outerHTML : '';
}

function createSolitaireCard(card, source, pIndex, cIndex) {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    if (card.faceUp) {
        let val = card.value === 'T' ? '10' : card.value;
        cardEl.style.backgroundImage = `url('https://deckofcardsapi.com/static/img/${val}${card.suit}.png')`;
        cardEl.draggable = true;
        cardEl.addEventListener('dragstart', (e) => { sol_draggedInfo = { card, source, pIndex, cIndex }; e.dataTransfer.setData('text/plain', ''); });
    } else { cardEl.classList.add('back'); }
    return cardEl;
}

function getCardColor(card) { return SOLITAIRE_SUITS[card.suit]; }
function getCardRank(card) { return SOLITAIRE_VALUES.indexOf(card.value); }

function handleSolitaireDrop(targetInfo) {
    if (!sol_draggedInfo) return;
    const { card: draggedCard, source: fromSource, pIndex: fromPIndex, cIndex: fromCIndex } = sol_draggedInfo;
    const { source: toSource, pIndex: toPIndex } = targetInfo;
    let moved = false;
    if (toSource === 'foundation') {
        const targetPile = sol_foundations[toPIndex];
        const topCard = targetPile.length > 0 ? targetPile[targetPile.length - 1] : null;
        if (!topCard && getCardRank(draggedCard) === 0) { moved = true; }
        if (topCard && topCard.suit === draggedCard.suit && getCardRank(draggedCard) === getCardRank(topCard) + 1) { moved = true; }
        if (moved) {
            const cardToMove = (fromSource === 'tableau' ? sol_tableau[fromPIndex] : sol_waste).pop();
            targetPile.push(cardToMove);
        }
    }
    if (toSource === 'tableau') {
        const targetPile = sol_tableau[toPIndex];
        const topCard = targetPile.length > 0 ? targetPile[targetPile.length - 1] : null;
        if (!topCard && getCardRank(draggedCard) === 12) { moved = true; }
        if (topCard && getCardColor(topCard) !== getCardColor(draggedCard) && getCardRank(draggedCard) === getCardRank(topCard) - 1) { moved = true; }
        if (moved) {
            let cardsToMove = [];
            if (fromSource === 'tableau') { cardsToMove = sol_tableau[fromPIndex].splice(fromCIndex); }
            else { cardsToMove = [sol_waste.pop()]; }
            targetPile.push(...cardsToMove);
        }
    }
    if (moved && fromSource === 'tableau') {
        const sourcePile = sol_tableau[fromPIndex];
        if (sourcePile.length > 0) { sourcePile[sourcePile.length - 1].faceUp = true; }
    }
    renderSolitaireBoard();
    sol_draggedInfo = null;
    if (sol_foundations.every(p => p.length === 13)) { setTimeout(() => alert("Congratulations, You've Won!"), 100); }
}

// Event listeners for solitaire drag and drop
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
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
                sol_stock = sol_waste.reverse().map(c => ({...c, faceUp: false})); 
                sol_waste = []; 
            }
            renderSolitaireBoard();
        });
    }, 200);
});

// ===== ADMIN & ICON MANAGEMENT =====
function requireAdminAuth(action) {
    if (isAdminAuthenticated) { action(); return; }
    pendingAdminAction = action;
    const modal = document.getElementById('adminModal');
    if (modal) { modal.style.display = 'flex'; document.getElementById('adminPassword').focus(); }
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
    if (typeof hideAllMenus === 'function') hideAllMenus();
}

function editIcon(icon) {
    if (!icon) return;
    currentIcon = icon;
    document.getElementById('modalTitle').textContent = 'Edit Icon';
    document.getElementById('iconName').value = icon.querySelector('span').textContent;
    document.getElementById('iconUrl').value = icon.dataset.url;
    document.getElementById('iconModal').style.display = 'flex';
    if (typeof hideAllMenus === 'function') hideAllMenus();
}

function deleteIcon(icon) {
    if (!icon) return;
    if (confirm('Are you sure you want to delete this icon?')) {
        icon.remove();
        if (typeof autoArrangeIcons === 'function') autoArrangeIcons();
    }
    if (typeof hideAllMenus === 'function') hideAllMenus();
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
        if (typeof createIconElement === 'function') {
            createIconElement(newIconData);
            if (typeof autoArrangeIcons === 'function') autoArrangeIcons();
        }
    }
    closeModal();
}

// ===== CORE APP & UI FUNCTIONS =====
function updateTime() {
    try {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit' });
        document.getElementById('timeDisplay').textContent = timeString;
    } catch (error) { 
        console.error('Time update error:', error); 
    }
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
        button.innerHTML = `<img src="${app.icon}" width="16" height="16" alt=""><span>${app.name}</span>`;
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

function setupWeatherTextDragging() {
    const weatherText = document.getElementById('weatherText');
    if (!weatherText) return;
    let isDragging = false, offset = { x: 0, y: 0 };
    
    weatherText.onmousedown = (e) => {
        isDragging = true;
        const rect = weatherText.getBoundingClientRect();
        offset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        weatherText.style.cursor = 'grabbing';
    };
    
    document.onmousemove = (e) => {
        if (!isDragging) return;
        let newX = e.clientX - offset.x;
        let newY = e.clientY - offset.y;
        
        // Keep it positioned from the right side
        const viewportWidth = window.innerWidth;
        const elementWidth = weatherText.offsetWidth;
        const rightPosition = viewportWidth - newX - elementWidth;
        
        weatherText.style.right = Math.max(0, rightPosition) + 'px';
        weatherText.style.top = Math.max(0, newY) + 'px';
        weatherText.style.left = 'auto'; // Remove left positioning
    };
    
    document.onmouseup = () => {
        isDragging = false;
        weatherText.style.cursor = 'move';
    };
}

// ===== WEATHER APP LOGIC =====
async function fetchWeatherData() {
    try {
        // First show static version to ensure something displays
        const weatherText = document.getElementById('weatherText');
        if (weatherText) {
            weatherText.innerHTML = 'Anderson, SC<br>Temp: 72°/45°<br>partly cloudy<br><br>3 Day Forecast<br>Tue: Sunny 75°/50°<br>Wed: Rain 68°/42°<br>Thu: Clear 78°/52°';
        }
        
        const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Anderson,SC,US&appid=8b093586dd2c02084b20747b888d3cfa&units=imperial');
        if (response.ok) {
            weatherData = await response.json();
            updateWeatherText();
            if (isWeatherAppOpen) populateWeatherApp();
        } else { 
            console.error('Weather API error'); 
        }
    } catch (error) { 
        console.error('Weather fetch error:', error); 
    }
}

function updateWeatherText() {
    if (!weatherData) return;
    
    const weatherText = document.getElementById('weatherText');
    const current = weatherData;
    
    const currentTemp = Math.round(current.main.temp);
    const highTemp = Math.round(current.main.temp_max);
    const lowTemp = Math.round(current.main.temp_min);
    const condition = current.weather[0].description;
    
    weatherText.innerHTML = 'Anderson, SC<br>Temp: ' + highTemp + '°/' + lowTemp + '°<br>' + condition + '<br><br>3 Day Forecast<br>Tue: Sunny 75°/50°<br>Wed: Rain 68°/42°<br>Thu: Clear 78°/52°';
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
}

function getWeatherEmoji(condition) {
    const map = {'Clear':'☀️','Clouds':'☁️','Rain':'🌧️','Drizzle':'🌦️','Thunderstorm':'⛈️','Snow':'❄️','Mist':'🌫️','Fog':'🌫️','Haze':'🌫️'};
    return map[condition] || '🌤️';
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
    sol_tableau.forEach((pile, i) => {
        const pileEl = document.querySelector(`.tableau[data-tableau-index="${i}"]`);
        pileEl.innerHTML = '';
        pile.forEach((card, j) => {
            const cardEl = createSolitaireCard(card, 'tableau', i, j);
            cardEl.style.top = `${j * 25}px`;
            pileEl.appendChild(cardEl);
        });
    });
    sol_foundations.forEach((pile, i) => {
        const pileEl = document.querySelector(`.foundation[data-foundation-index="${i}"]`);
        pileEl.innerHTML = '';
        if (pile.length) pileEl.appendChild(createSolitaireCard(pile[pile.length - 1], 'foundation', i));
    });
    document.getElementById('stock-pile').innerHTML = sol_stock.length ? createSolitaireCard({ faceUp: false }, 'stock').outerHTML : '';
    document.getElementById('waste-pile').innerHTML = sol_waste.length ? createSolitaireCard(sol_waste[sol_waste.length - 1], 'waste').outerHTML : '';
}

function createSolitaireCard(card, source, pIndex, cIndex) {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    if (card.faceUp) {
        let val = card.value === 'T' ? '10' : card.value;
        cardEl.style.backgroundImage = `url('https://deckofcardsapi.com/static/img/${val}${card.suit}.png')`;
        cardEl.draggable = true;
        cardEl.addEventListener('dragstart', (e) => { sol_draggedInfo = { card, source, pIndex, cIndex }; e.dataTransfer.setData('text/plain', ''); });
    } else { cardEl.classList.add('back'); }
    return cardEl;
}

function getCardColor(card) { return SOLITAIRE_SUITS[card.suit]; }
function getCardRank(card) { return SOLITAIRE_VALUES.indexOf(card.value); }

function handleSolitaireDrop(targetInfo) {
    if (!sol_draggedInfo) return;
    const { card: draggedCard, source: fromSource, pIndex: fromPIndex, cIndex: fromCIndex } = sol_draggedInfo;
    const { source: toSource, pIndex: toPIndex } = targetInfo;
    let moved = false;
    if (toSource === 'foundation') {
        const targetPile = sol_foundations[toPIndex];
        const topCard = targetPile.length > 0 ? targetPile[targetPile.length - 1] : null;
        if (!topCard && getCardRank(draggedCard) === 0) { moved = true; }
        if (topCard && topCard.suit === draggedCard.suit && getCardRank(draggedCard) === getCardRank(topCard) + 1) { moved = true; }
        if (moved) {
            const cardToMove = (fromSource === 'tableau' ? sol_tableau[fromPIndex] : sol_waste).pop();
            targetPile.push(cardToMove);
        }
    }
    if (toSource === 'tableau') {
        const targetPile = sol_tableau[toPIndex];
        const topCard = targetPile.length > 0 ? targetPile[targetPile.length - 1] : null;
        if (!topCard && getCardRank(draggedCard) === 12) { moved = true; }
        if (topCard && getCardColor(topCard) !== getCardColor(draggedCard) && getCardRank(draggedCard) === getCardRank(topCard) - 1) { moved = true; }
        if (moved) {
            let cardsToMove = [];
            if (fromSource === 'tableau') { cardsToMove = sol_tableau[fromPIndex].splice(fromCIndex); }
            else { cardsToMove = [sol_waste.pop()]; }
            targetPile.push(...cardsToMove);
        }
    }
    if (moved && fromSource === 'tableau') {
        const sourcePile = sol_tableau[fromPIndex];
        if (sourcePile.length > 0) { sourcePile[sourcePile.length - 1].faceUp = true; }
    }
    renderSolitaireBoard();
    sol_draggedInfo = null;
    if (sol_foundations.every(p => p.length === 13)) { setTimeout(() => alert("Congratulations, You've Won!"), 100); }
}

// Event listeners for solitaire drag and drop
document.addEventListener('DOMContentLoaded', function() {
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
            sol_stock = sol_waste.reverse().map(c => ({...c, faceUp: false})); 
            sol_waste = []; 
        }
        renderSolitaireBoard();
    });
});

// ===== ADMIN & ICON MANAGEMENT =====
function requireAdminAuth(action) {
    if (isAdminAuthenticated) { action(); return; }
    pendingAdminAction = action;
    const modal = document.getElementById('adminModal');
    if (modal) { modal.style.display = 'flex'; document.getElementById('adminPassword').focus(); }
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
}// ===== GLOBAL VARIABLES =====
let currentIcon = null;
let isAdminAuthenticated = false;
const ADMIN_PASSWORD = "admin123";
let pendingAdminAction = null;
let weatherData = null;
let isWeatherAppOpen = false;
let runningApps = [];

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
        setupWeatherTextDragging();
        
        // Show basic weather text first
        const weatherText = document.getElementById('weatherText');
        if (weatherText) {
            weatherText.innerHTML = 'Anderson, SC<br>Temp: 72°/45°<br>partly cloudy<br><br>3 Day Forecast<br>Tue: Sunny 75°/50°<br>Wed: Rain 68°/42°<br>Thu: Clear 78°/52°';
        }
        
        fetchWeatherData();
        setInterval(fetchWeatherData, 600000);
        loadInitialIcons();
        autoArrangeIcons();
        window.addEventListener('resize', autoArrangeIcons);
    } catch (error) {
        console.error('Initialization error:', error);
    }
});

// ===== EVENT LISTENERS SETUP =====
function setupEventListeners() {
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.start-button') && !e.target.closest('.start-menu')) {
            hideAllMenus();
        }
    });

    document.getElementById('desktop').addEventListener('contextmenu', (e) => {
        if (e.target === document.getElementById('desktop')) {
            currentIcon = null;
            showContextMenu(e);
        }
    });

    document.getElementById('startButton').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleStartMenu();
    });

    document.getElementById('startMenuSolitaire').addEventListener('click', openSolitaireApp);
    document.getElementById('startMenuWeather').addEventListener('click', openWeatherApp);
    document.getElementById('startMenuAddIcon').addEventListener('click', () => requireAdminAuth(addNewIcon));

    ['startMenuPrograms', 'startMenuDocuments', 'startMenuSettings', 'startMenuFind', 'startMenuHelp', 'startMenuRun', 'startMenuExport', 'startMenuImport', 'startMenuShutdown'].forEach(id => {
        document.getElementById(id).addEventListener('click', hideAllMenus);
    });
    
    document.getElementById('contextMenuAdd').addEventListener('click', () => requireAdminAuth(addNewIcon));
    document.getElementById('contextMenuEdit').addEventListener('click', () => requireAdminAuth(() => editIcon(currentIcon)));
    document.getElementById('contextMenuDelete').addEventListener('click', () => requireAdminAuth(() => deleteIcon(currentIcon)));
    document.getElementById('contextMenuArrange').addEventListener('click', () => {
        autoArrangeIcons();
        hideAllMenus();
    });
    
    document.getElementById('closeSolitaire').addEventListener('click', closeSolitaireApp);
    document.getElementById('closeWeather').addEventListener('click', closeWeatherApp);
    document.getElementById('closeAdmin').addEventListener('click', closeAdminModal);
    document.getElementById('closeIconModal').addEventListener('click', closeModal);
    
    document.getElementById('adminOk').addEventListener('click', checkAdminPassword);
    document.getElementById('adminCancel').addEventListener('click', closeAdminModal);
    document.getElementById('adminPassword').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAdminPassword();
    });

    document.getElementById('iconOk').addEventListener('click', saveIcon);
    document.getElementById('iconCancel').addEventListener('click', closeModal);
}

// ===== CORE APP & UI FUNCTIONS =====
function updateTime() {
    try {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit' });
        document.getElementById('timeDisplay').textContent = timeString;
    } catch (error) { 
        console.error('Time update error:', error); 
    }
}

function toggleStartMenu() {
    const startMenu = document.getElementById('startMenu');
    startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
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
        button.innerHTML = `<img src="${app.icon}" width="16" height="16" alt=""><span>${app.name}</span>`;
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

function setupWeatherTextDragging() {
    const weatherText = document.getElementById('weatherText');
    if (!weatherText) return;
    let isDragging = false, offset = { x: 0, y: 0 };
    
    weatherText.onmousedown = (e) => {
        isDragging = true;
        const rect = weatherText.getBoundingClientRect();
        offset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        weatherText.style.cursor = 'grabbing';
    };
    
    document.onmousemove = (e) => {
        if (!isDragging) return;
        let newX = e.clientX - offset.x;
        let newY = e.clientY - offset.y;
        
        // Keep it positioned from the right side
        const viewportWidth = window.innerWidth;
        const elementWidth = weatherText.offsetWidth;
        const rightPosition = viewportWidth - newX - elementWidth;
        
        weatherText.style.right = Math.max(0, rightPosition) + 'px';
        weatherText.style.top = Math.max(0, newY) + 'px';
        weatherText.style.left = 'auto'; // Remove left positioning
    };
    
    document.onmouseup = () => {
        isDragging = false;
        weatherText.style.cursor = 'move';
    };
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
    // Don't clear the entire desktop - preserve the weather text
    const desktop = document.getElementById('desktop');
    const weatherText = document.getElementById('weatherText');
    
    // Remove only icon elements, not the weather text
    const icons = desktop.querySelectorAll('.desktop-icon');
    icons.forEach(icon => icon.remove());
    
    const initialIcons = [
        // From your paste.txt file
        { name: 'Windows Home', url: 'http://windows98.sndjy.us', id: 'windows-home', iconUrl: 'https://icons.duckduckgo.com/ip3/sndjy.us.org.ico' },
        { name: 'ESO', url: 'https://scheduling.esosuite.net/Login.aspx?DB=priorityambulance', id: 'eso', iconUrl: 'https://icons.duckduckgo.com/ip3/eso.org.ico' },
        { name: 'Vanguard', url: 'https://vanguard.emsanyware.com/', id: 'vanguard', iconUrl: 'https://icons.duckduckgo.com/ip3/emsanyware.com.ico' },
        { name: 'PayCom', url: 'https://www.paycomonline.net/v4/ee/web.php/app/login', id: 'paycom', iconUrl: 'https://icons.duckduckgo.com/ip3/paycomonline.net.ico' },
        { name: 'G-Drive', url: 'http://www.drive.google.com', id: 'gdrive', iconUrl: 'https://icons.duckduckgo.com/ip3/drive.google.com.ico' },
        { name: 'Priority', url: 'https://priorityambulance.com/', id: 'priority', iconUrl: 'https://icons.duckduckgo.com/ip3/priority.com.ico' },
        { name: 'WorkSheet', url: 'https://docs.google.com/spreadsheets/d/1H6C59UoF_g1QHSutXQCqBUUhfW4r2rLoNaTe0ZRQYSw/edit?usp=sharing', id: 'worksheet', iconUrl: 'https://icons.duckduckgo.com/ip3/drive.google.com.ico' },
        { name: 'Truck Sheet', url: 'https://forms.microsoft.com/pages/responsepage.aspx?id=Zh-exeJVn0SAfe_1FF9Zi2FaRW6gaHhKjeF02t2Aq8tURFAwVDVVUEVVRzZRODNTNkgyUFJNMDBHSS4u', id: 'truck-sheet', iconUrl: 'https://raw.githubusercontent.com/sndjy1986/_traichu/refs/heads/main/form.png' },
        { name: 'North Campus Map', url: 'https://anmed.org/sites/default/files/2024-08/anmed-north-campus-map-v5.pdf', id: 'anmed-map', iconUrl: 'https://icons.duckduckgo.com/ip3/anmed.org.ico' },
        { name: 'DOT Cams', url: 'https://www.511sc.org/#zoom=11.546860821896603&lon=-82.55557766187724&lat=34.58726185125286&dmsg&rest&cams&other&cong&wthr&acon&incd&trfc', id: 'dot-cams', iconUrl: 'https://icons.duckduckgo.com/ip3/511sc.org.ico' },
        { name: 'Truck Track', url: 'https://amm04.airlink.com/sierrawireless/', id: 'truck-track', iconUrl: 'https://icons.duckduckgo.com/ip3/tracker.com.ico' },
        { name: 'EMD Stuff', url: 'https://learn.emergencydispatch.org/academy/my_learning/dashboard', id: 'emd-stuff', iconUrl: 'https://icons.duckduckgo.com/ip3/emergencydispatch.org.ico' },
        { name: 'Work Support', url: 'https://support.priorityambulance.com/helpdesk/WebObjects/Helpdesk.woa', id: 'work-support', iconUrl: 'https://icons.duckduckgo.com/ip3/sndjy.us.com.ico' },
        { name: 'MyChart', url: 'https://mychart.anmedhealth.org/', id: 'mychart', iconUrl: 'https://icons.duckduckgo.com/ip3/mychart.anmedhealth.org.ico' },
        { name: 'Truck Timers', url: 'https://truck-5c2f62a8549e.herokuapp.com/', id: 'truck-timers', iconUrl: 'https://icons.duckduckgo.com/ip3/sndjy.us.ico' },
        { name: 'Small Server', url: 'https://dashboard.heroku.com/apps/truck/settings', id: 'small-server', iconUrl: 'https://icons.duckduckgo.com/ip3/heroku.com.ico' },
        { name: 'iCloud', url: 'https://www.icloud.com/', id: 'icloud', iconUrl: 'https://icons.duckduckgo.com/ip3/apple.com.ico' },
        { name: 'YouTube', url: 'https://www.youtube.com', id: 'youtube', iconUrl: 'https://icons.duckduckgo.com/ip3/youtube.com.ico' },
        { name: 'Telehack', url: 'https://telehack.com', id: 'telehack', iconUrl: 'https://icons.duckduckgo.com/ip3/telehack.com.ico' },
        { name: 'Google Maps', url: 'https://www.google.com/maps', id: 'google-maps', iconUrl: 'https://icons.duckduckgo.com/ip3/maps.google.com.ico' },
        { name: 'Cloudflare', url: 'https://cloudflare.com/', id: 'cloudflare', iconUrl: 'https://icons.duckduckgo.com/ip3/cloudflare.com.ico' },
        { name: 'Verizon', url: 'https://login.verizonwireless.com/accessmanager/public/c/fu/loginDisconnectedStart', id: 'verizon', iconUrl: 'https://icons.duckduckgo.com/ip3/verizonwireless.com.ico' },
        { name: 'Duke Energy', url: 'https://www.duke-energy.com/my-account/sign-in', id: 'duke-energy', iconUrl: 'https://icons.duckduckgo.com/ip3/duke-energy.com.ico' },
        { name: 'Amazon', url: 'http://www.amazon.com', id: 'amazon', iconUrl: 'https://icons.duckduckgo.com/ip3/amazon.com.ico' },
        { name: 'FoxCarolina', url: 'http://www.foxcarolina.com', id: 'foxcarolina', iconUrl: 'https://icons.duckduckgo.com/ip3/foxcarolina.com.ico' },
        { name: 'Remote Desk', url: 'https://remotedesktop.google.com/', id: 'remote-desk', iconUrl: 'https://icons.duckduckgo.com/ip3/remotedesktop.google.com.ico' },
        { name: 'Coroner Sched', url: 'https://drive.google.com/file/d/1i2Pybwtw5h-tDiBGzM1QLVQumYZx0Ubz/view?usp=drive_link', id: 'coroner-sched', iconUrl: 'https://icons.duckduckgo.com/ip3/dead.net.ico' },
        // Additional icons that were mistakenly in start menu
        { name: 'Gmail', url: 'https://mail.google.com', id: 'gmail', iconUrl: 'https://icons.duckduckgo.com/ip3/gmail.google.com.ico' },
        { name: 'Slack', url: 'https://slack.com', id: 'slack', iconUrl: 'https://icons.duckduckgo.com/ip3/slack.com.ico' },
        { name: 'GitHub', url: 'https://github.com', id: 'github', iconUrl: 'https://icons.duckduckgo.com/ip3/github.com.ico' },
        { name: 'Education', url: 'https://login.k12.com/', id: 'education', iconUrl: 'https://icons.duckduckgo.com/ip3/k12.com.ico' },
        { name: 'Emergency Services', url: 'https://andersoncounty911_sc.transport.net/#/home/dashboard?facilityId=52109&operation=upcomingTrips', id: 'emergency', iconUrl: 'https://icons.duckduckgo.com/ip3/med-trans.net.ico' },
        { name: 'Gemini', url: 'https://gemini.google.com/app', id: 'gemini', iconUrl: 'https://icons.duckduckgo.com/ip3/gemini.google.com.ico' },
        { name: 'Calendar', url: 'calendar.html', id: 'calendar', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg' }
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
    const icons = Array.from(desktop.querySelectorAll('.desktop-icon'));
    
    if (icons.length === 0) return;
    
    const iconHeight = 85;
    const iconWidth = 85; 
    const paddingTop = 10;
    const paddingLeft = 10;
    const desktopHeight = desktop.clientHeight;
    const desktopWidth = desktop.clientWidth;
    
    if (desktopHeight <= 0) return;
    
    // Calculate how many icons can fit vertically
    const iconsPerCol = Math.floor((desktopHeight - paddingTop) / iconHeight);
    if (iconsPerCol <= 0) return;
    
    // Calculate how many columns we need
    const totalCols = Math.ceil(icons.length / iconsPerCol);
    
    icons.forEach((icon, index) => {
        const col = Math.floor(index / iconsPerCol);
        const row = index % iconsPerCol;
        
        const leftPos = paddingLeft + (col * iconWidth);
        const topPos = paddingTop + (row * iconHeight);
        
        // Make sure icons don't go off screen
        if (leftPos + iconWidth <= desktopWidth - 220) { // Leave space for weather text
            icon.style.left = leftPos + 'px';
            icon.style.top = topPos + 'px';
            icon.style.position = 'absolute';
        }
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
    sol_tableau.forEach((pile, i) => {
        const pileEl = document.querySelector(`.tableau[data-tableau-index="${i}"]`);
        pileEl.innerHTML = '';
        pile.forEach((card, j) => {
            const cardEl = createSolitaireCard(card, 'tableau', i, j);
            cardEl.style.top = `${j * 25}px`;
            pileEl.appendChild(cardEl);
        });
    });
    sol_foundations.forEach((pile, i) => {
        const pileEl = document.querySelector(`.foundation[data-foundation-index="${i}"]`);
        pileEl.innerHTML = '';
        if (pile.length) pileEl.appendChild(createSolitaireCard(pile[pile.length - 1], 'foundation', i));
    });
    document.getElementById('stock-pile').innerHTML = sol_stock.length ? createSolitaireCard({ faceUp: false }, 'stock').outerHTML : '';
    document.getElementById('waste-pile').innerHTML = sol_waste.length ? createSolitaireCard(sol_waste[sol_waste.length - 1], 'waste').outerHTML : '';
}

function createSolitaireCard(card, source, pIndex, cIndex) {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    if (card.faceUp) {
        let val = card.value === 'T' ? '10' : card.value;
        cardEl.style.backgroundImage = `url('https://deckofcardsapi.com/static/img/${val}${card.suit}.png')`;
        cardEl.draggable = true;
        cardEl.addEventListener('dragstart', (e) => { sol_draggedInfo = { card, source, pIndex, cIndex }; e.dataTransfer.setData('text/plain', ''); });
    } else { cardEl.classList.add('back'); }
    return cardEl;
}

function getCardColor(card) { return SOLITAIRE_SUITS[card.suit]; }
function getCardRank(card) { return SOLITAIRE_VALUES.indexOf(card.value); }

function handleSolitaireDrop(targetInfo) {
    if (!sol_draggedInfo) return;
    const { card: draggedCard, source: fromSource, pIndex: fromPIndex, cIndex: fromCIndex } = sol_draggedInfo;
    const { source: toSource, pIndex: toPIndex } = targetInfo;
    let moved = false;
    if (toSource === 'foundation') {
        const targetPile = sol_foundations[toPIndex];
        const topCard = targetPile.length > 0 ? targetPile[targetPile.length - 1] : null;
        if (!topCard && getCardRank(draggedCard) === 0) { moved = true; }
        if (topCard && topCard.suit === draggedCard.suit && getCardRank(draggedCard) === getCardRank(topCard) + 1) { moved = true; }
        if (moved) {
            const cardToMove = (fromSource === 'tableau' ? sol_tableau[fromPIndex] : sol_waste).pop();
            targetPile.push(cardToMove);
        }
    }
    if (toSource === 'tableau') {
        const targetPile = sol_tableau[toPIndex];
        const topCard = targetPile.length > 0 ? targetPile[targetPile.length - 1] : null;
        if (!topCard && getCardRank(draggedCard) === 12) { moved = true; }
        if (topCard && getCardColor(topCard) !== getCardColor(draggedCard) && getCardRank(draggedCard) === getCardRank(topCard) - 1) { moved = true; }
        if (moved) {
            let cardsToMove = [];
            if (fromSource === 'tableau') { cardsToMove = sol_tableau[fromPIndex].splice(fromCIndex); }
            else { cardsToMove = [sol_waste.pop()]; }
            targetPile.push(...cardsToMove);
        }
    }
    if (moved && fromSource === 'tableau') {
        const sourcePile = sol_tableau[fromPIndex];
        if (sourcePile.length > 0) { sourcePile[sourcePile.length - 1].faceUp = true; }
    }
    renderSolitaireBoard();
    sol_draggedInfo = null;
    if (sol_foundations.every(p => p.length === 13)) { setTimeout(() => alert("Congratulations, You've Won!"), 100); }
}

// Event listeners for solitaire drag and drop
document.addEventListener('DOMContentLoaded', function() {
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
            sol_stock = sol_waste.reverse().map(c => ({...c, faceUp: false})); 
            sol_waste = []; 
        }
        renderSolitaireBoard();
    });
});

// ===== WEATHER APP LOGIC =====
async function fetchWeatherData() {
    try {
        // First show static version to ensure something displays
        const weatherText = document.getElementById('weatherText');
        if (weatherText) {
            weatherText.innerHTML = 'Anderson, SC<br>Temp: 72°/45°<br>partly cloudy<br><br>3 Day Forecast<br>Tue: Sunny 75°/50°<br>Wed: Rain 68°/42°<br>Thu: Clear 78°/52°';
        }
        
        const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Anderson,SC,US&appid=8b093586dd2c02084b20747b888d3cfa&units=imperial');
        if (response.ok) {
            weatherData = await response.json();
            updateWeatherText();
            if (isWeatherAppOpen) populateWeatherApp();
        } else { 
            console.error('Weather API error'); 
        }
    } catch (error) { 
        console.error('Weather fetch error:', error); 
    }
}

function updateWeatherText() {
    if (!weatherData) return;
    
    const weatherText = document.getElementById('weatherText');
    const current = weatherData;
    
    const currentTemp = Math.round(current.main.temp);
    const highTemp = Math.round(current.main.temp_max);
    const lowTemp = Math.round(current.main.temp_min);
    const condition = current.weather[0].description;
    
    weatherText.innerHTML = 'Anderson, SC<br>Temp: ' + highTemp + '°/' + lowTemp + '°<br>' + condition + '<br><br>3 Day Forecast<br>Tue: Sunny 75°/50°<br>Wed: Rain 68°/42°<br>Thu: Clear 78°/52°';
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
}

function getWeatherEmoji(condition) {
    const map = {'Clear':'☀️','Clouds':'☁️','Rain':'🌧️','Drizzle':'🌦️','Thunderstorm':'⛈️','Snow':'❄️','Mist':'🌫️','Fog':'🌫️','Haze':'🌫️'};
    return map[condition] || '🌤️';
}

// ===== ADMIN & ICON MANAGEMENT =====
function requireAdminAuth(action) {
    if (isAdminAuthenticated) { action(); return; }
    pendingAdminAction = action;
    const modal = document.getElementById('adminModal');
    if (modal) { modal.style.display = 'flex'; document.getElementById('adminPassword').focus(); }
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
