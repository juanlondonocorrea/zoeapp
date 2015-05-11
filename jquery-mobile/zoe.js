	//load header, footer and menu
		$(document).bind("pageinit", function(event) {
			$('.app-header').load("header.html", function() {
				$(this).trigger('create');
			});
			$('.app-footer').load("footer.html", function() {
				$(this).trigger('create');
			});
			$('.app-menu').load("menu.html", function() {
				$(this).trigger('create');
			});
			if (typeof(localpageinit) == "function"){
				try{
					localpageinit();
				}catch(err){
					alert(err.message);
				}
			}
		});
