const apiKey = "YOUR_API_KEY";
const destinationInput = document.getElementById('destination-name');
const destinationSuggestions = document.getElementById('destination-suggestions');
const itineraryContainer = document.getElementById('itinerary-container');
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');
const addDestinationBtn = document.getElementById('add-btn');
const itineraryList = document.getElementById('itinerary-list');

destinationInput.addEventListener('input', (e) => {
    const destination = e.target.value.trim();
    if (destination) {
        getAutocompleteSuggestions(destination);
    }
});

addDestinationBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const destination = destinationInput.value.trim();
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    if (destination && startDate && endDate) {
        const placeId = destinationSuggestions.querySelector('div').getAttribute("data-place-id");
        getPlaceDetails(placeId);
    } else {
        alert('Please fill in all fields to continue');
    }
});

// function getAutocompleteSuggestions(destination) {
//     const url = ``;
//     fetch(url)
//     .then((response) => response.json())
//     .then((data) => {
//         suggestions = data.predictions;
//         if (suggestions.length > 0) {
//             displayAutocompleteSuggestions(suggestions);
//         }
//     })
//     .catch((error) => console.error(error));
// }

// function displayAutocompleteSuggestions(suggestions) {
//     destinationSuggestions.innerHTML = "";
//     suggestions.forEach((suggestions) => {
//         const suggestionHTML = `<div data-place-id="${suggestion.place_id}">${suggestion.description}</div>`;

//         destinationSuggestions.insertAdjacentHTML('beforeend', suggestionHTML);

//         const suggestionDivs = destinationSuggestions.querySelectorAll('div');

//         suggestionDivs.forEach((div) => {
//             div.addEventListener("click", (e) => {
//                 const placeId = e.target.getAttribute("data-place-id");

//                 getPlaceDetails(placeId);
//             });
//         });
//     });
// }

// function getPlaceDetails(placeId) {
//     const url = ``;
//     fetch (url)
//     .then((response) => response.json())
//     .then((data) => {
//         const place = data.result;

//         addDestinationToItinerary(place);
//     })
//     .catch((error) => console.error(error))
// }

// function addDestinationToItinerary(place) {
//     const startDate = startDateInput.value;
//     const endDate = endDateInput.value;
//     const destinationHTML = `
//     <li>
//     <h3>${place.name}</h3>
//     <p>${place.formatted_address}</p>
//     <p>Start Date: ${startDate}</p>
//     <p>End Date: ${endDate}</p>
//     <button class="edit-btn">Edit</button>
//     <button class="delete-btn">Delete</button>
//     </li>`;

//     itineraryList.insertAdjacentHTML("beforeend", destinationHTML);

//     const editButton = itineraryList.querySelector(".edit-btn");
//     const deleteButton = itineraryList.querySelector(".delete-btn");
//     editButton.addEventListener("click", () => {
//         editDestination(place);
//     });

//     deleteButton.addEventListener("click", () => {
//         deleteDestintion(place, deleteButton)
//     })
// }

// let map;

// function initMap() {
//     map = new google.maps.Map(document.getElementById('map'), {
//         center: {lat: 37.7749, lng: -122.4194},
//         zoom: 12,
//     });
// }

// function displayItineraryOnMap(itinerary) {
//     itinerary.forEach((destination, index) => {
//         const marker = new google.maps.Marker({
//             position: destination.geometry.location,
//             map: map,
//             title: destination.name,
//         });
//         if (index > 0) {
//             const previousDestination = itinerary[index - 1];

//         displayRouteBtwnDestinations(previousDestination, destination);
//         }
//     });   
// }

// // function addDestinationToItinerary(place) {
// //     const startDate = startDateInput.value;
// //     const endDate = endDateInput.value;
// //     const destinationHTML = `<h3>${place.name}</h3>
// //     <p>${place.formatted_address}</p>
// //     <p>Start Date: ${startDate}</p>
// //     <p>End Date: ${endDate}</p>`;
// //     itineraryContainer.insertAdjacentHTML("beforeend", destinationHTML);
// //     displayItineraryOnMap([place]);
// // }

