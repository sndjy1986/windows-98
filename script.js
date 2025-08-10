document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    const desktop = document.getElementById('desktop');
    const timeDisplay = document.getElementById('timeDisplay');
    const runningAppsContainer = document.getElementById('runningApps');

    // Modals and Menus
    const startMenu = document.getElementById('startMenu');
    const contextMenu = document.getElementById('contextMenu');
    const iconModal = document.getElementById('iconModal');
    const adminModal = document.getElementById('adminModal');
    const solitaireModal = document.getElementById('solitaireModal');
    const weatherModal = document.getElementById('weatherModal');

    // --- State Variables ---
    let icons = [];
    let openWindows = {};
    let highestZIndex = 1000;
    let currentIconElement = null;
    let adminCallback = null;

    // --- Persistence Functions ---

    /**
     * Saves the current icon array to the browser's localStorage.
     */
    function saveIcons() {
        localStorage.setItem('desktopIcons', JSON.stringify(icons));
    }

    /**
     * Loads icons from localStorage or creates a default set if none are found.
     */
    function loadIcons() {
        const savedIcons = localStorage.getItem('desktopIcons');
        if (savedIcons && JSON.parse(savedIcons).length > 0) {
            icons = JSON.parse(savedIcons);
        } else {
            // If no icons are saved, create the default set
            createInitialIcons();
        }
        renderAllIcons();
    }
    
    /**
     * Creates the default set of icons and saves them.
     * THIS IS WHERE YOUR ICONS ARE DEFINED.
     */
    function createInitialIcons() {
        icons = [
            // { id, name, icon, url, top, left }
            { id: 'icon-1', name: 'My Documents', icon: 'folder.png', url: '#', top: 20, left: 20 },
            { id: 'icon-2', name: 'Solitaire', icon: 'https://win98icons.alexmeub.com/icons/png/card_deck.png', url: '#solitaire', top: 20, left: 110 },
            { id: 'icon-3', name: 'Weather', icon: 'https://win98icons.alexmeub.com/icons/png/weather-2.png', url: '#weather', top: 20, left: 200 },
            { id: 'icon-4', name: 'Google', icon: 'https://win98icons.alexmeub.com/icons/png/msie-1.png', url: 'https://www.google.com', top: 110, left: 20 }
        ];
        saveIcons(); // Save the new default set
    }

    /**
     * Renders all icons from the global 'icons' array to the desktop.
     */
    function renderAllIcons() {
        desktop.innerHTML = ''; // Clear the desktop first
        icons.forEach(iconData => createDesktopIcon(iconData));
    }


    // --- Core Functions ---

    /**
     * Creates and adds a single icon to the desktop from a data object.
     * @param {object} iconData - The object containing icon information.
     */
    function createDesktopIcon(iconData) {
        const iconElement = document.createElement('div');
        iconElement.className = 'desktop-icon';
        iconElement.id = iconData.id;
        iconElement.style.top = `${iconData.top}px`;
        iconElement.style.left = `${iconData.left}px`;
        iconElement.innerHTML = `
            <img src="${iconData.icon}" alt="${iconData.name}">
            <span>${iconData.name}</span>
        `;
        
        iconElement.addEventListener('dblclick', () => {
            if (iconData.url && iconData.url !== '#') {
                 if (iconData.url === '#solitaire') openSolitaireApp();
                 else if (iconData.url === '#weather') openWeatherApp();
                 else window.open(iconData.url, '_blank');
            }
        });
        
        iconElement.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            hideMenus();
            showContextMenu(e.pageX, e.pageY, iconElement);
        });

        desktop.appendChild(iconElement);
        makeDraggable(iconElement);
    }
    
    /**
     * Updates the system clock in the taskbar.
     */
    function updateTime() {
        const now = new Date();
        timeDisplay.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    function toggleStartMenu() {
        startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
    }

    function showContextMenu(x, y, iconElement = null) {
        currentIconElement = iconElement;
        contextMenu.style.top = `${y}px`;
        contextMenu.style.left = `${x}px`;
        contextMenu.style.display = 'block';
        // Show/hide menu items based on whether an icon was clicked
        document.getElementById('contextMenuEdit').style.display = iconElement ? 'flex' : 'none';
        document.getElementById('contextMenuDelete').style.display = iconElement ? 'flex' : 'none';
    }

    function hideMenus() {
        if (startMenu) startMenu.style.display = 'none';
        if (contextMenu) contextMenu.style.display = 'none';
    }

    function makeDraggable(element) {
        let offsetX, offsetY, isDragging = false;
        const header = element.classList.contains('desktop-icon') ? element : element.querySelector('.modal-header');
        
        header.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return; // Only drag with left mouse button
            isDragging = true;
            offsetX = e.clientX - element.offsetLeft;
            offsetY = e.clientY - element.offsetTop;
            highestZIndex++;
            element.style.zIndex = highestZIndex;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                element.style.left = `${e.clientX - offsetX}px`;
                element.style.top = `${e.clientY - offsetY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                // Update icon position in the array and save
                if (element.classList.contains('desktop-icon')) {
                    const iconData = icons.find(icon => icon.id === element.id);
                    if (iconData) {
                        iconData.top = element.offsetTop;
                        iconData.left = element.offsetLeft;
                        saveIcons();
                    }
                }
            }
        });
    }

    // --- App Window Functions ---
    // (This section remains the same as the previous script)
    // ...

    // --- Admin and Icon Management ---
    // (This section remains the same as the previous script)
    // ...

    // --- Event Listeners ---
    document.getElementById('startButton').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleStartMenu();
    });
    
    desktop.addEventListener('click', hideMenus);
    
    desktop.addEventListener('contextmenu', (e) => {
        // Show context menu only if right-clicking on the desktop itself
        if (e.target === desktop) {
            e.preventDefault();
            hideMenus();
            showContextMenu(e.pageX, e.pageY);
        }
    });

    // --- Initialization ---
    updateTime();
    setInterval(updateTime, 30000); // Update time every 30 seconds

    // Make all modal windows draggable
    document.querySelectorAll('.modal').forEach(makeDraggable);

    // Load user's icons from storage or create the default set
    loadIcons();
});
