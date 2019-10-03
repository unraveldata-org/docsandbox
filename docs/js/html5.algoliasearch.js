$(document).ready(function () {
    addSearch();
});

function addSearch() {
    $("#aa-search-input").keyup(function () {
        var input = $(this);
        
        if (input.val() == "") {
            $('.overlay').hide();
        }
    });
    
    //For permalinks: data-topic-level will only be set if produce.permalink = 1 in XSLT
    var topiclevel = $('section[data-topic-level]').first().attr('data-topic-level');
    var up = '';
    
    if (topiclevel != '') {
        for (i = 1; i < parseInt(topiclevel);
        i++) {
            up += '../';
        }
    }
    
    //If this is the portal/index page:
    if ($('.portal-search-result').length) {
        up = portalLanguage + '/';
    }
    
    var client = algoliasearch(algolia_application_id, algolia_search_only_api_key);
    var index = client.initIndex(publication_id);
    //initialize autocomplete on search input (ID selector must match)
    $('#aa-search-input').autocomplete({
        hint: false,
        autoselect: true
    },[ {
        source: $.fn.autocomplete.sources.hits(index, {
            /*The users can set this in the Algolia dashboard instead.*/
            /*hitsPerPage: 5*/
        }),
        //value to be displayed in input control after user's suggestion selection
        displayKey: 'title',
        //hash of templates used when rendering dataset
        templates: {
            //'suggestion' templating function used to render a single suggestion
            suggestion: function (suggestion) {
                return '<a href="' + up + suggestion.url + '"><div class="aa-search-title">' +
                suggestion._highlightResult.title.value + '</div><div class="aa-search-body">' +
                suggestion._highlightResult.body.value + '</div></a>';
            }
        }
    }]).on('autocomplete:shown', function (event, suggestion, dataset) {
        $('.overlay').show();
    }).on('autocomplete:closed', function (event, suggestion, dataset) {
        $('.overlay').hide();
    }).on('autocomplete:selected', function (dataset, suggestion) {
        location.href = up + suggestion.url;
        //Note: Important to prepend the up path.
    });
}