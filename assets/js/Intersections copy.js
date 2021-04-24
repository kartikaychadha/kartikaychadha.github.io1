//valiable
var geoJSON = L.geoJSON([]);
const Slider = document.getElementById('slider-date');
var geoJSONlayers = {};
var targetIntersection= {};

// var map = L.map('mapid').setView([8.75,42.19], 3);
const map = L.map('mapid').setView([51.505, -0.09], 4);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 4,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1,
    mixZoom: 4,
}).addTo(map);


// Create a new date from a string, return as a timestamp.
/**
 * @param string 
 * @return int
 */
function timestamp(str) {
    if(typeof str === 'number') {
        str += "";
    }
    return parseInt(new Date(str).getTime());
}

/**
 * 
 * @param int
 * @return  string // "m YYYY"
 */
function convertTimestamp(milliseconds) {
    return new Date(parseInt(milliseconds)).toLocaleDateString('en-GB', {
        month: 'short',
        year: 'numeric'
    });
}

/**
 *
 * @param int
 * @return  string // "m YYYY"
 */
function convertTimestampNumber(date) {
    var date = new Date(date);

    var year = date.getFullYear();
    if(year === undefined || isNaN(year) ){
        return undefined;
    }
    var month = date.getMonth();
    
    if(month === undefined){
        month = "0";
    }

    date = year + "" + ("0" + (month + 1)).slice(-2);
    return parseInt(date);
}

/* ========================================================================
*
* ========================================================================
*/

//init slider range
$(function () {
    // slider range
    const range_all_sliders = {
        'min': [timestamp(minDateRange)],
        "8.333333333%": [timestamp(minDateRange + 10)],
        "16.6667%": [timestamp(minDateRange + 20)],
        "25%": [timestamp( minDateRange + 30)],
        "33.3333%": [timestamp( minDateRange + 40)],
        "41.6667%": [timestamp(minDateRange + 50)],
        "50%": [timestamp(minDateRange + 60)],
        "58.3333%%": [timestamp(minDateRange + 70)],
        "66.6667%": [timestamp(minDateRange + 80)],
        "75%": [timestamp(minDateRange + 90)],
        "83.3333%": [timestamp(minDateRange + 100)],
        "91.6667%": [timestamp(minDateRange + 110)],
        'max': [timestamp(minDateRange + 120)]
    }

    //create a slider
    noUiSlider.create(Slider, {
        range: range_all_sliders,
        orientation: 'vertical',
        connect: true,
        // Two more timestamps indicate the handle starting positions.
        start: [range_all_sliders.min, range_all_sliders.max],
        behaviour: 'tap',
        pips: {
            mode: 'range',
            density: 12
        },
    });


    // date minisecound to year "YYYY" // 2000
    $(".noUi-value").each(function () {
        try {
            $(this).html(
                new Date(parseInt($(this).html()))
                    .toLocaleDateString('en-GB', { year: 'numeric' })
            );
        } catch (error) {
            // console.log("invalid date");
        }
    });

    // remoev marker
    $(".noUi-marker-vertical").each(function () {
        $(this).remove();
    });

    // fixed top spacing issue
    $(".noUi-handle-lower").css('top', '-12px');

    currentIntersection();
    InsertLayout()

    // currentIntersection();

    // set start point and end point
    Slider.noUiSlider.on('update', function (values, handle) {
        var date = new Date(parseInt(values[handle]))
            .toLocaleDateString('default', {
            month: 'short',
            year: 'numeric'
        })
        if (handle) {
            $('.date-start').html(date);
        } else {
            $('.date-end').html(date);
        }
    });


    Slider.noUiSlider.on('change', function () {

        currentIntersection();
        removeGeoJSONlayout();
        InsertLayout();
    });

    

});

