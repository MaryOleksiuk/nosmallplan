const stickyHeader = () => {
  $(window).scroll(function(event) {
    let $header = $('.js-header')
    let scroll = $(window).scrollTop()
    let height = $header.outerHeight() 

    if ( scroll > height ) {
      $header.addClass('header--sticky')
    } else {
      $header.removeClass('header--sticky')
    }

  });
}

stickyHeader();