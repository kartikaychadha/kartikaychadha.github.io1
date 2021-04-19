
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
    function convertTimestamp( milliseconds )
    {
        return new Date(parseInt(milliseconds)).toLocaleDateString('en-GB', {
            month : 'short',
            year : 'numeric'
        });
    }

    /**
     *
     * @param int
     * @return  string // "m YYYY"
     */
    function convertTimestampNumber( milliseconds )
    {
        var date =  new Date(parseInt(milliseconds));

        var year  = date.getFullYear(),
            month = (date.getMonth() + 1).toString().padStart(2, "0");
        return year +"-" + month;
    }


/**
     * slider date init;
     */
    function slider_range(){

          // slider range
        var range_all_sliders = {
            'min': [ timestamp('1889')],
            "8.333333333%": [timestamp('1899')],
            "16.6667%": [timestamp('1909')],
            "25%": [timestamp('1919')],
            "33.3333%": [timestamp('1929')],
            "41.6667%": [timestamp('1939')],
            "50%": [timestamp('1949')],
            "58.3333%%": [timestamp('1959')],
            "66.6667%": [timestamp('1969')],
            "75%": [timestamp('1979')],
            "83.3333%": [timestamp('1989')],
            "91.6667%": [timestamp('1999')],
            'max': [ timestamp('2010') ]
        }

        var dateSlider = document.getElementById('slider-date');
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
                month : 'short',
                year : 'numeric'
            })
            if (handle) {
                $('.date-start').html( date );
            } else {
                $('.date-end').html( date );
            }
        });

        dateSlider.noUiSlider.on('change', function (values, handle) {

            var start_date = convertTimestampNumber(values[0]);
            var end_date = convertTimestampNumber(values[1]);

            for (var layoutI in geoJSON._layers){
                if(geoJSON._layers[layoutI]  !== undefined ) {
                    geoJSON._layers[layoutI].remove()
                }
            }
            var data = {"type":"FeatureCollection","features":[]};

            console.log(CountryDB);
            //
            for (var date in  IntersectionDB ) {
                for (var i in  IntersectionDB[date] ) {
                    if( parseInt(start_date) > parseInt(date) ){
                        
                        for (let j in CountryDB.features) {
                            if(i == CountryDB.features[j].properties.PlaceID){
                                data.features.push(CountryDB.features[j]);
                                // delete mapDataTeamp[j];
                            }
                        }
                    }
                }
            }

            console.log(data);
            //
            L.geoJSON([data], {
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

            // console.log(geoJSON);
        });

        // date minisecound to year "YYYY" // 2000
        $(".noUi-value").each(function(){
            try {
                $(this).html(
                    new Date(parseInt($(this).html()))
                        .toLocaleDateString('en-GB', { year : 'numeric' })
                );
            } catch (error) {
               // console.log("invalid date");
            }
        });

        // remoev marker
        $(".noUi-marker-vertical").each(function(){
            $(this).remove();
        });

        // fixed top spacing issue
        $(".noUi-handle-lower").css('top', '-12px');
    }




/* ========================================================================
*
* ========================================================================
*/



class Trajectories{

    constructor() { 
        slider_range();
    }
}


function get_start_date(){

    var date = new Date($(".date-start").html().trim() );

    var year  = date.getFullYear(),
    month = (date.getMonth() + 1).toString().padStart(2, "0");

    return year +"-" + month;
}


function get_end_date(){

    var date = new Date($(".date-end").html().trim() );

    var year  = date.getFullYear(),
    month = (date.getMonth() + 1).toString().padStart(2, "0");

    return year +"-" + month;
}


class Intersections{


    constructor() { 

        this.filterDate();

        slider_range();
    }

    filterDate(){

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
$(".legend").on('click', function(){
    $(this).fadeOut(300);
});

// active pointer
$("").on('click', function(){
    
});