var archiveEntryCount = 0;
var archiveEntries = [];
var archiveListPromises = [];
var defaultarchiveListSize = 14;
var defaultPostListSize = 6;
var startPage = 0;
var currentPage = 0;
var totalPages = 0;
var navBarSize = 5;
var jumpToAnchor = undefined;
//var startIndex = parseInt(params.attr('startIndex'));
//var startIndex = 0;

$.urlParam = function(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if(results) 
        return results[1];
    return undefined;
}

$.urlAnchor = function() {
	var hash = $(location).attr('hash');
	return hash;
}

function getPostPageURLString(post, postFromIndex) 
{
    var page = parseInt(postFromIndex / defaultPostListSize);
    var ID = post["ID"];

    return "/?p="+page+"#"+ID;
}


function getarchiveEntryID(archiveEntry)
{
    return archiveEntry["ID"];
}

function formatarchiveEntry(archiveEntry,index)
{
    var htmlString = "";
    htmlString = htmlString.concat(
    "<div class='archiveLine' style='margin-top: 8px;'>" +
        "<text style='margin-left: 40px;'>" +
            "連絡:log [ " + archiveEntry["ID"].padStart(5,'0') + " ]" +
        "</text></br>" +
        "<text style='margin-left: 40px;'>" +
            "日付:day [ " +archiveEntry["date"] + " ]" + 
        "</text><br/><br/>" +
        "<text style='margin-left: 40px; font-style: italic;'>" + 
            archiveEntry["title"]+
        "</text>"
    );
    
    if(archiveEntry["images"] != undefined && archiveEntry["images"].length > 0)
    {
        htmlString = htmlString.concat(
        "<div>" +
            "<text style='margin-left: 50px;color:darkgray;''>"+
                "<i class='fas fa-level-up-alt' style='transform:rotate(90deg);color: #333333;'></i> " +
                archiveEntry["images"].length + " image(s) added to gallery" +
            "</text>" +
        "</div>"
        );
    }

    htmlString = htmlString.concat(
        "<div class='archiveLinkContainer'>" +
            "<text>" +
                "go to [ <a class='archiveLink' href='"+getPostPageURLString(archiveEntry,index)+"'>>> full post</a> ]" + 
            "</text>"+ 
        "</div>" +
    "</div>" +
    "</div>" +
    "<hr class='hrSubtle'/>"
    );
    return htmlString;
}

function getarchiveEntry(archiveEntryIndex, archiveEntryID)
{
    var request = $.getJSON("../../data/posts/"+archiveEntryIndex["posts"][archiveEntryID]+".json", function(archiveEntry) 
    {
        archiveEntries[archiveEntryIndex["postCount"]-archiveEntryID] = archiveEntry;
    });

    return request;
}

function writearchiveListPagesLink(toPage, clickable)
{
    if(clickable == true)
    {
        $(".archiveListNavigatorLinks").append(
            "<a class='archiveListPagesLinks' data-topage='"+toPage+"'>"+
                toPage +
            "</a>"
        );
    } else 
    {
        $(".archiveListNavigatorLinks").append(
            "<text class='archiveListPagesLinks' style='color:hotpink;text-decoration:underline' data-topage='"+toPage+"'>"+
                toPage +
            "</text>"
        );
    }
}

