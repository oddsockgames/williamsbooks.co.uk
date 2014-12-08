var View = {};

(function () {
    'strict mode';

    View = {
        easing : 'linear', //replaced!!,
        gid : 0
    };

	View.init = function (_callback) {

		log('Initialising View...');
		View.extendEasing();
        View.extendFxstep();

        //-TEST ENVIRONMENT
		this._eleRefs = {
            wrapper: $('div#wrapper')
            ,header: $('header#header')
            ,article: $('article#article')
            ,nav: $('nav#nav')
            ,sections: $('div#sections')
            //,gallery: $('#work .gallery')
            ,buttons : $('nav li.btn')
        };

        //-TEST ENVIRONMENT
        this._env = {
             isMac: $('html').hasClass('mac')
            ,isChrome: $('html').hasClass('chrome')
            ,isIPad: $('html').hasClass('ipad')
            ,isIPhone: $('html').hasClass('iphone')
            ,isIPod: $('html').hasClass('ipod')
            ,isWebkit: $('html').hasClass('webkit')
            ,isMobile: $('html').hasClass('mobile')
            ,visibleWidth: function () { return window.innerWidth || $(window).width() }
            ,visibleHeight: function () { return window.innerHeight || $(window).height() }
        };

        this._env.isIOS = this._env.isIPhone || this._env.isIPad || this._env.isIPod;
        
        /*
        this._evts = {};

        if (this._env.isMobile) {
            this._evts = {
                 click: 'touchstart'
                ,activate: 'touchstart'
                ,deactivate: 'touchend touchcancel'
            };
        } else {
            this._evts = {
                click: 'mousedown'
                ,activate: 'mousedown'
                ,deactivate: 'mouseup'
           };
        }
        */

        //-ADJUST INITIAL SCALE ON TABLETS/DEVICES WIDTH EXTRA WIDTH
        if (this._env.isMobile && $(window).width() > 1000) {
            //log('Adjusting initial-scale for large screen mobile...' ,'view');
            var vp = $ ('[name="viewport"]');
            var val = vp.attr('content').replace(/initial\-scale=\d?\.?\d?/, 'initial-scale=1.0');
            vp.attr('content', val);
        }

        //-SETUP CONTENT
        this._eleRefs.buttons.click( Main.click );
        this._eleRefs.buttons.mouseover( Main.over );
        this._eleRefs.buttons.mouseout( Main.out );
        this._eleRefs.nav.mouseout( function(){
           // View.hideSubNav()
       });

        //this._eleRefs.article.find('#rightside,#leftside').mouseover( View.pushSide );
        //this._eleRefs.article.find('#rightside,#leftside').mouseover( View.pullSide );

        //this._eleRefs.buttons.mouseout( Main.out );

        this._eleRefs.wrapper.bind('DOMMouseScroll mousewheel', function(e){
            e.preventDefault();
            var scroll;
            scroll = (e.type == 'DOMMouseScroll') ? e.originalEvent.detail : e.originalEvent.wheelDelta;
            $('.debug').html(scroll);
            View.movesectionsBy(scroll);
        });

        /*
        
        var touch = {x:0,y:0};
        var offset = {x:0,y:0};

        this._eleRefs.wrapper.bind('touchstart', function(e){
            e.preventDefault();
            if(e.type == 'touchstart'){
                touch.x = event.touches[0].pageX;
                touch.y = event.touches[0].pageY;
            }else{

            }

        });

        this._eleRefs.wrapper.on('touchmove', function(e){
            e.preventDefault();
            var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
            var elm = $(this).offset();
            var x = touch.pageX - elm.left;
            var y = touch.pageY - elm.top;
            if(x < $(this).width() && x > 0){
                if(y < $(this).height() && y > 0){
                    offset.x = start.x - touch.pageX;
                    offset.y = start.y - touch.pageY;
                    View.movesectionsBy(offset.y);
                    $('.debug').html( e.type );
                }
            }
        });

        */
        //var gallery = setInterval( View.scrollGallery, 2000);

        if(_callback) _callback();
	};

    View.scrollGallery = function()
    {
        var height, now, next, el, captions;

        el = $('#work .img');        

        height = el.height();
        now =  el.position().top;
        next =  now - (height/5);
        View.gid ++;

        if( next <= -height) {
            el.stop().css( 'top', 0 );
            next = 0 - (height/5);
            View.gid = 0;
        }
        
        el.stop().animate( {top: next}, 500);

        el = $('#work .caption p');

        captions = [ 'image one caption | Dec 2014', 'image two caption | Aug 2014', 'image three caption | Jul 2013', 'image four caption | oct 2014', 'image one caption | Dec 2014'];
        el.html( captions[ View.gid ] )  

    };

    View.updateNav = function(_page)
    {
        var my = this, e = this._eleRefs;

      //  console.log( _page )

        e.nav.find('.btn').removeClass('active');
        var i = _page;
        e.nav.find('.btn:eq(' + i + ')').addClass('active');

        //e.nav.find('p').css('color', 'white');
        //e.nav.find('.nav-highlight p:eq(' + _page + ')').css('color', '#0268cd');
        //e.nav.find('.nav-subitem').fadeOut(250);
    
    };


    View.pushSide = function()
    {
       //var my = this, e = this._eleRefs;
        //$(this).stop().animate( {paddingLeft: -5 + 'px'}, 150, View.easing); //.delay(200).animate( {marginLeft: 0 + 'px'}, 150, View.easing);
    };


    View.movesectionsBy = function( _amount )
    {
        //-move sections by amount, on scroll
        var my = this, e = this._eleRefs, max,  min, before, after, height, top, aftermod, page;

        height = parseInt( e.sections.css('height') );
        before = parseInt( e.sections.css('top') );
        max = ( height / Main.maxpages) * (Main.maxpages-1);
       // max -= 110;
        min = 0;
        after = before + _amount;
        if(after > min ) after = min;
        if(after < -max ) after = -max;

        e.sections.css('top', after);

        e.header.find('.left').stop().animate( {left: after/2 + 'px'}, 0, View.easing);
        e.header.find('.left-2').stop().animate( {left: after/2 + 'px'}, 0, View.easing);

        aftermod = Math.abs(after) - ( ( height / Main.maxpages) / 2 );

        //log('_amount[' + _amount + '] height[' + height + '] before[' + before + '] max[' + max + '] min[' + min + '] aftermod['+aftermod+']');

        page = Main.currentpage;

        if( aftermod < 0 ){
            page = 0;
        }else if( aftermod  < (height / Main.maxpages) * 1){
            page = 1;
        }else if( aftermod  < (height / Main.maxpages) * 2){
            page = 2;
        }else if( aftermod  < (height / Main.maxpages) * 3){
            page = 3;
        }else if( aftermod  < (height / Main.maxpages) * 4){ 
            page = 4;
        }

        if(Main.currentpage != page) e.wrapper.trigger('SiteEvent', { type : 'page-changed', id : page });

        /*
        if(before != after){
           e.sections.find('.wrap').each(function(i){
            before = parseInt( $(this).css('top') );
            after = before-_amount;
            $(this).css('top',  after );
           });
        }
        */
    };

    View.movesectionsTo  = function( _id, _time)
    {
        var my = this, e = this._eleRefs, to, from, time, timeout ;

       // log('movesectionsTo[' + _id + '] [' + _time + ']')
        //-move to a certain section, on nav click
        Main.currentheight = $(window).height();
        time = (_time) ? _time : 500;
        to =  -( ( parseInt( e.sections.css('height') ) / Main.maxpages ) * _id );
        //$('#section-wrap').css('top', to);
        e.sections.stop().animate( {top: to + 'px'}, time, View.easing);

        e.header.find('.left').stop().animate( {left: to/2 + 'px'}, time, View.easing);
        e.header.find('.left-2').stop().animate( {left: to/2 + 'px'}, time, View.easing);
        //e.header.find('.corner-right').stop().animate( {right: to + 'px'}, time, View.easing);

        timeout = setTimeout(function(){
            e.wrapper.trigger('SiteEvent', { type : 'page-changed', id : _id });
        },time)
    };

    //-------------------------------------------------------------------
 
    View.nopx = function (_i) {
        return _i.replace(/[^-\d\.]/g, '');
    };

    View.updateBgPos = function (_target, _x, _y){
        _target.each(function() {
            var newx,nexy,bgpos;
            if($(this).css('backgroundPosition'))
            {
                bgpos = $(this).css('backgroundPosition').split(" ");
                newx = ( _x ) ? _x + 'px' : bgpos[0];
                newy = ( _y ) ? _y + 'px' : bgpos[1];
            }else{
                newx = ( _x ) ? _x + 'px' : $(this).css('background-position-x');
                newy = ( _y ) ? _y + 'px' : $(this).css('background-position-y');
            }
            $(this).css('backgroundPosition', newx + ' ' + newy);
        });
    };

	View.extendEasing = function(){
		$.extend($.easing,{
            easeOutExpo: function (x, t, b, c, d) {
                return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
		    },
            easeInOutCirc: function (x, t, b, c, d) {
                if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
                return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
            },
            easeInExpo: function (x, t, b, c, d) {
                return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
            },
            easeInOutQuint: function (x, t, b, c, d) {
                if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
                return c/2*((t-=2)*t*t*t*t + 2) + b;
            },
		});

        View.easing = 'easeInOutQuint';
	};

    View.extendFxstep = function(){
        $.extend($.fx.step,{
            backgroundPosition: function(fx) {
                if (typeof fx.end == 'string') {
                    var start = $.css(fx.elem,'backgroundPosition');
                    start = toArray(start);
                    fx.start = [start[0],start[2]];
                    var end = toArray(fx.end);
                    fx.end = [end[0],end[2]];
                    fx.unit = [end[1],end[3]];
                }
                var nowPosX = [];
                nowPosX[0] = Math.round(((fx.end[0] - fx.start[0]) * fx.pos) + fx.start[0]) + fx.unit[0];
                nowPosX[1] = Math.round(((fx.end[1] - fx.start[1]) * fx.pos) + fx.start[1]) + fx.unit[1];
                fx.elem.style.backgroundPosition = nowPosX[0]+' '+nowPosX[1];

                function toArray(strg){
                    strg = strg.replace(/left|top/g,'0px');
                    strg = strg.replace(/right|bottom/g,'100%');
                    strg = strg.replace(/([0-9\.]+)(\s|\)|$)/g,"$1px$2");
                    var res = strg.match(/(-?[0-9\.]+)(px|\%|em|pt)\s(-?[0-9\.]+)(px|\%|em|pt)/);
                    return [parseFloat(res[1],10),res[2],parseFloat(res[3],10),res[4]];
                }
            }
        });
    };
////////////////////////[ END ]/////////////////////////////
})();