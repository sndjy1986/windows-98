// ===== GLOBAL VARIABLES =====
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
        const timeString = now.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit' });
        const timeDisplay = document.getElementById('timeDisplay');
        if (timeDisplay) timeDisplay.textContent = timeString;
    } catch (error) {
        console.error('Time update error:', error);
    }
}

function toggleStartMenu() {
    const startMenu = document.getElementById('startMenu');
    if (startMenu) startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
}

function hideAllMenus() {
    const startMenu = document.getElementById('startMenu');
    if (startMenu) startMenu.style.display = 'none';
    const contextMenu = document.getElementById('contextMenu');
    if(contextMenu) contextMenu.style.display = 'none';
}

function addAppToTaskbar(appId, appName, iconUrl, focusHandler) {
    if (runningApps.find(app => app.id === appId)) {
        if (focusHandler) focusHandler();
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
    const container = document.getElementById('runningApps');
    container.innerHTML = '';
    runningApps.forEach(app => {
        const button = document.createElement('button');
        button.className = 'app-button';
        if (app.handler) button.onclick = app.handler;
        button.innerHTML = `<img src="${app.icon}" width="16" height="16"><span>${app.name}</span>`;
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
        const maxX = window.innerWidth - modal.offsetWidth;
        const maxY = window.innerHeight - modal.offsetHeight;
        modal.style.left = `${Math.max(0, Math.min(newX, maxX))}px`;
        modal.style.top = `${Math.max(0, Math.min(newY, maxY))}px`;
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
             const startMenu = document.getElementById('startMenu');
            if (startMenu) startMenu.style.display = 'none';
        }
        if (!e.target.closest('.desktop-icon') && !e.target.closest('.context-menu')) {
            const contextMenu = document.getElementById('contextMenu');
            if (contextMenu) contextMenu.style.display = 'none';
        }
    });
    const desktop = document.getElementById('desktop');
    if (desktop) desktop.addEventListener('contextmenu', (e) => {
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
    document.getElementById('desktop').innerHTML = '';
    const initialIcons = [
        { name: 'PayCom Online', url: 'https://www.paycomonline.net/v4/ee/web.php/app/login', id: 'paycom', iconUrl: 'https://icons.duckduckgo.com/ip3/paycomonline.net.ico' },
        { name: 'Slack', url: 'https://slack.com/', id: 'slack', iconUrl: 'https://icons.duckduckgo.com/ip3/slack.com.ico' },
        { name: 'Lifeflight OLS', url: 'https://andersoncounty911_sc.transport.net/#/home/dashboard?facilityId=52109&operation=upcomingTrips', id: 'lifeflight', iconUrl: 'https://icons.duckduckgo.com/ip3/med-trans.net.ico' },
        { name: 'IAED EMD', url: 'https://learn.emergencydispatch.org/academy/my_learning/dashboard', id: 'iaed', iconUrl: 'https://icons.duckduckgo.com/ip3/emergencydispatch.org.ico' },
        { name: 'Vanguard', url: 'https://vanguard.emsanyware.com/', id: 'vanguard', iconUrl: 'https://icons.duckduckgo.com/ip3/emsanyware.com.ico' },
        { name: 'Priority Ambulance', url: 'https://priorityambulance.com/', id: 'priority', iconUrl: 'https://icons.duckduckgo.com/ip3/priority.com.ico' },
        { name: 'Daily Truck Form', url: 'https://forms.microsoft.com/pages/responsepage.aspx?id=Zh-exeJVn0SAfe_1FF9Zi2FaRW6gaHhKjeF02t2Aq8tURFAwVDVVUEVVRzZRODNTNkgyUFJNMDBHSS4u', id: 'truck-form', iconUrl: 'https://raw.githubusercontent.com/sndjy1986/_traichu/refs/heads/main/form.png' },
        { name: 'North Campus Map', url: 'https://anmed.org/sites/default/files/2024-08/anmed-north-campus-map-v5.pdf', id: 'anmed-map', iconUrl: 'https://icons.duckduckgo.com/ip3/anmed.org.ico' },
        { name: 'SC DOT Camera\'s', url: 'https://www.511sc.org/#zoom=11.546860821896603&lon=-82.55557766187724&lat=34.58726185125286&dmsg&rest&cams&other&cong&wthr&acon&incd&trfc', id: 'scdot', iconUrl: 'https://icons.duckduckgo.com/ip3/511sc.org.ico' },
        { name: 'Saved Reports', url: 'https://drive.google.com/drive/folders/1Qzn_8PrPBanI6P5IC9Jovt3qDSLiJH9v?usp=drive_link', id: 'saved-reports', iconUrl: 'https://raw.githubusercontent.com/sndjy1986/windows-98/refs/heads/main/folder.png' },
        { name: 'Priority Support', url: 'https://support.priorityambulance.com/helpdesk/WebObjects/Helpdesk.woa', id: 'priority-support', iconUrl: 'https://raw.githubusercontent.com/sndjy1986/_traichu/refs/heads/main/support.JPG' },
        { name: 'Google Voice', url: 'https://voice.google.com/u/0/messages', id: 'gvoice', iconUrl: 'https://icons.duckduckgo.com/ip3/voice.google.com.ico' }
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
        <img src="${iconData.iconUrl}" alt="${iconData.name}" onerror="this.src='https://win98icons.alexmeub.com/icons/png/file_lines-0.png';">
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

function handleResize() {
    isMobile = window.innerWidth <= 768;
    autoArrangeIcons();
}

// ===== SOLITAIRE GAME LOGIC =====
const SOLITAIRE_SUITS = ["H", "D", "C", "S"], SOLITAIRE_VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"];
let sol_stock = [], sol_waste = [], sol_foundations = [[], [], [], []], sol_tableau = [[], [], [], [], [], [], []];
let sol_draggedInfo = null;

function openSolitaireApp() {
    const modal = document.getElementById('solitaireModal');
    if (modal.style.display === 'flex') return;
    modal.style.display = 'flex';
    addAppToTaskbar('solitaire', 'Solitaire', 'https://win98icons.alexmeub.com/icons/png/card_deck.png', () => modal.style.display = 'flex');
    initSolitaire();
}

function closeSolitaireApp() {
    document.getElementById('solitaireModal').style.display = 'none';
    removeAppFromTaskbar('solitaire');
}

function initSolitaire() {
    sol_stock = [], sol_waste = [], sol_foundations = Array(4).fill().map(() => []), sol_tableau = Array(7).fill().map(() => []);
    const deck = SOLITAIRE_SUITS.flatMap(s => SOLITAIRE_VALUES.map(v => ({ suit: s, value: v, faceUp: false }))).sort(() => Math.random() - 0.5);
    for (let i = 0; i < 7; i++) for (let j = i; j < 7; j++) sol_tableau[j].push(deck.pop());
    sol_tableau.forEach(p => { if (p.length) p[p.length - 1].faceUp = true; });
    sol_stock = deck;
    renderSolitaireBoard();
}

function renderSolitaireBoard() {
    sol_tableau.forEach((p, i) => {
        const pe = document.querySelector(`.tableau[data-tableau-index="${i}"]`);
        pe.innerHTML = '';
        p.forEach((c, j) => {
            const ce = createSolitaireCard(c, 'tableau', i, j);
            ce.style.top = `${j * 20}px`;
            pe.appendChild(ce);
        });
    });
    sol_foundations.forEach((p, i) => {
        const pe = document.querySelector(`.foundation[data-foundation-index="${i}"]`);
        pe.innerHTML = '';
        if (p.length) pe.appendChild(createSolitaireCard(p[p.length - 1], 'foundation', i));
    });
    const stockEl = document.getElementById('stock-pile');
    stockEl.innerHTML = '';
    if (sol_stock.length) stockEl.appendChild(createSolitaireCard({ faceUp: false }, 'stock'));
    const wasteEl = document.getElementById('waste-pile');
    wasteEl.innerHTML = '';
    if (sol_waste.length) wasteEl.appendChild(createSolitaireCard(sol_waste[sol_waste.length - 1], 'waste'));
}

function createSolitaireCard(card, source, pIndex = -1, cIndex = -1) {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    if (card.faceUp) {
        let val = card.value === 'T' ? '10' : card.value;
        cardEl.style.backgroundImage = `url('https://deckofcardsapi.com/static/img/${val}${card.suit}.png')`;
        cardEl.draggable = true;
        cardEl.addEventListener('dragstart', (e) => { sol_draggedInfo = { card, source, pIndex, cIndex }; e.dataTransfer.setData('text/plain', ''); });
    } else {
        cardEl.classList.add('back');
    }
    return cardEl;
}

document.querySelectorAll('.pile').forEach(p => {
    p.addEventListener('dragover', e => e.preventDefault());
    p.addEventListener('drop', e => {
        e.preventDefault();
        const tClass = e.currentTarget.classList;
        let tInfo = {};
        if(tClass.contains('tableau')) tInfo = { source: 'tableau', pIndex: parseInt(e.currentTarget.dataset.tableauIndex) };
        if(tClass.contains('foundation')) tInfo = { source: 'foundation', pIndex: parseInt(e.currentTarget.dataset.foundationIndex) };
        if(sol_draggedInfo && tInfo.source) handleSolitaireDrop(tInfo);
    });
});

function handleSolitaireDrop(targetInfo) { console.log("Card dropped on:", targetInfo); renderSolitaireBoard(); sol_draggedInfo = null; }

document.getElementById('stock-pile').addEventListener('click', () => {
    if (sol_stock.length > 0) { const card = sol_stock.pop(); card.faceUp = true; sol_waste.push(card); }
    else if (sol_waste.length > 0) { sol_stock = sol_waste.reverse().map(c => ({...c, faceUp: false})); sol_waste = []; }
    renderSolitaireBoard();
});

// ===== WEATHER APP =====
async function fetchWeatherData() {
    try {
        const currentResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${WEATHER_LOCATION}&appid=${WEATHER_API_KEY}&units=imperial`);
        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${WEATHER_LOCATION}&appid=${WEATHER_API_KEY}&units=imperial`);
        if (currentResponse.ok && forecastResponse.ok) {
            weatherData = { current: await currentResponse.json(), forecast: await forecastResponse.json() };
            if (isWeatherAppOpen) populateWeatherApp();
        } else { console.error('Weather API error'); }
    } catch (error) { console.error('Weather fetch error:', error); }
}

function openWeatherApp() {
    const modal = document.getElementById('weatherModal');
    if (modal.style.display === 'flex') return;
    isWeatherAppOpen = true;
    modal.style.display = 'flex';
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
    document.getElementById('currentLocation').textContent = `${weatherData.current.name}, ${weatherData.current.sys.country}`;
    document.getElementById('currentWeatherIcon').textContent = getWeatherEmoji(weatherData.current.weather[0].main);
    document.getElementById('currentTemp').textContent = `${Math.round(weatherData.current.main.temp)}°F`;
    document.getElementById('currentCondition').textContent = weatherData.current.weather[0].description;
    document.getElementById('feelsLike').textContent = `${Math.round(weatherData.current.main.feels_like)}°F`;
    document.getElementById('humidity').textContent = `${weatherData.current.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${Math.round(weatherData.current.wind.speed)} mph`;
    document.getElementById('pressure').textContent = `${weatherData.current.main.pressure} mb`;
    populateForecast(weatherData.forecast);
}

function populateForecast(forecastData) {
    const container = document.getElementById('forecastContainer');
    container.innerHTML = '';
    const dailyForecasts = {};
    const today = new Date(); today.setHours(0, 0, 0, 0);
    forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const daysDiff = Math.floor((date - today) / (1000 * 60 * 60 * 24));
        if (daysDiff > 0 && daysDiff <= 3) {
            const dateKey = date.toDateString();
            if (!dailyForecasts[dateKey] || Math.abs(date.getHours() - 12) < Math.abs(new Date(dailyForecasts[dateKey].dt * 1000).getHours() - 12)) {
                dailyForecasts[dateKey] = item;
            }
        }
    });
    Object.values(dailyForecasts).sort((a, b) => a.dt - b.dt).slice(0, 3).forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const forecastDiv = document.createElement('div');
        forecastDiv.className = 'forecast-day';
        forecastDiv.innerHTML = `
            <div class="forecast-day-name">${dayName}</div><div style="font-size: 9px; color: #666; margin-bottom: 3px;">${monthDay}</div>
            <div class="forecast-icon">${getWeatherEmoji(day.weather[0].main)}</div><div class="forecast-temps">
            <div class="forecast-high">${Math.round(day.main.temp_max)}°</div><div class="forecast-low">${Math.round(day.main.temp_min)}°</div></div>
            <div style="font-size: 9px; color: #666; margin-top: 3px; text-align: center;">${day.weather[0].description}</div>`;
        container.appendChild(forecastDiv);
    });
}

