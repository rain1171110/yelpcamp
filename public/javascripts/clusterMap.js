// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "cluster-map",
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  // v3使用時
  // style: "mapbox://styles/mapbox/standard",

  // v2スタイルを使う（言語はレイヤ書き換えで対応）
  style: "mapbox://styles/mapbox/streets-v12",
  center: [138, 39],
  zoom: 3,
});
map.addControl(new mapboxgl.NavigationControl());

map.on("load", () => {
  const layers = map.getStyle().layers;
  layers.forEach((layer) => {
    if (layer.layout && layer.layout["text-field"]) {
      map.setLayoutProperty(layer.id, "text-field", [
        "coalesce",
        ["get", "name_ja"],
        ["get", "name"],
      ]);
    }
  });

  // データソース
  map.addSource("campgrounds", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: campgrounds,
    },
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
  });

  // クラスタ表示
  map.addLayer({
    id: "clusters",
    type: "circle",
    source: "campgrounds",
    filter: ["has", "point_count"],
    paint: {
      "circle-color": [
        "step",
        ["get", "point_count"],
        "red",
        20,
        "orange",
        40,
        "yellow",
      ],
      "circle-radius": ["step", ["get", "point_count"], 15, 20, 20, 40, 25],
    },
  });

  // クラスタ内の数字
  map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "campgrounds",
    filter: ["has", "point_count"],
    layout: {
      "text-field": ["get", "point_count_abbreviated"],
      "text-size": 12,
    },
  });

  // 単独ポイント
  map.addLayer({
    id: "unclustered-point",
    type: "circle",
    source: "campgrounds",
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": "#11b4da",
      "circle-radius": 4,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#fff",
    },
  });

  // 👇 v2流儀のイベントハンドラ
  map.on("click", "clusters", (e) => {
    console.log("クラスタークリック");
    const features = map.queryRenderedFeatures(e.point, {
      layers: ["clusters"],
    });
    const clusterId = features[0].properties.cluster_id;
    map
      .getSource("campgrounds")
      .getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        map.easeTo({ center: features[0].geometry.coordinates, zoom });
      });
  });

  map.on("click", "unclustered-point", (e) => {
    const { popupMarkup } = e.features[0].properties;
    const f = e.features[0];
    new mapboxgl.Popup()
      .setLngLat(f.geometry.coordinates)
      .setHTML(popupMarkup ||`<pre>${JSON.stringify(f.properties, null, 2)}</pre>`)
      // .setHTML(`<pre>${JSON.stringify(f.properties, null, 2)}</pre>`)
      .addTo(map);
  });

  // マウスカーソルの変更
  map.on("mouseenter", "clusters", () => {
    console.log("クラスターマウスエンター");
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "clusters", () => (map.getCanvas().style.cursor = ""));
  map.on(
    "mouseenter",
    "unclustered-point",
    () => (map.getCanvas().style.cursor = "pointer")
  );
  map.on(
    "mouseleave",
    "unclustered-point",
    () => (map.getCanvas().style.cursor = "")
  );
});
