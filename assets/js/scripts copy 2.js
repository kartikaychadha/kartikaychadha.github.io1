// var map = L.map('mapid').setView([8.75,42.19], 3);
var map = L.map('mapid').setView([51.505, -0.09], 4);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 4,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1,
    mixZoom: 4,
}).addTo(map);

var geoJSON = L.geoJSON([]);

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

var Slider = document.getElementById('slider-date');

var geoJSONlayers = {};
class Intersections {

    intersection;
    data = {};

    constructor() {
        self = this
        this.createSlider();
        this.init();
    }

    buildAuthors() {
        //authors
        var author_ids =  this.db.author_id;
        for (let key in author_ids) {
            this.authors[author_ids[key]] =key;
            this.author_names[key] = author_ids[key];
        }
    }


    buildPlaces() {
        this.places = this.db.places;      // Place JSON no longer requires processing.
    }


    createSlider() {
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

    }


    current() {
        var value = Slider.noUiSlider.get();
        var start_date = parseInt(convertTimestampNumber(value[0]).replace('-', ''));
        var end_date = parseInt(convertTimestampNumber(value[1]).replace('-', ''));

        var InterTempDB = {};
        for (let key in intersectionData) {
            var dataIndex = parseInt("" + key.replace('-', ''));
            // end_date > dataIndex &&
            if ( start_date < dataIndex ) {
                for (let PlaceKey in intersectionData[key]) {
                    for (let authorKey in intersectionData[key][PlaceKey]) {

                        var authorEnd = intersectionData[key][PlaceKey][authorKey]['EndDate'];
                        authorEnd = convertTimestampNumber(authorEnd+"").replace("-", "");

                        if( authorEnd == "NaNNaN" || parseInt(authorEnd) < end_date ){
                            
                            if(InterTempDB[PlaceKey] === undefined){
                                InterTempDB[PlaceKey] = [];
                            }
                            InterTempDB[PlaceKey].push(intersectionData[key][PlaceKey][authorKey]);    
                        }
                    }
                }
            }
        }

        Intersections.prototype.intersection = InterTempDB;
    }



    insertLayout() {

        Intersections.prototype.data = continentData;
        var data = Intersections.prototype.data;

        function onEachFeature(feature, layer) {
            // var layers = {};
            //
            // var index  = feature['id'];
            // layers.push(Intersections.prototype.Layers);
            //
            // Intersections.prototype.Layers = layers;
            // console.log(layers);

            // [feature['id']] = layer;
        }


        L.geoJSON(data, {

            onEachFeature: onEachFeature,

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

                var users = Intersections.prototype.findUsers(feature.properties.PlaceID);

                if(users === null){
                    return false;
                }
          
                return true;
               
            }
        }).addTo(map);
    }

    findUsers(placeID){
        var users = {};
        var start_range = Slider.noUiSlider.get();
        start_range = start_range[0];

        var data = Intersections.prototype.intersection[placeID];

        if(data === undefined){
            return null;
        }

        for (const key in data) {

            console.log(data[key]['StartDate']);

            // var check_start_date = function (params) {
            
            // }

        }


       

        return data;
    }

    /**
     * slider date init;
     */
    init() {

        Intersections.prototype.current();
        Intersections.prototype.insertLayout()

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

            Intersections.prototype.current();
            Intersections.prototype.remove();
            Intersections.prototype.insertLayout();
        });

    }

    // return void
    remove() {

        for (let index in geoJSONlayers) {
            geoJSONlayers[index].remove();
        }
        $(".results .title").html("");
        $("#intersections-results").html("");
    }

    // show authors
    showAuthors(data){

        var title = data['properties']['city'] + ", " + data['properties']['country'];

        alert(title);
        var html = ""+
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
}



// remove legend popup
$(".legend").on('click', function () {
    $(this).fadeOut(300);
});