// function displayRouteBtwnDestinations(origin, destination) {
//     const directionService = new google.maps.DirectionService();
//     const directionRenderer = new google.maps.DirectionRenderer();
//     directionRenderer.setMap(map);
//     const request = {
//         origin: origin.geometry.location, destination: destination.geometry.location, travelMode: "DRIVING",
//     };
//     directionService.route(request, (result, status) => {
//         if (status === "OK") {
//             directionRenderer.setDirections(result);
//         }
//     });
// }

// function editDestination(place) {
//     const editDestinationPopup = document.getElementById('edit-destination-popup');
//     editDestinationPopup.style.display = "block";
//     const editDestinationForm = document.getElementById('edit-destination-form');
//     const editDestinationNameInput = document.getElementById('edit-destination-name');
//     const editStartDateInput = document.getElementById('edit-start-date');
//     const editEndDateInput = document.getElementById('edit-end-date');

//     editDestinationNameInput.value = place.name;
//     editStartDateInput.value = startDateInput.value;
//     editEndDateInput.value = endDateInput.value;

//     const saveEditsButton = document.getElementById("save-edit-btn");

//     saveEditsButton.addEventListener("click", () => {
//         const editedDestinationName = editDestinationNameInput.value;
//         const editedStartDate = editStartDateInput.value;
//         const editedEndDate = editEndDateInput.value;

//         const itineraryListItems = itineraryList.children;
//         for (const item of itineraryListItems) {
//             if (item.querySelector('h3').textContent === place.name) {
//                 item.querySelector("h3").textContent = editedDestinationName;

//                 item.querySelector("p:nth-child(3)").textContent = `Start Date: ${editedStartDate}`;

//                 item.querySelector("p:nth-child(4)").textContent = `Edited  Date: ${editedEndDate}`;
//             }
//         }
//         editDestinationPopup.style.display = "none";
//     });
// }

// function saveItineraryToLocalStorage() {
//     const itineraryListItems = itineraryList.children;
//     const itinerary = [];
//     for (const item of itineraryListItems) {
//         const destinationName = item.querySelector("h3").textContent;
//         const destinationAddress = item.querySelector("p:nth-child(2)").textContent;
//         const startDate = item.querySelector("p:nth-child(3)").textContent.split("")[1];
//         const endDate = item.querySelector("p:nth-child(4)").textContent.split("")[1];
//         itinerary.push({
//             name: destinationName,
//             address: destinationAddress,
//             startDate: startDate,
//             endDate: endDate
//         });
//     }
//     localStorage.setItem("itinerary", JSON.stringify(itinerary));
// }

// document.getElementById('save-itinerary-btn').addEventListener("click", saveItineraryToLocalStorage);

// function loadItineraryFromLStorage() {
//     const storedItinerary = localStorage.getItem("itinerary");
//     if (storedItinerary) {
//         const itinerary =JSON.parse(storedItinerary);
//         itinerary.forEach((destination)=> {
//             const destinationHTML = <li>
//                 <h3>${destination.name}</h3>
//                 <p>${destination.address}</p>
//                 <p>Start Date: ${destination.startDate}</p>
//                 <p>End Date: ${destination.endDate}</p>
//                 <button class="edit-btn">Edit</button>
//                 <button class="delete-btn">Delete</button>
//             </li>;
//             itineraryList.insertAdjacentHTML("beforeend", destinationHTML);
//         });
//     }
// }

// document.addEventListener("DOMContentLoaded", loadItineraryFromLStorage);

// document.getElementById("clr-itinerary-btn").addEventListener("click", clearItinerary);

// function clearItinerary() {
//     itineraryList.innerHTML = "";
//     localStorage.removeItem(username);
// }

const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
const dropdownMenu = document.getElementById('dropdown-menu');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

document.querySelector('.user-icon').addEventListener('click', () => {
    dropdownMenu.classList.toggle('show');
});

window.addEventListener('click', (e) => {
    if (!e.target.matches('.user-icon img')) {
        dropdownMenu.classList.remove('show');
    }
});