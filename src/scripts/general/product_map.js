import $ from 'jquery'

$(document).ready(function() {
    var api_url = 'https://no-small-plan.herokuapp.com/api';

    if($('.button--add_your_map').length) {
	  	/* map page start */

	    var myMaps = [];
	    var customerId;
	    var selectedMap = {
	        id: -1,
	        map_name: "",
	        map_setting: ""
	    };

	    if(typeof meta.page.customerId == 'undefined') {
	        customerId = 1;
	    } else {
	        customerId = meta.page.customerId;
	        console.log(customerId);
	        $.getJSON( api_url + "/map/load/" + customerId, function( response ) {
	            if(!response.error) {
	                $('.maps__buttons_load').removeClass('button--disabled').addClass('button--green');
	                myMaps = response.data;
	            } else {

	            }

	            console.log(response);
	        });
	    }

	    $('.button--add_your_map').click(function(){
	      
			if($(this).hasClass('button--green')) {

				// remove all slides
				var cnts = $('.maps--sliders .item').length;
				for(var i=cnts-1; i>0; i--) {
				    if(typeof $('.maps--sliders .item')[i] != 'undefined') {
				        $('.maps--sliders .item')[i].remove();
				    }
				}

				var item_ct = '';
				var setting = '';
				myMaps.forEach(function(item) {
				    setting = JSON.parse(item.map_setting).toString();
				    item_ct = '<div class="item" data-id="' + item.id + '" data-setting="' + setting + '" data-name="' + item.map_name + '">' + 
				            '   <img src="' + window.map_icon_url + '" />' + 
				            '<div class="title">' + item.map_name + '</div>';

				    $('.maps--sliders').slick('slickAdd',item_ct); 
				});

				$('#load--maps-blocker').show();
				$('#load--maps').animate({bottom: "0px"}, 500);
			}
	    });

	    $('.maps--sliders').slick({
            infinite: false,
            slidesToShow: 5,
            slidesToScroll: 5,
            responsive: [
                {
                    breakpoint: 1199,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 4
                    }
                },
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3
                    }
                },
                {
                breakpoint: 768,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2
                    }
                },
                {
                breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
                // You can unslick at a given breakpoint now by adding:
                // settings: "unslick"
                // instead of a settings object
            ]
        });

        $('.load--maps_close').click(function(e){
            $('#load--maps-blocker').hide();
            $('#load--maps').animate({bottom: "-1500px"}, 500);
        });


        $('.maps--sliders').on('click', '.item', function(e){
            var map_id = $(this).data('id');
            var map_name = $(this).data('name');
            var map_setting = $(this).data('setting')? $(this).data('setting').split(","): [];

            var country_names = '';

            if(map_id == -1) {
            	window.location.href = '/maps';
            } else {
            	map_setting.forEach(function(item){
            		for(var i=0;i<window.map_countries.length-1;i++) {
            			if(item == window.map_countries[i].code) {
            				country_names += window.map_countries[i].name + ', '
            			}
            		}
            	});
            }

            $('.load--maps_close').trigger('click');

            if(country_names) {
            	console.log(country_names);
            	country_names = country_names.substring(0, country_names.length - 2);

            	$('#map_id_lineitem').val(map_id);
                $('#map_name_lineitem').val(map_name);
            	$('#map_countries_lineitem').val(country_names);
            	
            	$('.accordeon__tab--map p').text(country_names);
                $('.accordeon__tab--map').show();

				// $('.button--add_your_map').removeClass('button--green').addClass('button--disabled');
				$('#add-to-cart').removeClass('button--disabled').addClass('button--green');
            }
        });
	}
});