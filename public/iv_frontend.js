var iv_ids = []; // Array of all embed ids
var iv_players = []; // Array of all Youtube players
var iv_threads = [[[]]]; // The general comments array (metadata)
var iv_moderatorcomments = []; // The times of all moderator threads (used for reservation)
var iv_commentintervals = []; // Interval to trigger scroll when next comment is reached
var iv_pulse = false; // This will be the general 1s interval refreshing timelines
var iv_rollingvids = []; // An array of all videos currently playing
var iv_draggingvid = false; // Global variable used for dragging events
var iv_openqueue = []; // A cue of IVs to be opened when players are ready
var iv_playqueue = []; // A cue of IVs to be played when players are ready

var iv_speed = 800; // General speed used in most animations
var iv_jumpspeed = 200; // Speed for rapid movement
var aspectRatio = 16 / 9; // Defining aspectRatio -> Can this be done via teaser img?
var limitcommentscope = 5; // How many seconds before and after we count comments when limiting them


// Add Youtube API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Adapted Youtube function to initiate all players, or a specific one
function onYouTubeIframeAPIReady(curembedid) {
    if (typeof iv_ids === 'undefined') return;
    if (typeof curembedid === 'undefined') {
        for (var i = 0; i < iv_ids.length; i++) {
            var curembedobj = jQuery("#" + iv_ids[i]);
            var curvideoid = curembedobj.data("videoid");
            if (!curembedobj.hasClass("lazyload")) {
                var curplayer = new YT.Player(iv_ids[i] + "_player", {
                    height: "390",
                    width: "640",
                    videoId: curvideoid,
                    playerVars: {"rel": 0, "controls":0, "modestbranding":1, "playsinline":1}, //
                    events: {
                        'onReady': iv_initialise,
                        'onStateChange': iv_statechange
                    }
                });
                iv_players[i] = curplayer;
            }
        }
    } else {
        var curvideoid = jQuery("#" + curembedid).data("videoid");
        var curplayer = new YT.Player(curembedid + "_player", {
            height: "390",
            width: "640",
            videoId: curvideoid,
            playerVars: {"rel": 0, "controls":0, "modestbranding":1, "playsinline":1}, //
            events: {
                'onReady': iv_initialiseajax,
                'onStateChange': iv_statechange
            }
        });
        iv_players[iv_ids.indexOf(curembedid)] = curplayer;
    }
}

function iv_initialise(e) {
    var curembedid = e.target.getIframe().parentNode.parentNode.id;
    var curembednr = iv_ids.indexOf(curembedid);
    //console.log(iv_ids);
    var curembedobj = jQuery("#" + curembedid);
    var curwidth = curembedobj.width();
    iv_players[curembednr].setSize(width = curwidth, height = curwidth / aspectRatio);
    curembedobj.find(".iv_controllayers").height(curwidth / aspectRatio).css("margin-top", -curwidth / aspectRatio);
    //iv_players[curembednr].mute();
    iv_players[curembednr].duration = iv_players[curembednr].getDuration();
    iv_players[curembednr].durationform = iv_players[curembednr].duration>=3600?"hours":(iv_players[curembednr].duration>=60?"minutes":"seconds");
    curembedobj.find(".iv_currenttimes .durations").html(seconds2human(iv_players[curembednr].duration));
    curembedobj.find(".iv_currenttimes .curtimes").html(seconds2human(0, iv_players[curembednr].durationform));
    iv_players[curembednr].touchtimer = false;
    iv_players[curembednr].draggingflag = false;
    iv_players[curembednr].tooltip = true;
    iv_players[curembednr].commentbarheight = curembedobj.find(".iv_commentbars").height();
    if (iv_openqueue.includes(curembedid)) {
        curembedobj.iv_openclose(false);
        iv_openqueue.splice(iv_openqueue.indexOf(curembedid), 1);
    }
    if (iv_playqueue.includes(curembedid)) {
        iv_players[curembednr].playVideo();
        iv_playqueue.splice(iv_playqueue.indexOf(curembedid), 1);
    }
}

function iv_initialiseajax(e) {
    iv_initialise(e);
    var curembedobj = jQuery("#" + e.target.getIframe().parentNode.parentNode.id);
    curembedobj.find(".iv_videotitles").html(e.target.getVideoData()['title']);
    curembedobj.addClass("lazyloaded");
}

function iv_statechange(e)  {
    var curembedid = e.target.getIframe().parentNode.parentNode.id;
    var curembednr = iv_ids.indexOf(curembedid);
    var curembedobj = jQuery("#" + curembedid);
    var playerstate = e.target.getPlayerState();
    // IF NOT CUED -> SWITCH CONTROLS ON
    if (playerstate != 5 && !curembedobj.hasClass("initialised")) {
        curembedobj.addClass("initialised");
    }
    if (iv_draggingvid === false) {
        if (playerstate == 2) {
            // Paused. Attention: Can be called when changing
            // from paused to buffering to paused, e.g. on timeline change.
            iv_rollingvids[curembednr] = false;
            if (curembedobj.hasClass("playing")) {
                curembedobj.iv_changeplaypausebutton("play").removeClass("playing");
            }
            if (curembedobj.hasClass("open")) {
                curembedobj.iv_scrollstop(false);
            }
            // kill pulse if no video playing
            if (iv_rollingvids.every(function (t) { return !t })) {
                clearInterval(iv_pulse);
                iv_pulse = false;
            }
        } else if (playerstate == 1 && iv_draggingvid === false) {
            //playing
            iv_rollingvids[curembednr] = true;
            if (!curembedobj.hasClass("playing")) {
                curembedobj.iv_changeplaypausebutton("pause").addClass("playing");
            }
            curembedobj.iv_touchtimer();
            if (curembedobj.hasClass("sync") && curembedobj.hasClass("open")) {
                if (curembedobj.hasClass("manualscroll")) {
                    curembedobj.iv_scroll(iv_jumpspeed);
                } else {
                    curembedobj.iv_scroll(0);
                }
            }
            //reanimate if necessary
            if (!iv_pulse) {
                iv_pulse = setInterval(function() {
                    iv_pulsefunction();
                }, 1000)
            }
        }
    } else {
        if (playerstate == 0) {
            // This means somebody dragged the video to the end
            iv_players[curembednr].draggingflag = true;
        }
    }
}

