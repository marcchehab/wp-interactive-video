(function() {
    tinymce.PluginManager.add('vcvideo', function( editor, url ) {
        var sh_tag = 'vcvideo';

        //helper functions
        function getAttr(s, n) {
            n = new RegExp(n + '=\"([^\"]+)\"', 'g').exec(s);
            return n ?  window.decodeURIComponent(n[1]) : '';
        };

        //Construct html code with iframe
        function getIframe( videoid, args ) {
            var htmlstr = '';
            var embedid = getAttr(args, "embedid") ? getAttr(args, "embedid") : Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6);
            if (getAttr(args, "default") == "false") {
                if (getAttr(args, "usevc") == "false") {
                    htmlstr += '<div class="vcvideo usevc" data-videoid="' + videoid + '" data-embedid="' + embedid + '" contenteditable="false">';
                } else {
                    htmlstr += '<div class="vcvideo" data-videoid="' + videoid + '" data-embedid="' + embedid + '" contenteditable="false">';
                }
                htmlstr += '<iframe src="//www.youtube.com/embed/' + videoid + '" width="580" height="326"></iframe><span class="vc_admincontrols"><img src="' + url + '/../images/vc_logo.svg" /><span class="vc_settingboxes vc_defaults">Default<br /><label class="switch" contenteditable="true"><input id="' + embedid + '_default" class="vc_checkboxes" type="checkbox"    ><span class="slider"></span></label></span>';
                if (getAttr(args, "usevc") == "true") {
                    htmlstr += '<span class="vc_settingboxes vc_usevcs">Use VC<br /><label class="switch" contenteditable="true"><input id="' + embedid + '_usevc" class="vc_checkboxes" type="checkbox" checked><span class="slider"></span></label></span>';
                } else {
                    htmlstr += '<span class="vc_settingboxes vc_usevcs">Use VC<br /><label class="switch" contenteditable="true"><input id="' + embedid + '_usevc" class="vc_checkboxes" type="checkbox"><span class="slider"></span></label></span>';
                }
                if (getAttr(args, "preloadc") == "true") {
                    htmlstr += '<span class="vc_settingboxes vc_preloadcs">Preload comments<br /><label class="switch" contenteditable="true"><input id="' + embedid + '_preloadc" class="vc_checkboxes" type="checkbox" checked><span class="slider"></span></label></span>';
                } else {
                    htmlstr += '<span class="vc_settingboxes vc_preloadcs">Preload comments<br /><label class="switch" contenteditable="true"><input id="' + embedid + '_preloadc" class="vc_checkboxes" type="checkbox"><span class="slider"></span></label></span>';
                }
                if (getAttr(args, "lazyloadv") == "true") {
                    htmlstr += '<span class="vc_settingboxes">Lazyload video<br /><label class="switch" contenteditable="true"><input id="' + embedid + '_lazyloadv" class="vc_checkboxes" type="checkbox" checked><span class="slider"></span></label></span></span></div>'
                } else {
                    htmlstr += '<span class="vc_settingboxes">Lazyload video<br /><label class="switch" contenteditable="true"><input id="' + embedid + '_lazyloadv" class="vc_checkboxes" type="checkbox"><span class="slider"></span></label></span></span></div>'
                }
            } else {
                htmlstr += '<div class="vcvideo default" data-videoid="' + videoid + '" data-embedid="' + embedid + '" contenteditable="false"><iframe src="//www.youtube.com/embed/' + videoid + '" width="580" height="326"></iframe><span class="vc_admincontrols"><img src="' + url + '/../images/vc_logo.svg" /><span class="vc_settingboxes vc_defaults">Default<br /><label class="switch" contenteditable="true"><input id="' + embedid + '_default" class="vc_checkboxes" type="checkbox"     checked><span class="slider"></span></label></span><span class="vc_settingboxes vc_usevcs">Use VC<br /><label class="switch" contenteditable="true"><input id="' + embedid + '_usevc" class="vc_checkboxes" type="checkbox"><span class="slider"></span></label></span><span class="vc_settingboxes vc_preloadcs">Preload comments<br /><label class="switch" contenteditable="true"><input id="' + embedid + '_preloadc" class="vc_checkboxes" type="checkbox"><span class="slider"></span></label></span><span class="vc_settingboxes">Lazyload video<br /><label class="switch" contenteditable="true"><input id="' + embedid + '_lazyloadv" class="vc_checkboxes" type="checkbox"><span class="slider"></span></label></span></span></div>';
            }
            return htmlstr;
        }

        function replaceYoutube(e) {
            //Normal Youtube URLS, e.g. https://www.youtube.com/watch?v=ezxSAMPLEJf4
            var content = e.content;
            content = content.replace(/https?:\/\/www.youtube\.com.+v=([A-Za-z0-9_-]+)&?([a-z0-9&=\-_]+)?/g, function( all, videoid, args) {
                if (args !== undefined) {
                    //Formatting arguments from URL style to shortcode style
                    args.replace(/(\w*)=(\w*)&?/, " $1=\"$2\"");
                } else {
                    args = '';
                }
                return getIframe( videoid, args);
            });
            //VC Shortcodes, e.g. [vcvideo videoid="ezxSAMPLEJf4" somearg="foo"]
            content = content.replace(/\[vcvideo videoid="([^\"]*)"([^\]]*)\]/g, function( all, videoid, args) {
                return getIframe( videoid, args);
            });
            return content;
        }

        function restoreYoutube(e) {
            var content = e.content;
            //match any iframe tag with data-videoid and replace it with the shortcode's content and attributes
            content = content.replace(/(<div [^>]+>).*?<\/div>/g, function( all, main ) {
                var videoid = getAttr( main, 'data-videoid' );
                if ( videoid ) {
                    var embedid = getAttr( main, 'data-embedid');
                    var args = ' embedid="' + embedid + '"';
                    if (!tinyMCE.activeEditor.dom.select('#'+embedid+'_default')[0].checked) {
                        args += ' default="false"';
                        if (tinyMCE.activeEditor.dom.select('#'+embedid+'_usevc')[0].checked) {
                            args += ' usevc="true"';
                        } else {
                            args += ' usevc="false"';
                        }
                        if (tinyMCE.activeEditor.dom.select('#'+embedid+'_preloadc')[0].checked) {
                            args += ' preloadc="true"';
                        } else {
                            args += ' preloadc="false"';
                        }
                        if (tinyMCE.activeEditor.dom.select('#'+embedid+'_lazyloadv')[0].checked) {
                            args += ' lazyloadv="true"';
                        } else {
                            args += ' lazyloadv="false"';
                        }
                    }
                    return '<p>[' + sh_tag + ' videoid="' + videoid + '"' + args + ']</p>';
                }
                return all;
            });
            //content = content.replace(/<div class=\"vcvideo_controls.*?<\/div>/g, '');
            return content;
        }

        // replace URL/Shortcode with Youtube-iFrame
        editor.on('BeforeSetcontent', function(e){
            e.content = replaceYoutube(e);
        });

        // replace Youtube-iFrame with URL/Shortcode
        editor.on('GetContent', function(e){
            e.content = restoreYoutube(e);
        });

        // if default active -> deactivate other controls
        editor.on('Click',function(e) {
            if ( e.target.nodeName == 'SPAN' && e.target.className.indexOf('slider') > -1 ) {
                if (e.target.closest(".vc_settingboxes").classList.contains("vc_defaults")) {
                    if (!e.target.previousSibling.checked) {
                        e.target.closest(".vcvideo").classList.add("default");
                    }
                    if (e.target.previousSibling.checked) {
                        e.target.closest(".vcvideo").classList.remove("default");
                    }
                }
                if (e.target.closest(".vc_settingboxes").classList.contains("vc_usevcs")) {
                    if (e.target.previousSibling.checked) {
                        e.target.closest(".vcvideo").classList.add("usevc");
                    }
                    if (!e.target.previousSibling.checked) {
                        e.target.closest(".vcvideo").classList.remove("usevc");
                    }
                }
            }
        });
    });
})();