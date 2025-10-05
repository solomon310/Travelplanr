let map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 37.7749, lng: -122.4194 },
        zoom: 13,
    });
}

const form = document.getElementById('itinerary-form');
const tripNameInput = document.getElementById('trip-name');
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');
const destinationInput = document.getElementById('destination');

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const tripName = tripNameInput.value;
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    const destination = destinationInput.value;

    const itinerary = {
        tripName,
        startDate,
        endDate,
        destination,
    };

    saveItinerary(itinerary);

    const marker = new google.maps({
        position: { lat: 37.7859, lng: -122.4364 },
        map: map,
        title: tripName,
    });

    const infoWindow = new google.maps.infoWindow({
        content: `<h2>${tripName}</h2>
    <p>Start Date: ${startDate}</p>
    <p>End Date: ${endDate}</p>
    <p>Destination: ${destination}</p>`
    });
    infoWindow.open(map, marker);

    tripNameInput.value = "";
    startDateInput.value = "";
    endDateInput.value = "";
    destinationInput.value = "";
});

function saveItinerary(itinerary) {
    const storedItineraries = localStorage.getItem('itineraries');
    if (storedItineraries) {
        const itineraries = JSON.parse(storedItineraries);
        itineraries.push(itinerary);

        localStorage.setItem("itineraries", JSON.stringify(itineraries));
    } else {
        const itineraries = [itinerary];

        localStorage.setItem('itineraries', JSON.stringify(itineraries));
    }
}

function displayItineraries() {
    const storedItineraries = localStorage.getItem("itineraries");
    if (storedItineraries) {
        const itineraries = JSON.parse(storedItineraries);
        const itineraryList = document.getElementById('itinerary-list');
        itineraryList.innerHTML = "";
        itineraries.forEach((itinerary) => {
            const itineraryItem = document.createElement('li');
            itineraryItem.innerHTML = `
            <h3>${itinerary.tripName}</h3>
            <p>Start Date: ${startDate}</p>
            <p>End Date: ${endDate}</p>
            <p>Destination: ${destination}</p>
            <button class="delete-btn" data-index="${index}">Delete</button>
            `;
            itineraryList.appendChild(itineraryItem);
        });

        const deleteBtns = document.querySelectorAll('.delete-btn');
        deleteBtns.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                deleteItinerary(index);
            });
        });
    }
}

function deleteItinerary(index) {
    const storedItineraries = localStorage.getItem('itineraries');
    if (storedItineraries) {
        const itineraries = JSON.parse(storedItineraries);
        itineraries.splice(index, 1);
        localStorage.setItem('itineraries', JSON.stringify(itineraries));
        displayItineraries();
    }
}


displayItineraries();
initMap();