function iv_pulsefunction () {
    if (iv_draggingvid === false) {
        for (var i = 0; i < iv_rollingvids.length; i++) {
            if (iv_rollingvids [i]) {
                var curembedobj = jQuery("#" + iv_ids[i]);
                curembedobj.iv_updatetimeline();
            }
        }
    }
}
var seconds2human = function(seconds, hms) {
    var txt = "";
    seconds = Math.floor(seconds);
    var twodigits = false;
    if (seconds >= 3600 || hms == "hours") {
        txt += Math.floor(seconds / 3600) + ":";
        twodigits = true;
    }
    if (seconds >= 60 || hms == "minutes") {
        txt += twodigits ? ("0" + Math.floor((seconds % 3600) / 60)).slice(-2) : Math.floor((seconds % 3600) / 60) +
            ":";
        twodigits = true;
    }
    txt += twodigits ? ("0" + Math.floor(seconds % 60)).slice(-2) : seconds % 60;
    return txt;
}

//Fullscreen
var iv_goFullscreen, iv_FullscreenElement, iv_quitFullscreen, iv_Fullscreenchange;
if ((new Image)['requestFullScreen']) {
    iv_goFullscreen = 'requestFullScreen';
    iv_FullscreenElement = 'fullscreenElement';
    iv_quitFullscreen = 'exitFullscreen';
    iv_Fullscreenchange = 'fullscreenchange';
} else if ((new Image)['webkitRequestFullScreen']) {
    iv_goFullscreen = 'webkitRequestFullScreen';
    iv_FullscreenElement = 'webkitFullscreenElement';
    iv_quitFullscreen = 'webkitExitFullscreen';
    iv_Fullscreenchange = 'webkitfullscreenchange';
} else if ((new Image)['mozRequestFullScreen']) {
    iv_goFullscreen = 'mozRequestFullScreen';
    iv_FullscreenElement = 'mozFullScreenElement';
    iv_quitFullscreen = 'mozCancelFullScreen';
    iv_Fullscreenchange = 'mozfullscreenchange';
} else if ((new Image)['msRequestFullScreen']) {
    iv_goFullscreen = 'msRequestFullScreen';
    iv_FullscreenElement = 'msFullscreenElement';
    iv_quitFullscreen = 'msExitFullscreen';
    iv_Fullscreenchange = 'MSFullscreenChange';
}

