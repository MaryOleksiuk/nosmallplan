import $ from 'jquery'

/*
$('#create_customer').submit(function(e){
    e.preventDefault();

    var first_name = $('#first_name').val().trim();
    $('#first_name').val(first_name);
    var last_name = $('#last_name').val().trim();
    $('#last_name').val(last_name);
    var email = $('#email').val().trim();
    $('#email').val(email);
    var password = $('#password').val();
    if(first_name == "") {
        $('#first_name').focus();
        return false;
    }
    if(last_name == "") {
        $('#last_name').focus();
        return false;
    }
    if(email == "") {
        $('#email').focus();
        return false;
    }
    if(password == "") {
        $('#password').focus();
        return false;
    }

    var param = {
        "customer": {
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "verified_email": true,
            "password": password,
            "password_confirmation": password,
            "send_email_welcome": false
        }
    };

    var url = $(this).attr('action');


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(response) {
        if (this.readyState == 4 && this.status == 200) {
            console.log(response);
            // window.location.href = '/account';
        }
    };
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(param));
});
*/

$('#btn_update_profile').click(function(){
    $('#update_profile').submit();
});

$('#update_profile').submit(function(e){
    e.preventDefault();

    var first_name = $('#first_name').val().trim();
    $('#first_name').val(first_name);
    var last_name = $('#last_name').val().trim();
    $('#last_name').val(last_name);
    var email = $('#email').val().trim();
    $('#email').val(email);
    if(first_name == "") {
        $('#first_name').focus();
        return false;
    }
    if(last_name == "") {
        $('#last_name').focus();
        return false;
    }
    if(email == "") {
        $('#email').focus();
        return false;
    }

    var param = {
        "customer": {
            "id": $('#customer_id').val(),
            "first_name": first_name,
            "last_name": last_name,
            "email": email
        }
    };

    var url = $(this).attr('action');


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            window.location.href = '/account';
        }
    };
    xhttp.open("PUT", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(param));
});

$('#btn_change_password').click(function(){
    $('#change_password').submit();
});

$('#change_password').submit(function(e){
    e.preventDefault();
    var pwd = $('#customer_password').val();
    var re_pwd = $('#customer_confirm_password').val();
    if(pwd == "") {
        $('#customer_password').focus();
        return false;
    }

    if(pwd != re_pwd) {
        $('#customer_confirm_password').focus();
        return false;
    }

    var param = {
        "customer": {
            "id": $('#customer_id').val(),
            "password": pwd,
            "password_confirmation": re_pwd
        }
    };

    var url = $(this).attr('action');


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            window.location.href = '/account';
        }
    };
    xhttp.open("PUT", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(param));
});

