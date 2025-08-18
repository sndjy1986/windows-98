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

    document.getElementById('startMenuGmail').addEventListener('click', () => {
        window.open('https://mail.google.com', '_blank');
        hideAllMenus();
    });
    document.getElementById('startMenuCloudflare').addEventListener('click', () => {
        window.open('https://cloudflare.com', '_blank');
        hideAllMenus();
    });
    document.getElementById('startMenuDrive').addEventListener('click', () => {
        window.open('https://drive.google.com', '_blank');
        hideAllMenus();
    });
    document.getElementById('startMenuSlack').addEventListener('click', () => {
        window.open('https://slack.com', '_blank');
        hideAllMenus();
    });
    document.getElementById('startMenuGitHub').addEventListener('click', () => {
        window.open('https://github.com', '_blank');
        hideAllMenus();
    });
    document.getElementById('startMenuEducation').addEventListener('click', () => {
        window.open('https://login.k12.com/', '_blank');
        hideAllMenus();
    });
    document.getElementById('startMenuEmergency').addEventListener('click', () => {
        window.open('https://andersoncounty911_sc.transport.net/#/home/dashboard?facilityId=52109&operation=upcomingTrips', '_blank');
        hideAllMenus();
    });
    document.getElementById('startMenuGemini').addEventListener('click', () => {
        window.open('https://gemini.google.com/app', '_blank');
        hideAllMenus();
    });
    document.getElementById('startMenuCalendar').addEventListener('click', () => {
        window.open('calendar.html', '_blank');
        hideAllMenus();
    });

    ['startMenuPrograms', 'startMenuDocuments', 'startMenuSettings', 'startMenuFind', 'startMenuHelp', 'startMenuRun', 'startMenuExport', 'startMenuImport', 'startMenuShutdown'].forEach(id => {
        document.getElementById(id).addEventListener('click', hideAllMenus);
    });
    
    document.getElementById('contextMenuAdd').addEventListener('click', () => requireAdminAuth(addNewIcon));
    document.getElementById('contextMenuEdit').addEventListener('click', () => requireAdminAuth(() => editIcon(currentIcon)));
    document.getElementById('contextMenuDelete').addEventListener('click', () => requireAdminAuth(() => deleteIcon(currentIcon)));
    
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
    if (runningApps.find(app => app.
