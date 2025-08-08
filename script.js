// ===== GLOBAL VARIABLES =====
let draggedIcon = null;
let currentIcon = null;
let iconCounter = 0;
let isAdminAuthenticated = false;
const SECURE_PASSWORD_HASH = "fcbc6de9d131c683d5f182a61144ac491a0313f614f73d916db59c58ec21b77c";
const PASSWORD_SALT = "joeyisthebestprogrammerever";
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
        setupIconDragging();
        setupEventListeners();
        setupModalDragging();
        fetchWeatherData();
        setInterval(fetchWeatherData, 600000); // Update weather every 10 minutes
    } catch (error) {
        console.error('Initialization error:', error);
    }
});

// ===== TIME FUNCTIONS =====
function updateTime() {
    try {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: true,
            hour: 'numeric',
            minute: '2-digit'
        });
        const dateString = now.toLocaleDateString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric'
        });
        const timeDisplay = document.getElementById('timeDisplay');
        if (timeDisplay) {
            timeDisplay.textContent = `${timeString} ${dateString}`;
        }
    } catch (error) {
        console.error('Time update error:', error);
    }
}

// ===== WEATHER FUNCTIONS =====
async function fetchWeatherData() {
    try {
        const currentResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${WEATHER_LOCATION}&appid=${WEATHER_API_KEY}&units=imperial`
        );
        
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${WEATHER_LOCATION}&appid=${WEATHER_API_KEY}&units=imperial`
        );
        
        if (currentResponse.ok && forecastResponse.ok) {
            const currentData = await currentResponse.json();
            const forecastData = await forecastResponse.json();
            
            weatherData = {
                current: currentData,
                forecast: forecastData
            };
        } else {
            console.error('Weather API error');
        }
    } catch (error) {
        console.error('Weather fetch error:', error);
    }
}

function openWeatherApp() {
    if (isWeatherAppOpen) {
        const weatherModal = document.getElementById('weatherModal');
        if (weatherModal) {
            weatherModal.style.display = 'flex';
        }
        return;
    }

    isWeatherAppOpen = true;
    addAppToTaskbar('weather', '🌤️ Weather', () => focusWeatherApp());
    
    const weatherModal = document.getElementById('weatherModal');
    const weatherLoading = document.getElementById('weatherLoading');
    const weatherContent = document.getElementById('weatherContent');
    
    if (weatherModal) {
        weatherModal.style.display = 'flex';
        
        if (weatherData) {
            populateWeatherApp();
            weatherLoading.style.display = 'none';
            weatherContent.style.display = 'block';
        } else {
            weatherLoading.style.display = 'block';
            weatherContent.style.display = 'none';
            fetchWeatherData().then(() => {
                if (weatherData) {
                    populateWeatherApp();
                    weatherLoading.style.display = 'none';
                    weatherContent.style.display = 'block';
                }
            });
        }
    }
    hideAllMenus();
}

function focusWeatherApp() {
    const weatherModal = document.getElementById('weatherModal');
    if (weatherModal) {
        weatherModal.style.display = 'flex';
    }
}

function closeWeatherApp() {
    isWeatherAppOpen = false;
    removeAppFromTaskbar('weather');
    
    const weatherModal = document.getElementById('weatherModal');
    if (weatherModal) {
        weatherModal.style.display = 'none';
    }
}

function populateWeatherApp() {
    if (!weatherData) return;
    
    const current = weatherData.current;
    const forecast = weatherData.forecast;
    
    // Update current weather
    document.getElementById('currentLocation').textContent = current.name + ', ' + current.sys.country;
    document.getElementById('currentWeatherIcon').textContent = getWeatherEmoji(current.weather[0].main);
    document.getElementById('currentTemp').textContent = Math.round(current.main.temp) + '°F';
    document.getElementById('currentCondition').textContent = current.weather[0].description;
    
    // Update weather details
    document.getElementById('feelsLike').textContent = Math.round(current.main.feels_like) + '°F';
    document.getElementById('humidity').textContent = current.main.humidity + '%';
    document.getElementById('windSpeed').textContent = Math.round(current.wind.speed) + ' mph';
    document.getElementById('pressure').textContent = current.main.pressure + ' mb';
    
    // Update 3-day forecast
    populateForecast(forecast);
}

