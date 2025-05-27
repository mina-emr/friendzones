document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const clockForm = document.getElementById('clock-form');
    const clocksContainer = document.getElementById('clocks-container');
    const timezoneInput = document.getElementById('timezone');
    const locationSearch = document.getElementById('location-search');
    const timezoneResults = document.getElementById('timezone-results');
    const friendSearch = document.getElementById('friend-search');
    const collapsibleBtn = document.querySelector('.collapsible-btn');
    const collapsibleContent = document.querySelector('.collapsible-content');
    const infoBtn = document.querySelector('.info-btn');
    const infoModal = document.querySelector('.info-modal');
    const infoCloseBtn = document.querySelector('.info-close-btn');
    const confirmModal = document.getElementById('confirm-modal');
    const confirmMessage = document.getElementById('confirm-message');
    const confirmCancel = document.getElementById('confirm-cancel');
    const confirmDelete = document.getElementById('confirm-delete');
    const timezonePreview = document.getElementById('timezone-preview');

    // Info button functionality
    infoBtn.addEventListener('click', function() {
        infoModal.style.display = 'flex';
    });

    infoCloseBtn.addEventListener('click', function() {
        infoModal.style.display = 'none';
    });

    // Close modal when clicking outside content
    window.addEventListener('click', function(event) {
        if (event.target === infoModal) {
            infoModal.style.display = 'none';
        }
        if (event.target === confirmModal) {
            confirmModal.style.display = 'none';
        }
    });

    // Collapsible section
    collapsibleBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        collapsibleContent.classList.toggle('expanded');
    });

    // Friend search
    friendSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        document.querySelectorAll('.clock-card').forEach(card => {
            const name = card.querySelector('.clock-name').textContent.toLowerCase();
            card.style.display = name.includes(searchTerm) ? 'block' : 'none';
        });
    });

    // Location search with TimeAPI.io
    locationSearch.addEventListener('input', async function() {
        const searchTerm = this.value.trim();
        timezoneResults.innerHTML = '';
        timezonePreview.style.display = 'none';
        
        if (searchTerm.length < 2) {
            timezoneResults.style.display = 'none';
            return;
        }

        timezoneResults.innerHTML = '<div class="loading">Searching timezones...</div>';
        timezoneResults.style.display = 'block';

        try {
            // First check if it's a timezone abbreviation (PST, EST, etc.)
            const abbreviationMatch = await getTimezoneFromAbbreviation(searchTerm);
            if (abbreviationMatch) {
                const currentTime = await getCurrentTimeForTimezone(abbreviationMatch);
                showOptions([{
                    name: abbreviationMatch.replace(/_/g, ' '),
                    timezone: abbreviationMatch,
                    currentTime: currentTime
                }]);
                return;
            }

            // Search through all available timezones
            const response = await fetch('https://timeapi.io/api/TimeZone/AvailableTimeZones');
            if (!response.ok) throw new Error('Failed to fetch timezones');
            
            const allTimezones = await response.json();
            const filtered = allTimezones
                .filter(tz => tz.toLowerCase().includes(searchTerm.toLowerCase()))
                .sort((a, b) => a.localeCompare(b)); // Sort alphabetically
            
            if (filtered.length) {
                // Get current time for each matching timezone
                const options = await Promise.all(filtered.map(async tz => {
                    return {
                        name: tz.replace(/_/g, ' '),
                        timezone: tz,
                        currentTime: await getCurrentTimeForTimezone(tz)
                    };
                }));
                showOptions(options);
            } else {
                timezoneResults.innerHTML = '<div class="no-results">No matching timezones found. Try again or something.</div>';
            }
        } catch (error) {
            console.error("Error searching timezones:", error);
            timezoneResults.innerHTML = '<div class="no-results">Error searching timezones. Sorry.</div>';
        }
    });

    function showOptions(options) {
        timezoneResults.innerHTML = '';
        
        options.forEach(opt => {
            const optionElement = document.createElement('div');
            optionElement.className = 'timezone-option';
            
            optionElement.innerHTML = `
                <div class="timezone-option-name">${opt.name}</div>
                <div class="timezone-option-timezone">${opt.timezone}</div>
                ${opt.currentTime ? `<div class="timezone-option-current">Current time: ${opt.currentTime}</div>` : ''}
            `;
            
            optionElement.addEventListener('click', () => {
                timezoneInput.value = opt.timezone;
                locationSearch.value = opt.name;
                timezoneResults.style.display = 'none';
                
                // Show the current time in the selected timezone
                if (opt.currentTime) {
                    timezonePreview.textContent = `Current time: ${opt.currentTime}`;
                    timezonePreview.style.display = 'block';
                }
            });
            
            timezoneResults.appendChild(optionElement);
        });
        
        if (options.length > 0) {
            timezoneResults.style.display = 'block';
        }
    }

    // Helper function to get timezone from common abbreviations
    async function getTimezoneFromAbbreviation(abbr) {
        const abbreviations = {
            'utc': 'UTC', 'gmt': 'GMT',
            'pst': 'America/Los_Angeles', 'pdt': 'America/Los_Angeles',
            'mst': 'America/Denver', 'mdt': 'America/Denver',
            'cst': 'America/Chicago', 'cdt': 'America/Chicago',
            'est': 'America/New_York', 'edt': 'America/New_York',
            'aest': 'Australia/Sydney', 'aedt': 'Australia/Sydney',
            'bst': 'Europe/London', 'ist': 'Asia/Kolkata',
            'jst': 'Asia/Tokyo', 'cet': 'Europe/Paris',
            'cest': 'Europe/Paris', 'eet': 'Europe/Athens',
            'eest': 'Europe/Athens', 'msk': 'Europe/Moscow',
            'awst': 'Australia/Perth', 'acst': 'Australia/Adelaide',
            'acdt': 'Australia/Adelaide', 'nzst': 'Pacific/Auckland',
            'nzdt': 'Pacific/Auckland'
        };
        
        const lowerAbbr = abbr.toLowerCase();
        return abbreviations[lowerAbbr] || null;
    }

    // Helper function to get current time for a timezone
    async function getCurrentTimeForTimezone(timezone) {
        try {
            const response = await fetch(`https://timeapi.io/api/Time/current/zone?timeZone=${encodeURIComponent(timezone)}`);
            if (!response.ok) throw new Error();
            const data = await response.json();
            return `${data.hour}:${data.minute.toString().padStart(2, '0')}`;
        } catch (error) {
            console.error("Error getting current time:", error);
            return null;
        }
    }

    function formatTime(timezone) {
        const now = new Date();
        const optionsTime = { timeZone: timezone, hour12: false, hour: '2-digit', minute: '2-digit' };
        const optionsDate = { timeZone: timezone, weekday: 'long', day: '2-digit', month: '2-digit', year: '2-digit' };

        const time = now.toLocaleTimeString('en-US', optionsTime);
        const date = now.toLocaleDateString('en-US', optionsDate);

        const [weekday, rest] = date.split(', ');
        const [month, day, year] = rest.split('/');

        return `
            <p>${time}</p>
            <p>${weekday}, ${day}.${month}.${year}</p>
        `;
    }

    function getTimeDifference(targetTimezone) {
        try {
            const now = new Date();
            const localTimeStr = now.toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
            const targetTimeStr = now.toLocaleString('en-US', { timeZone: targetTimezone });
            const localTime = new Date(localTimeStr);
            const targetTime = new Date(targetTimeStr);
            const diffMinutes = Math.round((targetTime - localTime) / (1000 * 60));
            if (diffMinutes % 60 === 0) {
                const diffHours = diffMinutes / 60;
                if (diffHours === 0) return "same time";
                return `${Math.abs(diffHours)}h ${diffHours > 0 ? 'ahead' : 'behind'}`;
            }
            const absDiff = Math.abs(diffMinutes);
            const hours = Math.floor(absDiff / 60);
            const minutes = absDiff % 60;
            let timeString = hours > 0 ? `${hours}h ` : '';
            timeString += `${minutes}m`;
            return diffMinutes > 0 ? `${timeString} ahead` : `${timeString} behind`;
        } catch (e) {
            console.error("Error calculating time difference:", e);
            return "";
        }
    }

    function getTimeOfDay(timezone) {
        const hour = parseInt(new Date().toLocaleString('en-US', { timeZone: timezone, hour: 'numeric', hour12: false }));
        if (hour >= 5 && hour < 9) return 'morning';
        if (hour >= 9 && hour < 12) return 'daytime';
        if (hour >= 12 && hour < 17) return 'afternoon';
        if (hour >= 17 && hour < 21) return 'evening';
        return 'night';
    }

    function createClockCard(friend_id, name, timezone, note) {
        const card = document.createElement('div');
        card.className = 'clock-card ' + getTimeOfDay(timezone);
        card.dataset.friend_id = friend_id;
        const emoji = { morning: '🌅', daytime: '☀️', afternoon: '⛅', evening: '🌇', night: '🌙' }[getTimeOfDay(timezone)];
        const timeDifference = getTimeDifference(timezone);
        
        card.innerHTML = `
            <button class="delete-btn">✕</button>
            <div class="clock-name">${emoji} ${name}</div>
            <div class="clock-time" data-timezone="${timezone}">${formatTime(timezone)}</div>
            <div class="clock-timezone">
                <span class="time-difference">${timeDifference}</span>
                <span class="timezone-name">${timezone.replace(/_/g, ' ')}</span>
            </div>
            ${note ? `<div class="clock-note"><img src="img/star.gif" alt="star" width="30">${note}</div>` : ''}
        `;
        
        card.querySelector('.delete-btn').addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const name = card.querySelector('.clock-name').textContent.replace(/^[^\w\s]+\s/, '');
            const friend_id = card.dataset.friend_id;
            
            let cardToDelete = card;
            
            confirmMessage.textContent = `Are you sure you want to delete ${name}?`;
            confirmModal.style.display = 'flex';
            
            confirmCancel.onclick = function() {
                confirmModal.style.display = 'none';
            };
            
            confirmDelete.onclick = async function() {
                confirmModal.style.display = 'none';
                
                try {
                    const response = await fetch(`delete-friend.php?friend_id=${encodeURIComponent(friend_id)}`, {
                        method: 'GET'
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        cardToDelete.classList.add('deleting');
                        setTimeout(() => cardToDelete.remove(), 300);
                    } else {
                        alert('Failed to delete friend: ' + (result.error || 'Unknown error'));
                    }
                } catch (error) {
                    console.error('Error deleting friend:', error);
                    alert('Error deleting friend');
                }
            };
        });
        return card;
    }

    async function saveFriendToDB(name, timezone, note) {
        try {
            const response = await fetch('save-friend.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    timezone: timezone,
                    note: note || ''
                })
            });
            
            if (!response.ok) throw new Error('Network response was not ok');
            
            return await response.json();
        } catch (error) {
            console.error('Error saving friend:', error);
            return { success: false, error: error.message };
        }
    }

    async function loadFriendsFromDB() {
        try {
            const response = await fetch('load-friends.php');
            const friends = await response.json();
            // Sort friends by ID in descending order (newest first)
            friends.sort((a, b) => b.friend_id - a.friend_id);
            friends.forEach(friend => {
                clocksContainer.prepend(createClockCard(friend.friend_id, friend.name, friend.timezone, friend.note));
            });
        } catch (error) {
            console.error('Error loading friends:', error);
        }
    }

    clockForm.onsubmit = async function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const timezone = timezoneInput.value.trim();
        const note = document.getElementById('note').value.trim();
        
        if (!name) {
            alert('Please enter a name for your friend');
            return;
        }
        
        if (!timezone) {
            alert('Please select a timezone from the search results');
            return;
        }
        
        try {
            const result = await saveFriendToDB(name, timezone, note);
            
            if (result.success) {
                clocksContainer.prepend(createClockCard(result.friend_id, name, timezone, note));
                clockForm.reset();
                timezoneInput.value = '';
                locationSearch.value = '';
                timezonePreview.style.display = 'none';
            } else {
                alert('Failed to save friend: ' + (result.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while saving your friend');
        }
    };

    function updateClocks() {
        document.querySelectorAll('.clock-card').forEach(card => {
            const tz = card.querySelector('.clock-time').dataset.timezone;
            card.querySelector('.clock-time').innerHTML = formatTime(tz);
            const tod = getTimeOfDay(tz);
            card.className = 'clock-card ' + tod;
            const emoji = { morning: '🌅', daytime: '☀️', afternoon: '⛅', evening: '🌇', night: '🌙' }[tod];
            const name = card.querySelector('.clock-name').textContent.replace(/^[^\w\s]+\s/, '');
            card.querySelector('.clock-name').textContent = `${emoji} ${name}`;
            card.querySelector('.time-difference').textContent = getTimeDifference(tz);
        });
    }

    // Initialize
    loadFriendsFromDB();
    setInterval(updateClocks, 1000);
    updateClocks();
});