jQuery(document).ready(function ($) {
    //region Initialise / Layout
    $(window).resize(function () {
        if (document[iv_FullscreenElement]) {
            var curembednr = iv_ids.indexOf(document[iv_FullscreenElement].id);
            if (screen.width/screen.height<=aspectRatio) {
                iv_players[curembednr].setSize(width = screen.width, height = screen.width / aspectRatio);
            } else {
                iv_players[curembednr].setSize(width = screen.height * aspectRatio, height = screen.height);
            }
        } else {
            //Update Youtube sizes
            for (var i = 0; i < iv_players.length; i++) {
                curembedobj = $("#" + iv_ids[i]);
                iv_players[i].setSize(width = curembedobj.width(), height = curembedobj.width() / aspectRatio);
            }
            //Screen portrait or landscape?
            if (screen.width < screen.height) {
                $("body").addClass("portrait");
            } else {
                $("body").removeClass("portrait");
            }
        }
    });
    $(window).resize();

    // Moderator -> body class
    if (eval(ivData.isModerator)) $("body").addClass("iv_moderator");

    // Handling scrollbar in iv_restdivs
    var getScrollBarWidth = function () {
        var inner = document.createElement('p');
        inner.style.width = "100%";
        inner.style.height = "200px";

        var outer = document.createElement('div');
        outer.style.position = "absolute";
        outer.style.top = "0px";
        outer.style.left = "0px";
        outer.style.visibility = "hidden";
        outer.style.width = "200px";
        outer.style.height = "150px";
        outer.style.overflow = "hidden";
        outer.appendChild(inner);

        document.body.appendChild(outer);
        var w1 = inner.offsetWidth;
        outer.style.overflow = 'scroll';
        var w2 = inner.offsetWidth;

        if (w1 == w2) {
            w2 = outer.clientWidth;
        }

        document.body.removeChild(outer);

        return (w1 - w2);
    };
    var iv_scrollbarwidth = getScrollBarWidth();
    $(".iv_linkbuttons").css("margin-right", iv_scrollbarwidth+"px");

    // Detecting once whether touch or mouse and then assuming it's such a device
    $(window).bind('mousemove.hasMouse',function(){
        $("body").addClass("iv_mouse");
        $(window).unbind('.hasMouse');
    }).one('touchstart',function(){
        $("body").removeClass("iv_mouse");
        $(window).unbind('.hasMouse');
    });

    // Mixing colors
    var mixcolors = function (color_1, color_2, weight) {

        function d2h(d) { return d.toString(16); }  // convert a decimal value to hex
        function h2d(h) { return parseInt(h, 16); } // convert a hex value to decimal

        function extractrgba(colorstring) {
            let rgba = [];
            if (colorstring.substr(0,5)=="rgba(") {
                rgba = colorstring.replace(/^(rgb|rgba)\(/,'').replace(/\)$/,'').replace(/\s/g,'').split(',').map(val => parseFloat(val));
            } else if (colorstring.length==7 ) { //hex
                rgba[0] = h2d(colorstring.replace(/#/,'').slice(0,2));
                rgba[1] = h2d(colorstring.replace(/#/,'').slice(2,4));
                rgba[2] = h2d(colorstring.replace(/#/,'').slice(4,6));
                rgba[3] = 1;
            }
            return rgba;
        }

        weight = (typeof(weight) !== 'undefined') ? weight : 50; // set the weight to 50%, if that argument is omitted

        let color = "rgba(";
        let rgba_1 = extractrgba(color_1);
        let rgba_2 = extractrgba(color_2);
        console.log(color_1);
        console.log(color_2);
        console.log(rgba_1);
        console.log(rgba_2);

        for(let i = 0; i <= 2; i += 1) { // loop through red, green, blue
            // combine the current pairs from each source color, according to the specified weight
            color += Math.floor(rgba_2[i] + (rgba_1[i] - rgba_2[i]) * (weight / 100.0))+", "; 
            // color += Math.floor(Math.abs(rgba_1[i] - rgba_2[i]))+", ";
        }
        //handle alpha
        console.log(rgba_2[3]+" and "+rgba_2[3]+"=>"+(rgba_2[3] + (rgba_1[3] - rgba_2[3])) * 1000);
        color += (rgba_1[3]+rgba_2[3]!==2) ? "0."+Math.floor((rgba_2[3] + (rgba_1[3] - rgba_2[3])) * 1000 * (weight / 100.0))+")" : "1)"; 
        console.log(color);
        return color;
    };
    
    // CONSTRUCT iv_ids array
    $(".iv_containers").each(function () {
        iv_ids.push($(this).attr("id"));
    });
    
//     ==================================================================
//     Functionality for .iv_commentcontainers
//     ==================================================================
    
    //This constructs the histogram svg showing where the comments are
    $.fn.iv_histogram = function (nrofsegments, fadein) {
        var curembedobj = $(this[0]);
        var curembedid = curembedobj.attr("id");
        var curembednr = iv_ids.indexOf(curembedid);
        var vidlength = iv_players[curembednr].duration;
        var canvasobj = curembedobj.find(".iv_histogramcanvases");

        //build SVG string
        var width=100;
        var height=50;
        var arraypos=0;
        // about the segments: 0.5start+0.5end = 1 extra segment, so +1.
        var px=width/(nrofsegments+1); //width in px of segments
        var intervalseconds=vidlength/(nrofsegments+1); //length of intervals in seconds
        var commentsums = [];
        var maxcomments = 0;
        for (var intervalnr=0;intervalnr<=nrofsegments-1; intervalnr++) {
            commentsums[intervalnr] = 0;
            if(arraypos<iv_threads[curembednr].length) {
                sumit:
                    while (iv_threads[curembednr][arraypos][1]<(intervalnr+1)*intervalseconds) {
                        commentsums[intervalnr]+=iv_threads[curembednr][arraypos][2];
                        arraypos++;
                        if (arraypos>=iv_threads[curembednr].length) break sumit;
                    }
            }
            if (commentsums[intervalnr]>maxcomments) maxcomments=commentsums[intervalnr];
        }
        var svgstring="M 0 " + height + " ";
        for (var i=0; i<commentsums.length;i++) {
            var pointheight = (1-commentsums[i]/maxcomments)*height; // normal height
            pointheight = pointheight*0.9+5; //slight correction 
            svgstring+= "S " + (i+0.5)*px + " " + pointheight + ", " + (i+1)*px + " " + pointheight + " ";
        }
        svgstring+= "L " + width + " " + height + " Z"; //Go to bottom right and close path
        var svgpath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        svgpath.setAttribute("d", svgstring);
        canvasobj.html(svgpath);
        if (fadein) {canvasobj.slideDown();}
        return this;
    };
    $.fn.iv_buildcommentarray = function () {
        var curembedobj = $(this[0]);
        var curembedid = curembedobj.attr("id");
        var curembednr = iv_ids.indexOf(curembedid);
        var array = [];
        var maxthread = 1;
        curembedobj.find(".iv_commentcontainers li.comment.depth-1").each(function(i) {
            if($(this).hasClass("moderatorcomments")) {
                iv_moderatorcomments.push($(this).data("comment-time"));
            }
            if($(this).children("ul.children").length) {
                var childrencount = $(this).find("data.childrencounts").data("childrencount");
                $(this).children(".iv_commentbodies").children(".iv_commentcontents").children(".iv_comment-belowline").children(".separators").show().next().show().children(".iv_childrencountnumber").html(" (" + childrencount + ")");
                childrencount++;
                if (childrencount>maxthread) {
                    maxthread=childrencount;
                }
            } else {
                var childrencount = 1;
            }
            array.push([$(this).data("comment-id"), jQuery(this).data("comment-time"), childrencount]);
        });

        for (var i = 0; i < array.length; i++) {
            if (array[i][2]!=1) {
                $("#comment-"+array[i][0]).css("background-color", mixcolors(ivData.maxColor, ivData.minColor, array[i][2]/maxthread*100))
            }
        }
        iv_threads[curembednr] = array;
        curembedobj.iv_histogram(20, true);
        return this;
    };
    $.fn.iv_scroll = function (jumpspeed, justjump, calctime) {
        var curembedobj = $(this[0]); // It's your element
        if (curembedobj.hasClass("commentsfetched")) {
            var curembedid = $(this[0]).attr("id");
            var curembednr = iv_ids.indexOf(curembedid);
            var curcommentcontainerobj = curembedobj.find(".iv_commentcontainers");
            if (calctime) {
                var curtime = calctime;
            } else {
                var curtime = iv_players[curembednr].getCurrentTime();
            }
            //Before first comment
            if (iv_threads[curembednr][0][1] > curtime) {
                var firstcomment = iv_threads[curembednr][0];
                curcommentcontainerobj.stop();
                if (jumpspeed) {
                    curcommentcontainerobj.animate({scrollTop: 0}, jumpspeed);
                }
                clearInterval(iv_commentintervals[curembednr]);
                // Scrolling to first comment, which is only useful in cases yet unfathomed. Setting interval is necessary.
                if (!justjump) {
                    curcommentcontainerobj.animate({scrollTop: 0}, (firstcomment[1] - curtime) * 1000);
                    // Schedule next iv_scroll execution
                    iv_commentintervals[curembednr] = setInterval(function () {
                        curembedobj.iv_scroll(false, false);
                    }, (firstcomment[1] - curtime) * 1000);
                }
            }
            //After last comment
            else if (iv_threads[curembednr][iv_threads[curembednr].length - 1][1] < curtime) {
                var lastcomment = iv_threads[curembednr][iv_threads[curembednr].length - 1];
                var curvidduration = iv_players[curembednr].duration;
                curcommentcontainerobj.stop();
                if (jumpspeed) {
                    lastcommentobj = jQuery('*[data-comment-id="' + lastcomment[0] + '"]');
                    curcommentcontainerobj.animate({
                        scrollTop:
                        curcommentcontainerobj.height()
                        - lastcommentobj.height() * 1 - ((curtime - lastcomment[1]) / (curvidduration - lastcomment[1]))
                        + curcommentcontainerobj.scrollTop()
                        - curcommentcontainerobj.offset().top
                    }, jumpspeed);
                }
                clearInterval(iv_commentintervals[curembednr]);
                // Scrolling to the end
                if (!justjump) {
                    curcommentcontainerobj.animate({scrollTop: curcommentcontainerobj.height() + curcommentcontainerobj.scrollTop() - curcommentcontainerobj.offset().top}, (curvidduration - curtime) * 1000);
                }
            }
            //Everything in between
            else {
                prevcommentnr = 0;
                for (var i = 0; i < iv_threads[curembednr].length; i++) {
                    if (iv_threads[curembednr][i][1] > curtime) {
                        curcommentcontainerobj.stop();
                        // Jumping
                        if (jumpspeed) {
                            prevcomment = curcommentcontainerobj.find('*[data-comment-id="' + iv_threads[curembednr][prevcommentnr][0] + '"]');
                            curcommentcontainerobj.animate({
                                scrollTop: prevcomment.offset().top + prevcomment.height() * (curtime - iv_threads[curembednr][prevcommentnr][1]) / (iv_threads[curembednr][i][1] - iv_threads[curembednr][prevcommentnr][1]) + curcommentcontainerobj.scrollTop() - curcommentcontainerobj.offset().top
                            }, jumpspeed);
                        }
                        // CLEAR INTERVAL ANYWAY?
                        clearInterval(iv_commentintervals[curembednr]);
                        // Scrolling to next comment
                        if (!justjump) {
                            curcommentcontainerobj.animate({
                                scrollTop:
                                curcommentcontainerobj.find('*[data-comment-id="' + iv_threads[curembednr][i][0] + '"]').offset().top + curcommentcontainerobj.scrollTop() - curcommentcontainerobj.offset().top
                            }, (iv_threads[curembednr][i][1] - curtime) * 1000);
                            // Schedule next iv_scroll execution
                            iv_commentintervals[curembednr] = setInterval(function () {
                                curembedobj.iv_scroll(false, false);
                            }, (iv_threads[curembednr][i][1] - curtime) * 1000);
                        }
                        break;
                    }
                    if (iv_threads[curembednr][i][1] > iv_threads[curembednr][prevcommentnr][1]) {
                        prevcommentnr = i;
                    }
                }
            }
            curembedobj.find(".iv_linkbuttons input").prop("checked", true);
            curembedobj.addClass("sync").removeClass("manualscroll");
            setTimeout(function () {
                if (curembedobj.hasClass("sync")) {
                    curembedobj.find(".iv_linkbuttons").removeClass("show");
                }
            }, iv_speed * 3);
        }
        return this;
    }
    $.fn.iv_scrollstop = function(unlink) {
        var curembedobj = $(this[0]); // It's your element
        var curembedid = $(this[0]).attr("id");
        var curembednr = iv_ids.indexOf(curembedid);
        clearInterval(iv_commentintervals[curembednr]);
        curembedobj.find(".iv_commentcontainers").stop();
        if (unlink) {
            curembedobj.removeClass("sync");
            var linkbutton = curembedobj.find(".iv_linkbuttons");
            linkbutton.addClass("show");
            if (iv_players[curembednr].tooltip === true) {
                linkbutton.addClass("showtooltip");
                setTimeout(function() {
                    linkbutton.removeClass("showtooltip");
                    iv_players[curembednr].tooltip = false;
                }, iv_speed*3);
            }
            linkbutton.find("input").prop("checked", false);
        }
        return this; // This is needed so others can keep chaining off of this
    };
    // Give background color to .iv_restdivs
    $(".iv_restdivs").css("background-color", ivData.minColor);
    //endregion
    //region Scrolling/Syncing
    //Unlink when interference
    $(".iv_containers").on("wheel touchstart mousedown", ".iv_commentcontainers", function() {
        var curembedobj = $(this).parents(".iv_containers");
        curembedobj.iv_scrollstop(true);
        curembedobj.addClass("manualscroll");
    });
    $(".iv_containers").on("click", ".iv_linkbuttons", function (e){
        var curembedobj = $(this).parents(".iv_containers");
        var curembedid = curembedobj.attr("id");
        var curembednr = iv_ids.indexOf(curembedid);
        if (curembedobj.hasClass("sync")) {
            curembedobj.iv_scrollstop(true);
        } else {
            if(iv_rollingvids[curembednr] === false) {
                curembedobj.iv_scroll(iv_jumpspeed, true);
            } else {
                curembedobj.iv_scroll(iv_jumpspeed, false);
            }
        }
        e=e || window.event;
        pauseEvent(e);
    });
    //endregion
    //region Timeline
    $.fn.iv_updatetimeline = function (time) {
        var curembedobj = $(this[0]);
        var curembedid = curembedobj.attr("id");
        var curembednr = iv_ids.indexOf(curembedid);
        if (typeof time == 'number') {
            var curtime = time;
        } else {
            var curtime = iv_players[curembednr].getCurrentTime();
        }
        curembedobj.find(".iv_formtimes").val(curtime);
        curembedobj.find(".iv_currenttimes .curtimes").html(seconds2human(curtime, iv_players[curembednr].durationform));
        curembedobj.find(".iv_positions").width(curtime / iv_players[curembednr].duration * curembedobj.find(".iv_timelines").width());
        return this;
    }
    $(".iv_containers").on("mouseover", ".iv_timelinewrappers", function () {
        var curembedid = $(this).parents(".iv_containers").attr("id");
        $("#" + curembedid + " .thumbs").stop().animate({opacity: 1, height: '10px', width: '10px'}, 100);
        $("#" + curembedid + " .iv_timelines").css({'height': '5px', 'margin': '0px'});
    });
    function pauseEvent(e){
        if(e.stopPropagation) e.stopPropagation();
        if(e.preventDefault) e.preventDefault();
        e.cancelBubble=true;
        e.returnValue=false;
        return false;
    }
    function iv_dragging (e) {
        if (iv_draggingvid !== false) {
            var curembedid = iv_ids[iv_draggingvid];
            var curembedobj = $("#" + curembedid);
            var curembednr = iv_ids.indexOf(curembedid);
            var positionobj = curembedobj.find(".iv_positions");
            positionobj.width(e.pageX - positionobj.offset().left);
            calctime = ((e.pageX - positionobj.offset().left) / curembedobj.find(".iv_timelines").width()) * iv_players[iv_draggingvid].duration;
            if (calctime<0) calctime=0;
            if (calctime>iv_players[curembednr].duration) calctime=iv_players[curembednr].duration;
            iv_players[iv_draggingvid].seekTo(calctime);
            curembedobj.iv_updatetimeline(calctime);
            //recover pause if dragged to the end and back
            if(iv_players[curembednr].draggingflag && calctime<iv_players[curembednr].duration) {
                if (curembedobj.hasClass("playing")) {
                    iv_players[iv_draggingvid].playVideo();
                } else {
                    iv_players[iv_draggingvid].pauseVideo();
                }
            }
            if (curembedobj.hasClass("open")) {
                curembedobj.iv_scrollstop(false);
                if (curembedobj.hasClass("sync")) {
                    if(iv_rollingvids[iv_draggingvid]) {
                        curembedobj.iv_scroll(iv_jumpspeed, false, calctime);
                    } else {
                        curembedobj.iv_scroll(iv_jumpspeed, true, calctime);
                    }
                }
            }

        }
    }
    $(".iv_containers").on("click", ".iv_timelinewrappers", function (e) {
        var curembedobj = $(this).parents(".iv_containers");
        var curembedid = curembedobj.attr("id");
        var curembednr = iv_ids.indexOf(curembedid);
        var positionobj = curembedobj.find(".iv_positions");
        positionobj.width(e.pageX - positionobj.offset().left);
        calctime = ((e.pageX - positionobj.offset().left) / curembedobj.find(".iv_timelines").width()) * iv_players[curembednr].duration;
        iv_players[curembednr].seekTo(calctime);
        curembedobj.find(".iv_formtimes").val(calctime);
        if (curembedobj.hasClass("open")) {
            curembedobj.iv_scrollstop(false);
            if (curembedobj.hasClass("sync")) {
                if (iv_rollingvids[iv_draggingvid]) {
                    curembedobj.iv_scroll(iv_jumpspeed, false, calctime);
                } else {
                    curembedobj.iv_scroll(iv_jumpspeed, true, calctime);
                }
            }
        }
    });
    $(".iv_containers").on("mousedown", ".iv_timelinewrappers", function (e) {
        var curembedobj = $(this).parents(".iv_containers");
        var curembedid = curembedobj.attr("id");
        iv_draggingvid = iv_ids.indexOf(curembedid);
        curembedobj.addClass("dragging");
        document.addEventListener("mousemove", iv_dragging, true);
        e=e || window.event;
        pauseEvent(e);
    });
    $(document.body).on("mouseup", function (e) {
        if (iv_draggingvid !== false) {
            var curembedobj = $("#" + iv_ids[iv_draggingvid]);
            var curembedid = curembedobj.attr("id");
            var curembednr = iv_ids.indexOf(curembedid);
            $(".thumbs").stop().animate({opacity: 0, height: '0px', width: '0px'}, 100);
            $(".iv_timelines").css({'height': '3px', 'margin': '1px'});
            document.removeEventListener("mousemove", iv_touching, true);
            curembedobj.removeClass("dragging");
            iv_draggingvid = false;
        }
    });
    function iv_touching (e) {
        if (iv_draggingvid !== false) {
            var curembedid = iv_ids[iv_draggingvid];
            var curembedobj = $("#" + curembedid);
            var curembednr = iv_ids.indexOf(curembedid);
            var positionobj = curembedobj.find(".iv_positions");
            positionobj.width(e.changedTouches[0].pageX - positionobj.offset().left);
            calctime = ((e.changedTouches[0].pageX - positionobj.offset().left) / curembedobj.find(".iv_timelines").width()) * iv_players[iv_draggingvid].duration;
            if (calctime<0) calctime=0;
            if (calctime>iv_players[curembednr].duration) calctime=iv_players[curembednr].duration;
            iv_players[iv_draggingvid].seekTo(calctime);
            curembedobj.iv_updatetimeline(calctime);
            //recover pause if dragged to the end and back
            if(iv_players[curembednr].draggingflag && calctime<iv_players[curembednr].duration) {
                if (curembedobj.hasClass("playing")) {
                    iv_players[iv_draggingvid].playVideo();
                } else {
                    iv_players[iv_draggingvid].pauseVideo();
                }
            }
            if (curembedobj.hasClass("open")) {
                curembedobj.iv_scrollstop(false);
                if (curembedobj.hasClass("sync")) {
                    if (iv_rollingvids[iv_draggingvid]) {
                        curembedobj.iv_scroll(iv_jumpspeed, false, calctime);
                    } else {
                        curembedobj.iv_scroll(iv_jumpspeed, true, calctime);
                    }
                }
            }
        }
    }
    $(".iv_containers").on("touchstart", ".iv_timelinewrappers", function (e) {
        var curembedobj = $(this).parents(".iv_containers");
        var curembedid = curembedobj.attr("id");
        iv_draggingvid = iv_ids.indexOf(curembedid);
        curembedobj.find(".thumbs").stop().animate({opacity: 1, height: '10px', width: '10px'}, 100);
        curembedobj.find(".iv_timelines").css({'height': '5px', 'margin': '0px'});
        curembedobj.addClass("dragging");
        clearTimeout(iv_players[iv_draggingvid].touchtimer);
        document.addEventListener("touchmove", iv_touching, true);
        e=e || window.event;
        pauseEvent(e);
    });
    $(document.body).on("touchend", function (e) {
        if (iv_draggingvid !== false) {
            var curembedobj = $("#" + iv_ids[iv_draggingvid]);
            $(".thumbs").stop().animate({opacity: 0, height: '0px', width: '0px'}, 100);
            $(".iv_timelines").css({'height': '3px', 'margin': '1px'});
            document.removeEventListener("touchmove", iv_touching, true);
            curembedobj.removeClass("dragging");
            curembedobj.iv_touchtimer();
            iv_draggingvid = false;
        }
    });
    $(".iv_containers").on("mouseleave", ".iv_timelinewrappers", function () {
        if (iv_draggingvid === false) {
            $(".thumbs").stop().animate({opacity: 0, height: '0px', width: '0px'}, 100);
            $(".iv_timelines").css({'height': '3px', 'margin': '1px'});
        }
    });
    //endregion
    //region Opening IV
    $.fn.iv_cropsvg = function(cropornot) {
        var curembedobj = $(this[0]);
        var curembedid = $(this[0]).attr("id");
        var curembednr = iv_ids.indexOf(curembedid);
        var svgobj = curembedobj.find(".iv_openclosebuttons svg");
        if(cropornot == true) {
            svgobj[0].setAttribute("viewBox", "50 0 20 10");
            svgobj.css("transition", "none");
            svgobj.width("32px");
            svgobj.css("transition", "");
        } else {
            svgobj[0].setAttribute("viewBox", "0 0 70 10");
            svgobj.css("transition", "none");
            svgobj.width("112px");
            svgobj.css("transition", "");
        }
        return this;
    };

    var adminbar;
    if ($("body").hasClass("admin-bar") && $("#wpadminbar").css("position") == "fixed")
    {
        adminbar=$("#wpadminbar").height();
    } else {
        adminbar=0;
    }
    $.fn.iv_openclose = function (justjump) {
        var curembedobj = $(this[0]);
        var curembedid = curembedobj.attr("id");
        var curembednr = iv_ids.indexOf(curembedid);
        if (curembedobj.hasClass("open")) { //if this open, shut it
            curembedobj.find(".iv_restdivs").animate({height:'0px'}, iv_speed);
            curembedobj.removeClass("open");
            curembedobj.iv_cropsvg(false);
        } else {
            if (!curembedobj.hasClass("commentsfetched")) {
                curembedobj.iv_fetchallcomments(true, justjump);
            } else {
                curembedobj.iv_buildcommentarray();
                curembedobj.iv_scroll(iv_jumpspeed, justjump);
            }
            var restdivheight = $(window).height() - curembedobj.find(".iv_players").height();
            curembedobj.find(".iv_commentcontainers").height(restdivheight - iv_players[curembednr].commentbarheight - adminbar);
            curembedobj.find(".iv_restdivs").animate({height:restdivheight - adminbar}, iv_speed, function () {
                curembedobj.addClass("open");
                curembedobj.iv_cropsvg(true);
            });
            curembedobj.iv_scrollto(iv_speed);
        }
        return this;
    };
    $.fn.iv_scrollto = function (speed) {
        var curembedobj = $(this[0]);
        var offset = curembedobj.offset().top;
        if (speed === undefined) var speed = 0;
        if (adminbar!=0 && !curembedobj.hasClass("fullscreen")) offset -= adminbar;
        $("html,body").animate({
            scrollTop:  offset
        }, speed);

        return this;
    };
    $(".iv_containers").on("click", '.iv_openclosebuttons', function () {
        var curembedobj = $(this).parents(".iv_containers");
        var curembedid = curembedobj.attr("id");
        var curembednr = iv_ids.indexOf(curembedid);
        var playerstate = iv_players[curembednr].getPlayerState();
        if (playerstate == 1) {
            curembedobj.iv_openclose(false);
        } else if (playerstate == 2 || playerstate == 3) {
            curembedobj.iv_openclose(true);
        }
    });
    $(".iv_containers").on("click", ".iv_batches", function (e) {
        var curembedobj = $(this).parents(".iv_containers");
        var curembedid = curembedobj.attr("id");
        if (curembedobj.hasClass("lazyload")) {
            curembedobj.removeClass("lazyload");
            if (curembedobj.hasClass("lazyloaded")) {
                // If the video is ready
                curembedobj.iv_openclose(false);
                iv_players[iv_ids.indexOf(curembedid)].playVideo();
            } else {
                // If the video isn't ready
                iv_openqueue.push(curembedid);
                iv_playqueue.push(curembedid);
            }
            e=e || window.event;
            pauseEvent(e);
        } else {
            curembedobj.iv_openclose(false);
            iv_players[iv_ids.indexOf(curembedid)].playVideo();
            e=e || window.event;
            pauseEvent(e);
        }
    });

    $(".iv_containers").on("click", ".iv_placeholders", function () {
        var curembedobj = $(this).parents(".iv_containers");
        var curembedid = curembedobj.attr("id");
        curembedobj.removeClass("lazyload");
        if (curembedobj.hasClass("lazyloaded")) {
            // If the video is ready
            iv_players[iv_ids.indexOf(curembedid)].playVideo();
        } else {
            // If the video isn't ready
            iv_playqueue.push(curembedid);
        }
    });

    //endregion
    //region Control video
    $.fn.iv_changeplaypausebutton = function (switchto) {
        var buttonobj = $(this[0]).find('.iv_playpausebuttons'); // It's your element
        if (switchto == "play" && buttonobj.hasClass("pausebutton")) {
            buttonobj.find('.shapes1 animate').attr({'from':'0,0 110,0 110,300 0,300','to':'0,0 150,75 150,225 0,300'})[0].beginElement();
            buttonobj.find('.shapes2 animate').attr({'from':'190,0 300,0 300,300 190,300','to':'150,75 300,150 300,150 150,225'})[0].beginElement();
            buttonobj.removeClass("pausebutton");
        }
        if (switchto == "pause" && !buttonobj.hasClass("pausebutton")) {
            buttonobj.find('.shapes1 animate').attr({'to':'0,0 110,0 110,300 0,300','from':'0,0 150,75 150,225 0,300'})[0].beginElement();
            buttonobj.find('.shapes2 animate').attr({'to':'190,0 300,0 300,300 190,300','from':'150,75 300,150 300,150 150,225'})[0].beginElement();
            buttonobj.addClass("pausebutton");
        }
        return this;
    };
    $.fn.iv_playpause = function() {
        var curembedobj = $(this[0]); // It's your element
        var curembedid = $(this[0]).attr("id");
        var curembednr = iv_ids.indexOf(curembedid);
        var playerstate = iv_players[curembednr].getPlayerState();
        if (playerstate == 1) {
            iv_players[curembednr].pauseVideo();
            curembedobj.iv_scrollstop(false);
            curembedobj.removeClass("playing");
            curembedobj.iv_changeplaypausebutton("play");
        } else if (playerstate == 2 || playerstate == 3) {
            iv_players[curembednr].playVideo();
            curembedobj.addClass("playing");
            curembedobj.iv_changeplaypausebutton("pause");
        }
        return this;
    };
    $.fn.iv_touchtimer = function () {
        var curembedobj = $(this[0]); // It's your element
        var curembedid = $(this[0]).attr("id");
        var curembednr = iv_ids.indexOf(curembedid);
        clearTimeout(iv_players[curembednr].touchtimer);
        curembedobj.addClass("touched");
        iv_players[curembednr].touchtimer = setTimeout(function() {
            curembedobj.removeClass("touched");
        }, 3800);
        return this;
    };
    $(".iv_containers").on("click", '.iv_playpausebuttons', function () {
        $(this).parents(".iv_containers").iv_playpause();
    });
    $(".iv_containers").on("click", '.iv_replaybuttons', function () {
        var curembedobj = $(this).parents(".iv_containers");
        var curembedid = curembedobj.attr("id");
        var curembednr = iv_ids.indexOf(curembedid);
        calctime = iv_players[curembednr].getCurrentTime() - 5;
        curembedobj.find(".iv_formtimes").val(calctime);
        iv_players[curembednr].seekTo(calctime);
        curembedobj.iv_updatetimeline(calctime);
        curembedobj.iv_scrollstop(false);
        if (curembedobj.hasClass("sync")) {
            if (iv_rollingvids[curembednr]) {
                curembedobj.iv_scroll(iv_jumpspeed, false, calctime);
            } else {
                curembedobj.iv_scroll(iv_jumpspeed, true, calctime);
            }
        }
    });
    $(".iv_containers").on("click", ".iv_clickcanvas", function() {
        var curembedobj = $(this).parents(".iv_containers");
        var curembedid = curembedobj.attr("id");
        var curembednr = iv_ids.indexOf(curembedid);
        if ($("body").hasClass("iv_mouse")) {
            if (!iv_draggingvid) {
                curembedobj.iv_playpause();
            }
        } else {
            if (curembedobj.hasClass("touched")) {
                curembedobj.iv_playpause();
            } else {
                curembedobj.addClass("touched");
            }
            curembedobj.iv_touchtimer();
        }
    });
    //Volume
    $(".iv_containers").on("click", '.iv_volumebuttons', function () {
        var curembedid = $(this).parents(".iv_containers").attr("id");
        var curembednr = iv_ids.indexOf(curembedid);
        iv_players[curembednr].mute();
    });
    $.fn.fullscreen = function ( exit ) {
        if (document[iv_FullscreenElement] || exit === true) {
            document[iv_quitFullscreen]();
            this.removeClass("fullscreen");
            this.find(".iv_fullscreenbuttons span").addClass("dashicons-editor-expand").removeClass("dashicons-editor-contract");
        } else {
            this[0][iv_goFullscreen]();
            this.addClass("fullscreen");
            this.find(".iv_fullscreenbuttons span").removeClass("dashicons-editor-expand").addClass("dashicons-editor-contract");
            var curembednr = iv_ids.indexOf(this.attr("id"));
            if (screen.width/screen.height<=aspectRatio) {
                iv_players[curembednr].setSize(width = screen.width, height = screen.width / aspectRatio);
            } else {
                iv_players[curembednr].setSize(width = screen.height * aspectRatio, height = screen.height);
            }
            if ($("body").hasClass("portrait") && this.hasClass("open")) {
                var restdivheight = screen.height - (screen.width / aspectRatio);
                this.find(".iv_commentcontainers").height(restdivheight-iv_players[curembednr].commentbarheight);
                this.find(".iv_restdivs").height(restdivheight);
            }
            document.addEventListener(iv_Fullscreenchange, function (e) {
                if (!document[iv_FullscreenElement]) {
                    $(".iv_containers").removeClass("fullscreen");
                    $(e.target).find(".iv_fullscreenbuttons span").addClass("dashicons-editor-expand").removeClass("dashicons-editor-contract");
                    $(window).resize();
                }
            });
        }
    };
    $(".iv_containers").on("click", '.iv_fullscreenbuttons', function () {
        $(this).parents(".iv_containers").fullscreen();
    });
    //endregion
    //region Commenting
    var screenedges = $(window).width() + $(window).height();
    $.fn.iv_fetchallcomments = function (scroll, justjump) {
        var curembedobj = $(this[0]); // It's our element
        var curembedid = $(this[0]).attr("id");
        var post_id = curembedobj.find("input[name='comment_post_ID']").val();
        var data = {
            'action': 'update_comment_list',
            'post_id':  post_id
        };
        $.post(ivData.ajaxUrl, data, function(response){
            if(response){
                //console.log(response);
                curembedobj.find(".iv_commentcontainers").html(response);
                curembedobj.addClass("commentsfetched");
                curembedobj.iv_buildcommentarray();
                if (scroll===true) curembedobj.iv_scroll(iv_jumpspeed, justjump);
            }
        });
        return this;
    };
    $.fn.iv_fetchplayer = function () {
        var curembedobj = $(this[0]);
        var curembedid = $(this[0]).attr("id");
        var data = {
            'action': 'iv_fetchplayer',
            'iv_videoid':  curembedobj.data('videoid'),
            'iv_embedid':  curembedobj.data('embedid'),
            'iv_default':  curembedobj.data('default'),
            'iv_useiv':  curembedobj.data('useiv'),
            'iv_preloadc':  curembedobj.data('preloadc'),
            'iv_lazyloadv':  curembedobj.data('lazyloadv')
        };
        $.post(ivData.ajaxUrl, data, function(response){
            if(response){
                curembedobj.append(response);
                onYouTubeIframeAPIReady(curembedid);
            }
        });
        return this;
    };

    $(".iv_containers").on("click", ".iv_commentstatus", function () {
        var curembedid = $(this).parents(".iv_containers").attr("id");
        $("#" + curembedid + "_commentform").submit();
    });
    $(".iv_containers").on("submit", ".iv_commentforms", function (e) {
        var commentform = $(this);
        var curembedobj = $(this).parents(".iv_containers");
        var curembedid = curembedobj.attr("id");
        var curembednr = iv_ids.indexOf(curembedid);
        // Serialize and store form data
        var formdata = commentform.serialize() + '&redirect_to=' + window.location.href;
        //Check if there's a moderator comment too close by
        var commenttime = commentform.children(".iv_formtimes").val();
        var prohibitpost = 0; // 1 = moderator thread too close, 2 = too many threads
        var closemodcomments = iv_moderatorcomments.filter(n => n>(commenttime-ivData.moderatorreservetime) && n<(eval(commenttime)+eval(ivData.moderatorreservetime)));
        if (!(closemodcomments === undefined || closemodcomments.length == 0)) prohibitpost = 1;
        var commenttimes = iv_threads[curembednr].map(function (subarray) { return subarray[1] });
        var closecomments = commenttimes.filter(n => n>(commenttime-limitcommentscope) && n<(eval(commenttime)+eval(limitcommentscope)));
        if (closecomments.length > ivData.commentslimit) prohibitpost = 2;
        if (eval(ivData.isModerator) || !(jQuery("[name='comment_parent']").val() == "") || (!prohibitpost)) {
            var commentstatusobj = $("#" + curembedid + "_commentform .comment-status");
            //Processing...
            commentstatusobj.html("sync").css("color", "#2ad4ff").addClass("rotating");
            //Post Form with data
            var ajaxpost = $.post(ivData.PostCommentUrl, formdata);
            ajaxpost.success(function(data, textStatus, obj) {
                if (data == "success" || textStatus == "success") {
                    $("#" + curembedid + "_commentform .comment-status").html("done").css("color", "#37c837").removeClass("rotating");
                    curembedobj.iv_fetchallcomments();

                    commentform[0].reset();
                    commentform.find("input[name='comment_parent']").val("");
                    $("#" + curembedid + "_commentinput").blur();
                } else {
                    commentstatusobj.html("error").css("color", "#e55454").removeClass("rotating");
                    commentform.find('textarea[name=comment]').val('');
                }
            });
            ajaxpost.error(function (XMLHttpRequest, textStatus, errorThrown) {
                commentstatusobj.html("error").css("color", "#e55454").removeClass("rotating");
            });
            commentstatusobj.delay(iv_speed * 3).fadeOut(iv_speed, function() {
                $(this).html("send").css("color", "#757575").removeClass("rotating");
                $(this).fadeIn('slow');
            });
        } else {
            var errorprompt = commentform.children(".iv_errorprompts");
            if (prohibitpost==1) errorprompt.children(".moderrors").show();
            if (prohibitpost==2) errorprompt.children(".limiterrors").show();
            errorprompt.height(commentform.children(".commentinputs").height()).fadeIn(iv_speed).delay(iv_speed*3).fadeOut(iv_speed);
        }
        e.preventDefault(); // avoid to second submit of the form
        return false;
    });
    // Decide whether to focus or prompt name / login
    $(".iv_containers").on("mousedown", ".commentinputs", function (e) {
        e.stopImmediatePropagation();
        var curembedobj = $(this).parents(".iv_containers");
        if ($("html,body").hasClass("logged-in") || $(this).siblings("input[name='author']").val() !== "") {
            curembedobj.addClass("inputfocused");
            this.focus();
        } else {
            curembedobj.addClass("commenterprompt");
            var containerobj = curembedobj.find(".iv_commentcontainers");
            var promptobj = curembedobj.find(".iv_commenterprompts .prompt");
            var scale = Math.min(
                containerobj.width() / promptobj.width(),
                containerobj.height() / promptobj.height()
            );
            promptobj.css({
                maxheight: containerobj.height(),
                transform: "scale(" + scale + ")"
            });
            e.preventDefault();
        }
    });

    $(".iv_containers").on("input propertychange", ".iv_commenterprompts input", function() {
        var curembedobj = $(this).parents(".iv_containers");
        if ($(this).attr("id") == "cauthor") {
            curembedobj.find(".iv_commentforms input[name='author']").val($(this).val());
            curembedobj.find(".iv_commentertabs .cauthors").html($(this).val());
        }
        if ($(this).attr("id") == "cemail") {
            curembedobj.find(".iv_commentforms input[name='email']").val($(this).val());
        }
        if ($(this).attr("id") == "curl") {
            curembedobj.find(".iv_commentforms input[name='url']").val($(this).val());
        }
    });

    $(".iv_containers").on("click", ".iv_commenterprompts .prompt", function(e) {
        e.stopPropagation();
    });
    $(".iv_containers").on("click", ".iv_commenterprompts, .iv_commenterprompts .prompt .dashicons-no", function() {
        var curembedobj = $(this).parents(".iv_containers");
        curembedobj.removeClass("commenterprompt");
        if (curembedobj.find(".iv_commentforms input[name='author']").val() == "") {
            curembedobj.find(".iv_commentertabs").removeClass("show");
        } else {
            curembedobj.find(".iv_commentertabs").addClass("show");
            curembedobj.find(".commentinputs").focus();
        }
    });
    $(".iv_containers").on("click", ".iv_commentertabs", function(){
        var curembedobj = $(this).parents(".iv_containers");
        curembedobj.toggleClass("commenterprompt");
    });

    $(".iv_containers").on("focus", ".commentinputs", function () {
        $(this).css("height", this.scrollHeight+2);
        var curembedobj = $(this).parents(".iv_containers");
        if($(window).width() + $(window).height() < screenedges) {
            curembedobj.addClass("virtualkeyboard");
            curembedobj.iv_scrollto(0);
        }
    });
    $(".iv_containers").on("blur", ".commentinputs", function () {
        $(this).css("height", "");
        var curembedobj = $(this).parents(".iv_containers");
        curembedobj.removeClass("virtualkeyboard").removeClass("inputfocused");
    });
    $(".iv_containers").on("keypress", ".commentinputs", function (e) {
        if (e.which == 13) {
            e.preventDefault(); // If <input>, stop enter from submitting so it's not triggered twice.
            var curembedid = $(this).parents(".iv_containers").attr("id");
            $("#" + curembedid + "_commentform").submit();
        }
    });
    $(".iv_containers").on("click", ".iv_replylinks", function () {
        var curembedid = $(this).parents(".iv_containers").attr("id");
        var replyto = $(this).parents("li.comment").data("comment-id");
        //var post_id = $(this).children("input[name='comment_post_ID']").val();
        $("#" + curembedid + "_commentform input[name='comment_parent']").val(replyto);
        $("#" + curembedid + "_commentinput").focus();
    });
    $(".iv_containers").on("click", ".iv_expand_comment_thread", function () {
        if ($(this).children("span.dashicons").hasClass("dashicons-arrow-down-alt2")) {
            $(this).parents("li").find('ul.children').slideDown(iv_speed);
            $(this).children("span.dashicons").removeClass("dashicons-arrow-down-alt2");
            $(this).children("span.dashicons").addClass("dashicons-arrow-up-alt2");
        } else {
            $(this).parents("li").find('ul.children').slideUp(iv_speed);
            $(this).children("span.dashicons").removeClass("dashicons-arrow-up-alt2");
            $(this).children("span.dashicons").addClass("dashicons-arrow-down-alt2");
        }

    });
    $(".iv_containers").on("click", ".iv_comment_times", function() {
        var curembedobj = $(this).parents(".iv_containers");
        var curembedid = curembedobj.attr("id");
        var curembednr = iv_ids.indexOf(curembedid);
        var commenttime = $(this).parents("li.comment").data("comment-time")-5;
        iv_players[curembednr].seekTo(commenttime);
        curembedobj.iv_updatetimeline(commenttime);
    });
    //endregion
    //region Lazyloading

    //Start lazyloading when document ready, but only if Youtube is loaded (otherwise it can be triggered too fast!)
    function lazyloadall() {
        if (typeof(YT) === 'undefined' || typeof(YT.Player) === 'undefined') {
            //try again a little later
            setTimeout(lazyloadall, 100);
        } else {
            $(".iv_containers.lazyload").each(function() {
                $(this).iv_fetchplayer();
            });
        }
    }
    lazyloadall();
    //endregion
});


//Specific thumbnail
hZ = function(element, b, c, d, e) {
    var f = b.Pt / b.rows
        , k = Math.min(c / (b.Qt / b.columns), d / f)
        , l = b.Qt * k
        , m = b.Pt * k;
    l = Math.floor(l / b.columns) * b.columns;
    m = Math.floor(m / b.rows) * b.rows;
    var n = l / b.columns
        , q = m / b.rows
        , r = -b.column * n
        , u = -b.row * q;
    e && 45 >= f && (q -= 1 / k);
    n -= 2 / k;
    element = element.style;
    element.width = n + "px";
    element.height = q + "px";
    e || (d = (d - q) / 2,
        c = (c - n) / 2,
        element.marginTop = Math.floor(d) + "px",
        element.marginBottom = Math.ceil(d) + "px",
        element.marginLeft = Math.floor(c) + "px",
        element.marginRight = Math.ceil(c) + "px");
    element.background = "url(" + b.url + ") " + r + "px " + u + "px/" + l + "px " + m + "px";
    if (e)
        return new g.kd(n,q)
}
;