// account maps 
if($('#customer_maps').length) {

    // load maps
    var api_url = 'https://no-small-plan.herokuapp.com/api';
    var customerId = meta.page.customerId;
    var myMaps;
    var selectedMap = {
        id: -1,
        map_name: "",
        map_setting: ""
    };

    $.getJSON( api_url + "/map/load/" + customerId, function( response ) {
        if(!response.error) {
            myMaps = response.data;

            var item_ct = '';
            var setting = '';
            myMaps.forEach(function(item) {
                setting = JSON.parse(item.map_setting).toString();

                item_ct = '' + 
                        '<div class="block_map" data-id="' + item.id + '" data-setting="' + setting + '" data-name="' + item.map_name + '">'+
                            '<div class="box">'+
                                '<img src="' + window.map_icon_url + '" />'+
                                '<p>' + item.map_name + '</p>'+
                                '<div class="v_border"></div>'+
                                '<div class="h_border"></div>'+
                                '<div class="overlap--buttons">'+
                                    '<div>'+
                                        '<button class="button button--green button--edit">Edit</button>'+
                                        '<button class="button button--disable button--delete">delete</button>'+
                                    '</div>'+
                                '</div>'+
                           '</div>'+
                        '</div>';

                $('#customer_maps .map-blocks').append(item_ct); 
            });

        } else {

        }

        console.log(response);
    });

    // click map
    $('#customer_maps').on('click', '.block_map_new', function(e){
        var map_id = -1;
        var map_name = "";
        var map_setting = [];

        selectedMap = {
            id: map_id,
            map_name: map_name,
            map_setting: map_setting
        };

        $('#map_name').val( selectedMap.map_name);

        $("#customer_maps-modal").modal({
            fadeDuration: 100,
            fadeDelay: 0.2,
            closeClass: 'icon-remove',
            closeText: 'X',
            escapeClose: false,
            clickClose: false,
        });

        $('#customer_maps-modal .button').removeClass('button--green').addClass('button--disabled'); 
    });

    // click map
    $('#customer_maps').on('click', '.button--edit', function(e){
        var parent = $(this).parents('.block_map');
        var map_id = $(parent).data('id');
        var map_name = $(parent).data('name');
        var map_setting = $(parent).data('setting')? $(parent).data('setting').split(","): [];

        selectedMap = {
            id: map_id,
            map_name: map_name,
            map_setting: map_setting
        };
        console.log(selectedMap);
        $('#map_name').val( selectedMap.map_name);

        $("#customer_maps-modal").modal({
            fadeDuration: 100,
            fadeDelay: 0.2,
            closeClass: 'icon-remove',
            closeText: 'X',
            escapeClose: false,
            clickClose: false,
        });

        $('#customer_maps-modal .button').removeClass('button--disabled').addClass('button--green'); 

    });

    $('#customer_maps-modal').on($.modal.OPEN, function(event, modal) {
        setTimeout(function(){
            // let's build a list of currently selected countries
            console.log(map);
            for ( var i in map.dataProvider.areas ) {
                var area = map.dataProvider.areas[ i ];
                if ( area.showAsSelected ) {
                    area.showAsSelected = false;

                    // make the chart take in new color
                    area.validate();
                }
            }
            
            countries = [];

            for (let i=0; i<selectedMap.map_setting.length; i++) {
                var area = map.getObjectById(selectedMap.map_setting[i]);
                console.log("area===");
                console.log(area);
                area.showAsSelected = true;

                // make the chart take in new color
                area.validate();

                countries.push( area.id );
            }

            console.log(countries);
        }, 500);
    });

    function load_maps() {
        $('#customer_maps .block_map').each(function(){
            if(!$(this).hasClass('block_map_new')) {
                $(this).remove();
            }
        });

        var item_ct = '';
        var setting = '';
        myMaps.forEach(function(item) {
            setting = JSON.parse(item.map_setting).toString();

            item_ct = '' + 
                    '<div class="block_map" data-id="' + item.id + '" data-setting="' + setting + '" data-name="' + item.map_name + '">'+
                        '<div class="box">'+
                            '<img src="' + window.map_icon_url + '" />'+
                            '<p>' + item.map_name + '</p>'+
                            '<div class="v_border"></div>'+
                            '<div class="h_border"></div>'+
                            '<div class="overlap--buttons">'+
                                '<div>'+
                                    '<button class="button button--green button--edit">Edit</button>'+
                                    '<button class="button button--disable button--delete">delete</button>'+
                                '</div>'+
                            '</div>'+
                       '</div>'+
                    '</div>';

            $('#customer_maps .map-blocks').append(item_ct); 
        });
    }

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

        var data_countries = JSON.stringify(countries);
        var params = {
            map: {
                id: selectedMap.id,
                name: map_name,
                setting: data_countries
            },
            customer_id: meta.page.customerId
        };

        $.ajax({
            type: 'post',
            url: api_url + '/map/save',
            data: params,
            success: function(response) {
                myMaps = response.data;

                $('#save-your-map .button').removeClass('button--disabled').addClass('button--green');
                $('#map_name').val('');

                $("#customer_maps-modal a.close-modal" ).trigger( "click" );

                load_maps();

                $.ajax({
                    type: 'get',
                    url: '/cart.js',
                    dataType: 'json',
                    success:function(cart_json){
                        for(var i=0;i<cart_json.items.length;i++) {
                            var item = cart_json.items[i];

                            if(item.properties.map_id_lineitem == selectedMap.id) {

                                $.ajax({
                                    url: '/cart/change.js',
                                    dataType: 'json',
                                    type: 'post',
                                    async:false,
                                    data: {quantity: 0, id: item.id},
                                    success: function(itemData) {
                                
                                        var country_names = '';

                                        countries.forEach(function(dc){
                                            for(var i=0;i<window.map_countries.length-1;i++) {
                                                if(dc == window.map_countries[i].code) {
                                                    country_names += window.map_countries[i].name + ', '
                                                }
                                            }
                                        });

                                        if(country_names) {
                                            country_names = country_names.substring(0, country_names.length - 2);
                                            item.properties.map_name_lineitem = map_name;
                                            item.properties.map_countries_lineitem = country_names;
                                            $.ajax({
                                                url: '/cart/add.js',
                                                dataType: 'json',
                                                type: 'post',
                                                data: item,
                                                async:false,
                                                success: function(itemData) {
                                                    console.log(itemData)
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    }
                });
            },
            dataType: 'json'
        }); 
    });

    // delete map

    // click map
    $('#customer_maps').on('click', '.button--delete', function(e){
        var parent = $(this).parents('.block_map');
        var map_id = $(parent).data('id');
        var map_name = $(parent).data('name');
        var map_setting = $(parent).data('setting')? $(parent).data('setting').split(","): [];

        selectedMap = {
            id: map_id,
            map_name: map_name,
            map_setting: map_setting
        };
        
        $('#delete_your_map span.delete_map--name').html(map_name);

        $("#customer_maps-modal_delete").modal({
            fadeDuration: 100,
            fadeDelay: 0.2,
            closeClass: 'icon-remove',
            closeText: 'X',
            escapeClose: false,
            clickClose: false,
        });

    });

    $('a.cancel-modal').click(function(){
        $(".modal a.close-modal" ).trigger( "click" );
    });

    $('#delete-your-map a.button').click(function(e){
        if($(this).hasClass('button--disabled')) {
            return false;
        }

        e.preventDefault();

        $('#delete-your-map .button').removeClass('button--green').addClass('button--disabled');

        var data = JSON.stringify(countries);
        var params = {
            map: {
                id: selectedMap.id
            },
            customer_id: meta.page.customerId
        };

        console.log("params")
        console.log(params);

        $.ajax({
            type: 'post',
            url: api_url + '/map/delete',
            data: params,
            success: function(response) {
                myMaps = response.data;

                $('#save-your-map .button').removeClass('button--disabled').addClass('button--green');

                $("#customer_maps-modal_delete a.close-modal" ).trigger( "click" );

                load_maps();
            },
            dataType: 'json'
        }); 
    });
}



