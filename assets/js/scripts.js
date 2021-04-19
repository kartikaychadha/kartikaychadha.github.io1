
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
     * slider date init;
     */
    function slider_range(){
     
        //   // slider range
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

            // new Intersections();
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

    data = {"type":"FeatureCollection","features":[]};
    geoJSONLayer;

    circleMarkers = {};

    constructor() { 

        this.filterDate();

        this.range();

        slider_range();

        this.Intersection_map();
        this.update();
    }

    filterDate(){

        var mapDataTeamp = CountryDB.features;
        
        var start_date = get_start_date();
        var end_date = get_end_date();

        for (var date in  IntersectionDB ) {
            for (var i in  IntersectionDB[date] ) {

                var checkEndTime = IntersectionDB[date][i][0].EndDate;
                if(checkEndTime != ""){
                    checkEndTime = timestamp(checkEndTime)
                }else{
                    checkEndTime = 0;
                }

                if(timestamp(start_date) <= timestamp(date)
                    || timestamp(end_date)  > checkEndTime || checkEndTime == 0 ){

                    for (let j in mapDataTeamp) {

                        // var PlaceId = mapDataTeamp[j].properties.PlaceID;
                        if(i == mapDataTeamp[j].properties.PlaceID){

                            this.data.features.push(mapDataTeamp[j]);
                            delete mapDataTeamp[j];
                        }
                    }
                }
            }
        }

    }

    range(){}

    Intersection_map() {
       

        this.geoJSONLayer = L.geoJSON([this.data], {

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


        map.on('click', function(e){
            var coord = e.latlng;
            var lat = coord.lat;
            var lng = coord.lng;
            //console.log("You clicked the map at latitude: " + lat + " and longitude: " + lng);
        });
        
    }

    update(){

        $('.date-selector').bind('DOMSubtreeModified', function(){

            var start = true;
            if(!start){ return ;}

            for (var layoutI in map._layers){
                if(map._layers[layoutI].feature  !== undefined )
                    map._layers[layoutI].remove()
            }


            var mapDataTeamp = CountryDB.features;

            var start_date = get_start_date();
            var end_date = get_end_date();

            for (var date in  IntersectionDB ) {
                for (var i in  IntersectionDB[date] ) {

                    var checkEndTime = IntersectionDB[date][i][0].EndDate;
                    if(checkEndTime != ""){
                        checkEndTime = timestamp(checkEndTime)
                    }else{
                        checkEndTime = 0;
                    }

                    if(timestamp(start_date) <= timestamp(date)
                        || timestamp(end_date)  > checkEndTime || checkEndTime == 0 ){

                        for (let j in mapDataTeamp) {

                            // var PlaceId = mapDataTeamp[j].properties.PlaceID;
                            if(i == mapDataTeamp[j].properties.PlaceID){

                                Intersections.prototype.data.features.push(mapDataTeamp[j]);
                                delete mapDataTeamp[j];
                            }
                        }
                    }
                }
            }


            start =false;
        });



        return true;
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