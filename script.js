// Guest data loaded from guests.json
let guestsData = {};

// Load guest data from JSON file
async function loadGuestsData() {
    try {
        const response = await fetch('guests.json');
        const data = await response.json();
        
        // Convert array format to object format for easy lookup
        guestsData = {};
        data.guests.forEach(guest => {
            guestsData[guest.token] = guest.name;
        });
        
        return true;
    } catch (error) {
        console.error('Error loading guests data:', error);
        return false;
    }
}

// Get recipient name from token in URL parameter
function getRecipientName() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('invite');
    
    if (token && guestsData[token]) {
        return guestsData[token];
    }
    
    // Fallback: check if old 'name' parameter is used
    const name = urlParams.get('name');
    if (name) {
        return decodeURIComponent(name);
    }
    
    return 'My Friend';
}

// Function to add event to Google Calendar
function addToGoogleCalendar() {
    const title = 'Graduation Ceremony';
    const startDate = '20251220T103000'; // Dec 20, 2025, 10:30
    const endDate = '20251220T123000';   // Dec 20, 2025, 12:30
    const location = 'University of Science, VNUHCMUS, 227 Nguyen Van Cu, Cho Quan Ward, Ho Chi Minh City';
    const details = 'Graduation Ceremony at University of Science, VNUHCMUS';
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&location=${encodeURIComponent(location)}&details=${encodeURIComponent(details)}`;
    
    window.open(url, '_blank');
}

// Function to open venue in Google Maps
function openVenueMap() {
    const address = 'University of Science, VNUHCMUS, 227 Nguyen Van Cu, Cho Quan Ward, Ho Chi Minh City';
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    
    window.open(url, '_blank');
}

// Function to open parking in Google Maps
function openParkingMap() {
    const address = 'Nowzone Fashion Mall, 235 Nguyen Van Cu, Ho Chi Minh City';
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    
    window.open(url, '_blank');
}

// Set the recipient name when page loads
document.addEventListener('DOMContentLoaded', async function() {
    const recipientNameElement = document.getElementById('recipientName');
    
    // Load guest data first
    await loadGuestsData();
    
    const name = getRecipientName();
    recipientNameElement.textContent = name;
    
    // Setup envelope click handler
    const envelope = document.querySelector('.envelope');
    const invitationCard = document.querySelector('.invitation-card');
    let isOpened = false;
    
    if (envelope) {
        envelope.addEventListener('click', function() {
            if (!isOpened) {
                isOpened = true;
                envelope.classList.add('opening');
                invitationCard.classList.add('show');
                
                // Add entrance animation for recipient name
                recipientNameElement.style.opacity = '0';
                setTimeout(() => {
                    recipientNameElement.style.transition = 'opacity 1s ease-in';
                    recipientNameElement.style.opacity = '1';
                }, 2500);
            }
        });
    }
    
    // Setup click handlers for interactive elements
    const dateTimeItem = document.getElementById('dateTimeItem');
    const venueItem = document.getElementById('venueItem');
    const parkingItem = document.getElementById('parkingItem');
    
    if (dateTimeItem) {
        dateTimeItem.addEventListener('click', addToGoogleCalendar);
    }
    
    if (venueItem) {
        venueItem.addEventListener('click', openVenueMap);
    }
    
    if (parkingItem) {
        parkingItem.addEventListener('click', openParkingMap);
    }
});
