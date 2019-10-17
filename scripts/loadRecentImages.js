
var gallerySize = 0;
var galleryIndex = {};
var previewListSize = 6;

function writeGalleryImages() {

    $.getJSON("../../data/galleryIndex.json", function(galleryIndexRaw) 
    {
        gallerySize = galleryIndexRaw["gallerySize"];
        galleryIndex = galleryIndexRaw["galleryIndex"];
    })
    
    .then(function() 
    {
        for(var i = 0; i < previewListSize && gallerySize-i > 0; i++)
        {
            var filename = galleryIndex[gallerySize-i];
            $('.recentGalleryPreview').append(
                "<a href='./galleryData/"+ filename + "' target='_blank' style='margin-left: 3px; float: left; box-sizing:border-box;'>" +
                    "<img class='galleryThumbnail' src='./galleryData/thumbnails/"+ filename + "' width='142' height='142' style=''/>" +
                "</a>"
            );
        }
    });
}

$(document).ready(function() 
{
    writeGalleryImages();
});
