---
---

// // var author = {{ site.data.countries | jsonify }};
// // var continents = {{ site.data.continents | jsonify }};
var CountryDB = {{ site.data.countries | jsonify }};


// console.log(Countries)

var IntersectionDB = {{ site.data.intersections | jsonify }};
// console.log(IntersectionDB);
// // var itineraries = {{ site.data.itineraries | jsonify }};
// // var places = {{ site.data.places | jsonify }};


// formate IntersectionDB
var TempDB = {};

// minDateRange
const minDateRange = parseInt("{{ site.min_date_range }}");
