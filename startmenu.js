// ===== START MENU FUNCTIONS =====
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

// ===== START MENU EVENT LISTENERS =====
function setupStartMenuListeners() {
    // Working Start Menu Items
    document.getElementById('startMenuSolitaire').addEventListener('click', openSolitaireApp);
    document.getElementById('startMenuWeather').addEventListener('click', openWeatherApp);
    document.getElementById('startMenuAddIcon').addEventListener('click', () => requireAdminAuth(addNewIcon));

    // Non-functional menu items (just hide menu)
    ['startMenuPrograms', 'startMenuDocuments', 'startMenuSettings', 'startMenuFind', 'startMenuHelp', 'startMenuRun', 'startMenuExport', 'startMenuImport', 'startMenuShutdown'].forEach(id => {
        document.getElementById(id).addEventListener('click', hideAllMenus);
    });
}

// ===== CONTEXT MENU EVENT LISTENERS =====
function setupContextMenuListeners() {
    document.getElementById('contextMenuAdd').addEventListener('click', () => requireAdminAuth(addNewIcon));
    document.getElementById('contextMenuEdit').addEventListener('click', () => requireAdminAuth(() => editIcon(currentIcon)));
    document.getElementById('contextMenuDelete').addEventListener('click', () => requireAdminAuth(() => deleteIcon(currentIcon)));
    document.getElementById('contextMenuArrange').addEventListener('click', () => {
        autoArrangeIcons();
        hideAllMenus();
    });
}
