// @ts-nocheck

!(function(exports) {
    const _$ = {
        p_text1_arr: [],
        p_text2_arr: [],
        p_text1_font: "",
        p_text2_font: "",
        p_title: "",
        p_footnote: "",
        p_current_index: 0,
        p_last_index: 0,
        p_bkgnd_filename: "",
        p_bkgnd_motion: false,
        p_font_color: "",
        p_font_color2: "",
        p_font_color_invert: "",
        p_font_color2_invert: "",
        p_window_X: 800,
        p_window_Y: 600,
        p_topMargin: 50,
        p_bottomMargin: 50,
        p_leftMargin: 50,
        p_rightMargin: 50,
        p_align: "left",
        p_maxFontSize: 100,
        p_enableTransition: true,
        p_enableShadow: true,
        p_bkgnd_color: "000000",
        p_bkgnd_color1: "00ffa0",
        p_bkgnd_color2: "FacFFF",
        p_bkgnd_grad_orient: 0, // grad angle
        p_motion_bkgnd_index: 0,
        p_bkgnd_type: 3,
        p_text_orientation: '0',
        p_logo: "",
        p_showTitle: false,
        p_showDate: false,
        p_showLogo: false,
        p_shadeBackground: null,
        p_transparentBackground: null,
        p_isArabic1: false,
        p_isArabic2: false,
        p_ver1ScaleFactor: 1,
        p_ver2ScaleFactor: 1,
        p_format_multiplelines: true,
    };

    const TRANSITION_DURATION = 150;
    const DEBUG_ENABLED = true;

    let transitionDuration = 0;

    let imageMotionActive = false;
    let outlineThickness = 3;
    let initialRenderDelay = 100;
    let showingTheme = false;
    let firstTime = true;

    let canvas_top, canvas_left, canvas_height, canvas_width;
    let title_top, title_left, title_height, title_width;
    let c1_top, c1_left, c1_height, c1_width;
    let c2_top, c2_left, c2_height, c2_width;
    let f_top, f_left, f_height, f_width;

    let titleAllocation = 0.1;
    let contentAllocation = 0.85;
    let footerAllocation = 0.05;

    function withinRange(lb, ub, val) {
        return val >= lb && val <= ub;
    }

    function IsNumeric(val) {
        const charset = "0123456789";

        for (let i = 0; i < val.length; i++) {
            const char = val.charAt(i);
            if (charset.indexOf(char) === -1) {
                return false;
            }
        }

        return true;
    }

    // INIT
    function initPresentation() {
        debug("*** Init Presentation****");

        window.onload = function () {
            document.body.onkeyup = findKey;
            document.body.style.overflow = "hidden";
        }

        // Fetch data from parent
        window.passVariable(0, _$);

        imageMotionActive = false;

        initTransition(!!_$.p_enableTransition);

        setupEvents();

        if (_$.p_showDate) {
            updateDate();
        }

        updatePresentation();

        updateContent();
    }

    function setupEvents() {
        // setup swipe event
        $("#presentationContent").swipe({
            swipe: function (c, e, f, d, b) {
                switch (e) {
                    case "up":
                    case "down": {
                        clearPresenter();
                        break;
                    }
                    case "right": {
                        prevSlide();
                        window.parent.goToPrevSlide();
                        break;
                    }
                    case "left": {
                        nextSlide();
                        window.parent.goToNextSlide();
                        break;
                    }
                }
            },
        });

        window.onunload = function (evt) {
            window.parent.onWindowUnload();
        };
    }

    function clearPresenter() {
        window.close();
    }

    function angleToCartesianCoords(angle) {
        // Normalize angle to be between 0 and 360
        angle = angle % 360;
        if (angle < 0) {
            angle += 360;
        }

        // Convert angle to a coordinate space where
        // 0,0 is top-left and 100,100 is bottom-right
        const radian = (angle * Math.PI) / 180;
        const x = Math.cos(radian);
        const y = Math.sin(radian);

        // Calculate start and end points
        const startX = (50 * (1 - x)).toFixed(2) + '%';
        const startY = (50 * (1 + y)).toFixed(2) + '%';
        const endX = (50 * (1 + x)).toFixed(2) + '%';
        const endY = (50 * (1 - y)).toFixed(2) + '%';

        // Return formatted gradient string
        return `${startX} ${startY}, ${endX} ${endY}`;
    }

    function setupBackground() {
        const bgl = document.getElementById("backgroundLayer");

        debug("Setting up background...");
        debug('Background type: ' + _$.p_bkgnd_type);

        _$.p_bkgnd_type = parseInt(_$.p_bkgnd_type);

        switch (_$.p_bkgnd_type) {
            case 1: { // Solid color
                debug('Transparent: ' + _$.p_transparentBackground);
                debug('Bg Color: ' + _$.p_bkgnd_color);

                bgl.style.opacity = _$.p_transparentBackground ? "0" : "1";
                document.body.style.backgroundColor = _$.p_bkgnd_color;

                break;
            }
            case 2: { // Gradient color
                debug('Transparent: ' + _$.p_transparentBackground);

                debug('p_bkgnd_color1: ' + _$.p_bkgnd_color1);
                debug('p_bkgnd_color2: ' + _$.p_bkgnd_color2);
                debug('p_bkgnd_grad_orient: ' + _$.p_bkgnd_grad_orient);

                bgl.style.opacity = _$.p_transparentBackground ? "0" : "1";

                // TODO: multi color stops
                const type = 'linear'; // linear

                let gradient = `-webkit-gradient(${type}, `;

                gradient += angleToCartesianCoords(parseInt(_$.p_bkgnd_grad_orient));

                gradient += `, from(${_$.p_bkgnd_color1}), to(${_$.p_bkgnd_color2}))`;

                const el = document.body;

                el.style.backgroundImage = 'url()'; // reset first (hack for the air webkit bug)
                el.style.backgroundImage = gradient;

                break;
            }
            case 3: { // Image
                debug('p_transparentBackground: ' + _$.p_transparentBackground);
                debug('p_bkgnd_motion: ' + _$.p_bkgnd_motion);
                debug('p_bkgnd_filename: ' + _$.p_bkgnd_filename);

                const { applicationStorageDirectory } = air.File;

                const bgImgFile = applicationStorageDirectory.resolvePath(_$.p_bkgnd_filename[0]);

                bgl.style.opacity = _$.p_transparentBackground ? '0' : '1';

                function initBackground() {
                    bgl.innerHTML = '<img id="backgroundImage" alt="" src="" />';
                    bgl.width = _$.p_window_X;
                    bgl.height = _$.p_window_Y;

                    const bgi = document.getElementById("backgroundImage");

                    bgi.src = bgImgFile.url;
                    bgi.width = _$.p_window_X;
                    bgi.height = _$.p_window_Y;
                }

                if (!_$.p_bkgnd_motion) { // Static Image
                    initBackground();
                } else {
                    if (!imageMotionActive) { // Motion Image
                        initBackground();

                        imageMotionActive = true;
                    }

                    animateZoomPan("#backgroundLayer", bgImgFile.url);
                }

                break;
            }
        }
    }

    function setupCanvasPosition() {
        const el = document.getElementById("semitransparentLayer");

        const a = 20;

        canvas_top = _$.p_topMargin;
        canvas_left = _$.p_leftMargin;
        canvas_width = _$.p_window_X - canvas_left - _$.p_rightMargin;
        canvas_height = _$.p_window_Y - canvas_top - _$.p_bottomMargin;

        el.style.left = canvas_left - a;
        el.style.top = canvas_top - a;
        el.style.width = canvas_width + a * 2;
        el.style.height = canvas_height + a * 2;
        el.style.visibility = _$.p_shadeBackground ? "visible" : "hidden";
    }

    function setupTitlePosition() {
        if (_$.p_title.length < 1) {
            titleAllocation = 0;
            contentAllocation = 0.95;
            title_top = 0;
            title_left = 0;
            title_height = 0;
            title_width = 0;
        } else {
            titleAllocation = 0.1;
            contentAllocation = 0.85;
            title_top = canvas_top;
            title_left = canvas_left;
            title_width = canvas_width;
            title_height = parseInt(canvas_height * titleAllocation);
        }
        document.getElementById("presentationTitle").style.left = title_left;
        document.getElementById("presentationTitle").style.top = title_top;
        document.getElementById("presentationTitle").style.width = title_width;
        document.getElementById("presentationTitle").style.height = title_height;
    }
    function setupContentPosition() {
        const b = _$.p_text1_arr[_$.p_current_index].length;
        const a = _$.p_text2_arr[_$.p_current_index].length;

        if (a < 2) {
            _$.p_text_orientation = 2;
        }
        if (_$.p_text_orientation == "2") {
            c1_top = parseInt(canvas_top) + parseInt(title_height) + 1;
            c1_left = canvas_left;
            c1_width = canvas_width;
            c1_height = parseInt(canvas_height * contentAllocation);
            c2_top = 0;
            c2_left = 0;
            c2_width = 0;
            c2_height = 0;
        } else if (_$.p_text_orientation == "0") {
            const e = b / (b + a);
            const d = contentAllocation * e;
            const c = contentAllocation - d;
            c1_top = parseInt(canvas_top) + parseInt(title_height) + 1;
            c1_left = canvas_left;
            c1_width = canvas_width;
            c1_height = parseInt(canvas_height * d);
            c2_top = c1_top + c1_height + 1;
            c2_left = canvas_left;
            c2_width = canvas_width;
            c2_height = parseInt(canvas_height * c);
        } else {
            const f = 40;
            c1_top = parseInt(canvas_top) + parseInt(title_height) + 1;
            c1_left = canvas_left;
            c1_width = parseInt(canvas_width / 2) - f / 2;
            c1_height = parseInt(canvas_height * contentAllocation);
            c2_top = parseInt(canvas_top) + parseInt(title_height) + 1;
            c2_left = parseInt(canvas_left) + parseInt(c1_width) + parseInt(f);
            c2_width = parseInt(canvas_width / 2) - f / 2;
            c2_height = parseInt(canvas_height * contentAllocation);
        }

        document.getElementById("content1").style.left = c1_left;
        document.getElementById("content1").style.top = c1_top;
        document.getElementById("content1").style.width = c1_width;
        document.getElementById("content1").style.height = c1_height;
        document.getElementById("content2").style.left = c2_left;
        document.getElementById("content2").style.top = c2_top;
        document.getElementById("content2").style.width = c2_width;
        document.getElementById("content2").style.height = c2_height;
    }
    function setupFooterPosition() {
        f_height = parseInt(canvas_height * footerAllocation);
        f_top = parseInt(canvas_top) + parseInt(canvas_height) - f_height;
        f_left = canvas_left;
        f_width = canvas_width;

        document.getElementById("footer_date").style.left = f_left;
        document.getElementById("footer_date").style.top = f_top;
        document.getElementById("footer_date").style.width = f_width;
        document.getElementById("footer_date").style.height = f_height;
        document.getElementById("footnote").style.left = f_left;
        document.getElementById("footnote").style.top = f_top;
        document.getElementById("footnote").style.width = f_width;
        document.getElementById("footnote").style.height = f_height;
        document.getElementById("footer_vv").style.left = f_left;
        document.getElementById("footer_vv").style.top = f_top;
        document.getElementById("footer_vv").style.width = f_width;
        document.getElementById("footer_vv").style.height = f_height;
    }

    function setupRTLClass() {
        if (_$.p_isArabic1) {
            $("#content1").addClass("arabic");
            $("#presentationTitle").addClass("arabic");
        } else {
            $("#content1").removeClass("arabic");
            $("#presentationTitle").removeClass("arabic");
        }

        if (_$.p_isArabic2) {
            $("#content2").addClass("arabic");
        } else {
            $("#content2").removeClass("arabic");
        }
    }

    function updatePresentation() {
        debug("Updating presentation frames...");

        setupBackground();

        setupRTLClass();

        setupCanvasPosition();

        setupTitlePosition();

        setupContentPosition();

        setupFooterPosition();
    }

    function get_next_index() {
        let a = _$.p_current_index * 1 + 1;
        if (_$.p_current_index === _$.p_last_index) {
            a = 0;
        }
        return a;
    }
    function get_prev_index() {
        let a = _$.p_current_index * 1 - 1;
        if (_$.p_current_index === 0) {
            a = _$.p_last_index;
        }
        return a;
    }
    function nextSlide() {
        _$.p_current_index = get_next_index();
        document.getElementById("content1").style.textShadow = null;
        document.getElementById("content2").style.textShadow = null;
        setupContentPosition();
        if (!showingTheme) {
            updateContentWithAnimation();
        } else {
            showThemeProcess();
            updateContent2();
        }
    }
    function prevSlide() {
        _$.p_current_index = get_prev_index();
        document.getElementById("content1").style.textShadow = null;
        document.getElementById("content2").style.textShadow = null;
        setupContentPosition();
        if (!showingTheme) {
            updateContentWithAnimation();
        } else {
            showThemeProcess();
            updateContent2();
        }
    }
    function updateContent() {
        if (!showingTheme) {
            updateContentWithAnimation();
        }
    }

    function updateContentWithAnimation() {
        const contentContainer = $("#presentationContent");

        contentContainer.animate(
            { opacity: '0' }, transitionDuration, "swing", () => {
            updateContent2();
            contentContainer.animate({ opacity: '1' }, transitionDuration, "swing");
        });
    }

    function updateDate() {
        const now = new Date();
        const hours = now.getHours();

        let hh;
        let pp = " AM";
        if (hours === 0) {
            hh = 12;
        } else if (hours <= 11) {
            hh = hours;
        } else if (hours === 12) {
            hh = 12;
            pp = " PM";
        } else {
            hh = hours - 12;
            pp = " PM";
        }

        let mm = now.getMinutes();
        if (mm < 10) {
            mm = "0" + mm;
        }

        document.getElementById("footer_date").innerHTML = `${now.toDateString()}&nbsp;&nbsp;${hh}:${mm}${pp}`;

        // update every 5 seconds
        setTimeout(updateDate, 5000);
    }

    function updateContent2() {
        restoreSlideProcess();

        const c1 = document.getElementById("content1");
        const c2 = document.getElementById("content2");

        c1.style.visibility = "hidden";
        c2.style.visibility = "hidden";
        c1.innerHTML = "";
        c2.innerHTML = "";

        if (firstTime) {
            updateContentInitial();
            updateContentStyling();
        } else {
            updateContentStyling();
        }
    }

    function updateContentInitial() {
        const c1 = document.getElementById("content1");
        const c2 = document.getElementById("content2");

        c1.style.visibility = "hidden";
        c2.style.visibility = "hidden";
        c1.innerHTML = _$.p_text1_arr[_$.p_current_index];
        c2.innerHTML = _$.p_text2_arr[_$.p_current_index];

        firstTime = false;
    }

    function updateContentStyling() {
        _$.p_font_color_invert = invert_hex_color(_$.p_font_color);
        _$.p_font_color2_invert = invert_hex_color(_$.p_font_color2);
        let b = _$.p_format_multiplelines;
        if (_$.p_title !== "") {
            b = true;
        }

        const titleEl = document.getElementById("presentationTitle");

        if (_$.p_title !== "") {
            titleEl.innerHTML = formatReferenceWithFonts(_$.p_title, _$.p_text1_font, _$.p_text2_font);
            titleEl.style.color = _$.p_font_color;

            setTimeout(function () {
                textFit(document.getElementsByClassName("box3"), {
                    alignVert: true,
                    detectMultiLine: false,
                    multiLine: _$.p_format_multiplelines,
                    minFontSize: 30,
                    maxFontSize: _$.p_maxFontSize * 1,
                    alignVertWithFlexbox: false,
                });
                titleEl.style.visibility = "visible";
            }, initialRenderDelay);
        } else {
            titleEl.innerHTML = "";
            titleEl.style.visibility = "hidden";
        }

        document.getElementById("footnote").innerHTML = _$.p_footnote;
        document.getElementById("footnote").style.color = _$.p_font_color;

        if (_$.p_showLogo) {
            document.getElementById("footer_vv").innerHTML = _$.p_logo;
            document.getElementById("footer_vv").style.color = _$.p_font_color;
        }

        document.getElementById("footer_vv").style.textShadow =
            "2px 2px 3px #" +
            _$.p_font_color_invert +
            ", -2px -2px 3px #" +
            _$.p_font_color_invert;
        document.getElementById("footer_date").style.textShadow =
            "2px 2px 3px #" +
            _$.p_font_color_invert +
            ", -2px -2px 3px #" +
            _$.p_font_color_invert;

        if (_$.p_enableShadow) {
            document.getElementById("footnote").style.textShadow =
                "2px 2px 3px #" +
                _$.p_font_color_invert +
                ", -2px -2px 3px #" +
                _$.p_font_color_invert;
        }

        document.getElementById("content1").style.textAlign = _$.p_align;
        document.getElementById("content2").style.textAlign = _$.p_align;
        document.getElementById("content1").style.fontFamily = _$.p_text1_font;
        document.getElementById("content2").style.fontFamily = _$.p_text2_font;
        document.getElementById("content1").style.color = _$.p_font_color;
        document.getElementById("content2").style.color = _$.p_font_color2;
        document.getElementById("content1").innerHTML = _$.p_text1_arr[_$.p_current_index];

        if (_$.p_text_orientation != "2") {
            document.getElementById("content2").innerHTML = _$.p_text2_arr[_$.p_current_index];
        }

        setTimeout(() => {
            textFit(document.getElementsByClassName("box1"), {
                alignVert: true,
                detectMultiLine: false,
                multiLine: b,
                minFontSize: 30,
                maxFontSize: _$.p_maxFontSize * 1,
                reProcess: true,
                alignVertWithFlexbox: false,
            });

            if (_$.p_text_orientation != "2") {
                textFit(document.getElementsByClassName("box2"), {
                    alignVert: true,
                    detectMultiLine: false,
                    multiLine: b,
                    minFontSize: 30,
                    maxFontSize: _$.p_maxFontSize * 1,
                    alignVertWithFlexbox: false,
                });
            }

            if (_$.p_enableShadow) {
                renderShadow();
            }

            document.getElementById("content1").style.visibility = "visible";
            document.getElementById("content2").style.visibility = "visible";

            initialRenderDelay = 100;
        }, initialRenderDelay);

        function renderShadow() {
            outlineThickness = getOutlineThickness(
                _$.p_text1_arr[_$.p_current_index],
                _$.p_text1_font
            );

            document.getElementById("content1").style.webkitTextStroke =
                `${outlineThickness}px #${_$.p_font_color_invert}`;

            outlineThickness = getOutlineThickness(
                _$.p_text2_arr[_$.p_current_index],
                _$.p_text2_font
            );

            document.getElementById("content2").style.webkitTextStroke =
                `${outlineThickness}px #${_$.p_font_color2_invert}`;

            document.getElementById("presentationTitle").style.webkitTextStroke =
                `${outlineThickness}px #${_$.p_font_color2_invert}`;
        }
    }

    function getOutlineThickness(b, c, d) {
        if (b == null) {
            return 0;
        }
        const a = b.length;
        if (parseInt(_$.p_maxFontSize) < 48) {
            return 0.5;
        }
        if (c === "Malayalam") {
            return 0;
        }
        if (d != null) {
            if (d > 100) {
                return 2;
            } else {
                if (d > 80) {
                    return 1;
                } else {
                    return 0.5;
                }
            }
        } else {
            if (a > 100) {
                return 1;
            } else {
                return 1;
            }
        }
    }
    function showThemeProcess() {
        if (!showingTheme) {
            showingTheme = true;
            $("#presentationTitle").hide();
            $("#content1").hide();
            $("#content2").hide();
            $("#footnote").hide();
        } else {
            showingTheme = false;
            $("#presentationTitle").show();
            $("#content1").show();
            $("#content2").show();
            $("#footnote").show();
        }
    }
    function showBlankProcess() {
        document.getElementById("presentationTitle").innerHTML = "";
        document.getElementById("content1").innerHTML = "";
        document.getElementById("content2").innerHTML = "";
        document.getElementById("footnote").innerHTML = "";
        $("#backgroundLayer").css("background-color", "black");
        $("#backgroundImage").hide();
    }
    function restoreSlideProcess() {
        $("#backgroundImage").show();
    }
    function findKey(a) {
        key = a.keyCode;
        switch (key) {
            case 27:
                clearPresenter();
                break;
            case 39:
            case 40:
            case 34:
                if (!showingTheme) {
                    nextSlide();
                    window.parent.goToNextSlide();
                }
                break;
            case 37:
            case 38:
            case 33:
                if (!showingTheme) {
                    prevSlide();
                    window.parent.goToPrevSlide();
                }
                break;
            case 84:
                showThemeProcess();
                break;
            default:
                break;
        }
    }
    function savePresentationMargin() {
        var k = true;
        var e = document.getElementById("presentConfigMarginTop").value;
        var c = document.getElementById("presentConfigMarginBottom").value;
        var f = document.getElementById("presentConfigMarginLeft").value;
        var n = document.getElementById("presentConfigMarginRight").value;
        if (IsNumeric(e) && IsNumeric(c) && IsNumeric(f) && IsNumeric(n)) {
            $RvW.vvConfigObj.set_p_topMargin(e);
            $RvW.vvConfigObj.set_p_bottomMargin(c);
            $RvW.vvConfigObj.set_p_leftMargin(f);
            $RvW.vvConfigObj.set_p_rightMargin(n);
        } else {
            k = false;
            alert("Invalid entry for margin");
            document.getElementById("presentConfigMarginTop").value =
                $RvW.vvConfigObj.get_p_topMargin();
            document.getElementById("presentConfigMarginBottom").value =
                $RvW.vvConfigObj.get_p_bottomMargin();
            document.getElementById("presentConfigMarginLeft").value =
                $RvW.vvConfigObj.get_p_leftMargin();
            document.getElementById("presentConfigMarginRight").value =
                $RvW.vvConfigObj.get_p_rightMargin();
        }
        var v = document.getElementById("presentConfigMaxFontSize").value;
        if (IsNumeric(v)) {
            if (withinRange(30, 200, v)) {
                $RvW.vvConfigObj.set_p_maxFontSize(v);
            } else {
                k = false;
                alert("Maximum font size value out of Range");
                document.getElementById("presentConfigMaxFontSize").value =
                    $RvW.vvConfigObj.get_p_maxFontSize();
            }
        } else {
            k = false;
            alert("Invalid maximum font size value.");
            document.getElementById("presentConfigMaxFontSize").value =
                $RvW.vvConfigObj.get_p_maxFontSize();
        }
        var l = document.getElementById("presentConfigEnableTransition").checked;
        $RvW.vvConfigObj.set_p_enableTransition(l);
        var d = document.getElementById("presentConfigEnableSongTitle").checked;
        $RvW.vvConfigObj.set_p_showTitle(d);
        var g = document.getElementById("presentConfigEnableShadow").checked;
        $RvW.vvConfigObj.set_p_enableShadow(g);
        var q = document.getElementById("justify_left").checked;
        var z = document.getElementById("justify_center").checked;
        var a = document.getElementById("justify_right").checked;
        var i = "left";
        if (z) {
            i = "center";
        }
        if (a) {
            i = "right";
        }
        $RvW.vvConfigObj.set_p_align(i);
        var y = document.getElementById("porient_hori").checked;
        var h = document.getElementById("porient_vert").checked;
        var r = "0";
        if (h) {
            r = "1";
        }
        _$.p_text_orientation = r;
        $RvW.vvConfigObj.set_p_text_orientation(_$.p_text_orientation);
        var p = document.getElementById("showPrimaryFont").checked;
        if (p) {
            $RvW.vvConfigObj.set_song_primaryOnly("true");
        } else {
            $RvW.vvConfigObj.set_song_primaryOnly("false");
        }
        var y = document.getElementById("porient_song_hori").checked;
        var h = document.getElementById("porient_song_vert").checked;
        var r = "0";
        if (h) {
            r = "1";
        }
        p_song_text_orientation = r;
        $RvW.vvConfigObj.set_song_text_orientation(p_song_text_orientation);
        var x = document.getElementById("customLogoText1").value;
        var w = document.getElementById("customLogoText2").value;
        $RvW.vvConfigObj.set_logoText1(x);
        $RvW.vvConfigObj.set_logoText2(w);
        var t = document.getElementById("presentConfigShowDateTime").checked;
        var m = document.getElementById("presentConfigShowVVLogo").checked;
        var s = document.getElementById("presentConfigShowCustomLogo").checked;
        $RvW.vvConfigObj.set_showDateTime(t);
        $RvW.vvConfigObj.set_showVVLogo(m);
        $RvW.vvConfigObj.set_showCustomLogo(s);
        var j = document.getElementById("presentConfigOntop").checked;
        $RvW.vvConfigObj.set_presentationOnTop(j);
        var u = document.getElementById("show2LinesSlides").checked;
        $RvW.vvConfigObj.set_show2lines(u);
        var o = document.getElementById("hideStanzaNumber").checked;
        $RvW.vvConfigObj.set_hideStanzaNumber(o);
        var b = document.getElementById("fitLineSetup").checked;
        $RvW.vvConfigObj.set_pformat_multiplelines(b);
        if (k) {
            $RvW.vvConfigObj.save();
        }
    }
    function initTransition(enabled) {
        transitionDuration = 0;
        if (enabled) {
            transitionDuration = TRANSITION_DURATION;
        }
    }
    function animateZoomPan(layer, c) {
        const img = new Image(); // probably ensuring the image is loaded before we start the animation
        let a = 1;
        img.onload = function () {
            const g = img.height;
            const k = img.width;
            // FIXME: are we really using the proper screen?
            const j = air.Screen.screens;
            const h = j[0].bounds.width;
            const f = j[0].bounds.height;
            const e = h / k;
            const i = f / g;
            a = e;
            if (i > e) {
                a = i;
            }
            animateZP();
        };
        img.src = c;

        function animateZP() {
            const e = 13;
            jQuery.fx.interval = 80;

            $(layer).crossSlide(
                { fade: 1 },
                [
                    {
                        src: c,
                        alt: "",
                        from: `${Math.floor(Math.random() * 100 + 1)}% ${Math.floor(Math.random() * 100 + 1)}% ${a}x`,
                        to: `${Math.floor(Math.random() * 100 + 1)}% ${Math.floor(Math.random() * 100 + 1)}% 3x`,
                        time: e,
                    },
                    {
                        src: c,
                        alt: "",
                        from: `${Math.floor(Math.random() * 100 + 1)}% ${Math.floor(Math.random() * 100 + 1)}% ${a}x`,
                        to: `${Math.floor(Math.random() * 100 + 1)}% ${Math.floor(Math.random() * 100 + 1)}% 3x`,
                        time: e,
                    },
                    {
                        src: c,
                        alt: "",
                        from: `${Math.floor(Math.random() * 100 + 1)}% ${Math.floor(Math.random() * 100 + 1)}% ${a}x`,
                        to: `${Math.floor(Math.random() * 100 + 1)}% ${Math.floor(Math.random() * 100 + 1)}% 3x`,
                        time: e,
                    },
                    {
                        src: c,
                        alt: "",
                        from: `${Math.floor(Math.random() * 100 + 1)}% ${Math.floor(Math.random() * 100 + 1)}% ${a}x`,
                        to: `${Math.floor(Math.random() * 100 + 1)}% ${Math.floor(Math.random() * 100 + 1)}% 3x`,
                        time: e,
                    },
                    {
                        src: c,
                        alt: "",
                        from: `${Math.floor(Math.random() * 100 + 1)}% ${Math.floor(Math.random() * 100 + 1)}% ${a}x`,
                        to: `${Math.floor(Math.random() * 100 + 1)}% ${Math.floor(Math.random() * 100 + 1)}% 3x`,
                        time: e,
                    },
                    {
                        src: c,
                        alt: "",
                        from: `${Math.floor(Math.random() * 100 + 1)}% ${Math.floor(Math.random() * 100 + 1)}% ${a}x`,
                        to: `${Math.floor(Math.random() * 100 + 1)}% ${Math.floor(Math.random() * 100 + 1)}% 3x`,
                        time: e,
                    },
                    {
                        src: c,
                        alt: "",
                        from: `${Math.floor(Math.random() * 100 + 1)}% ${Math.floor(Math.random() * 100 + 1)}% ${a}x`,
                        to: `${Math.floor(Math.random() * 100 + 1)}% ${Math.floor(Math.random() * 100 + 1)}% 3x`,
                        time: e,
                    },
                ],
                function (f, g, h, i) {
                    if (h === undefined) {
                        $("div.caption").text(g.alt).animate({ opacity: 0.7 });
                    } else {
                        $("div.caption").fadeOut();
                    }
                }
            );
        }
    }
    function formatReferenceWithFonts(i, c, b) {
        var h = "";
        var a = i.split(")");
        if (a[1] != null) {
            var f = a[1];
            var g = a[0].split("(");
            var e = g[0];
            var d = g[1];
            h += '<span style="font-family:' + c + ';">' + e + "</span>";
            h += '<span style="font-family:' + b + ';"> (' + d + ") </span>";
            h += '<span style="font-family:' + c + ';">' + f + "</span>";
        } else {
            h += '<span style="font-family:' + c + ';">' + i + "</span>";
        }
        return h;
    }
    function invert_hex_color(d) {
        const e = "0123456789ABCDEF";

        function c(f) {
            return e.charAt((f >> 4) & 15) + e.charAt(f & 15);
        }
        function b(f) {
            f = f.toUpperCase();
            return parseInt(f, 16);
        }
        function a(h) {
            var f = h;
            if (f.toString().length < 6 || f.toString().length > 6) {
                f = f.toString(16);
            }
            hex1 = f.slice(0, 2);
            hexb1 = f.slice(2, 4);
            hexc1 = f.slice(4, 6);
            hex2 = 16 * b(hex1.slice(0, 1));
            hex3 = b(hex1.slice(1, 2));
            hex1 = hex1 + hex2;
            hexb2 = 16 * b(hexb1.slice(0, 1));
            hexb3 = b(hexb1.slice(1, 2));
            hexb1 = hexb2 + hexb3;
            hexc2 = 16 * b(hexc1.slice(0, 1));
            hexc3 = b(hexc1.slice(1, 2));
            hexc1 = hexc2 + hexc3;
            return c(255 - hex1) + "" + c(255 - hexb1) + "" + c(255 - hexc1);
        }
        return a(d);
    }

    function debug(msg) {
        if (DEBUG_ENABLED) {
            air.trace("[presentation.js]: " + msg);
        }
    }

    // exports (global)
    exports.$load = initPresentation;
    exports.$onKeyUp = findKey;

    // exports (bridge)
    exports.ctx = _$;

    // set by parent
    // exports.parent.onWindowUnload = null;
    // exports.parent.goToPrevSlide = null;
    // exports.parent.goToNextSlide = null;

    // DON'T SET IT
    // exports.passVariable = null; // sync func

    exports.updatePresentation = updatePresentation;
    exports.updateContent = updateContent;
    exports.nextSlide = nextSlide;
    exports.prevSlide = prevSlide;
    exports.showThemeProcess = showThemeProcess;
    exports.clearPresenter = clearPresenter;
    exports.showBlankProcess = showBlankProcess;
}(window /** @type {any} */));