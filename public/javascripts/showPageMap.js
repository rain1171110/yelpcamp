
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  center: campground.geometry.coordinates, // [lng, lat]
  zoom: 8,
});

map.addControl(new mapboxgl.NavigationControl());

map.on("load", () => {
  const layers = map.getStyle().layers || [];
  for (const layer of layers) {
    if (layer.layout && layer.layout["text-field"]) {
      map.setLayoutProperty(layer.id, "text-field", [
        "coalesce", ["get", "name_ja"], ["get", "name"],
      ]);
    }
  }
});

new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(
    `<h4>${campground.title}</h4><p>${campground.location}</p>`
  ))
  .addTo(map);
