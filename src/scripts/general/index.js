import './jquery'
import './fonts'
import './modal'
import './slick'
import './map'
import './account'
import './product_map'
import './header'
import './jssocials'

$(document).ready(function() {

    /* Nagigation */
    $('#nav-toggle').click(function(){
        if($(this).is(":checked")) {
            $('.content-wrap').css('transform', 'translateX(88%)');
            $('.infobar').css('transform', 'translateX(88%)');
        } else {
            $('.content-wrap').css('transform', 'translateX(0)');
            $('.infobar').css('transform', 'translateX(0)');
        }
        $('body, html').toggleClass('overflow-hidden');
        $('#c-mask').toggleClass('is-active');
    });

    $('#c-mask').click(function() {
        $('#overlay').fadeOut('slow');
        $(this).removeClass('is-active');
        $('#nav-toggle').prop('checked', false);
        $('.content-wrap').css('transform', 'translateX(0)');
        $('.infobar').css('transform', 'translateX(0)');
    });

    $('a.header__nav-item-link--account').click(function(e){
        console.log($(window).width())
        if($(window).width() < 768 && typeof meta.page.customerId != 'undefined') {
            e.preventDefault();
            $('li.header__nav-item').hide();
            $('li.header__nav-item-accounts').show();
        }
    });

    $('li.header__nav-item-accounts-back a.header__nav-item-link').click(function(e){
        e.preventDefault();
        $('li.header__nav-item').show();
        $('li.header__nav-item-accounts').hide();
    });

  /* Hide mobile nav when window resize */
    $(window).resize(function() {
        if ($(window).width() > 768) {
            $('#overlay').fadeOut('slow');
            $('#c-mask').removeClass('is-active');
            $('#nav-toggle').prop('checked', false);
            $('.content-wrap').css('transform', 'translateX(0)');
            $('.infobar').css('transform', 'translateX(0)');
        }
    });

    /* Product page start */
    var $productColorSlider;
    (function() {
        $('.product__image').clone().insertBefore($('.product__description'));
    })();

    (function() {
        $('.product__image-for').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            adaptiveHeight: true,
            asNavFor: '.product-thumbnails',
            arrows: true,
            fade: true
        });
        $productColorSlider = $('.product-thumbnails').slick({
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
    })();


    $('.product .swatch-element').click(function(e) {
        $(this).parents('ul.swatch').find('li.swatch-element').removeClass('swatch-active');
        $(this).addClass('swatch-active');

        var selectedSize = $(this).data('value');
        $(this).parents('ul.swatch').find('.product__small-title span').text(selectedSize);

        var option_index = $(this).data('id');

        $('#product-select-option-' + option_index).val(selectedSize).trigger('change');

        if(!$(this).hasClass('product__title-link')) {
            var colorSlideIndex = $('.color-slide-'+selectedSize).eq(0).data('slick-index');
            console.log(colorSlideIndex);
            console.log($productColorSlider);
            if (colorSlideIndex != undefined) {
                $productColorSlider.slick('slickGoTo', colorSlideIndex);
            }
        }
    });

    /* Product page END */

    /* CART Page START*/

    $('.button-confirm').click(function(e) {
        $(this).addClass('button--disabled').text('Confirmed');
        $('.button-checkout').removeClass('button--disabled').addClass('button--green');
         e.stopPropagation();
    });

    function remove_currency_string(currency) {
        var arr = currency.split(' ');
        return arr[0];
    }

    $('.cart__quantity').on('change', function () {
        var itemId = parseInt($(this).attr('itemid'));
        var qty = parseInt($(this).val());
        var loopindex = parseInt($(this).data('loopindex'));

        $.ajax({
            url: '/cart/change.js',
            dataType: 'json',
            type: 'post',
            data: {quantity: qty, id: itemId},
            success: function(itemData) {
                console.log(itemData)

                for(var i=0;i<itemData.items.length;i++) {
                    var item = itemData.items[i];
                    if(item.id == itemId && i == loopindex) {
                        $('#cart__lineitem_lineprice_' + item.id+ '_' + loopindex).text(remove_currency_string(Shopify.formatMoney(item.line_price, window.money_with_currency_format)));
                    }
                }

                $('#cart__subtotal-price').text(remove_currency_string(Shopify.formatMoney(itemData.original_total_price, window.money_with_currency_format)));
                $('#cart__total-price').text(remove_currency_string(Shopify.formatMoney(itemData.total_price, window.money_with_currency_format)));
                $('#cart-count').text(itemData.item_count);
            }
        });
    });

    $('.cart__country-selection').click(function(){
        var str_countries = $(this).parents('.cart__row').find('.cart__product--countries p').html();
        $('#lineitem_countries_modal p').html(str_countries);

        $("#lineitem_countries_modal").modal({
            fadeDuration: 100,
            fadeDelay: 0.20,
            closeClass: 'icon-remove',
            closeText: 'X',
            escapeClose: true,
            clickClose: true
        });
    });

    /* CART Page END*/

    /*Infobar START */
    $('.button-close').click(function() {
        $('.infobar').css('display', 'none');
    });
    /* Infobar End */

    // Home slider
    $('.banner--home_slider').on('init', function(event, slick){
        console.log('slider was initialized');
        $('.banner--home_slider .home__slide').show();
    });
    $('.banner--home_slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        speed: 350,
        autoplay: true,
        arrows: false,
        fade: false
    });

    // social for product
    $("#shareicons_product").jsSocials({
        showLabel: false,
        showCount: false,
        shares: ["facebook", "twitter", "pinterest"]
    });
});
