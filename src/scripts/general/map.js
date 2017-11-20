import $ from 'jquery'

$(document).ready(function() {

    var api_url = 'https://no-small-plan.herokuapp.com/api';

    /* map page start */

    if($('#mappanel').length) {
        var myMaps;
        var customerId;
        var selectedMap = {
            id: -1,
            map_name: "",
            map_setting: ""
        };
        var user_just_loggedin = localStorage.getItem("onlogin");
        var user_selected_countries = localStorage.getItem("onselection");

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

        if(user_just_loggedin != "null" && user_selected_countries != "null") {
            console.log("user_just_loggedin: " + user_just_loggedin)
            console.log("user_selected_countries: " + user_selected_countries)
            retrieve_keep_selections();
            var keep_selections = setInterval(function(){ retrieve_keep_selections() }, 1000);
        }

        function retrieve_keep_selections() {
            var selected_countries = JSON.parse(user_selected_countries);
            var map_id = selected_countries[0];
            var area = map.getObjectById(map_id);
            if(typeof area != 'undefined') {     
                countries = [];           
                for(var i=0; i<selected_countries.length;i++) {
                    map_id = selected_countries[i];
                    area = map.getObjectById(map_id);
                    area.showAsSelected = true;

                    // make the chart take in new color
                    area.validate();

                    $('.country_list-body li[data-code="' + map_id + '"] input[type="checkbox"]').prop('checked', true);

                    countries.push( map_id );
                }

                $('.maps__buttons_save').removeClass('button--disabled').addClass('button--green'); 


                var offset = $('#mappanel').offset();
                
                $("html, body").animate({ scrollTop: offset.top }, "slow"); 

                localStorage.setItem("onlogin", null);

                clearInterval(keep_selections);
            }
        }


        
        $('.maps__buttons_load').click(function(){
          console.log("customerId: " + customerId)
          if(customerId == 1) {
            $("#signin-modal").modal({
                fadeDuration: 100,
                fadeDelay: 0.20,
                closeClass: 'icon-remove',
                closeText: 'X',
                escapeClose: false,
                clickClose: false,
            });
          } else if($(this).hasClass('button--green')) {

            // remove all slides
            var cnts = $('.maps--sliders .item').length;
            for(var i=cnts-1; i>0; i--) {
                if(typeof $('.maps--sliders .item')[i] != 'undefined') {
                    $('.maps--sliders .item')[i].remove();
                }
                console.log(i);
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


        $('.maps__buttons_product').click(function(){
            if($('.maps__buttons_product').hasClass('button--disabled')) {
                return false;
            }

            $('.maps__buttons_product').removeClass('button--green').addClass('button--disabled');

            var g_w = $(window).width();
            if(g_w > 1250 && $(this).parents('.maps--home').length == 0) {
                $('#map_sidebar__block_step').removeClass('active--side');
                $('#map_sidebar__block_step2').addClass('active--side');
                $('#select-product').show("slow");
                $('#shopify-section-map-map').hide();
            } else {
                $('#select-product').show("slow", function() {
                    var offset = $('#select-product').offset();

                    $("html, body").animate({ scrollTop: offset.top }, "slow"); 
                });
            }
        });

        $('.map_sidebar--block h2').click(function(){
            if(selectedMap.id == -1) return false;

            $('.map_sidebar--block').removeClass('active--side');
            $(this).parent().addClass('active--side');

            var parent_id = $(this).parent().attr('id');
            console.log(parent_id);
            switch(parent_id) {
                case 'map_sidebar__block_step':
                    $('#shopify-section-map-products').hide();
                    $('#shopify-section-map-product').hide();
                    $('#shopify-section-map-map').show();
                    break;
                case 'map_sidebar__block_step2':
                    $('#shopify-section-map-products').show();
                    $('#shopify-section-map-product').hide();
                    $('#shopify-section-map-map').hide();
                    break;
                case 'map_sidebar__block_ste3':
                    $('#shopify-section-map-products').hide();
                    $('#shopify-section-map-product').show();
                    $('#shopify-section-map-map').hide();
                    break;
            }
        });

        $('.maps__buttons_save').click(function(event){
          event.preventDefault();
          if($(this).hasClass('button--green')) {

            $('#map_name').val( selectedMap.map_name);

            $("#signin-modal").modal({
                fadeDuration: 100,
                fadeDelay: 0.20,
                closeClass: 'icon-remove',
                closeText: 'X',
                escapeClose: false,
                clickClose: false,
            });

            localStorage.setItem("onlogin", null);

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

        $('.country_list-header ul').slick({
            infinite: false,
            slidesToShow: 6,
            slidesToScroll: 6,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 5,
                        slidesToScroll: 5
                    }
                },
                {
                breakpoint: 992,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 4
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


            for (let i=0; i<countries.length; i++) {
                var area = map.getObjectById(countries[i]);
                area.showAsSelected = false;

                // make the chart take in new color
                area.validate();

                $('.country_list-body li[data-code="' + countries[i] + '"] input[type="checkbox"]').prop('checked', false);
            }
            
            countries = [];


            for (let i=0; i<map_setting.length; i++) {

                var area = map.getObjectById(map_setting[i]);
                area.showAsSelected = true;

                // make the chart take in new color
                area.validate();
                
                $('.country_list-body li[data-code="' + map_setting[i] + '"] input[type="checkbox"]').prop('checked', true);

                countries.push( area.id );
            }

            console.log(countries);

            selectedMap = {
                id: map_id,
                map_name: map_name,
                map_setting: map_setting
            };

            $('.load--maps_close').trigger('click');

            console.log(selectedMap);
            
            $('.maps__buttons_save').removeClass('button--green').addClass('button--disabled');
            if($('.maps__buttons_product').hasClass('button--disabled')) {
                $('.maps__buttons_product').removeClass('button--disabled').addClass('button--green');
            }

            // $("html, body").animate({ scrollTop: 0 }, "slow");
        });

        for(var i=0; i<window.map_countries.length-1;i++) {
            var country_obj = window.map_countries[i];
            if(country_obj.area) {

                var tmp_area = country_obj.area.replace(' ', '');
                $('ul.area-' + tmp_area).append('<li data-name="' + country_obj.name + '" data-code="' + country_obj.code + '" data-area="' + country_obj.area + '"><label><input type="checkbox" />' + country_obj.name + ' <span></span></label></li>')
            }
        }
  
        /* map page end */

        /* signin modal start */
        $('#btn_modal_signin').click(function(){
            $('#signin-modal #customer_login').submit();
        });

        $('#signin-modal #customer_login').submit( function(e){

            if($('#customer_login .button').hasClass('button--disabled')) {
                return false;
            }

            e.preventDefault();
            var randnum = Math.floor(Math.random()*1001);

            var customer_email = $.trim($('#customer_email').val());
            var customer_password = $.trim($('#customer_password').val());
            if(customer_email == "") {
                $('#customer_email').focus();
                return false;
            }
            if(customer_password == "") {
                $('#customer_password').focus();
                return false;
            }

            $('#customer_login .button').removeClass('button--green').addClass('button--disabled');

            $.ajax({
                type: "POST",
                url: "/account/login",
                cache: false,
                data: $('#customer_login').serialize() + "&random=" + randnum,
                success: function(html){  

                    var result = $(html).find('#customer_detail').html();

                    $('#customer_login .button').removeClass('button--disabled').addClass('button--green');

                    if (typeof result == 'undefined'){
                        $('#customer_login .errors').html('<ul><li>Invalid login credentials.</li></ul>');
                        $('#customer_login .errors').slideDown('slow');
                    }else{
                        localStorage.setItem("onlogin", "1");
                        window.location.reload(true);
                    }

                    console.log(meta);

                }
            });

        });

        // recover_customer_password
        $('#btn_modal_recover_pwd').click(function(){
            $('#recover-password form').submit();
        });

        $('#btn_modal_create_customer').click(function(){
            $('#signin-modal #create_customer').submit();
        });

        $('#save-your-map a.button').click(function(e){
            if($(this).hasClass('button--disabled')) {
                return false;
            }

            e.preventDefault();

            var map_name = $.trim($('#map_name').val());
            if(map_name == "") {
                $('#map_name').focus();
                return false;
            }

            $('#save-your-map .button').removeClass('button--green').addClass('button--disabled');

            var data = JSON.stringify(countries);
            var params = {
                map: {
                    id: selectedMap.id,
                    name: map_name,
                    setting: data
                },
                customer_id: meta.page.customerId
            };

            selectedMap.map_name = map_name,
            selectedMap.map_setting = countries;

            $.ajax({
                type: 'post',
                url: api_url + '/map/save',
                data: params,
                success: function(response) {
                    myMaps = response.data;

                    if(selectedMap.id == -1) {
                        selectedMap.id = myMaps[myMaps.length-1].id;
                    }

                    $('#save-your-map .button').removeClass('button--disabled').addClass('button--green');
                    $('#map_name').val('');

                    if($('.maps__buttons_load').hasClass('button--disabled')) {
                        $('.maps__buttons_load').removeClass('button--disabled').addClass('button--green');
                    }

                    $('.maps__buttons_save').removeClass('button--green').addClass('button--disabled');
                    $('.maps__buttons_product').removeClass('button--disabled').addClass('button--green');

                    $( "#signin-modal a.close-modal" ).trigger( "click" );
                },
                dataType: 'json'
            }); 
        });

        /* signin modal end */

        //////. country list - integration ////////////

        $('.country_list-header li').click(function(){
            var rel = $(this).data('rel');
            $('.country_list-header li').removeClass('is-active');
            $(this).addClass('is-active');

            $('.country_list-body ul').hide();
            $('.country_list-body ul.area-' + rel).show();
        })  

        $('.country_list-body li label').click(function(){
            var checked = $(this).find('input').prop('checked');

            var map_id = $(this).parent().data('code');
            var area = map.getObjectById(map_id);
            if(checked) {
                area.showAsSelected = true;
                var index = countries.indexOf(area.id);
                if (index == -1) {
                    countries.push( area.id );
                }

            } else {
                area.showAsSelected = false;
                var index = countries.indexOf(area.id);
                if (index > -1) {
                    countries.splice(index, 1);
                }
            }

            // make the chart take in new color
            area.validate();

            if(countries.length) {
                $('.maps__buttons_save').removeClass('button--disabled').addClass('button--green'); 
            } else {
                $('.maps__buttons_save').removeClass('button--green').addClass('button--disabled'); 
            }

            if($('.maps__buttons_product').hasClass('button--green')) {
                $('.maps__buttons_product').removeClass('button--green').addClass('button--disabled');
            }
        });

        //////. products - integration ////////////
        $('#select-product a.products-item__link').click(function(){
            var product_id = $(this).data('id');
            var product_url = $(this).data('url');

            var g_w = $(window).width();
            if(g_w > 1250 && $(this).parents('.maps--home').length == 0) {
                $('#shopify-section-map-products').hide();
                $('#map_sidebar__block_step2').removeClass('active--side');
                $('#map_sidebar__block_step3').addClass('active--side');
                $('#shopify-section-map-product').show("slow");
                $('#selected-product').show();
            } else {

                $('#selected-product').show("slow", function() {
                    var offset = $('#selected-product').offset();
                    
                    $("html, body").animate({ scrollTop: offset.top }, "slow"); 
                });
            }
                    
            $.ajax({
                type: "GET",
                url: product_url,
                cache: false,
                success: function(html){  

                    var result = $(html).find('section.product').html();

                    $('#product-view-panel').html(result);

                    // remove 'add your map' button
                    $('#product-view-panel .product__content .button--add_your_map').remove();

                    var country_names = '';
                    selectedMap.map_setting.forEach(function(item){
                        for(var i=0;i<window.map_countries.length-1;i++) {
                            if(item == window.map_countries[i].code) {
                                country_names += window.map_countries[i].name + ', '
                            }
                        }
                    });

                    if(country_names) {
                        country_names = country_names.substring(0, country_names.length - 2);

                        $('#map_name_lineitem').val(selectedMap.map_name);
                        $('#map_countries_lineitem').val(country_names);
                        
                        $('.accordeon__tab--map p').text(country_names);
                        $('.accordeon__tab--map').show();

                        $('#add-to-cart').removeClass('button--disabled').addClass('button--green');
                    }

                    /* Product page start */

                    $('.product__image').clone().insertBefore($('.product__description'));

                    $('.product__image-for').slick({
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        adaptiveHeight: true,
                        asNavFor: '.product-thumbnails',
                        arrows: true,
                        fade: true
                    });


                    var $productColorSlider = $('.product-thumbnails').slick({
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        asNavFor: '.product__image-for',
                        arrows: false,
                        variableWidth: true,
                        outerEdgeLimit: true,
                        infinite: false,
                        dots: false,
                        focusOnSelect: true,
                    });

                    $('.product .swatch-element').click(function(e) {  
                        $(this).parents('ul.swatch').find('li.swatch-element').removeClass('swatch-active');
                        $(this).addClass('swatch-active');

                        var selectedSize = $(this).data('value');
                        $(this).parents('ul.swatch').find('.product__small-title span').text(selectedSize);

                        var option_index = $(this).data('id');

                        $('#product-select-option-' + option_index).val(selectedSize).trigger('change');

                        var colorSlideIndex = $('.color-slide-'+selectedSize).eq(0).data('slick-index');
                        console.log(colorSlideIndex);
                        console.log($productColorSlider);
                        if (colorSlideIndex != undefined) {
                            $productColorSlider.slick('slickGoTo', colorSlideIndex);
                        }
                    });
                    /* Product page END */

                    new Shopify.OptionSelectors("product-select", { product: window.product_json, onVariantSelected: selectCallback });

                }
            });
        });

    } else {
        // init local-storage for selection
        localStorage.setItem("onselection", null);
    }

    $('#register-account').click(function(){
        $('#customer').animate({
            opacity: 'hide'
        }, 100, 'linear', function() {
            $('#create-customer').fadeIn();
        });
    });

    $('#return-signin').click(function(){
        $('#create-customer').animate({
            opacity: 'hide'
        }, 100, 'linear', function() {
            $('#customer').fadeIn();
        });
    });

    $('#forgot_password').click(function(){
        $('#customer').animate({
            opacity: 'hide'
        }, 100, 'linear', function() {
            $('#recover-password').fadeIn();
        });
    });

    $('#cancel-forgot').click(function(){
        $('#recover-password').animate({
            opacity: 'hide'
        }, 100, 'linear', function() {
            $('#customer').fadeIn();
        });
    });

    $('#btn_recover_customer_password').click(function(){
        $('#recover-password form').submit();
    });

    $('#recover-password form').submit(function(e){
        if($('#recover-password form .button').hasClass('button--disabled')) {
            return false;
        }

        e.preventDefault();
        var randnum = Math.floor(Math.random()*1001);

        var recover_email = $.trim($('#recover_email').val());
        if(recover_email == "") {
            $('#recover_email').focus();
            return false;
        }

        $('#recover-password form .button').removeClass('button--green').addClass('button--disabled');

        $.ajax({
            type: "POST",
            url: "/account/recover",
            cache: false,
            data: $('#recover-password form').serialize() + "&random=" + randnum,
            success: function(html){  
                console.log($(html).find('#recover-password form'));
                var result = $(html).find('#recover-password form .errors').html();

                $('#recover-password form .button').removeClass('button--disabled').addClass('button--green');

                if (typeof result == 'undefined'){
                    $('#recover_email').val('');
                    
                    $('#recover-password').animate({
                        opacity: 'hide'
                    }, 300, 'linear', function() {
                        $('#customer_login .errors').html('').hide();
                        $('#customer').fadeIn();
                    });
                }else{
                    $('#recover-password form .errors').html(result);
                    $('#recover-password form .errors').slideDown('slow');
                }
            }
        });
    });
});
