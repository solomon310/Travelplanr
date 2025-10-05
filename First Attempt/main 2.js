let map;
const holidayDestinations = [];

// Initialize the map
function initHolidayMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 37.7749, lng: -122.4194 }, // Default center (San Francisco)
    zoom: 5,
  });

  // Add a click event listener to the map to add markers
  map.addListener("click", (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    addMarker(lat, lng);
  });
}

// Add a marker to the map with an "Add to Holiday" option
function addMarker(lat, lng) {
  const marker = new google.maps.Marker({
    position: { lat, lng },
    map: map,
    draggable: true,
  });

  const infoWindow = new google.maps.InfoWindow({
    content: `
            <h3>New Destination</h3>
            <p>Latitude: ${lat.toFixed(4)}, Longitude: ${lng.toFixed(4)}</p>
            <button class="add-to-holiday-btn">Add to Holiday Destinations</button>
        `,
  });

  infoWindow.open(map, marker);

  // Open the info window when the marker is clicked
  marker.addListener("click", () => {
    infoWindow.open(map, marker);
  });

  // Add event listener for the "Add to Holiday" button
  google.maps.event.addListener(infoWindow, "domready", () => {
    document
      .querySelector(".add-to-holiday-btn")
      .addEventListener("click", () => {
        addToHoliday(lat, lng);
        infoWindow.close(); // Close the info window after adding
      });
  });

  // Log the new position if the marker is dragged
  marker.addListener("dragend", (event) => {
    const newPosition = event.latLng;
    console.log(
      `Marker moved to Latitude: ${newPosition.lat()}, Longitude: ${newPosition.lng()}`
    );
  });
}

// Add the selected destination to the holiday list
function addToHoliday(lat, lng) {
  // Generate a name for the destination based on coordinates
  const name = `Destination ${holidayDestinations.length + 1}`;
  holidayDestinations.push({ name, lat, lng });

  // Update the holiday list in the "Holiday" section
  const holidayList = document.getElementById("holiday-list");
  const holidayItem = document.createElement("div");
  holidayItem.classList.add("holiday-item");
  holidayItem.innerHTML = `
        <h3>${name}</h3>
        <p>Latitude: ${lat.toFixed(4)}, Longitude: ${lng.toFixed(4)}</p>
    `;
  holidayList.appendChild(holidayItem);

  alert(`${name} has been added to your holiday destinations!`);
}

// Display Holiday Destinations (Pre-existing logic if needed)
function displayHolidayDestinations() {
  const holidayList = document.getElementById("holiday-list");
  holidayList.innerHTML = ""; // Clear existing destinations

  holidayDestinations.forEach((destination) => {
    const holidayItem = document.createElement("div");
    holidayItem.classList.add("holiday-item");
    holidayItem.innerHTML = `
            <h3>${destination.name}</h3>
            <p>Latitude: ${destination.lat.toFixed(
              4
            )}, Longitude: ${destination.lng.toFixed(4)}</p>
        `;
    holidayList.appendChild(holidayItem);
  });
}

// Initialize the map on page load
window.onload = () => {
  initHolidayMap();
};

// Handle itinerary form submission
const form = document.getElementById("itinerary-form");
const tripNameInput = document.getElementById("trip-name");
const checkInDateInput = document.getElementById("start-date");
const checkOutDateInput = document.getElementById("end-date");
const destinationInput = document.getElementById("destination");

// Save itinerary to localStorage
function saveItinerary(itinerary) {
  const user = JSON.parse(localStorage.getItem("currentUser")); // Get the current logged-in user
  if (!user) return; // If no user is logged in, return

  const userId = user.username; // Use the username as the unique identifier
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

// Display itineraries for the current user
function displayItineraries() {
  const user = JSON.parse(localStorage.getItem("currentUser")); // Get the current logged-in user
  if (!user) {
    window.location.href = "sign_in.html"; // Redirect if no user is logged in
    return;
  }

  const userId = user.username;
  const storedItineraries = localStorage.getItem(`itineraries-${userId}`);
  const itineraryList = document.getElementById("itinerary-list");
  removeNoItinerariesMessage();

  if (storedItineraries) {
    const itineraries = JSON.parse(storedItineraries);
    itineraryList.innerHTML = "";
    itineraries.forEach((itinerary, index) => {
      const itineraryItem = document.createElement("li");
      itineraryItem.innerHTML = `
                <h3>${itinerary.tripName}</h3> <br>
                <p>Check In Date: ${itinerary.checkInDate}</p> <br>
                <p>Check Out Date: ${itinerary.checkOutDate}</p> <br>
                <p>Destination: ${itinerary.destination}</p> <br>
                <button class="delete-btn" data-index="${index}">Delete</button>
            `;
      itineraryList.prepend(itineraryItem);
    });

    const deleteBtns = document.querySelectorAll(".delete-btn");
    deleteBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        deleteItinerary(index);
      });
    });
  } else {
    displayNoItinerariesMessage();
  }
}

// Delete itinerary
function deleteItinerary(index) {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) return; // If no user is logged in, return

  const userId = user.username;
  const storedItineraries = localStorage.getItem(`itineraries-${userId}`);
  if (storedItineraries) {
    const itineraries = JSON.parse(storedItineraries);
    itineraries.splice(index, 1);
    localStorage.setItem(`itineraries-${userId}`, JSON.stringify(itineraries));
    displayItineraries();
  }
}

// Display "no itineraries" message
function displayNoItinerariesMessage() {
  const itineraryList = document.getElementById("itinerary-list");
  const noItinerariesMessage = document.createElement("p");
  noItinerariesMessage.id = "no-itineraries-message";
  noItinerariesMessage.textContent =
    "No Itineraries. Create an itinerary to see your itinerary.";
  itineraryList.appendChild(noItinerariesMessage);
}

