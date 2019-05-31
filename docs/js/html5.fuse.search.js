$(document).on('search.ready', function () {
    init();
});

$(document).ajaxComplete(function() {
  init();
});

function init(){
        //Stop arrow keys from default behaviour of moving before or after text so result selection can be done below
    $('form .search-field').on('keydown', function (e) {
        var _this = $(this);
        if(e.keyCode == '13' && enterKey === 'search'){
            search(e, _this);
            return false;
        }
        else if (e.keyCode == '38') {
            return false;
        } else if (e.keyCode == '40') {
            return false;
        }
    });
    
    if(enterKey === 'search'){
        var searchfield = $('form .search-field');
        $(".portal-search .btn").click(function (e) {
            search(e, searchfield);
            return false;
        });
    }
    else{
        //Disable, only keyup used
        $(".portal-search .btn").prop("disabled", true);        
    }


    addSearch();
    
    var timeout;
    var delay = 200;
    
    if(enterKey !== 'search'){
        //Unbind the keyup and focus events so we can select a new index for fuse for portal page:
        $('input#search').off('keyup focus');
        
        //on keydown, clear the countdown for the keypress search delay
        $('input#search').on('keydown', function () {
            clearTimeout(timeout);
        });    
        
        $('input#search').on('keyup focus', function (e) {
            var _this = $(this);
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                if(enterKey === 'select'){
                    //If the user is only using arrow keys to browse results, return false:
                    var isSearch = selectResults(e);
                    if (isSearch === false) {
                        return false;
                    }
                }
                search(e, _this);
            },
            delay);
        });
    }
}
var myHilitor;

var $resultcontainer;

var fuse;

function addSearch() {
    
    //For legacy HTML5:
    if ($('ul#page-tools').length) {
        $('ul#page-tools > li:first').html('<input placeholder="Search" type="text" class="form-control" id="search">');
    } else {
        //For new HTML5: Only adds to the search field actually used in the current page
        $('.portal-search .search-field, .navbar-form .search-field, .site-sidebar-search .search-field, .tool-search-form .search-field').attr('id', 'search');
    }
    
    //For legacy, where the search container is not already there
    if ($('.search-container').length == 0) {
        $resultcontainer = $('<div id="search-container"><h2>Search results</h2><ul class="searchresults"></ul></div>');
        $resultcontainer.appendTo($('#content-wrapper'));
    } else {
        if ($("*[data-portal-language]").length) {
            $resultcontainer = $("*[data-portal-language='" + portalLanguage + "'] .portal-search-result");
        } else {
            $resultcontainer = $('.search-container');
        }
    }
    
    //Make sure it has the id, even if it's for 'preloaded' variant
    $resultcontainer.attr('id', 'search-container');
    
    myHilitor = new Hilitor('search-container');
    
    $resultcontainer.click(function () {
        hideSearch($resultcontainer);
    });
    
    $('.portal-content, .site-content').click(function () {
        hideSearch($resultcontainer);
    });
    
    hideSearch($resultcontainer);
    
    var options = {
        shouldSort: true,
        threshold: fuse_threshold,
        location: 10,
        distance: 100000,
        maxPatternLength: 32,
        minMatchCharLength: 4,
        keys:[ {
            name: 'title',
            weight: 0.7
        }, {
            name: 'body',
            weight: 0.3
        }]
    };

    //The index variable is created by xslt in the fuzzydata.js file.
    if (typeof index == "undefined") {
        fuse = new Fuse(indexDict[portalLanguage], options)
    } else {
        fuse = new Fuse(index, options)
    }
}

