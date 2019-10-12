
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
                "<a class='galleryThumbnail' href='./gallery/"+ filename + "' target='_blank'>" +
                    "<img src='./gallery/thumbnails/"+ filename + "' width='140' height='140' style='padding-left:6px;padding-top:3px'/>" +
                "</a>"
            );
        }
    });
}

$(document).ready(function() 
{
    writeGalleryImages();
});
