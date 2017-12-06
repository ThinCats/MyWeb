var AIF = {};

AIF.video = function () {

    var $firstVideos,
        $inner,
        $body,
        $letters,
        $window,
        $header,
        $upControl,
        $downControl,
        $fullheight,
        $scrollEventElems,
        currentPosition = 0,
        totalPositions,
        isSingleCol = false,

    function init () {

        // Cache selectors
        $window = $(window);
        $inner = $('.container--inner');
        $letters = $('.letter');
        $body = $('body');
        $introVideo = $('.js--video-intro');
        $header = $('header');
        $fullheight = $('.fullheight');
        $introButtons = $('.intro--buttons');
        $upControl = $('.header--hit--up');
        $downControl = $('.header--hit--down');
        $modal = $('.modal');
        $mute = $('.header--mute');
        $scrollEventElems = $('.letter, .intro--container');
        $vimeoHolder = $('.vimeo');

        checkWidth();

        $introVideo.on('ended', function (e) {
            showHeader();
            bindControls();
        });

        $window.on('resize', function () {
            checkWidth();
            calcTotalPositions();
        });
    }

    function checkWidth () {
        isSingleCol = ($window.innerWidth() <= 800);
        $fullheight.height($window.height());
        videoHeight = $('.video-container').height();
    }

    function showHeader () {
        $header.addClass('show');
    }

    function calcTotalPositions () {
        if (isSingleCol) {
            totalPositions = 28;
        } else {
            totalPositions = 14;
        }
    }

    function moveDown () {

        if (!isSingleCol && currentPosition > 13) {
            return false;
        } else if (isSingleCol && currentPosition > 26) {
            return false;
        }

        var windowHeight = $window.innerHeight(),
            moveTo = (windowHeight + (currentPosition * videoHeight)) * -1;

        if (isSingleCol && currentPosition !== 26) {
            // Centre letter videos in page
            var extra = (windowHeight - videoHeight) / 2;
            moveTo += extra;
        }

        $inner.css('top', moveTo);

        if (currentPosition < totalPositions) {
            currentPosition++;
        }

        checkControls();
    }

    function gotoLetter (letter) {

        var gotoIndex = 0;

        if (letter == '#intro') {
            gotoIndex = -1;
            showModal();
        } else if (letter == '#about'){
            gotoIndex = 26;
        } else {
            letter = letter.replace('#', '');

            $letters.each(function (index, elem) {
                if ($(elem).attr('id') === letter) {
                    gotoIndex = index;
                }
            });
        }

        if (isSingleCol) {
            currentPosition = gotoIndex + 2;
        } else {
            currentPosition = Math.ceil((gotoIndex + 1) / 2) + 1;
        }

        moveUp(true);
    }
AIF.nav = function () {

    var $navToggle,
        $nav,
        $navItems;

    function init () {
        $navToggle = $('.js--nav-toggle');
        $nav = $('nav');
        $navItems = $nav.find('li a');

        $navToggle.on('click', function (e) {
            e.preventDefault();
            // iOS vh fix.
            var height = $(window).innerHeight() - 40;
            if ($(window).innerWidth() <= 800) {
                $navItems.css('height', Math.ceil(height / 7));
                $navItems.css('width', Math.floor($(window).innerWidth() / 4));
            } else {
                $navItems.css('height', Math.ceil(height / 4));
            }

            $nav.toggleClass('open');
        });

        $navItems.on('click', function (e) {
            e.preventDefault();
            $nav.removeClass('open');
            var href = $(e.target).closest('a').attr('href');
            AIF.video.gotoLetter(href);
        });
    }

    return {
        init: init
    };
}();


$(document).ready(function () {

    AIF.video.init();
    AIF.nav.init();
    AIF.share.init();

    $('.intro video').on('click', function (e) {
        $('.intro video')[0].play();
    });

    $('.js--who-made').hover(function (e) {
        $(e.target).text('Studio Lovelock');
    }, function (e) {
        $(e.target).text('Who made this?');
    });

});
