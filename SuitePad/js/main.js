(function() {
	'use strict';

    $(function() {

        var long;
        var lat;
        var cb = new Codebird;

        // authenticate API requests
        cb.setConsumerKey("NZkBvpzl5wo9mDIWjW9u55ijf", "DpbZgVDak7BQoby7tBx7PLx7CVkKYerCRijKLo7Nz6Ud1xhXPQ");


        // restore last search
        restoreCritiria()

        // initialize google geocode for location search
        google.maps.event.addDomListener(window, 'load', intilize);
    
        function intilize() {
            
            var autocomplete = new google.maps.places.Autocomplete(document.getElementById("txtautocomplete"));

            google.maps.event.addListener(autocomplete, 'place_changed', function () {
            
            var place = autocomplete.getPlace();
            
            lat =  place.geometry.location.lat();
            long = place.geometry.location.lng();

            });
        };

        // on search button click
        $('#searchBtn').click(function() {
                
                // show loading
                $('#tweetsContainer').html('<h1>Loading...</h1>');

                var params = {};
                var keyword = $('#keyword').val().trim();
                var lang = $('#lang').val();
                var location = $('#txtautocomplete').val().trim();

                if(!location) {
                    long = lat = null;
                }

                // setting params object with the selected search critiria
                if(keyword) params.q = keyword;
                if(lang) params.lang = lang;
                if(long) params.geocode = (lat + ',' + long + ',' + '10mi');

                // save critiria in local storage
                saveCritiria(params)
                
                // making the twitter api call
                getTweets(params);
                
        });

        // get Search tweets 
        function getTweets(params) {
            cb.__call(
                    "search_tweets",
                    params,
                    function (reply) {
                        var tweets = [];

                        // building the dom of the result set 
                        $(reply.statuses).each(function(index, tweet) {
                           tweets.push('<div class="tweet"><img src="'+ tweet.user.profile_image_url +'" class="img-responsive" alt="Responsive image"><p class="col-xs-9">'+ tweet.text +'</p> </div>');
                        });

                        if(tweets.length == 0) {
                            $('#tweetsContainer').html('<h1>There is no results to show</h1>');
                        } else {
                            $('#tweetsContainer').html(tweets.join(''));
                        }

                    }
                ); 
        }


        // save search critiria
        function saveCritiria(params) {
            localStorage.setItem('critiria', JSON.stringify(params));
            localStorage.setItem('locationText', $('#txtautocomplete').val());
        }

        // restore critiria
        function restoreCritiria() {
            var params = JSON.parse(localStorage.getItem('critiria'));
            var locationText = localStorage.getItem('locationText') || "";

            $('#txtautocomplete').val(locationText);
            
            if(params) {
                $('#keyword').val(params.q);
                $('#lang').val(params.lang);
                lat = params.geocode && params.geocode.split(',')[0];
                long = params.geocode && params.geocode.split(',')[1];
                
                if(params.q || params.geocode) {       
                    $('#tweetsContainer').html('<h1>Loading...</h1>');
                    getTweets(params);
                }
            }
           
        }
    });
    
})();