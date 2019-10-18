var gallerySize = 0;
var totalPages = 0;
var defaultGalleryPageSize = 18;
var currentPage = 0;

var gallery = {};

$.urlParam = function(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if(results) 
        return results[1];
    return undefined;
}

function updateURL(toPage)
{
    if(toPage == 0)
    {
        window.location = "/gallery";
    }else {
        window.location = "/gallery?p=" + (toPage);
    }
}

function formatThumbnail (filename)
{
    return $('<a/>')
        .attr('href','./galleryData/'+ filename)
        .append($('<img/>')
            .attr('class','galleryThumbnail')
            .attr('src','./galleryData/thumbnails/'+ filename)
            .attr('href','./galleryData/'+ filename)
            .css({
                'width':'150px',
                'height':'150px',
                'margin':'4px 7px 4px 7px'
            }));
}

function writeGalleryNavbar ()
{
    for (var i = 0; i <= totalPages; i++)
    {
        var toPage;
        if(i == 0) toPage = '/gallery';
        else toPage = '/gallery?p='+i;         
        var css = {};
        if(i == currentPage) css = {
            'color':'hotpink',
            'text-decoration':'underline'
        };

        $('.galleryNavigatorLinks').append($('<a/>')
            .attr('class','navbarLink')
            .attr('href',toPage)
            .append($('<text/>')
                .attr('class','navbarLinkText')
                .css(css)
                .text(i)
            ));
    }

    if(currentPage == 0)
    {
        $(".newerPostsButton").attr("disabled","true"); 
    }else if(currentPage > 0)
    {
        $(".newerPostsButton").removeAttr("disabled");
    }

    if((currentPage*defaultGalleryPageSize) + defaultGalleryPageSize >= gallerySize)
    {
        $(".olderPostsButton").attr("disabled","true");
    } else {
        $(".olderPostsButton").removeAttr("disabled");
    }
    
    $(".olderPostsButton").click(function()
    {
        updateURL(currentPage + 1);
    });

    $(".newerPostsButton").click(function()
    {
        updateURL(currentPage - 1);
    });
}

function writeGallery (startPage) 
{
    currentPage = startPage;
    $.getJSON("../../data/galleryIndex.json", function(galleryIndexRaw) 
    {
        gallerySize = galleryIndexRaw['gallerySize'];
        totalPages = parseInt((gallerySize-1)/defaultGalleryPageSize);
    })
    
    .then(function (galleryIndex)
    {
        writeGalleryNavbar();
        for (var i = 0; i < defaultGalleryPageSize && gallerySize - i > 0; i++)
        {
            var currIndex = gallerySize-i-(currentPage*defaultGalleryPageSize);
            if( currIndex > 0)
            {
                $('.galleryBody').append(
                    formatThumbnail(galleryIndex["galleryIndex"][currIndex])
                );
            }
        };
    });
}

$(document).ready(function() 
{
    var p = $.urlParam('p') 
    console.log(p);
    if(p != undefined) 
    {
        writeGallery(parseInt(p));
    } else  
    {
        writeGallery(0);
    }
});