function currentIntersection() {

    var value = Slider.noUiSlider.get();
    var start_date = convertTimestampNumber(parseInt(value[0]));
    var end_date = convertTimestampNumber(parseInt(value[1]));

    var intersectionTemp = intersectionData;

    for (let key in intersectionTemp) {
        // end_date > dataIndex &&
        for (var PlaceKey in intersectionTemp[key]) {
            for (let authorKey in intersectionTemp[key][PlaceKey]) {

                if(targetIntersection[PlaceKey] === undefined){
                    targetIntersection[PlaceKey] = [];
                }

                var authPlace = intersectionTemp[key][PlaceKey][authorKey]['PlaceID'];
                var authorEnd = convertTimestampNumber(intersectionTemp[key][PlaceKey][authorKey]['EndDate']);
                var authorStart = convertTimestampNumber(intersectionTemp[key][PlaceKey][authorKey]['StartDate']);

                // console.dir( authorEnd + " = " + end_date);
                if( authorEnd < end_date && PlaceKey === authPlace 
                    || authorEnd === undefined && PlaceKey === authPlace ){

                        targetIntersection[PlaceKey].push(intersectionTemp[key][PlaceKey][authorKey]);   
                        delete  intersectionTemp[key][PlaceKey][authorKey];
                            
                        if(authorStart < start_date ){
                            
                        }
                    }
                }
        }    
    }

    for (const key in targetIntersection) {
        // remove array empty 
        if (targetIntersection[key].length === 0) {
            delete targetIntersection[key];
        }
    }

    // console.dir(targetIntersection);

    return targetIntersection;
}

var continentDataTarget = continentData;

function InsertLayout() {

    function onEachFeature(feature, layer) {

        layer.on('click', function(){
            showAuthors(feature);
        });
        // var layers = {};
        //
        // var index  = feature['id'];
        // layers.push(Intersections.prototype.Layers);
        //
        // Intersections.prototype.Layers = layers;
        // console.log(layers);

        // [feature['id']] = layer;
    }



    L.geoJSON(continentDataTarget, {

        pointToLayer: function (feature, latlng) {
            // console.log(i);
            var layer =  L.circleMarker(latlng, {
                radius: 8,
                fillColor: "#ff7800",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
            geoJSONlayers[feature['id']] = layer;
            return layer;
        },
        filter: function(feature) {

            var users = getIntersectionUsers(feature.properties.PlaceID);

            console.dir(users);

            if( Object.keys(users).length == 0){
                return false;
            }

            // continentDataTarget.features[feature.id].users = users;
        
            return true;
            
        },
        onEachFeature: onEachFeature,
    }).addTo(map);
}

function getIntersectionUsers(placeID){

    var users = {};    
    var start_range = convertTimestampNumber(Slider.noUiSlider.get()[0]);
    var end_range = convertTimestampNumber(Slider.noUiSlider.get()[1]);
    

    var data = targetIntersection[placeID];

    if(data === undefined){
        return {};
    }
    var i = 0;
    for (const key in data) {
        //check start date
        var StartDate = convertTimestampNumber(data[key]['StartDate']);
        var EndDate = convertTimestampNumber(data[key]['EndDate']);
        

        // compre start range 
        if(start_range > StartDate){
            //continue;
        } 

        // end date compre 
        if(data[key]['EndDate'] == ""){
            users[i] = data[key];
            i++;
        }
        
        if(end_range> EndDate){
            users[i] = data[key];
            i++;
        }

    }

    if(users === undefined || Object.keys(users).length ===0 ){
        return {};
    }
    return users;
}

// return void
function removeGeoJSONlayout() {

    for (let index in geoJSONlayers) {
        geoJSONlayers[index].remove();
    }
    $(".results .title").html("");
    $("#intersections-results").html("");
}

// show authors
function showAuthors(feature){

    var title = feature['properties']['city'] + ", " + feature['properties']['country'];
    var users = getIntersectionUsers(feature.properties.PlaceID);

    console.log(users);

    var html = "";

    html ="" +
    '<div class="item id_4" style="opacity: 1;">Eslanda Goode Robeson'+
    '<div class="item_date">'+
    '1949-12&nbsp;–&nbsp;1950-01</div>'+
    '</div>'+
    '<div class="item id_10" style="opacity: 0.666667;">'+
    'W.E.B. Dubois'+
    '<div class="item_date">1959-02</div>'+
    '</div>'+
    ''+
    '<div class="item id_9" style="opacity: 1;">'+
    'René Depestre'+
    '<div class="item_date">'+
    '1960-11-30&nbsp;–&nbsp;1961-02'+
    '</div>'+
    '</div>'

    $(".results .title").html(title);
    $("#intersections-results").html(html);


}

// remove legend popup
$(".legend").on('click', function () {
    $(this).fadeOut(300);
});

