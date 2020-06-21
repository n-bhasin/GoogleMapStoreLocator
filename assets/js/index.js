console.log("Hello Frndsss!");
let map;
let markers = [];
let infoWindow;
window.onload = () => {};

function initMap() {
  let torontoDowntown = { lat: 43.65107, lng: -79.347015 };
  map = new google.maps.Map(document.getElementById("map"), {
    center: torontoDowntown,
    zoom: 11,
    mapTypeId: "roadmap",
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
    },
    styles: [
      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
      },
    ],
  });
  infoWindow = new google.maps.InfoWindow();
  searchStores();
}

searchStores = () => {
  console.log("searching");

  let foundStores = [];
  const zipCode = document.getElementById("zip-code-input").value;

  if (zipCode) {
    stores.map((store) => {
      let postal = store["address"]["postalCode"].substring(0, 5);
      let postal1 = store["address"]["postalCode"].substring(0, 1);
      let postal2 = store["address"]["postalCode"].substring(0, 2);
      let postal3 = store["address"]["postalCode"].substring(0, 3);
      let postal4 = store["address"]["postalCode"].substring(0, 4);
      if (
        postal == zipCode ||
        zipCode == postal1 ||
        postal2 == zipCode ||
        postal3 == zipCode ||
        postal4 == zipCode
      ) {
        foundStores.push(store);
      }
    });
  } else {
    foundStores = stores;
  }
  displayStoreData(foundStores);
  showStoreMarkers(foundStores);
  setOnClickListener();
};

displayStoreData = (stores) => {
  let html = "";
  stores.map((store, index) => {
    let address = store["addressLines"];
    let phoneNumber = store["phoneNumber"];
    html += `
    <div class="card  mb-1 store-container" >
    <div class="store-container-background">
        <div class="card-body" >
            <blockquote class="blockquote mb-0 store-address">
                <span>${address[0]}</span><br/>
                <span>${address[1]}</span>
                <footer class="text-muted store-phone-number">${phoneNumber}</footer>
            </blockquote>
            <div id="store-number-container" class="store-number-container d-flex flex-column align-items-center justify-content-end  ">
                <div id="store-number">
                 ${index + 1}
                </div>
            </div>
        </div>
        </div>
    </div>
    `;
    document.querySelector(".store-list").innerHTML = html;
  });
};

showStoreMarkers = (stores) => {
  let bounds = new google.maps.LatLngBounds();
  console.log(bounds);
  stores.map((store, index) => {
    let name = store["name"];
    let address = store["addressLines"][0];
    let latlng = new google.maps.LatLng(
      store["coordinates"]["latitude"],
      store["coordinates"]["longitude"]
    );
    let openStatusText = store["openStatusText"];
    let phoneNumber = store["phoneNumber"];
    bounds.extend(latlng);
    createMarker(latlng, name, address, openStatusText, phoneNumber, index);
  });
  map.fitBounds(bounds);
};

createMarker = (latlng, name, address, openStatusText, phoneNumber, index) => {
  let i = parseInt(index.toString());

  i = i + 1;
  let html = `
  <div class="store-info-window">
      <div class="store-info-name">${name}</div>
      <div class="store-info-status">${openStatusText}</div>
      <div class="store-info-address">
          <div class="circle">
              <i class="fas fa-location-arrow"></i>
          </div>
          ${address}
      </div>
      <div class="store-info-phone">
           <div class="circle">
              <i class="fas fa-phone-alt"></i>
            </div>
          ${phoneNumber}
      </div>
  </div>  
`;

  let marker = new google.maps.Marker({
    map: map,
    position: latlng,

    title: name,

    animation: google.maps.Animation.DROP,
  });
  google.maps.event.addListener(marker, "click", () => {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
};

setOnClickListener = () => {
  let storeElements = document.querySelectorAll(".store-container");
  for (const [index, storeElement] of storeElements.entries()) {
    console.log(storeElement);
    storeElement.addEventListener("click", () => {
      google.maps.event.trigger(markers[index], "click");
    });
  }
};

toggleBounce = () => {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
};
