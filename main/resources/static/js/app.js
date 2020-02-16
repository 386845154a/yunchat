
var vmApp = {
    init: function () {
        // fire this on page load if nav exists
        if ($('#nav').length) {
            vmApp.checkURL();
        }

        $('#nav a[href!="#"]').click(function (e) {
            e.preventDefault();
            window.location.hash = $(this).attr('href');
        });

        // fire links with targets on different window
        $('#nav a[target="_blank"]').click(function (e) {
            e.preventDefault();
            window.open($(this).attr('href'));
        });

        // all links with hash tags are ignored
        $('#nav a[href="#"]').click(function (e) {
            e.preventDefault();
            if ($(this).parents('.menu-min').length == 0) {
                $(this).parent().find('.submenu').slideToggle();
            }
        });
        
        // DO on hash change
	    $(window).on('hashchange', function () {
	        vmApp.checkURL();
	    });
	    
	    $('#nav a[href!="#"]').click(function (e) {
            e.preventDefault();
            window.location.hash = $(this).attr('href');
            $('#nav').find('.active').removeClass('active');
            $(this).parent().addClass('active');
            $(this).closest('.open').addClass('active');
        });
    },
    checkURL: function () {
    	var url = location.hash.replace(/^#/, '');
        url = url.replace(/^\//, '');

        if (!url) {
        	url = "home";
        }

        var urls = url.split('?');
        var parameter = null;
        if (urls.length > 1){
        	parameter = urls[1];
        }
        /*
    	$.ajax({
            type: "POST",
            url: '/modules/openPath',
            data: {'path' : url},
            dataType: 'html',
            async: false,
            cache: false, // (warning: this will cause a timestamp and will call the request twice)
            beforeSend: function () {
            	$('#page-content').html('<h1><i class="fa fa-cog fa-spin"></i> Loading...</h1>');
            },
            success: function (data) {
            	$('#page-content').css({
                    opacity: '0.0'
                }).html(data).delay(100)
    	            .animate({opacity: '1.0'}, 300);
            },
            error: function (xhr, ajaxOptions, thrownError) {
            	$('#page-content').html(
                    '<h4 style="margin-top:10px; display:block; text-align:left"><i class="fa fa-warning txt-color-orangeDark"></i> Error 404! Page not found.</h4>'
                );
            }
        });
        */
        $.get('/manager/' + url + '.html', function (data) {
        	$('#page-content').css({
                opacity: '0.0'
            }).html(data).delay(100)
	            .animate({opacity: '1.0'}, 300);
        	
        	//重置全选事件
        	$('thead').find('.radio-img').on('click', function (){
        		if ($(this).hasClass('checked')){  
        			$(this).closest('table').find('.radio-img').removeClass('checked');   			
        		}else {
        			$(this).closest('table').find('.radio-img').addClass('checked'); 
        		}
        	});

        });
    }
};
$(function (){
	vmApp.init();
});