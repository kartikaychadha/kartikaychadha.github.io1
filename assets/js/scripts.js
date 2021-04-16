---
--- 
 
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
        });

        // date minisecound to year "YYYY" // 2000
        $(".noUi-value").each(function(){
            try {
                $(this).html(
                    new Date(parseInt($(this).html()))
                        .toLocaleDateString('en-GB', { year : 'numeric' })
                );
            } catch (error) {
                console.log("invalid date");
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



function Intersection_map(){

    var map = L.map('mapid').setView([8.75,42.19], 3);

	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 25,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox/light-v9',
		tileSize: 512,
		zoomOffset: -1
	}).addTo(map);


    L.geoJSON([{{ site.data.countries | jsonify }}], {

		// style: function (feature) {
		// 	return feature.properties && feature.properties.style;
		// },

		//onEachFeature: onEachFeature,

		pointToLayer: function (feature, latlng) {
			return L.circleMarker(latlng, {
				radius: 8,
				fillColor: "#fcb040",
				color: "#fcb040",
				weight: 1,
				opacity: 1,
				fillOpacity: 0.8,
                className: "point"
			});
		}
	}).addTo(map);

	L.circle([51.508, -0.11], 200000, {
		color: 'red',
		fillColor: '#f03',
		fillOpacity: 0.5
	}).addTo(map).bindPopup("I am a circle.");

	function onEachFeature(feature, layer) {
        

        // alert("ok")
		var popupContent = "<p>I started out as a GeoJSON " +
				feature.geometry.type + ", but now I'm a Leaflet vector!</p>";

		if (feature.properties && feature.properties.popupContent) {

            // alert("ok boos")
			popupContent += feature.properties.popupContent;
		}

		layer.bindPopup(popupContent);
	}

    map.on('click', function(e){
        var coord = e.latlng;
        var lat = coord.lat;
        var lng = coord.lng;
        console.log("You clicked the map at latitude: " + lat + " and longitude: " + lng);
    });
    
}

class Intersections{
    constructor() { 
        slider_range();
        Intersection_map();
    }

}


// remove legend popup
$(".legend").on('click', function(){
    $(this).fadeOut(300);
});