function search(e, searchfield) {
        // Get query
        var query = searchfield.val();
        // Search for it
        var result = fuse.search(query);
        
        var $ul = $('ul.searchresults', $resultcontainer);
        
        // Output it
        if (query === '') {
            $ul.empty();
            hideSearch($resultcontainer);
        } else if (result.length === 0) {
            $ul.empty();
            $('.noresults').show();
            showSearch($resultcontainer);
        } else {
            // Show results
            $ul.empty();
            $('.noresults').hide();
            if ($('.portal-search-result').length) {
                $('footer[data-portal-language="' + portalLanguage + '"]').hide();
            }
            
            for (var item in result) {
                //For permalinks: data-topic-level will only be set if produce.permalink = 1 in XSLT
                var topiclevel = $('section[data-topic-level]').first().attr('data-topic-level');
                var up = '';
                
                if (topiclevel != '') {
                    for (i = 1; i < parseInt(topiclevel);
                    i++) {
                        up += '../';
                    }
                }
                
                var url = up + result[item].url;
                
                //If this is the portal/index page:
                if ($('.portal-search-result').length) {
                    url = portalLanguage + '/' + result[item].url;
                }
                
                var pathdisplay = '';
                var breadcrumbs = result[item].breadcrumbs;
                if (typeof breadcrumbs !== "undefined") {
                    pathdisplay = '<p class="search-result-breadcrumbs">' + result[item].breadcrumbs + '</p>';
                } else {
                    pathdisplay = '<p class="search-result-url">' + url + '</p>';
                }
                
                //If there's a video in the topic it has the string [video]:
                var checkvideo = result[item].body.substring(0,7);
                var videosearchicon = '';
                if(checkvideo == '[video]'){
                    //console.log('video');
                    videosearchicon = '<span class="video-search-icon" style="margin-left: 0.5em"><i class="fa fa-film" aria-hidden="true"></i></span>'
                }
                
                var searchitem = '';
                if (result[item].snippet != '') {
                    searchitem = '<li class="searchresultitem"><a href="' + url + '">' +
                    '<h3 class="searchresulttitle">' + result[item].title + 
                    videosearchicon +
                    '</h3>' +
                    '<p class="searchresultsnippet">' + result[item].snippet + '</p>' +
                    pathdisplay +
                    '</a></li>';
                } else {
                    var searchitem = '<li class="searchresultitem-nosnippet"><a href="' + url + '">' + result[item].title + '</a></li>';
                }
                
                $ul.append(searchitem);
            }
            
            showSearch($resultcontainer);
            
            myHilitor.apply(query);
        }
    }

function showSearch($resultcontainer) {
    $resultcontainer.show();
    if(enterKey === 'select'){
        $('.searchresults .searchresultitem:first').addClass('selected-searchresultitem');
    }
    $('#topic-content').hide();
}

function hideSearch($resultcontainer) {
    var input = $('form .search-field');
    //Do not hide results if the input has focus and is not empty
    if (input.is(":focus") && input.val() !== '') {
        return;
    }
    $resultcontainer.hide();
    if ($('.portal-search-result').length) {
        $('footer[data-portal-language="' + portalLanguage + '"]').show();
    }
    $('.noresults').hide();
    
    $('#topic-content').show();
}

function selectResults(e) {
    //Let the user browse search results by arrow keys and select by Enter (handled in html5-2-mp-common.js).
    if (e.keyCode == '38') {
        if ($('.selected-searchresultitem').is(':first-child')) {
            return false;
        } else {
            var _this = $('.selected-searchresultitem');
            _this.removeClass('selected-searchresultitem');
            _this.prev().addClass('selected-searchresultitem');
            var _new = $('.selected-searchresultitem');
            if (_new.index() <= 1) {
                $(window).scrollTop(0);
            } else {
                _new[0].scrollIntoView();
                window.scrollBy(0, -80);
            }
            return false;
        }
    } else if (e.keyCode == '40') {
        if ($('.selected-searchresultitem').is(':last-child')) {
            return false;
        } else {
            var _this = $('.selected-searchresultitem');
            _this.removeClass('selected-searchresultitem');
            _this.next().addClass('selected-searchresultitem');
            var _new = $('.selected-searchresultitem');
            if (_new.index() > 1) {
                _new[0].scrollIntoView();
                window.scrollBy(0, -80);
            }
            
            return false;
        }
    }
    return true;
}