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

$.urlParam = function(name) {
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	return results[1] || 0;
}

function getPostID(post)
{
    return post["ID"];
}

function formatPostTitle(post)
{
    return (
        "<div>"+
            "<text class='postTitle'>"+
                post["title"]+
            "</text>"+
        "</div>"
    );
}

function formatPostDate(post)
{
    return (
        "<div class='postDate'>"+
        "<i class='far fa-calendar-alt' style='font-size:11px;color:hotpink'></i>"+
            "<text> "+
                post["date"]+
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

function formatPostID(post)
{
    return (
        "<div class='postID'>"+
            "<text>"+
                "履歴:log [" + getPostID(post).padStart(5,'0') + "]" +
            "</text>"+
        "</div>"
    )
}

function formatPostImage(post, imageIndex) 
{
    var filename = post["images"][imageIndex];
    return (
        "<a class='galleryThumbnail' href='./gallery/"+ filename + "' target='_blank'>" +
            "<img src='./gallery/thumbnails/"+ filename + "' width='150' height='150' style='padding-left:6px;padding-top:6px'/>" +
        "</a>"
    )
}

function formatPostImages(post) 
{
    var htmlString = "";
    if(post["images"] != undefined) 
    {
        for(var i = 0; i < post["images"].length; i++)
        {
            htmlString = htmlString.concat(formatPostImage(post, i));
        }
    }
    return htmlString;
}

function getPost(postIndex, postID)
{
    var request = $.getJSON("../../data/posts/"+postIndex["posts"][postID]+".json", function(post) 
    {
        posts[postIndex["postCount"]-postID] = post;
    });

    return request;
}

function writePostListPagesLink(toPage, clickable)
{
    if(clickable == true)
    {
        $(".postListNavigatorLinks").append(
            "<a class='postListPagesLinks' data-topage='"+toPage+"'>"+
                toPage +
            "</a>"
        );
    } else 
    {
        $(".postListNavigatorLinks").append(
            "<text class='postListPagesLinks' style='color:hotpink;text-decoration:underline' data-topage='"+toPage+"'>"+
                toPage +
            "</text>"
        );
    }
}

function writePostListNavigator() 
{
    if(totalPages <= 6)
    {
        for(var i = 0; i <= 6 && i <= totalPages; i++)
        {
            if(i == currentPage)
            {
                writePostListPagesLink(i, false);
            } else 
            {
                writePostListPagesLink(i, true);
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
                    writePostListPagesLink(i, false);
                } else 
                {
                    writePostListPagesLink(i, true);
                }
            }
            $(".postListNavigatorLinks").append(
                "<text style='font-size:6px'>...</text><a class='postListPagesLinks' data-topage='"+totalPages+"'>"+
                    totalPages +
                "</a>"
            );
        } else if (currentPage >= 4 && currentPage < totalPages - 3) 
        {
            $(".postListNavigatorLinks").append(
                "<a class='postListPagesLinks' data-topage='"+0+"'>"+
                    0 +
                "</a><text style='font-size:6px'>...</text>"
            );
            for(var i = -2; i <= 2; i++)
            {
                if(i == 0)
                {
                    writePostListPagesLink(currentPage+i, false);
                } else 
                {
                    writePostListPagesLink(currentPage+i, true);
                }
            }
            $(".postListNavigatorLinks").append(
                "<text style='font-size:6px'>...</text><a class='postListPagesLinks' data-topage='"+totalPages+"'>"+
                    totalPages +
                "</a>"
            );
        } else 
        {
            $(".postListNavigatorLinks").append(
                "<a class='postListPagesLinks' data-topage='"+0+"'>"+
                    0 +
                "</a><text style='font-size:6px'>...</text>"
            );
            for(var i = totalPages-5; i <= totalPages; i++)
            {
                if(i == currentPage)
                {
                    writePostListPagesLink(i, false);
                } else 
                {
                    writePostListPagesLink(i, true);
                }
            }
        }
    }
    // manage active buttons dependant on currentPage
    if(currentPage == 0)
    {
        $(".newerPostsButton").attr("disabled","true");
    }else if(currentPage > 0)
    {
        $(".newerPostsButton").removeAttr("disabled");
    }

    if((currentPage*defaultPostListSize) + defaultPostListSize >= postCount)
    {
        $(".olderPostsButton").attr("disabled","true");
    } else {
        $(".olderPostsButton").removeAttr("disabled");
    }

    $(".olderPostsButton").click(function()
    {
        changeURLWritePosts(currentPage + 1);
    });

    $(".newerPostsButton").click(function()
    {
        changeURLWritePosts(currentPage - 1);
    });

    $(".postListPagesLinks").each(function(index) {
        $(this).on("click",function() 
        {
            changeURLWritePosts($(this).data('topage'));
        })
    });
}

function changeURLWritePosts(toPage) 
{
    if(toPage == 0)
    {
        window.location = "/";
    } else{
        window.location = "/?p=" + (toPage);
    }
}

function writePosts(startPage)
{
    currentPage = startPage;
    $.getJSON("../../data/postIndex.json", function(postIndexRaw) 
    {
        postCount = postIndexRaw["postCount"];
        totalPages = parseInt((postCount -1) / defaultPostListSize);
    })

    .then(function (postIndex) 
    {
        for (var i = 0; i < defaultPostListSize; i++)
        {
            if((currentPage*defaultPostListSize) + i < postCount)
            {
                var request = getPost(postIndex, postCount - i - (currentPage*defaultPostListSize));
                postListPromises.push(request);
            }
        };

        $.when.apply(null, postListPromises).done(function() 
        {

            writePostListNavigator();
            $("#postListBody").empty();
            for(var i = 0; i < defaultPostListSize; i++)
            {
                if(posts[i+(currentPage*defaultPostListSize)] != null) 
                {
                    $("#postListBody").append(
                        "<div class='post'>" +
                            //"<text>===== POST #"+(i+startIndex)+" === ID: "+getPostID(posts[i+startIndex])+" ====="+"</text>"+
                            formatPostTitle(posts[i+(currentPage*defaultPostListSize)])+
                            formatPostDate(posts[i+(currentPage*defaultPostListSize)])+
                            formatPostBody(posts[i+(currentPage*defaultPostListSize)])+
                            formatPostImages(posts[i+(currentPage*defaultPostListSize)])+
                            formatPostID(posts[i+(currentPage*defaultPostListSize)])+
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
    try { 
        var p = $.urlParam('p') 
    } catch (err) {
        // p is undefined
    }
    
    if(p != undefined) 
    {
        writePosts(parseInt(p));
    } else  
    {
        writePosts(0);
    }
});

