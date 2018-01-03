$.ajaxSetup ({
    cache: false
});

function simpleTabs(elements, options) {
    // set defaults
    var defaults = {
        speed: 7000
    }
    var options = $.extend(defaults, options);
    // each group of tabs
    elements.each(function() {
        // simple tab switching
        var el = $(this),
            tabs = el.find('.tabs-nav'),
            panes = el.find('.tabs-pane'),
            slideCount = Math.max(tabs.length, panes.length);

        el.addClass('enabled');
        $(tabs[0]).addClass('active');
        $(panes[0]).addClass('active');

        $(tabs).on('click', function(ev) {
            ev.preventDefault();
            if ( !$(this).hasClass('active') ) {
                var tabIndex = $(tabs).index($(this));

                $(el).find('.active').removeClass('active');
                $(el).find('.prev').removeClass('prev');
                $(el).find('.next').removeClass('next');
                $(this).addClass('active');
                $(panes[tabIndex]).addClass('active');

                if ( tabIndex == 0 ) {
                    $(panes[slideCount - 1]).addClass('prev');
                    $(panes[1]).addClass('next');
                } else if ( tabIndex == (slideCount - 1) ) {
                    $(panes[tabIndex - 1]).addClass('prev');
                    $(panes[0]).addClass('next');
                } else {
                    $(panes[tabIndex - 1]).addClass('prev');
                    $(panes[tabIndex + 1]).addClass('next');
                }

                if ( el.hasClass('playing') ) {
                    // pause and resume to reset clock
                    pauseSlideshow();
                    resumeSlideshow();
                }
            }
        });

        // next/prev changer function for slideshows
        function changeSlides(action) {
            var currentTab = el.find('.tabs-pane.active'),
            tabIndex = panes.index(currentTab),
            nextTab = 0;

            if (action == 'prev') {
                if (tabIndex <= 0) {
                    nextTab = slideCount - 1;
                } else {
                    nextTab = tabIndex - 1;
                }
            } else {
                if (tabIndex < (slideCount - 1)) {
                    nextTab = tabIndex + 1;
                }
            }
            $(el).find('.active').removeClass('active');
            $(panes).removeClass('prev next');
            $(tabs[nextTab]).addClass('active');
            $(panes[nextTab]).addClass('active');

            // prev and next
            if ( nextTab == 0 ) {
                $(panes[slideCount - 1]).addClass('prev');
                $(panes[1]).addClass('next');
            } else if ( nextTab == (slideCount - 1) ) {
                $(panes[nextTab - 1]).addClass('prev');
                $(panes[0]).addClass('next');
            } else {
                $(panes[nextTab - 1]).addClass('prev');
                $(panes[nextTab + 1]).addClass('next');
            }

            return false;
        }

        function pauseSlideshow() {
            var existingInterval = el.data('clock');
            if (existingInterval) {
                clearInterval(existingInterval);
                el.data('clock', null)
            }
            el.removeClass('playing').addClass('paused');
        }

        function resumeSlideshow() {
            var existingInterval = el.data('clock');
            if (!existingInterval) {
                changeSlidesInterval = setInterval(changeSlides, slideSpeed);
                el.data('clock', changeSlidesInterval);
            }
            el.removeClass('paused').addClass('playing');
        }

        // automate tab switching if applicable
        if ( el.hasClass('slideshow') ) {

            $(panes[1]).addClass('next');
            $(panes[slideCount - 1]).addClass('prev');

            var slideSpeed = options.speed;
            changeSlidesInterval = setInterval(changeSlides, slideSpeed);

            // avoid duplicate intervals on the slideshow
            el.data('clock', changeSlidesInterval).addClass('playing');

            // pause and resume buttons
            el.on('click', '.tabs-pause', function(ev) {
                ev.preventDefault();
                pauseSlideshow();
            });
            el.on('click', '.tabs-resume', function(ev) {
                ev.preventDefault();
                resumeSlideshow();
            });
            // prev and next buttons
            el.on('click', '.tabs-next', function(ev) {
                ev.preventDefault();
                pauseSlideshow(); // pause and resume to reset clock
                changeSlides();
                resumeSlideshow();
            });
            el.on('click', '.tabs-prev', function(ev) {
                ev.preventDefault();
                pauseSlideshow();
                changeSlides('prev');
                resumeSlideshow();
            });
        }
    });
}

