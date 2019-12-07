function setAnchors() {
    
    $("#topic-content section.section, #topic-content .example, #topic-content .procedure, #topic-content .figure, #topic-content .table, #topic-content .bridgehead, #topic-content .note, #topic-content .warning, #topic-content .caution, #topic-content .important, #topic-content .tip").each(function (index) {
        
        var idattr = $(this).attr('id');
        
        if (idattr !== undefined) {
            //id prefixed al (for anchorlink)
            id = 'al_' + idattr;
            //If the anchor doesn't already exist:
            if (! $(this).prev('a[id]').length) {
                section = $(this);
                var anchor = $("<a></a>").attr('id', id);
                $(anchor).insertBefore(section);
                
                icon = '<i class="fa fa-link"></i>';
                if ($(this).hasClass('bridgehead')) {
                    $(this).append($("<a />").addClass("header-link").attr("data-anchorid", "#" + id).html(icon));
                } else if ($(this).is('.note, .warning, .caution, .important, .tip')) {
                    $(this).find(' .title').first().append($("<a />").addClass("header-link").attr("data-anchorid", "#" + id).html(icon));
                } else {
                    $(this).find(' .titlepage :header, .example-title, .procedure-title, .figure-title, .table-title').first().append($("<a />").addClass("header-link").attr("data-anchorid", "#" + id).html(icon));
                }
            }
        }
    });
    
    /*Tooltip text variables defined by gentext in XSLT*/
    $('.header-link').tooltip({
        trigger: 'hover',
        title: clicktocopy,
        placement: 'bottom'
    })
    
    $('.header-link').click(function () {
        
        var _this = this;
        
        $(_this).attr('title', linkcopied).tooltip('fixTitle').tooltip('show');
        $(_this).tooltip('show');
        setTimeout(function () {
            $(_this).tooltip('hide');
            $(_this).attr('title', clicktocopy).tooltip('fixTitle');
        },
        1000)
    });
    
    //Then the copying:
    var clipboard = new ClipboardJS('.header-link', {
        text: function (trigger) {
            var id;
            parent = trigger.closest('section, .example, .procedure, .figure, .table, .bridgehead, .note, .caution, .warning, .important, .tip').parentNode;
            id = parent.id;
            //Check for 'Preloaded' variant first, in which case we always want the hash:
            contentwrapper = $(trigger.closest('.content-wrapper'));
            if (id === 'topic-content' && contentwrapper.length) {
                return location.href.replace(location.hash, "") + trigger.getAttribute('data-anchorid');
            } else if (id === 'topic-content') {
                return location.href.replace(location.hash, "");
            } else {
                return location.href.replace(location.hash, "") + trigger.getAttribute('data-anchorid');
            }
        }
    });
    
    clipboard.on('success', function (e) {
        console.log(e);
    });
    
    clipboard.on('error', function (e) {
        console.log(e);
    });
}