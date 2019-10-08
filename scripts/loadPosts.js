// this is the current post count from Post Index

var params = $("script[src*='./scripts/loadPosts.js']");

var postCount = 0;
var posts = [];
var postListPromises = [];
var defaultPostListSize = 6;
var startPage = 0;
var currentPage = 0;
var totalPages = 0;
var navBarSize = 5;
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


function writePostListNavigator(startIndex) 
{
    $(".postListNavigator").empty();
    $(".postListNavigator").append("<text>page [");
    
    if(totalPages <= 6)
    {
        for(var i = 0; i <= 6 && i <= totalPages; i++)
        {
            if(i == currentPage)
            {
                $(".postListNavigator").append(
                    "<text class='postListPagesLinks' style='color:hotpink;text-decoration:underline' data-topage='"+i+"'>"+
                        i +
                    "</text>"
                );
            } else 
            {
                $(".postListNavigator").append(
                    "<a class='postListPagesLinks' data-topage='"+i+"'>"+
                        i +
                    "</a>"
                );
            }
        }
    } else 
    {
        if(currentPage <= 3)
        {
            for(var i = 0; i <= 5; i++)
            {
                if(i == currentPage)
                {
                    $(".postListNavigator").append(
                        "<text class='postListPagesLinks' style='color:hotpink;text-decoration:underline' data-topage='"+i+"'>"+
                            i +
                        "</text>"
                    );
                } else 
                {
                    $(".postListNavigator").append(
                        "<a class='postListPagesLinks' data-topage='"+i+"'>"+
                            i +
                        "</a>"
                    );
                }
            }
            $(".postListNavigator").append(
                "<text style='font-size:6px'>...</text><a class='postListPagesLinks' data-topage='"+totalPages+"'>"+
                    totalPages +
                "</a>"
            );
        } else if (currentPage >= 4 && currentPage < totalPages - 3) 
        {
            $(".postListNavigator").append(
                "<a class='postListPagesLinks' data-topage='"+0+"'>"+
                    0 +
                "</a><text style='font-size:6px'>...</text>"
            );
            for(var i = -2; i <= 2; i++)
            {
                if(i == 0)
                {
                    $(".postListNavigator").append(
                        "<text class='postListPagesLinks' style='color:hotpink;text-decoration:underline' data-topage='"+currentPage+"'>"+
                            parseInt(currentPage+i) +
                        "</text>"
                    );
                } else 
                {
                    $(".postListNavigator").append(
                        "<a class='postListPagesLinks' data-topage='"+parseInt(currentPage+i)+"'>"+
                            parseInt(currentPage+i) +
                        "</a>"
                    );
                }
            }
            $(".postListNavigator").append(
                "<text style='font-size:6px'>...</text><a class='postListPagesLinks' data-topage='"+totalPages+"'>"+
                    totalPages +
                "</a>"
            );
        } else 
        {
            $(".postListNavigator").append(
                "<a class='postListPagesLinks' data-topage='"+0+"'>"+
                    0 +
                "</a><text style='font-size:6px'>...</text>"
            );
            for(var i = totalPages-5; i <= totalPages; i++)
            {
                if(i == currentPage)
                {
                    $(".postListNavigator").append(
                        "<text class='postListPagesLinks' style='color:hotpink;text-decoration:underline' data-topage='"+i+"'>"+
                            i +
                        "</text>"
                    );
                } else 
                {
                    $(".postListNavigator").append(
                        "<a class='postListPagesLinks' data-topage='"+i+"'>"+
                            i +
                        "</a>"
                    );
                }
            }
        }
    }

    $(".postListNavigator").append("<text>] </text>");
    $(".postListNavigator").append(
        "<button class='newerPostsButton' type='button' disabled='true' onClick='window.scrollTo(0,0);'>prev page</button>" +
        "<button class='olderPostsButton' type='button' disabled='true' onClick='window.scrollTo(0,0);'>next page</button>"
    );

    // manage active buttons dependant on currentPage
    if(currentPage == 0)
    {
        $(".newerPostsButton").attr("disabled","true");
    }else if(currentPage > 0)
    {
        $(".newerPostsButton").removeAttr("disabled");
    }

    if(startIndex + defaultPostListSize >= postCount)
    {
        $(".olderPostsButton").attr("disabled","true");
    } else {
        $(".olderPostsButton").removeAttr("disabled");
    }

    $(".olderPostsButton").click(function()
    {
        currentPage += 1;
        writePosts(defaultPostListSize * currentPage);
    });

    $(".newerPostsButton").click(function()
    {
        currentPage -= 1;
        writePosts(defaultPostListSize * currentPage);
    });

    $(".postListPagesLinks").each(function(index) {
        $(this).on("click",function() {
            currentPage = $(this).data('topage');
            writePosts(defaultPostListSize * currentPage);
            window.scrollTo(0,0);
        })
    });
}

function writePosts(startIndex, postListSize = defaultPostListSize)
{
    $.getJSON("../../data/postIndex.json", function(postIndexRaw) 
    {
        postCount = postIndexRaw["postCount"];
        totalPages = parseInt((postCount -1) / defaultPostListSize);
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
            writePostListNavigator(startIndex);
            $("#postListBody").empty();
            for(var i = 0; i < postListSize; i++)
            {
                if(posts[i+startIndex] != null) 
                {
                    $("#postListBody").append(
                        "<div class='post'>" +
                            "<text>===== POST #"+(i+startIndex)+" === ID: "+getPostID(posts[i+startIndex])+" ====="+"</text>"+
                            formatPostTitle(posts[i+startIndex])+
                            formatPostDate(posts[i+startIndex])+
                            formatPostBody(posts[i+startIndex])+
                        "</div>"
                    );
                } else {
                    /*$("#postListBody").append(
                        "<div class='post'>" +
                            "<text> === ERROR POSTLIST INDEX: " + (i+startIndex) + " === </text>" +
                        "</div>"
                    );*/
                };
            }
        })
    });
}

$(document).ready(function() 
{
    writePosts(0);
});

