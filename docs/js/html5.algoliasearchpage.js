search.addWidget(
instantsearch.widgets.searchBox({
    container: '#search-input'
}));

search.addWidget(
instantsearch.widgets.hits({
    container: '#hits',
    hitsPerPage: 10,
    templates: {
        item: '<div class="hit">' +
        '<div class="hit-content">' +
        '<a href="' + portalLanguage + '/' + '{{ url }}">' +
        '<h3 class="hit-title">{{ title }}</h3>' +
        '<p class="hit-body">{{{_highlightResult.body.value}}}</p>' +
        '</a>' +
        '</div>',
        empty: "We didn't find any results for the search <em>\"{{query}}\"</em>"
    }
}));

search.addWidget(
instantsearch.widgets.pagination({
    container: '#pagination'
}));


search.addWidget(
instantsearch.widgets.hierarchicalMenu({
    container: '#hierarchical-categories',
    attributes:[ 'hierarchicalCategories.lvl0', 'hierarchicalCategories.lvl1', 'hierarchicalCategories.lvl2'],
    templates: {
        header: 'Hierarchical categories'
    }
}));


search.start();