function writearchiveListNavigator() 
{
    $(".archiveListNavigatorLinks").empty();
    if(totalPages <= 6)
    {
        for(var i = 0; i <= 6 && i <= totalPages; i++)
        {
            if(i == currentPage)
            {
                writearchiveListPagesLink(i, false);
            } else 
            {
                writearchiveListPagesLink(i, true);
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
                    writearchiveListPagesLink(i, false);
                } else 
                {
                    writearchiveListPagesLink(i, true);
                }
            }
            $(".archiveListNavigatorLinks").append(
                "<text style='font-size:6px'>...</text><a class='archiveListPagesLinks' data-topage='"+totalPages+"'>"+
                    totalPages +
                "</a>"
            );
        } else if (currentPage >= 4 && currentPage < totalPages - 3) 
        {
            $(".archiveListNavigatorLinks").append(
                "<a class='archiveListPagesLinks' data-topage='"+0+"'>"+
                    0 +
                "</a><text style='font-size:6px'>...</text>"
            );
            for(var i = -2; i <= 2; i++)
            {
                if(i == 0)
                {
                    writearchiveListPagesLink(currentPage+i, false);
                } else 
                {
                    writearchiveListPagesLink(currentPage+i, true);
                }
            }
            $(".archiveListNavigatorLinks").append(
                "<text style='font-size:6px'>...</text><a class='archiveListPagesLinks' data-topage='"+totalPages+"'>"+
                    totalPages +
                "</a>"
            );
        } else 
        {
            $(".archiveListNavigatorLinks").append(
                "<a class='archiveListPagesLinks' data-topage='"+0+"'>"+
                    0 +
                "</a><text style='font-size:6px'>...</text>"
            );
            for(var i = totalPages-5; i <= totalPages; i++)
            {
                if(i == currentPage)
                {
                    writearchiveListPagesLink(i, false);
                } else 
                {
                    writearchiveListPagesLink(i, true);
                }
            }
        }
    }
    // manage active buttons dependant on currentPage
    if(currentPage == 0)
    {
        $(".newerarchiveEntriesButton").attr("disabled","true"); 
    }else if(currentPage > 0)
    {
        $(".newerarchiveEntriesButton").removeAttr("disabled");
    }

    if((currentPage*defaultarchiveListSize) + defaultarchiveListSize >= archiveEntryCount)
    {
        $(".olderarchiveEntriesButton").attr("disabled","true");
    } else {
        $(".olderarchiveEntriesButton").removeAttr("disabled");
    }

    $(".olderarchiveEntriesButton").click(function()
    {
        changeURLWritearchiveEntries(currentPage + 1);
    });

    $(".newerarchiveEntriesButton").click(function()
    {
        changeURLWritearchiveEntries(currentPage - 1);
    });

    $("#toBottomButton").click(function()
    {
        $('html, body').animate({
            scrollTop: $("#bottom").offset().top
        }, 600);
    });

    $("#toTopButton").click(function()
    {
        $('html, body').animate({
            scrollTop: $("body").offset().top
        }, 500);
    });

    $(".archiveListPagesLinks").each(function(index) {
        $(this).on("click",function() 
        {
            changeURLWritearchiveEntries($(this).data('topage'));
        })
    });
}

function changeURLWritearchiveEntries(toPage) 
{
    if(toPage == 0)
    {
        window.location = "/archive";
    } else{
        window.location = "/archive?p=" + (toPage);
    }
}

function writearchiveEntries(startPage)
{
    currentPage = startPage;
    $.getJSON("../../data/postIndex.json", function(postIndexRaw) 
    {
        archiveEntryCount = postIndexRaw["postCount"];
        totalPages = parseInt((archiveEntryCount -1) / defaultarchiveListSize);
    })

    .then(function (archiveEntryIndex) 
    {
        for (var i = 0; i < defaultarchiveListSize; i++)
        {
            if((currentPage*defaultarchiveListSize) + i < archiveEntryCount)
            {
                var request = getarchiveEntry(archiveEntryIndex, archiveEntryCount - i - (currentPage*defaultarchiveListSize));
                archiveListPromises.push(request);
            }
        };

        $.when.apply(null, archiveListPromises).done(function() 
        {
            writearchiveListNavigator();
            $("#archiveListBody").empty();
            for(var i = 0; i < defaultarchiveListSize; i++)
            {
                if(archiveEntries[i+(currentPage*defaultarchiveListSize)] != null) 
                {
                    $("#archiveListBody").append(
                        "<div class='archiveEntry'>" +
                            formatarchiveEntry(archiveEntries[i+(currentPage*defaultarchiveListSize)],i+(currentPage*defaultarchiveListSize))+
                        "</div>"
                    );
                }
            }
        })
    });
}

$(window).on('hashchange', function(){
    location.reload();
});

$(document).ready(function() 
{
    var p = $.urlParam('p') 
    jumpToAnchor = $.urlAnchor();

    if(p != undefined) 
    {
        writearchiveEntries(parseInt(p));
    } else  
    {
        writearchiveEntries(0);
    }
});

