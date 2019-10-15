var posts = [];
var postCount = 0;
var postListPromises = [];
var defaultPostListSize = 6;
var defaultArchivePreviewSize = 10;

function getPostPageURLString(post, postFromIndex) 
{
    var page = parseInt(postFromIndex / defaultPostListSize);
    var ID = post["ID"];

    return "/?p="+page+"#"+ID;
}

function formatPostID(post)
{
    return post["ID"].padStart(5,'0');
}

function getPost(postIndex, postKey, destinationIndex)
{
    var request = $.getJSON("../../data/posts/"+postIndex["posts"][postKey]+".json", function(post) 
    {
        posts[destinationIndex] = post;
    });

    return request;
}

function writeArchivePreview()
{
    $.getJSON("../../data/postIndex.json", function(postIndexRaw) 
    {
        postCount = postIndexRaw["postCount"];
    }).then(function (postIndex) 
    {
        for (var i = 0; i < defaultArchivePreviewSize && i < postCount; i++)
        {
            var request = getPost(postIndex, postCount - i, i);
            postListPromises.push(request);
        };

        $.when.apply(null, postListPromises).done(function() 
        {
            $('.archivePreview').append(
                "<text>go to: ... </text>"
            );
            for(var i = 0; i < defaultArchivePreviewSize; i++)
            {
                if(posts[i] != null) 
                {
                    $('.archivePreview').append(
                        "<div class='archivePreviewLine' style='margin-top: 8px;'>" +
                            "<text>・</text><a class='navLink' href='"+getPostPageURLString(posts[i],i)+"'>" + 
                                "<text>[ " +
                                    posts[i]["date"] + " ] <text style='font-style: italic;'>ー "+posts[i]["title"]+"</text>" +
                                "</text>" +
                            "</a>"
                    );
                    if(posts[i]["images"] != undefined && posts[i]["images"].length > 0)
                    {
                        $('.archivePreview').append(
                            "<text style='margin-left: 20px;color:darkgray;''>"+
                            "<i class='fas fa-level-up-alt' style='transform:rotate(90deg);color: #333333;'></i> "+
                                posts[i]["images"].length + " image(s) added to gallery" +
                            "</text>"
                        );
                    }
                    $('.archivePreview').append(
                        "</div>" +
                        "<hr class='hrSubtle'/>" 
                    );
                }
            }
        });
    });
}

$(document).ready(function() 
{
    writeArchivePreview();
});