// Remove "no itineraries" message
function removeNoItinerariesMessage() {
  const noItinerariesMessage = document.getElementById(
    "no-itineraries-message"
  );
  if (noItinerariesMessage) {
    noItinerariesMessage.remove();
  }
}

// Handle itinerary form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const tripName = tripNameInput.value.trim();
  const checkInDate = checkInDateInput.value.trim();
  const checkOutDate = checkOutDateInput.value.trim();
  const destination = destinationInput.value.trim();

  let isValid = true;

  // Clear previous error messages
  document
    .querySelectorAll(".error-message")
    .forEach((error) => error.remove());

  // Validate trip name
  if (!tripName) {
    displayError(tripNameInput, "Trip name is required.");
    isValid = false;
  }

  // Validate check-in date
  if (!checkInDate) {
    displayError(checkInDateInput, "Check-in date is required.");
    isValid = false;
  } else if (new Date(checkInDate) < new Date()) {
    displayError(checkInDateInput, "Check-in date cannot be in the past.");
    isValid = false;
  }

  // Validate check-out date
  if (!checkOutDate) {
    displayError(checkOutDateInput, "Check-out date is required.");
    isValid = false;
  } else if (new Date(checkOutDate) <= new Date(checkInDate)) {
    displayError(
      checkOutDateInput,
      "Check-out date must be after the check-in date."
    );
    isValid = false;
  }

  // Validate destination
  if (!destination) {
    displayError(destinationInput, "Destination is required.");
    isValid = false;
  }

  // If the form is valid, save the itinerary
  if (isValid) {
    const itinerary = {
      tripName,
      checkInDate,
      checkOutDate,
      destination,
    };

    saveItinerary(itinerary); // Save itinerary to localStorage
    alert("Itinerary created successfully!");
    displayItineraries();

    // Add marker on the map (optional, customize based on the destination)
    const marker = new google.maps.Marker({
      position: { lat: 37.7859, lng: -122.4364 }, // Sample location
      map: map,
      title: tripName,
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `<h2>${tripName}</h2> <br> <p>Check In Date: ${checkInDate}</p> <br> <p>Check Out Date: ${checkOutDate}</p> <br> <p>Destination: ${destination}</p>`,
    });
    infoWindow.open(map, marker);

    // Clear form fields
    tripNameInput.value = "";
    checkInDateInput.value = "";
    checkOutDateInput.value = "";
    destinationInput.value = "";
  }
});

// Helper function to display error messages
function displayError(inputElement, message) {
  const errorMessage = document.createElement("p");
  errorMessage.classList.add("error-message");
  errorMessage.style.color = "red";
  errorMessage.textContent = message;
  inputElement.parentElement.appendChild(errorMessage);
  inputElement.style.borderColor = "red";
}

// Clear error message when the user interacts with the input
[tripNameInput, checkInDateInput, checkOutDateInput, destinationInput].forEach(
  (input) => {
    input.addEventListener("input", () => {
      input.style.borderColor = "";
      const error = input.parentElement.querySelector(".error-message");
      if (error) error.remove();
    });
  }
);

// Handle user info popup and logout
const userInfo = document.getElementById("user-icon");
const popup = document.getElementById("popup");
const closeBtn = document.getElementById("close-btn");
const logoutBtn = document.getElementById("logout-btn");

// Get the current logged-in user from localStorage
const user = JSON.parse(localStorage.getItem("currentUser"));

// Display user info in the popup
if (user) {
  document.getElementById("username").innerText = user.username;
  document.getElementById("email").innerText = user.email;
} else {
  window.location.href = "sign_in.html"; // Redirect if no user is found
}

// Show user itineraries count in the popup
userInfo.addEventListener("click", () => {
  popup.style.display = "flex";

  // Show the number of itineraries
  const userId = user.username;
  const storedItineraries = localStorage.getItem(`itineraries-${userId}`);
  const numItineraries = storedItineraries
    ? JSON.parse(storedItineraries).length
    : 0;
  document.getElementById("num-itineraries").innerText = numItineraries;
});

// Close the popup
closeBtn.addEventListener("click", () => {
  popup.style.display = "none";
});

// Logout the current user and redirect to sign-in page
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "sign_in.html";
  popup.style.display = "none";
});

const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelector(".nav-links");
const logo = document.getElementById("logo");
const dropdownMenu = document.getElementById("dropdown-menu");

hamburger.addEventListener("click", () => {
  if (navLinks.classList.toggle("active")) {
    logo.style.display = "none";
    userInfo.style.display = "none";
  } else {
    logo.style.display = "block";
    userInfo.style.display = "block";
  }
});

document.querySelector(".user-icon").addEventListener("click", () => {
  dropdownMenu.classList.toggle("show");
});

window.addEventListener("click", (e) => {
  if (!e.target.matches(".user-icon img")) {
    dropdownMenu.classList.remove("show");
  }
});

// const emailInput = document.getElementById("email");
// const errorPara = document.getElementById("errorPara");
// const subscribeBtn = document.getElementById("subscribe");

// subscribeBtn.addEventListener("click", () => {
//   const newsletterEmail = emailInput.value.trim();
//   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

//   if (newsletterEmail === "") {
//     errorPara.innerText = "Please enter a valid email address";
//   } else if (emailRegex.test(newsletterEmail)) {
//     errorPara.innerText = "Please enter a valid email address";
//   } else {
//     errorPara.innerText = "";
//     console.log("Subscribed:", newsletterEmail);
//   }
// });

// Initialize the map and display itineraries
displayItineraries();
initHolidayMap();