function getWeatherEmoji(condition) {
    const map = {'Clear':'☀️','Clouds':'☁️','Rain':'🌧️','Drizzle':'🌦️','Thunderstorm':'⛈️','Snow':'❄️','Mist':'🌫️','Fog':'🌫️','Haze':'🌫️'};
    return map[condition] || '🌤️';
}

// ===== ADMIN & ICON EDIT =====
function requireAdminAuth(action) {
    if (isAdminAuthenticated) { action(); return; }
    pendingAdminAction = action;
    const modal = document.getElementById('adminModal');
    if (modal) {
        modal.style.display = 'flex';
        const passField = document.getElementById('adminPassword');
        if (passField) passField.focus();
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
    const passField = document.getElementById('adminPassword');
    if (passField) passField.value = '';
}

function addNewIcon() {
    currentIcon = null;
    const modal = document.getElementById('iconModal');
    document.getElementById('modalTitle').textContent = 'Add New Icon';
    document.getElementById('iconName').value = '';
    document.getElementById('iconUrl').value = '';
    document.getElementById('iconEmoji').value = '🖥️';
    if(modal) modal.style.display = 'flex';
    hideAllMenus();
}

function editIcon(icon) {
    if (!icon) return;
    currentIcon = icon;
    const modal = document.getElementById('iconModal');
    document.getElementById('modalTitle').textContent = 'Edit Icon';
    document.getElementById('iconName').value = icon.querySelector('span').textContent;
    document.getElementById('iconUrl').value = icon.dataset.url;
    // This part assumes a more complex createIconElement, for simplicity we'll leave it as is
    // document.getElementById('iconEmoji').value = ...; 
    if(modal) modal.style.display = 'flex';
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
    const modal = document.getElementById('iconModal');
    if(modal) modal.style.display = 'none';
}

function saveIcon() {
    const name = document.getElementById('iconName').value.trim();
    const url = document.getElementById('iconUrl').value.trim();
    // const emoji = document.getElementById('iconEmoji').value; // For future enhancement
    if (!name || !url) { alert('Please fill in all fields.'); return; }

    if (currentIcon) {
        // Edit logic
    } else {
        const newIconData = { name, url, id: `custom-${Date.now()}`, iconUrl: `https://icons.duckduckgo.com/ip3/${new URL(url).hostname}.ico` };
        createIconElement(newIconData);
        autoArrangeIcons();
    }
    closeModal();
}
