var Main = {};

(function () {
    'strict mode';

    Main = {
        //menuopened : false
		currentpage : 0,
		currentheight : 0, 
		currentcontent : 0,
		maxpages : 5,
        //galleryInterval: false,
		totalpages : 5, //max 10
		busy : false,
    };

	Main.init = function () {

		View.init(function(){
            Main.onViewReady();
		});
	};

	Main.onViewReady = function()
	{
		Main.addListeners();
		Main.changePage(Main.currentpage);
	};


	Main.click = function(){
        var type = $(this).data('btn-type') || $(this).attr('data-btn-type') || null;
        var id = $(this).data('btn-id') || $(this).attr('data-btn-id') || null;
        if(type) {
        	$('#wrapper').trigger('BtnEvent', { type : type, id : id});
        }
    };

    Main.out = function(){
    	var type = $(this).data('btn-type') || $(this).attr('data-btn-type') || null;
    	//var id = $(this).data('btn-id') || $(this).attr('data-btn-id') || null;
        $('#wrapper').trigger('BtnEvent', { type : 'tooltip', id : null });
        //if(type == 'nav') $('#wrapper').trigger('BtnEvent', { type : 'nav-out', id : id});
    };

    Main.over = function(){
    	var type = $(this).data('btn-type') || $(this).attr('data-btn-type') || null;
    	var id = $(this).data('btn-id') || $(this).attr('data-btn-id') || null;
        var tooltip = $(this).data('btn-tooltip') || $(this).attr('data-btn-tooltip') || null;
        if(tooltip) $('#wrapper').trigger('BtnEvent', { type : 'tooltip', id : tooltip });
        if(type == 'nav') $('#wrapper').trigger('BtnEvent', { type : 'nav-over', id : id});
    };

	Main.addListeners = function()
    {

        window.onkeyup = function(e) {
            var key = e.keyCode ? e.keyCode : e.which;

            switch(key){

                case 33: //pageup
                case 37: //left
                case 38: //up
                    var p = Main.currentpage - 1;
                    if(p < 0) p = 0;
                    if(p > Main.totalpages - 1) p = Main.totalpages-1;
                    Main.changePage( p )
                    
                break;

                case 34: //pagedown
                case 39: //right
                case 40: //down
                    var p = Main.currentpage + 1;
                    if(p < 0) p = 0;
                    if(p > Main.totalpages - 1) p = Main.totalpages-1;
                    Main.changePage( p )
                break;

                case 49: //1
                case 50: //2
                case 51: //3
                case 52: //3
                case 53: //4
                    Main.changePage( parseInt( String.fromCharCode(key) ) -1 )
                break;
            }

          
        }


    	$("#wrapper").bind('BtnEvent SiteEvent', function(evt, data){
            var f,p;
            switch(data.type)
            {
                case 'nav':
                    f = Main.changePage
                    p = data.id;
                break;

                case 'nav-over':
                    f = Main.openNav
                    p = data.id;
                break;

                case 'nav-out':

                    f = Main.closeNav
                    p = data.id;
                break;

                case 'email':
                    f = Main.doMailTo
                    p = data.id;
                break;

                case 'tooltip':
                	f = Main.changeTooltip 
                    p = data.id;
                break;

                case 'url':
                	f = Main.openUrl 
                    p = data.id;
                break;

                case 'content-arrow':
                	f = Main.changeContent
                    p = (data.id == 'left') ? Main.currentcontent - 1 : Main.currentcontent + 1;
                    if(p < 0) p = Main.totalcontents[Main.currentpage]-1;//0;
                    if(p > Main.totalcontents[Main.currentpage]-1) p = 0;//Main.totalcontents[Main.currentpage]-1;
                break;

                case 'page-arrow':
                	f = Main.changePage
                    p = (data.id == 'up') ? Main.currentpage - 1 : Main.currentpage + 1;
                    if(p < 0) p = Main.totalpages-1;//0;
                    if(p > Main.totalpages-1) p = 0;//Main.totalpages-1;
                break;

                case 'page-changed':
                    f = Main.onPageChanged
                    p = data.id;
                break;

                case 'content-changed':
                    f = Main.onContentChanged
                    p = data.id;
                break;
            }
           	if (f) f(p);
        });
    };

    Main.openUrl = function(_url)
    {
    	var reg = /^(?:(ftp|http|https):\/\/)/;
    	if( !reg.test(_url) )  _url = "http://" + _url;
    	window.open(_url, "_blank")
    }

	Main.changePage = function(_id)
	{
		if(Main.busy) return;

		Main.busy = true;
	
		Main.currentpage = _id;

		var time = 1500;
		View.movesectionsTo(_id, time);
		View.updateNav(_id);

		var delay = setTimeout(function(){
			//View.updateNavBg(_id);
        },time/2)

	};

	Main.onPageChanged = function(_id)
	{	
        //View.updateHash(Main.pagenames[_id])

        if( Main.currentpage != _id ){
            Main.currentpage = _id;
            View.updateNav(_id);
        }

        if( _id == 1 ) {
           // Main.galleryInterval = setInterval( View.scrollGallery, 3000);
        }else{
           // if(Main.galleryInterval) clearInterval( Main.galleryInterval );
        }

	   	Main.busy = false; 	
	};

////////////////////////[ END ]/////////////////////////////
})();