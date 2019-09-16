import {URL} from "./metadata.js";

// this is the current post count from Post Index
var postCount = 0;
var posts = [];
var postListSize = 6;
var postListPromises = [];

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
    return $.getJSON(URL+"/data/posts/"+postIndex["posts"][postID]+".json", function(post) 
    {
        posts[postIndex["postCount"]-postID] = post;
    });
}

$(document).ready(function() 
{
    $.getJSON(URL+"/data/postIndex.json", function(postIndex) 
    {
        postCount = postIndex["postCount"];
    })
    
    .then(function (postIndex) 
    {
        for (var i = 0; i < postListSize; i++)
        {
            var request = getPost(postIndex, postCount - i);
            postListPromises.push(request);
        };

        $.when.apply(null, postListPromises).done(function()
        {  
            for(var i = 0; i < postListSize; i++)
            {
                if(posts[i] != null) 
                {
                    $("#postList").append(
                        "<div class='post'>" +
                            "<text>===== POST #"+i+"</text>"+
                            formatPostTitle(posts[i])+
                            formatPostDate(posts[i])+
                            formatPostBody(posts[i])+
                        "</div>"
                    );
                } else {
                    $("#postList").append(
                        "<div class='post'>" +
                            "<text> === ERROR POSTLIST INDEX: " + i + " === </text>" +
                        "</div>"
                    );
                };
            };
        });
    });
});