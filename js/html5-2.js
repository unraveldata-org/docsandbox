$(document).ready(function () {

    if ($("aside ul.toc").length) {
        $(document).trigger('toc.ready');
    }
    
    /*If a link target is a hidden accordion, first display it:
    =========*/
    var url = window.location.href;
    var hash = window.location.hash;
    /*From another page:*/
    displayAccordionTarget(hash);
    
    /*Same page*/
    $(document.body).on('click', 'a.xref, a.link', function (event) {
        var id = this.hash;
        displayAccordionTarget(id);
    });
    
    /* Adjusting position in view for internal page toc links */
    $(document.body).on('click', '.section-nav-container a', function (e) {
        var clickedhref = $(this).attr('href');
        $(clickedhref).scrollView();
        e.preventDefault();
    });
    /*=========*/
    
    //Bootstrap popovers for glossterms
    $('[data-toggle="popover"]').popover({
        animation: "fade",
        delay: {
            show: "500",
            hide: "100"
        },
        trigger: "hover",
        placement: "auto bottom",
        container: 'body',
        html: true,
        content: function () {
            var clone = $($(this).data('popover-content')).clone(true).removeClass('hide');
            return clone;
        }
    });
    
 	var $searchfield = $(".tool-search-form .search-field");
	$(".toolbar .tool-search").click(function() {
		$searchfield.fadeIn(100).focus();
		$(".top-nav-menu").fadeOut(100);
		});
		$searchfield.focusout(function() {
		$(".tool-search-form .search-field").fadeOut(100);
		$(".top-nav-menu").fadeIn(100);
	});
	initChecklist();
});

/* Adjusting position in view for internal page toc links. Ajax version handles this elsewhere */
$.fn.scrollView = function () {
  return this.each(function () {
    $('html, body').animate({
      scrollTop: $(this).offset().top - 80
    }, 0);
  });
}

$(document).on('toc.ready', function () {
    
    $("aside ul.toc a").click(function (e) {
        //Only for internal sections:
        var r = new RegExp('#');
        if (r.test($(this).attr('href'))) {
            $("aside ul.toc a").parent().removeClass("active").removeClass("opened");
            $(this).parent().addClass("active");
            $(this).parents("li").addClass("opened");
        }
    });
    
    setActiveTocline();
    chunkedPrevNext();
    buildSectionToc();
    if(useanchorlinks){
        setAnchors();
    }
    
    if (theme == '3' || theme == '3b') {
        $("aside ul.toc").attr({
            "data-spy": "affix", "data-offset-top": "157", "data-offset-bottom": "50"
        })
    }
    
    /*Swagger embed needs the nav arrow for dynamically loaded sub toc:*/
    var glyphicon = "<span class='glyphicon'></span>"; 
    $('ul.nav-site-sidebar .swagger-topic').append(glyphicon);    
});