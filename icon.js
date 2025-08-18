// ===== DESKTOP ICONS CONFIGURATION =====
const DESKTOP_ICONS = [
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
    // Additional icons
    { name: 'Gmail', url: 'https://mail.google.com', id: 'gmail', iconUrl: 'https://icons.duckduckgo.com/ip3/gmail.google.com.ico' },
    { name: 'Slack', url: 'https://slack.com', id: 'slack', iconUrl: 'https://icons.duckduckgo.com/ip3/slack.com.ico' },
    { name: 'GitHub', url: 'https://github.com', id: 'github', iconUrl: 'https://icons.duckduckgo.com/ip3/github.com.ico' },
    { name: 'Education', url: 'https://login.k12.com/', id: 'education', iconUrl: 'https://icons.duckduckgo.com/ip3/k12.com.ico' },
    { name: 'Emergency Services', url: 'https://andersoncounty911_sc.transport.net/#/home/dashboard?facilityId=52109&operation=upcomingTrips', id: 'emergency', iconUrl: 'https://icons.duckduckgo.com/ip3/med-trans.net.ico' },
    { name: 'Gemini', url: 'https://gemini.google.com/app', id: 'gemini', iconUrl: 'https://icons.duckduckgo.com/ip3/gemini.google.com.ico' },
    { name: 'Calendar', url: 'calendar.html', id: 'calendar', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg' }
];

// ===== ICON MANAGEMENT FUNCTIONS =====
function loadInitialIcons() {
    // Don't clear the entire desktop - preserve the weather text
    const desktop = document.getElementById('desktop');
    const weatherText = document.getElementById('weatherText');
    
    // Remove only icon elements, not the weather text
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
