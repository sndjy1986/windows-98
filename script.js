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
        setupSolitaireDragDrop();
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
        const timeString = now.toLocaleTimeString('en-US', { 
            hour12: true, 
            hour: 'numeric', 
            minute: '2-digit' 
        });
        const timeDisplay = document.getElementById('timeDisplay');
        if (timeDisplay) timeDisplay.textContent = timeString;
    } catch (error) {
        console.error('Time update error:', error);
    }
}

function toggleStartMenu() {
    const startMenu = document.getElementById('startMenu');
    if (startMenu) {
        startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
    }
}

function hideAllMenus() {
    const startMenu = document.getElementById('startMenu');
    if (startMenu) startMenu.style.display = 'none';
    const contextMenu = document.getElementById('contextMenu');
    if (contextMenu) contextMenu.style.display = 'none';
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
    if (!container) return;
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
    
    let isDragging = false;
    let offset = { x: 0, y: 0 };
    
    const startDrag = (e) => {
        if (e.target.classList.contains('modal-close')) return;
        isDragging = true;
        offset = { 
            x: e.clientX - modal.offsetLeft, 
            y: e.clientY - modal.offsetTop 
        };
        header.style.cursor = 'grabbing';
        e.preventDefault();
    };
    
    const doDrag = (e) => {
        if (!isDragging) return;
        let newX = e.clientX - offset.x;
        let newY = e.clientY - offset.y;
        const maxX = window.innerWidth - modal.offsetWidth;
        const maxY = window.innerHeight - modal.offsetHeight;
        modal.style.left = `${Math.max(0, Math.min(newX, maxX))}px`;
        modal.style.top = `${Math.max(0, Math.min(newY, maxY))}px`;
    };
    
    const endDrag = () => {
        if (isDragging) {
            isDragging = false;
            header.style.cursor = 'move';
        }
    };
    
    header.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', endDrag);
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
    if (desktop) {
        desktop.addEventListener('contextmenu', (e) => {
            if (e.target === desktop) {
                e.preventDefault();
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
    if (!contextMenu) return;
    contextMenu.style.display = 'block';
    contextMenu.style.left = `${e.clientX}px`;
    contextMenu.style.top = `${e.clientY}px`;
}

// ===== ICON MANAGEMENT =====
function loadInitialIcons() {
    const desktop = document.getElementById('desktop');
    if (!desktop) return;
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
        { name: 'SC DOT Cameras', url: 'https://www.511sc.org/#zoom=11.546860821896603&lon=-82.55557766187724&lat=34.58726185125286&dmsg&rest&cams&other&cong&wthr&acon&incd&trfc', id: 'scdot', iconUrl: 'https://icons.duckduckgo.com/ip3/511sc.org.ico' },
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
    if (!desktop) return;
    const icons = Array.from(desktop.children);
    const iconHeight = 85;
    const iconWidth = 85;
    const paddingTop = 10;
    const paddingLeft = 10;
    
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
const SOLITAIRE_SUITS = ["H", "D", "C", "S"];
const SOLITAIRE_VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"];
let sol_stock = [];
let sol_waste = [];
let sol_foundations = [[], [], [], []];
let sol_tableau = [[], [], [], [], [], [], []];
let sol_draggedInfo = null;

function openSolitaireApp() {
    hideAllMenus();
    const modal = document.getElementById('solitaireModal');
    if (!modal) return;
    if (modal.style.display === 'block') return;
    modal.style.display = 'block';
    addAppToTaskbar('solitaire', 'Solitaire', 'https://win98icons.alexmeub.com/icons/png/card_deck.png', () => {
        modal.style.display = 'block';
    });
    initSolitaire();
}

function closeSolitaireApp() {
    const modal = document.getElementById('solitaireModal');
    if (modal) modal.style.display = 'none';
    removeAppFromTaskbar('solitaire');
}

function initSolitaire() {
    sol_stock = [];
    sol_waste = [];
    sol_foundations = [[], [], [], []];
    sol_tableau = [[], [], [], [], [], [], []];
    
    const deck = [];
    for (let suit of SOLITAIRE_SUITS) {
        for (let value of SOLITAIRE_VALUES) {
            deck.push({ suit: suit, value: value, faceUp: false });
        }
    }
    
    // Shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    
    // Deal to tableau
    for (let i = 0; i < 7; i++) {
        for (let j = i; j < 7; j++) {
            sol_tableau[j].push(deck.pop());
        }
    }
    
    // Flip top cards
    sol_tableau.forEach(pile => {
        if (pile.length > 0) {
            pile[pile.length - 1].faceUp = true;
        }
    });
    
    sol_stock = deck;
    renderSolitaireBoard();
}

function renderSolitaireBoard() {
    // Render tableau
    sol_tableau.forEach((pile, i) => {
        const pileEl = document.querySelector(`.tableau[data-tableau-index="${i}"]`);
        if (!pileEl) return;
        pileEl.innerHTML = '';
        pile.forEach((card, j) => {
            const cardEl = createSolitaireCard(card, 'tableau', i, j);
            cardEl.style.top = `${j * 20}px`;
            pileEl.appendChild(cardEl);
        });
    });
    
    // Render foundations
    sol_foundations.forEach((pile, i) => {
        const pileEl = document.querySelector(`.foundation[data-foundation-index="${i}"]`);
        if (!pileEl) return;
        pileEl.innerHTML = '';
        if (pile.length > 0) {
            pileEl.appendChild(createSolitaireCard(pile[pile.length - 1], 'foundation', i));
        }
    });
    
    // Render stock
    const stockEl = document.getElementById('stock-pile');
    if (stockEl) {
        stockEl.innerHTML = '';
        if (sol_stock.length > 0) {
            const stockCard = createSolitaireCard({ faceUp: false }, 'stock');
            stockCard.addEventListener('click', handleStockClick);
            stockEl.appendChild(stockCard);
        }
    }
    
    // Render waste
    const wasteEl = document.getElementById('waste-pile');
    if (wasteEl) {
        wasteEl.innerHTML = '';
        if (sol_waste.length > 0) {
            wasteEl.appendChild(createSolitaireCard(sol_waste[sol_waste.length - 1], 'waste'));
        }
    }
}

function createSolitaireCard(card, source, pileIndex = -1, cardIndex = -1) {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    
    if (card.faceUp) {
        let val = card.value === 'T' ? '10' : card.value;
        cardEl.style.backgroundImage = `url('https://deckofcardsapi.com/static/img/${val}${card.suit}.png')`;
        cardEl.draggable = true;
        cardEl.addEventListener('dragstart', (e) => {
            sol_draggedInfo = { card, source, pileIndex, cardIndex };
            e.dataTransfer.setData('text/plain', '');
        });
    } else {
        cardEl.classList.add('back');
    }
    
    return cardEl;
}

function handleStockClick() {
    if (sol_stock.length > 0) {
        const card = sol_stock.pop();
        card.faceUp = true;
        sol_waste.push(card);
    } else if (sol_waste.length > 0) {
        sol_stock = sol_waste.reverse().map(c => ({...c, faceUp: false}));
        sol_waste = [];
    }
    renderSolitaireBoard();
}

function setupSolitaireDragDrop() {
    document.querySelectorAll('.pile').forEach(pile => {
        pile.addEventListener('dragover', e => e.preventDefault());
        pile.addEventListener('drop', e => {
            e.preventDefault();
            const targetClass = e.currentTarget.classList;
            let targetInfo = {};
            
            if (targetClass.contains('tableau')) {
                targetInfo = { 
                    source: 'tableau', 
                    pileIndex: parseInt(e.currentTarget.dataset.tableauIndex) 
                };
            }
            if (targetClass.contains('foundation')) {
                targetInfo = { 
                    source: 'foundation', 
                    pileIndex: parseInt(e.currentTarget.dataset.foundationIndex) 
                };
            }
            
            if (sol_draggedInfo && targetInfo.source) {
                handleSolitaireDrop(targetInfo);
            }
        });
    });
}

function handleSolitaireDrop(targetInfo) {
    // Simple drop logic - to be expanded
    console.log("Card dropped on:", targetInfo);
    renderSolitaireBoard();
    sol_draggedInfo = null;
}

// ===== WEATHER APP =====
async function fetchWeatherData() {
    try {
        const currentResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${WEATHER_LOCATION}&appid=${WEATHER_API_KEY}&units=imperial`
        );
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${WEATHER_LOCATION}&appid=${WEATHER_API_KEY}&units=imperial`
        );
        
        if (currentResponse.ok && forecastResponse.ok) {
            weatherData = {
                current: await currentResponse.json(),
                forecast: await forecastResponse.json()
            };
            if (isWeatherAppOpen) {
                populateWeatherApp();
            }
        } else {
            console.error('Weather API error');
        }
    } catch (error) {
        console.error('Weather fetch error:', error);
    }
}

function openWeatherApp() {
    hideAllMenus();
    const modal = document.getElementById('weatherModal');
    if (!modal) return;
    if (modal.style.display === 'block') return;
    
    isWeatherAppOpen = true;
    modal.style.display = 'block';
    addAppToTaskbar('weather', 'Weather', 'https://win98icons.alexmeub.com/icons/png/weather-2.png', () => {
        modal.style.display = 'block';
    });
    
    const loadingEl = document.getElementById('weatherLoading');
    const contentEl = document.getElementById('weatherContent');
    
    if (weatherData) {
        populateWeatherApp();
        if (loadingEl) loadingEl.style.display = 'none';
        if (contentEl) contentEl.style.display = 'block';
    } else {
        if (loadingEl) loadingEl.style.display = 'block';
        if (contentEl) contentEl.style.display = 'none';
    }
}

function closeWeatherApp() {
    isWeatherAppOpen = false;
    const modal = document.getElementById('weatherModal');
    if (modal) modal.style.display = 'none';
    removeAppFromTaskbar('weather');
}

function populateWeatherApp() {
    if (!weatherData) return;
    
    const elements = {
        location: document.getElementById('currentLocation'),
        icon: document.getElementById('currentWeatherIcon'),
        temp: document.getElementById('currentTemp'),
        condition: document.getElementById('currentCondition'),
        feelsLike: document.getElementById('feelsLike'),
        humidity: document.getElementById('humidity'),
        windSpeed: document.getElementById('windSpeed'),
        pressure: document.getElementById('pressure')
    };
    
    if (elements.location) {
        elements.location.textContent = `${weatherData.current.name}, ${weatherData.current.sys.country}`;
    }
    if (elements.icon) {
        elements.icon.textContent = getWeatherEmoji(weatherData.current.weather[0].main);
    }
    if (elements.temp) {
        elements.temp.textContent = `${Math.round(weatherData.current.main.temp)}°F`;
    }
    if (elements.condition) {
        elements.condition.textContent = weatherData.current.weather[0].description;
    }
    if (elements.feelsLike) {
        elements.feelsLike.textContent = `${Math.round(weatherData.current.main.feels_like)}°F`;
    }
    if (elements.humidity) {
        elements.humidity.textContent = `${weatherData.current.main.humidity}%`;
    }
    if (elements.windSpeed) {
        elements.windSpeed.textContent = `${Math.round(weatherData.current.wind.speed)} mph`;
    }
    if (elements.pressure) {
        elements.pressure.textContent = `${weatherData.current.main.pressure} mb`;
    }
    
    if (weatherData.forecast) {
        populateForecast(weatherData.forecast);
    }
    
    // Show content after populating
    const loadingEl = document.getElementById('weatherLoading');
    const contentEl = document.getElementById('weatherContent');
    if (loadingEl) loadingEl.style.display = 'none';
    if (contentEl) contentEl.style.display = 'block';
}

function populateForecast(forecastData) {
    const container = document.getElementById('forecastContainer');
    if (!container) return;
    container.innerHTML = '';
    
    const dailyForecasts = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const daysDiff = Math.floor((date - today) / (1000 * 60 * 60 * 24));
        
        if (daysDiff > 0 && daysDiff <= 3) {
            const dateKey = date.toDateString();
            if (!dailyForecasts[dateKey] || 
                Math.abs(date.getHours() - 12) < 
                Math.abs(new Date(dailyForecasts[dateKey].dt * 1000).getHours() - 12)) {
                dailyForecasts[dateKey] = item;
            }
        }
    });
    
    Object.values(dailyForecasts)
        .sort((a, b) => a.dt - b.dt)
        .slice(0, 3)
        .forEach(day => {
            const date = new Date(day.dt * 1000);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            const forecastDiv = document.createElement('div');
            forecastDiv.className = 'forecast-day';
            forecastDiv.innerHTML = `
                <div class="day-name">${dayName} <span class="month-day">${monthDay}</span></div>
                <div class="forecast-icon">${getWeatherEmoji(day.weather[0].main)}</div>
                <div class="forecast-temps">
                    <span class="high">${Math.round(day.main.temp_max)}°</span>
                    <span class="low">${Math.round(day.main.temp_min)}°</span>
                </div>
            `;
            container.appendChild(forecastDiv);
        });
}

function getWeatherEmoji(condition) {
    const map = {
        'Clear': '☀️',
        'Clouds': '☁️',
        'Rain': '🌧️',
        'Drizzle': '🌦️',
        'Thunderstorm': '⛈️',
        'Snow': '❄️',
        'Mist': '🌫️',
        'Fog': '🌫️',
        'Haze': '🌫️'
    };
    return map[condition] || '🌤️';
}

// ===== ADMIN & ICON EDIT =====
function requireAdminAuth(action) {
    if (isAdminAuthenticated) {
        action();
        return;
    }
    pendingAdminAction = action;
    const modal = document.getElementById('adminModal');
    if (modal) {
        modal.style.display = 'block';
        const passField = document.getElementById('adminPassword');
        if (passField) {
            passField.value = '';
            passField.focus();
        }
    }
}

function checkAdminPassword() {
    const passField = document.getElementById('adminPassword');
    if (!passField) return;
    
    if (passField.value === ADMIN_PASSWORD) {
        isAdminAuthenticated = true;
        closeAdminModal();
        if (pendingAdminAction) {
            pendingAdminAction();
            pendingAdminAction = null;
        }
    } else {
        alert('Incorrect password. Access denied.');
        passField.value = '';
        passField.focus();
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
    const titleEl = document.getElementById('modalTitle');
    const nameEl = document.getElementById('iconName');
    const urlEl = document.getElementById('iconUrl');
    
    if (titleEl) titleEl.textContent = 'Add New Icon';
    if (nameEl) nameEl.value = '';
    if (urlEl) urlEl.value = '';
    if (modal) modal.style.display = 'block';
    hideAllMenus();
}

function editIcon(icon) {
    if (!icon) return;
    currentIcon = icon;
    const modal = document.getElementById('iconModal');
    const titleEl = document.getElementById('modalTitle');
    const nameEl = document.getElementById('iconName');
    const urlEl = document.getElementById('iconUrl');
    
    if (titleEl) titleEl.textContent = 'Edit Icon';
    if (nameEl) nameEl.value = icon.querySelector('span').textContent;
    if (urlEl) urlEl.value = icon.dataset.url || '';
    if (modal) modal.style.display = 'block';
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
    if (modal) modal.style.display = 'none';
}

function saveIcon() {
    const nameEl = document.getElementById('iconName');
    const urlEl = document.getElementById('iconUrl');
    if (!nameEl || !urlEl) return;
    
    const name = nameEl.value.trim();
    let url = urlEl.value.trim();
    
    if (!name || !url) {
        alert('Please fill in all fields.');
        return;
    }
    
    if (!url.startsWith('http')) {
        url = 'https://' + url;
    }
    
    try {
        const hostname = new URL(url).hostname;
        const iconUrl = `https://icons.duckduckgo.com/ip3/${hostname}.ico`;
        
        if (currentIcon) {
            // Edit existing icon
            const spanEl = currentIcon.querySelector('span');
            const imgEl = currentIcon.querySelector('img');
            if (spanEl) spanEl.textContent = name;
            if (imgEl) {
                imgEl.src = iconUrl;
                imgEl.onerror = function() {
                    this.src = 'https://win98icons.alexmeub.com/icons/png/file_lines-0.png';
                };
            }
            currentIcon.dataset.url = url;
        } else {
            // Add new icon
            const newIconData = {
                name: name,
                url: url,
                id: `custom-${Date.now()}`,
                iconUrl: iconUrl
            };
            createIconElement(newIconData);
            autoArrangeIcons();
        }
        closeModal();
    } catch (error) {
        alert('Invalid URL format');
    }
}

function exportConfig() {
    const desktop = document.getElementById('desktop');
    if (!desktop) return;
    
    const icons = Array.from(desktop.children).map(icon => ({
        name: icon.querySelector('span').textContent,
        url: icon.dataset.url,
        id: icon.dataset.id,
        iconUrl: icon.querySelector('img').src
    }));
    
    const config = {
        version: '1.0',
        icons: icons,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'desktop-config.json';
    a.click();
    URL.revokeObjectURL(url);
}

function importConfig() {
    const fileInput = document.getElementById('importFile');
    if (fileInput) {
        fileInput.click();
    }
}

function handleImportFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const config = JSON.parse(e.target.result);
            if (config.icons && Array.isArray(config.icons)) {
                const desktop = document.getElementById('desktop');
                if (desktop) {
                    desktop.innerHTML = '';
                    config.icons.forEach(createIconElement);
                    autoArrangeIcons();
                }
            }
        } catch (error) {
            alert('Invalid configuration file');
        }
    };
    reader.readAsText(file);
    
    // Reset the input value to allow re-importing the same file
    event.target.value = '';