$(document).ready(function() {

    $('html').removeClass('no-js').addClass('js');

    // login popup
    $('#header-login').on({
        mouseenter: function () {
            $('#header-login-overlay').addClass('visible');
            $('#header-search').focus();
            $(document).keyup(function (e) {
                if (e.keyCode == 27) {
                    $('#header-login-overlay').removeClass('visible');
                }
            });
        },
        mouseleave: function () {
            $('#header-login-overlay').removeClass('visible');
        }
    });


    // mobile nav
    $('.mobile-toggled').clone().appendTo('#mobile-nav-container');

    // generic toggles
    // <el class="toggle" data-toggle-target="[next|selector]"></el>
    $('.toggle').each(function() {
        var toggleSource = $(this),
        toggleTarget = toggleSource.data('toggle-target');

        if ( toggleTarget == "next" ) {
            toggleTarget = toggleSource.next();
        } else if ( toggleTarget == "next" ) {
            toggleTarget = toggleSource.prev();
        }

        $(toggleSource).css({
            cursor: 'pointer'
        }).on('click', function(ev) {
            ev.preventDefault();
            toggleSource.toggleClass('toggle-active');
            $(toggleTarget).toggleClass('toggle-active');
            // login, search panes
            if ( toggleSource.data('toggle-focus') === 'focus' && toggleSource.hasClass('toggle-active') ) {
                $(toggleTarget).find('input:first').hide().show().focus(); // .hide().show() is a consistency hack
                $(document).keyup(function(k) {
                    if ( k.keyCode == 27 ) {
                        toggleSource.removeClass('toggle-active');
                        $(toggleTarget).removeClass('toggle-active');
                    }
                });
            }
        });
    });

    // homepage slideshow
    simpleTabs($('.hero.slideshow'), { speed: 5000 });

    $( "#accordion" ).accordion({
        heightStyle: "content",
        active: false,
        collapsible: true,
    });
    $( "#accordion2" ).accordion({
        heightStyle: "content",
        active: false,
        collapsible: true,
    });
    $( "#accordion3" ).accordion({
        heightStyle: "content",
        collapsible: true,
    });


    $(".toggle_container").show();

    $("button.reveal").click(function(){

        $(this).toggleClass("active").next().slideToggle("fast");

        if ($.trim($(this).text()) === 'Show') {
            $(this).text('Hide');
        } else {
            $(this).text('Show');
        }

        return false;
    });

    $("a[href='" + window.location.hash + "']").parent(".reveal").click();

    $(function() {
        // grab the initial top offset of the navigation
        var sticky_navigation_offset_top = $('#sticky_navigation').offset().top;

        // our function that decides weather the navigation bar should have "fixed" css position or not.
        var sticky_navigation = function(){
            var scroll_top = $(window).scrollTop(); // our current vertical position from the top

            // if we've scrolled more than the navigation, change its position to fixed to stick to top,
            // otherwise change it back to relative
            if (scroll_top > sticky_navigation_offset_top) {
                $('#sticky_navigation').css({ 'position': 'fixed', 'top':0, 'left':0 });
            } else {
                $('#sticky_navigation').css({ 'position': 'relative' });
            }
        };

        // run our function on load
        sticky_navigation();

        // and run it again every time you scroll
        $(window).scroll(function() {
             sticky_navigation();
        });
    });

    // suppress primary nav, because there are no landing pages
    $('#nav > ul > li > a')
        .css({ cursor: 'default' })
        .attr('href', '')
        .on('click', function (ev) {
            ev.preventDefault();
        });
    
    //knowledge center tabs
    $('#resource-tabs li').click(function(){
        var liNum = $(this).attr('data-num');
        $(this).addClass('active');
        $(this).siblings('li').removeClass('active');
        $('#resource-tabs-content div').removeClass('active');
        $('#resource-tabs-content div:nth-child('+liNum+')').addClass('active')
        
    })
});
