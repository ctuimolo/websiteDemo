// this is the current post count from Post Index

var params = $("script[src*='./scripts/loadPosts.js']");

var postCount = 0;
var posts = [];
var postListPromises = [];
var defaultPostListSize = 6;
//var startIndex = parseInt(params.attr('startIndex'));
//var startIndex = 0;

function getPostID(post)
{
    return post["ID"];
}

function formatPostTitle(post)
{
    return (
        "<div>"+
            "<text>"+
                "TITLE: " + post["title"]+
            "</text>"+
        "</div>"
    );
}

function formatPostDate(post)
{
    return (
        "<div>"+
            "<text>"+
                "DATE: " + post["date"]+
            "</text>"+
        "</div>"
    );
}

function formatPostBody(post)
{
    return (
        "<div class='postBody'>"+
            "<text>"+
                post["body"].join('<br>')+
            "</text>"+
        "</div>"
    );
}



function getPost(postIndex, postID)
{
    var request = $.getJSON("../../data/posts/"+postIndex["posts"][postID]+".json", function(post) 
    {
        posts[postIndex["postCount"]-postID] = post;
    })

    return request;
}

function writePosts(startIndex, postListSize = defaultPostListSize)
{
    $.getJSON("../../data/postIndex.json", function(postIndexRaw) 
    {
        postCount = postIndexRaw["postCount"];
    })

    .then(function (postIndex) 
    {
        for (var i = 0; i < postListSize; i++)
        {
            if(startIndex + i < postCount)
            {
                var request = getPost(postIndex, postCount - i - startIndex);
                postListPromises.push(request);
            }
        };

        $.when.apply(null, postListPromises).done(function() 
        {
            $("#postlist").empty();
            for(var i = 0; i < postListSize; i++)
            {
                if(posts[i+startIndex] != null) 
                {
                    $("#postList").append(
                        "<div class='post'>" +
                            "<text>===== POST #"+(i+startIndex)+" === ID: "+getPostID(posts[i+startIndex])+" ====="+"</text>"+
                            formatPostTitle(posts[i+startIndex])+
                            formatPostDate(posts[i+startIndex])+
                            formatPostBody(posts[i+startIndex])+
                        "</div>"
                    );
                } else {
                    $("#postList").append(
                        "<div class='post'>" +
                            "<text> === ERROR POSTLIST INDEX: " + (i+startIndex) + " === </text>" +
                        "</div>"
                    );
                };
            }
        })
    });
}
 
$(document).ready(function() 
{
    writePosts(0);
});