<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Primary Meta Tags -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="description" content="Track your friends' timezones so you don't forget when they're awake">
    <title>Friendzone Tracker</title>
    
    <!-- PWA Manifest -->
    <link rel="manifest" href="manifest.json">
    
    <!-- Favicons -->
    <link rel="icon" href="img/kse.gif" type="image/gif">
    <link rel="icon" href="img/icon-192.png" type="image/png" sizes="192x192">
    <link rel="icon" href="img/icon.png" type="image/png" sizes="512x512">
    
    <!-- iOS Specific -->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-title" content="Friendzone Tracker">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <link rel="apple-touch-icon" href="img/icon.png">
    <link rel="apple-touch-startup-image" href="img/splash.png">
    
    <!-- Android/Generic PWA -->
    <meta name="theme-color" content="#3f6b91">
    <meta name="mobile-web-app-capable" content="yes">
    
    <!-- Styles & Fonts -->
    <link rel="stylesheet" href="styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=Short+Stack&display=swap" rel="stylesheet">
    
    <!-- Preload important resources -->
    <link rel="preload" href="styles.css" as="style">
    <link rel="preload" href="img/star.gif" as="image">
</head>
<body>
    <div class="container">
        <header>
            <div class="header-row" style="display: flex; align-items: center; justify-content: center; gap: 20px;">
                <div class="header-icon">
                    <img src="img/cute.gif" alt="Discord GIF" class="discord-gif" width="" height="100" loading="lazy">
                </div>
                <div class="header-text">
                    <h1>🌍 Friendzone Tracker</h1>
                    <p class="subtitle">bc i keep forgetin</p>
                </div>
                <div class="header-icon">
                    <img src="img/cat.gif" alt="Discord GIF" class="discord-gif" width="" height="100" loading="lazy">
                </div>
            </div>
            <button class="info-btn">i</button>

            <div class="info-modal" aria-hidden="true">
                <div class="info-modal-content">
                <span class="info-close-btn">&times;</span>
                    <h2>About Friendzone Tracker</h2>
                    <p>I made this when i should have been sleeping bc i keep forgetting</p>
                    <h3>How to use:</h3>
                    <ul>
                        <li>click "Add New Friendzone" to add a friend</li>
                        <li>search for their location to set their timezone</li>
                        <li>add a fun note (only if you want (pls do. it is rly cute))</li>
                        <li>done <3 </li>
                    </ul>
                    <p>(u can type ur friends name in the searchbar if u are cool and have too many.)</p>
                    <p>(the colour of each friendzone changes based on the time of day in that timezone.)</p>
                </div>
            </div>

            <!-- Custom Confirmation Modal -->
            <div id="confirm-modal" class="confirm-modal" aria-hidden="true">
                <div class="confirm-content">
                    <h3>Confirm Deletion</h3>
                    <p id="confirm-message">Are you sure you want to delete this friend?</p>
                    <div class="confirm-buttons">
                        <button id="confirm-cancel" class="confirm-btn cancel-btn">Cancel</button>
                        <button id="confirm-delete" class="confirm-btn confirm-delete-btn">Delete</button>
                    </div>
                </div>
            </div>
        </header>
        
        <!-- Friend Search Bar at Top -->
        <div class="friend-search-container">
            <input type="text" id="friend-search" placeholder="🔍 Search for friend...">
        </div>
        
        <!-- Collapsible Add Friendzone Section -->
        <div class="collapsible-section">
            <button class="collapsible-btn">➕ Add New Friendzone lmao </button>
            <div class="add-clock collapsible-content">
                <form id="clock-form">
                    <div class="form-group">
                        <label for="name">Friend's Name:</label>
                        <input type="text" id="name" required>
                    </div>
                    <div class="form-group">
                        <label for="location-search">Location Search:</label>
                        <input type="text" id="location-search" placeholder="Type a city, country or timezone (e.g. Tokyo, UTC, PST)...">
                        <div id="timezone-results" class="timezone-results"></div>
                    </div>
                    <div class="form-group">
                        <label for="timezone">Selected Timezone:</label>
                        <input type="text" id="timezone" required readonly>
                        <small id="timezone-preview" style="display: none; margin-top: 4px; color: var(--leaf-green-darker);"></small>
                    </div>
                    <div class="form-group">
                        <label for="note">Note:</label>
                        <input type="text" id="note" placeholder="e.g. 'stinky'">
                    </div>
                    <div style="display: flex; align-items: center; justify-content: end; gap: 20px;">
                    <button type="submit" class="add-btn"><img src="img/star.gif" alt="star" height="30">Add Friendzone <img src="img/star.gif" alt="star" height="30"></button>
                    </div>
                </form>
            </div>
        </div>
        
        <div class="clocks-container" id="clocks-container" role="region" aria-live="polite">
            <!-- Clocks will be added here dynamically -->
        </div>
    <footer class="footer">
        <div class="footer-row" style="display: flex; align-items: center; justify-content: center; gap: 20px;">
        <img src="img/kse.gif" alt="my beloved" height="200" class="soleum-gsgw">
            </div>
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <p>Soleum sweep</p>
            </div>
        </footer>
    </div>

    <script src="script.js" defer></script>
</body>
</html>