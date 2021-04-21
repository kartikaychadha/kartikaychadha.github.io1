---
---

// minDateRange // so max slider date range minDateRange+120 years
const minDateRange = {{ site.min_date_range }};

// json data
const authorData = {{ site.data.author | jsonify }};
const intersectionData = {{ site.data.intersections | jsonify }};
const itinerarieData = {{ site.data.itineraries | jsonify }};
const placeData = {{ site.data.places | jsonify }};
const continentData = {{ site.data.countries | jsonify }};
