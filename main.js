window.addEventListener("load", () => {
    document.body.classList.add("loaded");
  });
  
  window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".nav-bar");
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  });
  
  let map;
  const holidayDestinations = [];
  
  // Initialize the map
  function initHolidayMap() {
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 37.7749, lng: -122.4194 },
      zoom: 5,
    });
  
    map.addListener("click", (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      addMarker(lat, lng);
    });
  
    loadHolidayDestinations();
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
  
    marker.addListener("click", () => {
      infoWindow.open(map, marker);
    });
  
    google.maps.event.addListener(infoWindow, "domready", () => {
      document
        .querySelector(".add-to-holiday-btn")
        .addEventListener("click", () => {
          addToHoliday(lat, lng);
          infoWindow.close();
        });
    });
  
    marker.addListener("dragend", (event) => {
      const newPosition = event.latLng;
      console.log(
        `Marker moved to Latitude: ${newPosition.lat()}, Longitude: ${newPosition.lng()}`
      );
    });
  }
  
  // Add the selected destination to the holiday list
  function addToHoliday(lat, lng) {
    const name = prompt("Enter a name for this holiday destination:", "My Destination");
    if (!name) return; // User cancelled or submitted empty
  
    const newDestination = { name, lat, lng };
    holidayDestinations.push(newDestination);
  
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      const userId = user.username;
      const storedDestinations = localStorage.getItem(`destinations-${userId}`);
      const destinations = storedDestinations
        ? JSON.parse(storedDestinations)
        : [];
      destinations.push(newDestination);
      localStorage.setItem(
        `destinations-${userId}`,
        JSON.stringify(destinations)
      );
    }
  
    const holidayList = document.getElementById("holiday-list");
  
    const noDestinationsMessage = document.querySelector(".no-destinations");
    if (noDestinationsMessage) noDestinationsMessage.remove();
  
    const index = holidayDestinations.length - 1;
    const holidayItem = document.createElement("li");
    holidayItem.classList.add("holiday-item");
    holidayItem.innerHTML = `
      <h3>${name}</h3>
      <p>Latitude: ${lat.toFixed(4)}, Longitude: ${lng.toFixed(4)}</p>
      <button class="delete-destination-btn" data-index="${index}">Delete</button>
    `;
    holidayList.appendChild(holidayItem);
  
    holidayItem
      .querySelector(".delete-destination-btn")
      .addEventListener("click", () => {
        deleteHolidayDestination(index);
      });
  
    alert(`"${name}" has been added to your holiday destinations!`);
  }
  
  
  function displayNoHolidayDestinationMessage() {
    const holidayList = document.getElementById("holiday-list");
    holidayList.innerHTML = `
            <div class="no-destinations">
              <img src="photos/trash-bin.png" alt="No destinations" width="48" height="48">
              <p>No destinations. Add a destination to view your holiday plans.</p>
          </div>`;
  }
  
  // Load holiday destinations from local storage
  function loadHolidayDestinations() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      const userId = user.username;
      const storedDestinations = localStorage.getItem(`destinations-${userId}`);
      const holidayList = document.getElementById("holiday-list");
  
      holidayList.innerHTML = "";
      holidayDestinations.length = 0;
  
      if (storedDestinations) {
        const destinations = JSON.parse(storedDestinations);
        holidayDestinations.push(...destinations);
  
        if (destinations.length === 0) {
          displayNoHolidayDestinationMessage();
        } else {
          destinations.forEach((destination, index) => {
            const holidayItem = document.createElement("li");
            holidayItem.classList.add("holiday-item");
            holidayItem.innerHTML = `
              <h3>${destination.name}</h3>
              <p>Latitude: ${destination.lat.toFixed(
              4
            )}, Longitude: ${destination.lng.toFixed(4)}</p>
              <button class="delete-destination-btn" data-index="${index}">Delete</button>
            `;
            holidayList.appendChild(holidayItem);
  
            holidayItem
              .querySelector(".delete-destination-btn")
              .addEventListener("click", () => {
                deleteHolidayDestination(index);
              });
          });
        }
      } else {
        displayNoHolidayDestinationMessage();
      }
    }
  }
  
  function deleteHolidayDestination(index) {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return;
  
    const userId = user.username;
    const storedDestinations = localStorage.getItem(`destinations-${userId}`);
    if (storedDestinations) {
      const destinations = JSON.parse(storedDestinations);
      destinations.splice(index, 1); // Remove destination at index
      localStorage.setItem(
        `destinations-${userId}`,
        JSON.stringify(destinations)
      );
      loadHolidayDestinations(); // Re-render updated list
    }
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
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      const userId = user.username;
      const storedItineraries = localStorage.getItem(`itineraries-${userId}`);
      const itineraryList = document.getElementById("itinerary-list");
      if (storedItineraries) {
        const itineraries = JSON.parse(storedItineraries);
        itineraryList.innerHTML = "";
        if (itineraries.length === 0) {
          displayNoItinerariesMessage();
        } else {
          itineraries.forEach((itinerary, index) => {
            const itineraryItem = document.createElement("li");
            itineraryItem.innerHTML = `
          <h3>${itinerary.tripName}</h3>
          <br>
          <p>Check In Date: ${itinerary.checkInDate}</p>
          <br>
          <p>Check Out Date: ${itinerary.checkOutDate}</p>
          <br>
          <p>Destination: ${itinerary.destination}</p>
          <br>
          <button class="delete-btn" data-index="${index}">Delete</button>
        `;
            itineraryList.appendChild(itineraryItem);
          });
          const deleteBtns = document.querySelectorAll(".delete-btn");
          deleteBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
              const index = e.target.dataset.index;
              deleteItinerary(index);
            });
          });
        }
      } else {
        displayNoItinerariesMessage();
      }
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
    itineraryList.innerHTML = `
              <div class="no-itineraries">
              <img src="photos/trash-bin.png" alt="No destinations" width="48" height="48">
              <p>No itineraries. Create an itinerary to view your plans.</p>
          </div>
          `;
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
  
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  const closeBtn = document.getElementById('closeBtn');
  
  hamburger.addEventListener('click', () => {
    sidebar.classList.add('active');
  });
  
  closeBtn.addEventListener('click', () => {
    sidebar.classList.remove('active');
  });
  
  // Optional: Close sidebar if user clicks outside of it
  window.addEventListener('click', (e) => {
    if (sidebar.classList.contains('active') && !sidebar.contains(e.target) && !hamburger.contains(e.target)) {
      sidebar.classList.remove('active');
    }
  });
  
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('nav-bar');
    if (window.scrollY > 50) {
      navbar.classList.add('sticky');
    } else {
      navbar.classList.remove('sticky');
    }
  });
  
  // JavaScript for carousel with controls
  let currentSlide = 0;
  const carousel = document.querySelector('.carousel');
  const slides = document.querySelectorAll('.carousel-item');
  const totalSlides = slides.length;
  
  function goToSlide(index) {
    carousel.style.transform = `translateX(-${index * 100}%)`;
    currentSlide = index;
  }
  
  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    goToSlide(currentSlide);
  }
  
  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    goToSlide(currentSlide);
  }
  
  // Auto-slide every 3 seconds
  let autoSlide = setInterval(nextSlide, 3000);
  
  // Pause auto-slide on button click and resume after 5 seconds
  document.querySelectorAll('.carousel-button').forEach(button => {
    button.addEventListener('click', () => {
      clearInterval(autoSlide);
      autoSlide = setInterval(nextSlide, 5000); // Resume after 5 seconds
    });
  });
  // Initialize the map and display itineraries
  displayItineraries();
  initHolidayMap();
  