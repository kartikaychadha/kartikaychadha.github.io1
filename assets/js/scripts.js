// var map = L.map('mapid').setView([8.75,42.19], 3);
var map = L.map('mapid').setView([51.505, -0.09], 13);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 4,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1,
    mixZoom: 3,
}).addTo(map);

var geoJSON = L.geoJSON([]);

// Create a new date from a string, return as a timestamp.
/**
 * @param string 
 * @return int
 */
function timestamp(str) {
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
function convertTimestampNumber(milliseconds) {
    var date = new Date(parseInt(milliseconds));

    var year = date.getFullYear(),
        month = (date.getMonth() + 1).toString().padStart(2, "0");
    return year + "-" + month;
}




/* ========================================================================
*
* ========================================================================
*/



class Trajectories {

    constructor() {
        slider_range();
    }
}


function get_start_date() {

    var date = new Date($(".date-start").html().trim());

    var year = date.getFullYear(),
        month = (date.getMonth() + 1).toString().padStart(2, "0");

    return year + "-" + month;
}


function get_end_date() {

    var date = new Date($(".date-end").html().trim());

    var year = date.getFullYear(),
        month = (date.getMonth() + 1).toString().padStart(2, "0");

    return year + "-" + month;
}

var dateSlider = document.getElementById('slider-date');

class Intersections {

    data = {};

    constructor() {
        this.createSlider();
        this.init();
    }

    createSlider(){
        // slider range

        var range_all_sliders = {
            'min': [timestamp('' + minDateRange)],
            "8.333333333%": [timestamp('' + (minDateRange + 10))],
            "16.6667%": [timestamp('' + (minDateRange +20))],
            "25%": [timestamp('' + (minDateRange +30))],
            "33.3333%": [timestamp('' + (minDateRange +40))],
            "41.6667%": [timestamp('' + (minDateRange +50))],
            "50%": [timestamp('' + (minDateRange +60))],
            "58.3333%%": [timestamp('' + (minDateRange +70))],
            "66.6667%": [timestamp('' + (minDateRange +80))],
            "75%": [timestamp('' + (minDateRange +90))],
            "83.3333%": [timestamp('' + (minDateRange +100))],
            "91.6667%": [timestamp('' +( minDateRange +110))],
            'max': [timestamp('' + (minDateRange +120))]
        }

        //create a slider
        noUiSlider.create(dateSlider, {
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
        
    }

    /**
 * slider date init;
 */
    init() {

        L.geoJSON([CountryDB], {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: 8,
                    fillColor: "#ff7800",
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            }
        }).addTo(map);

        // set start point and end point
        dateSlider.noUiSlider.on('update', function (values, handle) {
            var date = new Date(parseInt(values[handle])).toLocaleDateString('default', {
                month: 'short',
                year: 'numeric'
            })
            if (handle) {
                $('.date-start').html(date);
            } else {
                $('.date-end').html(date);
            }
        });


        dateSlider.noUiSlider.on('change', function (values, handle) {

            var start_date = parseInt(convertTimestampNumber(values[0]).replace('-', ''));
            var end_date = parseInt(convertTimestampNumber(values[1]).replace('-', ''));

            TempDB = {};
            for (var key in IntersectionDB) {
                var dataIndex = parseInt("" + key.replace('-', ''));

                if (end_date > dataIndex && start_date < dataIndex) {
                    TempDB[key] = IntersectionDB[key]
                }

            }

            console.dir(Intersections.prototype.setData(TempDB));
            console.dir(Intersections.prototype.getData());
            // console.dir(TempDB);

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
    }


    setData(data){
        this.data = data
        return true;
    }

    getData(){
        return this.data;
    }
}


function onEachFeature(feature, layer) {

    var latlng = layer;
    console.log(latlng);
    // L.circleMarker(latlng, {
    //     radius: 8,
    //     fillColor: "#ff7800",
    //     color: "#000",
    //     weight: 1,
    //     opacity: 1,
    //     fillOpacity: 0.8
    // }).addTo(map)
}





// remove legend popup
$(".legend").on('click', function () {
    $(this).fadeOut(300);
});

// active pointer
$("").on('click', function () {

});