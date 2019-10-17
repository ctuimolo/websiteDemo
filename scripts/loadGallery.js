var gallerySize = 0;
var totalPages = 0;
var defaultGalleryPageSize = 18;
var currentPage = 0;

var gallery = {};

function formatThumbnail (filename)
{
    var thumbnailLink = $('<a/>')
        .attr('href','./galleryData/'+ filename);

    var thumbnailImg = $('<img/>')
        .attr('class','galleryThumbnail')
        .attr('src','./galleryData/thumbnails/'+ filename)
        .attr('href','./galleryData/'+ filename)
        .css({
            'width':'150px',
            'height':'150px',
            'margin':'4px'
    });

    thumbnailLink.append(thumbnailImg);
    return thumbnailLink;
}

function writeGallery () 
{
    $.getJSON("../../data/galleryIndex.json", function(galleryIndexRaw) 
    {
        gallerySize = galleryIndexRaw['gallerySize'];
        totalPages = parseInt((gallerySize-1)/defaultGalleryPageSize);
    })
    
    .then(function (galleryIndex)
    {
        console.log(galleryIndex);
        for (var i = 0; i < defaultGalleryPageSize && gallerySize - i > 0; i++)
        {
            $('.galleryBody').append(
                formatThumbnail(galleryIndex["galleryIndex"][gallerySize-i-(currentPage*defaultGalleryPageSize)])
            );
        };
    });
}

$(document).ready(function() 
{
    writeGallery();
});