function populateForecast(forecastData) {
    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = '';
    
    const dailyForecasts = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toDateString();
        
        const daysDiff = Math.floor((date - today) / (1000 * 60 * 60 * 24));
        
        if (daysDiff > 0 && daysDiff <= 3) {
            if (!dailyForecasts[dateKey] || Math.abs(date.getHours() - 12) < Math.abs(new Date(dailyForecasts[dateKey].dt * 1000).getHours() - 12)) {
                dailyForecasts[dateKey] = item;
            }
        }
    });
    
    const forecastDays = Object.values(dailyForecasts)
        .sort((a, b) => a.dt - b.dt)
        .slice(0, 3);
    
    forecastDays.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        const forecastDiv = document.createElement('div');
        forecastDiv.className = 'forecast-day';
        forecastDiv.innerHTML = `
            <div class="forecast-day-name">${dayName}</div>
            <div style="font-size: 9px; color: #666; margin-bottom: 3px;">${monthDay}</div>
            <div class="forecast-icon">${getWeatherEmoji(day.weather[0].main)}</div>
            <div class="forecast-temps">
                <div class="forecast-high">${Math.round(day.main.temp_max)}°</div>
                <div class="forecast-low">${Math.round(day.main.temp_min)}°</div>
            </div>
            <div style="font-size: 9px; color: #666; margin-top: 3px; text-align: center;">${day.weather[0].description}</div>
        `;
        
        forecastContainer.appendChild(forecastDiv);
    });
}

function getWeatherEmoji(condition) {
    const iconMap = {
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
    return iconMap[condition] || '🌤️';
}

// ===== TASKBAR MANAGEMENT =====
function addAppToTaskbar(appId, appName, clickHandler) {
    if (runningApps.find(app => app.id === appId)) {
        return;
    }

    const app = { id: appId, name: appName, clickHandler: clickHandler };
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
        appButton.innerHTML = app.name;
        appButton.onclick = app.clickHandler;
        runningAppsContainer.appendChild(appButton);
    });
}

// ===== WINDOW DRAGGING =====
function setupModalDragging() {
    const weatherModal = document.getElementById('weatherModal');
    const weatherHeader = weatherModal.querySelector('.modal-header');
    
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    
    weatherHeader.addEventListener('mousedown', function(e) {
        isDragging = true;
        const modalContent = weatherModal.querySelector('.modal-content');
        const rect = modalContent.getBoundingClientRect();
        
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;
        
        weatherHeader.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        const modalContent = weatherModal.querySelector('.modal-content');
        let newX = e.clientX - dragOffset.x;
        let newY = e.clientY - dragOffset.y;
        
        const maxX = window.innerWidth - modalContent.offsetWidth;
        const maxY = window.innerHeight - modalContent.offsetHeight;
        
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
        
        modalContent.style.position = 'fixed';
        modalContent.style.left = newX + 'px';
        modalContent.style.top = newY + 'px';
        modalContent.style.margin = '0';
    });
    
    document.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            weatherHeader.style.cursor = 'move';
        }
    });
}

// ===== START MENU FUNCTIONS =====
function toggleStartMenu() {
    const startMenu = document.getElementById('startMenu');
    if (startMenu) {
        if (startMenu.style.display === 'block') {
            startMenu.style.display = 'none';
        } else {
            startMenu.style.display = 'block';
        }
    }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.context-menu') && !e.target.closest('.start-menu') && !e.target.closest('.start-button')) {
            const contextMenu = document.getElementById('contextMenu');
            const startMenu = document.getElementById('startMenu');
            if (contextMenu) {
                contextMenu.style.display = 'none';
            }
            if (startMenu) {
                startMenu.style.display = 'none';
            }
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const adminModal = document.getElementById('adminModal');
            if (adminModal && adminModal.style.display === 'flex') {
                checkAdminPassword();
            }
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

// ===== ICON MANAGEMENT =====
function setupIconDragging() {
    const icons = document.querySelectorAll('.desktop-icon');
    
    icons.forEach(icon => {
        icon.addEventListener('mousedown', handleMouseDown);
        icon.addEventListener('dblclick', handleDoubleClick);
        icon.addEventListener('contextmenu', handleRightClick);
    });
}

function handleMouseDown(e) {
    if (e.button === 0) {
        draggedIcon = e.currentTarget;
        const rect = draggedIcon.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        draggedIcon.classList.add('dragging');

        function handleMouseMove(e) {
            if (draggedIcon) {
                const desktop = document.getElementById('desktop');
                const desktopRect = desktop.getBoundingClientRect();
                
                let newX = e.clientX - desktopRect.left - offsetX;
                let newY = e.clientY - desktopRect.top - offsetY;

                newX = Math.max(0, Math.min(newX, desktopRect.width - 64));
                newY = Math.max(0, Math.min(newY, desktopRect.height - 70));

                draggedIcon.style.left = newX + 'px';
                draggedIcon.style.top = newY + 'px';
            }
        }

        function handleMouseUp() {
            if (draggedIcon) {
                draggedIcon.classList.remove('dragging');
                draggedIcon = null;
            }
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }
}

function handleDoubleClick(e) {
    const url = e.currentTarget.dataset.url;
    if (url) {
        window.open(url, '_blank');
    }
}

function handleRightClick(e) {
    e.preventDefault();
    currentIcon = e.currentTarget;
    showContextMenu(e);
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
