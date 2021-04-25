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


function getAuthStartDate(date) {

    return date;
    
    // return date.length;

    // var date = new Date(date);

    // var year = date.getFullYear();
    // if(year === undefined || isNaN(year) ){
    //     return undefined;
    // }
    // var month = date.getMonth();
    
    // if(month === undefined){
    //     month = "0";
    // }

    // date = year + "" + ("0" + (month + 1)).slice(-2);
    // return parseInt(date);


}
