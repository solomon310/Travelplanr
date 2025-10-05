// Save itinerary function
function saveItinerary(itinerary) {
  const userId = JSON.parse(localStorage.getItem('user')).username;
  const storedItineraries = localStorage.getItem(`itineraries-${userId}`);
  if (storedItineraries) {
    const itineraries = JSON.parse(storedItineraries);
    itineraries.push(itinerary);
    localStorage.setItem(`itineraries-${userId}`, JSON.stringify(itineraries));
  } else {
    const itineraries = [itinerary];
    localStorage.setItem(`itineraries-${userId}`, JSON.stringify(itineraries));
  }
}

// Display itineraries function
function displayItineraries() {
  const userId = JSON.parse(localStorage.getItem('user')).username;
  const storedItineraries = localStorage.getItem(`itineraries-${userId}`);
  const itineraryList = document.getElementById('itinerary-list');
  removeNoItinerariesMessage();
  if (storedItineraries) {
    const itineraries = JSON.parse(storedItineraries);
    itineraryList.innerHTML = "";
    itineraries.forEach((itinerary, index) => {
      const itineraryItem = document.createElement('li');
      itineraryItem.innerHTML = `
        <h3>${itinerary.tripName}</h3>
        <p>Check In Date: ${itinerary.checkInDate}</p>
        <p>Check Out Date: ${itinerary.checkOutDate}</p>
        <p>Destination: ${itinerary.destination}</p>
        <button class="delete-btn" data-index="${index}">Delete</button>
      `;
      itineraryList.prepend(itineraryItem);
    });
    const deleteBtns = document.querySelectorAll('.delete-btn');
    deleteBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const index = e.target.dataset.index;
        deleteItinerary(index);
      });
    });
  } else {
    displayNoItinerariesMessage();
  }
}

// Delete itinerary function
function deleteItinerary(index) {
  const userId = JSON.parse(localStorage.getItem('user')).username;
  const storedItineraries = localStorage.getItem(`itineraries-${userId}`);
  if (storedItineraries) {
    const itineraries = JSON.parse(storedItineraries);
    itineraries.splice(index, 1);
    localStorage.setItem(`itineraries-${userId}`, JSON.stringify(itineraries));
    displayItineraries();
  }
}

// Display no itineraries message function
function displayNoItinerariesMessage() {
  const itineraryList = document.getElementById('itinerary-list');
  const noItinerariesMessage = document.createElement('p');
  noItinerariesMessage.id = 'no-itineraries-message';
  noItinerariesMessage.textContent = 'No Itineraries. Create an itinerary to see your itinerary.';
  itineraryList.appendChild(noItinerariesMessage);
}

// Remove no itineraries message function
function removeNoItinerariesMessage() {
  const noItinerariesMessage = document.getElementById('no-itineraries-message');
  if (noItinerariesMessage) {
    noItinerariesMessage.remove();
  }
}

displayItineraries();

