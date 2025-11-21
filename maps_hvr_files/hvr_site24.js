/* temp data in hvr_data.js */
var site_url = "";
var isMcc = false;

/* Global Vars */
var debug = false;
var debug_prod = false;
var debug_checked = false;
var searchInit = 'הקלד מילות חיפוש';
var urlParams = {};
var searchVal = '';
/* var org_id  setup in top */
var userfullname = '';
var d = new Date();
window.MyNamespace = window.MyNamespace || {};
var startLogout;
MyNamespace.logout = function ()
{
	clearInterval(startLogout);
	document.cookie = 'topNav=; path=/';
	var dest = readCookie('logout');
	if (dest == '' || dest == null) {
		dest = '/site/logout';
	}
	window.location.href = dest;
}

function filterFormInput(form) {
	
	if(debug_prod)
		console.log('site: processing FormInput');
	
	if (form) {
		$(form).find('input').each(function(){
			if ($(this).val()) {
				var tmpVal = $(this).val();
				tmpVal = tmpVal.replace(/\u202a/g, '');
				tmpVal = tmpVal.replace(/\u202b/g, '');
				tmpVal = tmpVal.replace(/\u202c/g, '');
				tmpVal = tmpVal.replace(/\u202d/g, '');
				tmpVal = tmpVal.replace(/\u202e/g, '');
				tmpVal = tmpVal.replace(/\u2070/g, '');
				//console.log($(this).attr('name') + ':' + tmpVal);
				$(this).val(tmpVal);
			}
		});
		
		$(form).find('textarea').each(function(){
			if ($(this).val()) {
				var tmpVal = $(this).val();
				tmpVal = tmpVal.replace(/\u202a/g, '');
				tmpVal = tmpVal.replace(/\u202b/g, '');
				tmpVal = tmpVal.replace(/\u202c/g, '');
				tmpVal = tmpVal.replace(/\u202d/g, '');
				tmpVal = tmpVal.replace(/\u202e/g, '');
				tmpVal = tmpVal.replace(/\u2070/g, '');
				$(this).val(tmpVal);
			}
		});
		
	}
	
}


function altAlert() {
	window.alert = function(msg, cb) {
        $("#myModal .btn-primary").hide(); // Hide the primary button for simple alerts
        $("#myModal .modal-body").text(msg); // Set the alert message
        $("#myModal").modal('show'); // Show the modal

        // Ensure no previous event bindings
        $("#myModal").off('hide.bs.modal'); 

        // Bind the callback to the modal close event
        $("#myModal").on('hide.bs.modal', function() {
            if (typeof cb === 'function') {
                cb(); // Execute the callback regardless of how it's closed
            }
        });
    };
	
	
	window.confirm = function(msg, cb) {
		// Replace newlines with <br> tags for better readability
		$("#myModal .modal-body").html(msg.replace(/\n/g, "<br />"));
		$('#myModal').modal('show');

		// Clean up all previously bound events on the buttons and modal
		$("#myModal .btn-primary").off('click');
		$("#myModal .btn-secondary").off('click');
		$("#myModal").off('hide.bs.modal');

		// Show the primary button for confirm dialogs
		$("#myModal .btn-primary").show();

		let buttonTriggered = false; // Track which button was clicked

		// Bind events to buttons
		$("#myModal .btn-secondary").on('click', function() {
			buttonTriggered = true; // Mark that 'Cancel' was clicked
			$('#myModal').modal('hide'); // Close the modal
			if (typeof cb === 'function') {
				cb(false); // Callback with false for 'Cancel'
			}
		});

		$("#myModal .btn-primary").on('click', function() {
			buttonTriggered = true; // Mark that 'OK' was clicked
			$('#myModal').modal('hide'); // Close the modal
			if (typeof cb === 'function') {
				cb(true); // Callback with true for 'OK'
			}
		});

		// Handle modal close event
		$("#myModal").on('hide.bs.modal', function() {
			if (!buttonTriggered && typeof cb === 'function') {
				// If no button was clicked, execute callback with default false
				cb(false);
			}
		});
	};
	
}


/* READY Start */
$(function () {
	
	if (window.location.href.indexOf('www.mcc.co.il') != -1)
		site_url = "https://www.mcc.co.il/";
	
	if (window.location.href.indexOf('www.hvr.co.il') != -1) {
		site_url = "https://www.hvr.co.il/";
		isMcc = false;
	}
	
	if (window.location.href.indexOf('bs.hvr.co.il') != -1) {
		site_url = "https://bs.hvr.co.il/";
		isMcc = false;
	}
	
	if (window.location.href.indexOf('bs.mcc.co.il') != -1)
		site_url = "https://bs.mcc.co.il/";
	
	if (debug_prod)
		console.log('site_url:' + site_url);
	
	/* forms should handle submit */
	$('form').on('keyup keypress', function(e) {
	  var keyCode = e.keyCode || e.which;
	  if (keyCode === 13) { 
		e.preventDefault();
		return false;
	  }
	});
	
	/*
	if (debug)
		console.log('url_base:' + url_base());
	*/
	
	home_page();
	
	if (!isMcc)
		altAlert();
	
	var cur_location =  $(location).attr('href');
	if (cur_location.indexOf('home') != -1) {
		createCookie('amenu',0);
	}

	checkActiveMenu();

	/* fix images on mcc_items and html text */
	$('img').each(function(){
		var curSrc = $(this).attr('src');
		if (typeof curSrc != 'undefined') {
			if (curSrc.substring(0, 3) == 'pic') {
				curSrc = '/' + curSrc;
				$(this).attr('src',curSrc);
				$(this).addClass('img-fluid');
			}
		}
		
	});

	/* switch between bars and search on mobile menu */
	$('#mainNavResponsive').on('show.bs.collapse', function () {
		$('#search-bar-sm').collapse('hide');
	});
	
	$('#search-bar-sm').on('show.bs.collapse', function () {
	  $('#mainNavResponsive').collapse('hide');
	})
	
	/* jump to login after 30 min of no action */
	//startLogout = setInterval(MyNamespace.logout, 1800000);

	/* fix old browsers with no console */
	if (typeof console == "undefined") {
        window.console = {
            log: function() {}
        };
    }
		
	/* cookies */
	var uname = unescape(readCookie("userfullname"));
	//if (uname === undefined || uname === null || uname === 'null') {
	//	window.location.href = '/site/logout';
	//}
	
	$('#init_code').text(readCookie("init_code"));
	$('#userfullname').text(uname);
	$('.userfullname').text(uname);
	
	/* lightbox support */
    $(document).on('click', '[data-toggle="lightbox"]', function(e) {
		e.preventDefault();
		
		var d = $(this).attr('data-days');
		if (d == '') d = 1; /* default 1 day */
		var img_token = MD5($(this).attr('data-img'));
		var url_token = MD5(window.location.pathname + readCookie('userfullname') + img_token);
		
		if (debug)
			console.log('lightbox - days:' + d + ' token:' + img_token + ' path token:' + url_token);
		
		var lb_cookie = readCookie(url_token);
		if (lb_cookie == null) {
			if (debug)
				console.log('no lightbox cookie!');
			createCookie(url_token, img_token, d);
			$(this).ekkoLightbox();
		} 
    });
	
	
	
	$('.basicAutoComplete').autoComplete({
		autoSelect: false,
		minLength: 3,
		resolver: 'custom',
        events: {
            search: function (qry, callback) {
                $.ajax(
                    '/site/search', {
                        data: {
							'ac': '1',
							'N': '20',
							'word': qry
                        }
                    }
                ).done(function (res) {
					//console.log('res:'+res);
					var json = JSON.parse(res);
					var jsonRes = json.benefits_package_list;
					
					if (jsonRes.length === 0) {
						//console.log('no results:' + qry);
						/* logger */
						var json = {"search": qry , "status":"1" };
						var url='/logger.aspx';
						$.ajax({
							url: url,
							type: 'POST',
							data: json,
							cache: false // Appends _={timestamp} to the request query string
						});
						/* logger end */
					}
					
					//console.log('jsonRes.length:',jsonRes.length);
					jsonRes.forEach(function (arrayItem) {
						arrayItem.text = arrayItem.title;
						arrayItem.value = arrayItem.id;
					})
					
					if (json.paging_ind === 1 || jsonRes.length > 10) {
						var moreJson = {
							href: "submitSearch",
							id: 0,
							text: "<b class='f-08'>הצג את הרשימה המלאה...</b>",
							title: "<b class='f-08'>הצג את הרשימה המלאה...</b>",
							value: 0
						}
						jsonRes.push(moreJson);
					}
					
					if (json.suggestions && json.suggestions.length > 0) {
						var PreSugJson = {
							href: 'noSearch',
							id: -98,
							text: "<span class='sug-text' onfocus='alert(1)'>לא נמצא, אולי התכוונת ל:</span>",
							title: "<span class='sug-text' onfocus='alert(1)'>לא נמצא, אולי התכוונת ל:</span>",
							value: -98
						}
						jsonRes.push(PreSugJson);
						var jsonSug = json.suggestions;
						jsonSug.forEach(function (sug) {
							var moreJson = {
								href: sug,
								id: -99,
								text: sug,
								title: sug,
								value: -99
							}
							jsonRes.push(moreJson);
						})
						//console.log('suggestions:',json.suggestions);
					}
					
					callback(jsonRes);
					
					$('.sug-text').parent().addClass('disabled');
					
                });
            }
        },
		resolverSettings: {
		       requestThrottling: 300,
		}
    });
	
	
	
	$('.basicAutoComplete').on('autocomplete.select', function(evt, item) 
	{	
		
		// user selected from the list!!!
		evt.stopPropagation();
		
		var dest_href = item.href;
		var dest_value = item.value;
		
		/*
		console.log('dest_href:',dest_href);
		console.log('dest_value:',dest_value);
		console.log('seach val:',$('.input-search').val());
		console.log('searchVal:',searchVal);
		*/
		
		
		if (dest_href == "submitSearch") {
			preSubmitSearch();
			return;			
		} else if (dest_href == "noSearch") {
			//console.log('no search!');
			$('.input-search').val('').focus();
			return;
		} else {
			
			dest_href = 'page:' + dest_href.replace('#id#', dest_value);
		}
		
		if (debug)
		{	
			console.log('autocomplete.select 2----------------------------------------------');
			console.log('eventsAutoComplete autocomplete.select');
			console.log(evt);
			console.log(item);
			console.log(item.value);
			console.log('goto: ' + dest_href);	
		}

		
		/* logger */
		var json = {"search": $('.input-search').val() , "status":"0" };
		var url='/logger.aspx';
		$.ajax({
			url: url,
			type: 'POST',
			data: json,
			cache: false // Appends _={timestamp} to the request query string
		});
		/* logger end */
		
		
		handleHref(dest_href);
		
		//fn_search(null, item.value);
	});	
	
	$(".basicAutoComplete").keyup(function (e) {
		if ($('#searchWord').val().length !== 0)
			searchVal = $('#searchWord').val();
			
		if ($('#searchWord_sm').val().length !== 0)
			searchVal = $('#searchWord_sm').val();
	});
	
	$(".basicAutoComplete").bind("paste", function(e){
		// access the clipboard using the api
		var pastedData = e.originalEvent.clipboardData.getData('text');
		$('#searchWord').val(pastedData);
		searchVal = $('#searchWord').val();
		 
	} );
	
	$(".basicAutoComplete").keydown(function (e) {
		
		
		setTimeout(function() {
			sugOpt = $('.bootstrap-autocomplete').find('a span').parent().attr('class');
			isSugSelected = sugOpt? sugOpt.indexOf('active') !== -1 ? true: false :false;
			if (isSugSelected) {
					$('.bootstrap-autocomplete').find('a span.sug-text').parent().parent().children().eq(0).removeClass('active');
					$('.bootstrap-autocomplete').find('a span.sug-text').parent().parent().children().eq(1).addClass('active');
				} 
		},150);
		
		/* return key on active menu is already triggered */
		if ($('.bootstrap-autocomplete .dropdown-item.active').index() != -1)
			return;
		
		/* return key */
	   if (e.keyCode === 13) {
			e.preventDefault();
			submitSearch();
	   }
	});
	
		
	
	/* auto complete 
	$('.basicAutoComplete').autoComplete({
		minLength: 2,
		resolverSettings: {
		       requestThrottling: 300
		},
		change: function (event, ui) { console.log('change'); }
    });
	
	$('.basicAutoComplete').on('autocomplete.select', function(evt, item) 
	{	// search by ID - user selected from the list!!!
		evt.stopPropagation();
		if (debug)
		{	
			console.log(evt);
			console.log(item);
			console.log(item.value);
			console.log('eventsAutoComplete autocomplete.select');
		}
		fn_search(null, item.value);
	});	
	
	$(".basicAutoComplete").keydown(function (e) {
		
	
	   if (e.keyCode === 13) {
			e.preventDefault();
			submitSearch();
	   }
	});
	
	
	$('.basicAutoComplete').on('autocomplete.freevalue', function(evt, item) 
	{	// search by WORDS - user typed word or words and pressed enter. did not select from the list!
		evt.stopPropagation();
		if (debug)
		{	
			console.log(evt);
			console.log(item);
			console.log(item.value);
			console.log('eventsAutoComplete autocomplete.freevalue');
		}
		
		//if(typeof(item.value) === 'undefined') return;
		
		fn_search(null, item.value);
	});	
	*/
	
    $('[data-toggle="popover"]').popover();
    $('[data-toggle="tooltip"]').tooltip();

    $('[data-spy="scroll"]').each(function () {
    var $spy = $(this).scrollspy('refresh')
    })

    $('.dropdown').on('show.bs.dropdown', function () {
		$(this).find('.dropdown-menu').first().stop(true, true).slideDown();
    });

    // Add slideUp animation to Bootstrap dropdown when collapsing.
    $('.dropdown').on('hide.bs.dropdown', function () {
		$(this).find('.dropdown-menu').first().stop(true, true).slideUp();
    });

    // Collapse Navbar
    var navbarCollapse = function() {
		if (typeof $("#mainNav").offset() != 'undefined') {
			if ($("#mainNav").offset().top > 150) {
				$("#mainNav").addClass("navbar-shrink");
			} else {
				$("#mainNav").removeClass("navbar-shrink");
			}
		}
    };
    // Collapse now if page is not at top
    navbarCollapse();
    // Collapse the navbar when page is scrolled
    $(window).scroll(navbarCollapse);
    
	$('.dropdown-item').on('click', function(){
		var $navbarnav = $(this).parent().parent().parent();
		if ($navbarnav) {
			if ($navbarnav.hasClass('navbar-nav')) {
				$navbarnav.parent().collapse('hide');
			}
		 	
		}
	});
	
    $('.carousel-item img').click(function () {
		if (debug)
			console.log('----- click on carousel ------');
		
		const src = $(this).attr('src');
		let ext = "1";
		
		$( ".carousel-item img" ).each(function( index ) {
		  if ($(this).attr('src') == src) 
			  ext = index+1;
		});
		
		/* logger */
		var json = ''
		var url='/logger.aspx' + '?tp=carousel&ext=' + ext + '&object_url='+ $(this).parent().attr('data-href') + '&_=' + Date.now();
		if (debug)
			console.log(url);
		$.ajax({
			url: url,
			type: 'POST',
			data: json,
			cache: false // Appends _={timestamp} to the request query string
		});
		/* logger end */	
		
		var dest = $(this).parent().attr('data-href');
		handleHref(dest);
    });

    $('.full-year').text(d.getFullYear());

	
	window.onscroll = function(e) {
		
		if (this.oldScroll > this.scrollY) {
			// scroll up
			$('#back-to-top').fadeOut();
		} else {
			// scroll down
			if (this.scrollY > 50)
				$('#back-to-top').fadeIn();
		}
		this.oldScroll = this.scrollY;
	}
	
    $('#back-to-top').click(function () {
    $('#back-to-top').tooltip('hide');
    $('body,html').animate({
        scrollTop: 0
    }, 800);
    return false;
    });

    try {
		
		// Remove hidden items before initializing Owl Carousel
        $('.owl-carousel .hidden-item').remove();
		
		if (typeof center_owl === 'function') {
			center_owl();
			center_owl_sm();
		}
		
		$('.owl-carousel .item img').each(function() {
			if ($(this).attr('data-src')) {
				if ($(this).attr('data-src').substr(-1) != '/') {
					$(this).attr('src', $(this).attr('data-src'));
				}
			}
		});
		
		picCount = $('.owl-carousel-pics  .item').length;
		
		if (picCount > 1) {
			
			let owl = $('.owl-carousel').owlCarousel({
				rtl:true,
				loop:true,
				margin:0,
				nav:false,
				center: true,
				items: 1,
				autoplay: true,
				autoplayTimeout:7000,
				autoplayHoverPause:true
			});
			
			$('.product-owl .item').click(function(){
				var curImg = $(this).find('img').attr('src');
				$('.product-image img').attr('src', curImg);
			});
			
			  
			$('.owl-carousel').on('changed.owl.carousel', function(event) {
            // Stop all YouTube videos when the slide changes
				$('.owl-carousel .item iframe').each(function() {
					this.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
				});
			});
			
			// Handle autoplay when video is playing
			$('.owl-carousel').on('translate.owl.carousel', function (event) {
				const currentItem = $(this)
					.find('.owl-item')
					.eq(event.item.index)
					.find('iframe');

				// If the current slide contains an iframe (video), pause autoplay
				if (currentItem.length > 0) {
					owl.trigger('stop.owl.autoplay');
				} else {
					owl.trigger('play.owl.autoplay', [7000]);
				}
			});
			
		} else {
			$('.owl-carousel .item img').hide();
		}
		
    }  catch(e) {
		if (debug_checked)
			console.log(e);
	}
    
		
	if (typeof $('.sidebar-section').html() != 'undefined') {
		if ($('.sidebar-section').html().length < 100) {
			/* no sidebar */
			$('.sidebar-section').hide();
			$('.content-section').removeClass('col-lg-9');
		}
	}


    if (typeof $('.carousel-section').html() != 'undefined') {
        if ($('.carousel-section').html().length < 100) {
            /* no carousel */
            $('.carousel-section').hide();
        }
	}
    

/* Form Objects */
	
	
	$(".numbers-only").keydown(function (e) {
		// Allow: backspace, delete, tab, escape, enter 
		if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
			// Allow: Ctrl+A
			(e.keyCode == 65 && e.ctrlKey === true) ||
			// Allow: Ctrl+C
			(e.keyCode == 67 && e.ctrlKey === true) ||
			// Allow: Ctrl+V
			(e.keyCode == 86 && e.ctrlKey === true) ||
			// Allow: Ctrl+X
			(e.keyCode == 88 && e.ctrlKey === true) ||
			// Allow: home, end, left, right
			(e.keyCode >= 35 && e.keyCode <= 39)) {
			// let it happen, don't do anything
			return;
		}
		// Ensure that it is a number and stop the keypress
		if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
			e.preventDefault();
		}
	});
	
	//real numbers including dot
	$(".real-numbers-only").keydown(function (e) {
		// Allow: backspace, delete, tab, escape, enter and .
		if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
			// Allow: Ctrl+A
			(e.keyCode == 65 && e.ctrlKey === true) ||
			// Allow: Ctrl+C
			(e.keyCode == 67 && e.ctrlKey === true) ||
			// Allow: Ctrl+X
			(e.keyCode == 88 && e.ctrlKey === true) ||
			// Allow: home, end, left, right
			(e.keyCode >= 35 && e.keyCode <= 39)) {
			// let it happen, don't do anything
			return;
		}
		// Ensure that it is a number and stop the keypress
		if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
			e.preventDefault();
		}
	});
	
	$(".none-only").keydown(function (e) {
		/* usually for datepicker */
	   if (e.keyCode != 9)
            e.preventDefault();
    });
	
	 $('.datepicker').datepicker({
        format: 'dd-mm-yyyy',
        changeYear: true,
        changeMonth: true,
        yearRange: "-100:+2", // last hundred years
        todayBtn: "linked",
        language: "he",
        autoclose: true,
		orientation: "top",
        beforeShow: function (i) { if ($(i).attr('readonly')) { return false; } }
    });
	
	$('.datepicker-today').datepicker({
        format: 'dd-mm-yyyy',
        changeYear: true,
        changeMonth: true,
        yearRange: "-100:+2", // last hundred years
        todayBtn: "linked",
        language: "he",
		startDate: new Date(),
        autoclose: true,
		orientation: "top",
        beforeShow: function (i) { if ($(i).attr('readonly')) { return false; } }
    });
	

/* Objects */

	$('.box').click(function(){
		if (debug)
			console.log('----- click on box ------');
		
		var dest = $(this).attr('data-href');
		
		if (dest == ""){
			dest = 'page:' + $(this).attr('data-tmpl') + ',' + $(this).attr('data-item_id');
		}
		//console.log(dest)
		//console.log(escape(dest));
		/* logger */
		var log_data = {};
		log_data.data = $(this).attr('data-object_id');
		log_data.object_url = $(this).attr('data-tmpl') + ',' + $(this).attr('data-item_id');
		var json = '';
		var url = '/logger.aspx?data=' + log_data.data + '&object_url=' + log_data.object_url + '&_=' + Date.now();
		if (debug)
			console.log(url);
		$.ajax({
			url: url,
			type: 'POST',
			data: json,
			cache: false // Appends _={timestamp} to the request query string
		});
		/* logger end */
		
		if (dest != "") {
			handleHref(dest);
		}
		
	});

	$('.card-box-footer').each(function(){
		if ($(this).find('.card-box-footer-title').text().length != 0 || $(this).find('.card-box-footer-text').text().length != 0) {
			$(this).removeClass('hide-me');
		}
		
	});


	// init feed object
    Feed.init({ client: "HV" }); // select server.       IC - icmega / TV - tov / HV - hvr / PL - police
    Feed.join("counter", {
      name: window.location.pathname + window.location.search.toString()
    }); // message kind, key to listen to, recv handler ( key is the product_id )

	/* fix images in product desc*/
	$('.product-desc img').each(function(){
		$(this).addClass('img-fluid');
	});


	/* ic-access  */
	$.cachedScript("/orders/ictools/js/grayscale.js")
        .done(function(script, textStatus) {
            $.cachedScript("/orders/ictools/icaccess_bs_v03.js?v=1")
                .done(function(script, textStatus) {
                    //console.log( textStatus );
                    CreateAccessabilityContainer("mcc_item,167554");
                })
                .fail(function(jqxhr, settings, exception) {
                    console.log("error:"+exception);
                });
        })
        .fail(function(jqxhr, settings, exception) {
            console.log("error:"+exception);
        });
	
	
	/* sidebar object */
	var accordIndex = 100;
	$('.sidebar-accordion').each(function(index ){
		
		accordIndex += index;
		
		
		
		var objHTML =  '<div class="accordion" id="accordionExample' + index +'"><div class="card">';
		
		var check = $(this).attr('data-json');
		var data =  jQuery.parseJSON($(this).attr('data-json'));
		var bodyHTML = '';
		
		//console.log(data);
		var isOpen = "";
		var content = '';
		var isStillBody = 0;
		var localIndex = 0;
		$.each( data.obj, function( key, value ) {
			
			if (value.isHeader == "11") {
				
				if (isStillBody > 0 ) {
					if (isStillBody == 1)
						objHTML += '<div id="collapseOne' + accordIndex + '_' + localIndex + '" class="collapse ' + isOpen + '" aria-labelledby="headingOne" data-parent="#accordionExample' + index + '"><div class="card-body">' + bodyHTML + '</div></div>';
					else 
						objHTML += '<div><div class="card-body">' + bodyHTML + '</div></div>';
					isStillBody = 0;
					isOpen = '';
				}
				
				localIndex ++;
				bodyHTML = "";
				var textcolor = "text-light";
				if (value.icon == "2") textcolor = "text-dark";
				var color = value.color;
				if (color == "") color = '#240772';
				
				objHTML += '<div class="card-header p-1" style="background-color:' + color + ';"><div class="mb-0 p-1"><div class="' + textcolor + ' font-weight-bold" style="padding: .375rem .75rem;">' + value.text + '</div></div></div>';
			}
			else if (value.isHeader == "1") {
				
				if (isStillBody > 0 ) {
					if (isStillBody == 1)
						objHTML += '<div id="collapseOne' + accordIndex + '_' + localIndex + '" class="collapse ' + isOpen + '" aria-labelledby="headingOne" data-parent="#accordionExample' + index + '"><div class="card-body">' + bodyHTML + '</div></div>';
					else 
						objHTML += '<div><div class="card-body">' + bodyHTML + '</div></div>';
					isStillBody = 0;
					isOpen = '';
				}
				
				localIndex ++;
				bodyHTML = "";
				if (value.isOpen == "1") isOpen = "show";
				var textcolor = "text-light";
				if (value.icon == "2") textcolor = "text-dark";
				var color = value.color;
				if (color == "") color = '#240772';
				objHTML += '<div class="card-header p-1" style="background-color:' + color + ';"><h2 class="mb-0"><button class="btn btn-link btn-collapse text-right cur-pointer ' + textcolor + '" type="button" data-toggle="collapse" data-target="#collapseOne' + accordIndex + '_' + localIndex + '" aria-expanded="true" aria-controls="collapseOne"><span class="fa-collapse f-08"><i class="fas fa-plus"></i>&nbsp;&nbsp;</span>' + value.text + '</button></h2></div>';
			} 
			else if (value.isHeader == "22") {
				
				content = ''
				
				if (value.icon.indexOf('.') != -1)
					content = '<img src="/pics/site_home/' + value.icon + '" class="img-fluid" />';
				else
					content = unescape(value.html);
					
				if (isStillBody) 
					bodyHTML += content;
				else 
					bodyHTML = content;
				
				isStillBody = 2;
			}
			else {
				
				content = ''
				
				if (value.icon.indexOf('.') != -1)
					content = '<img src="/pics/site_home/' + value.icon + '" class="img-fluid" />';
				else
					content = unescape(value.html);
					
				if (isStillBody) 
					bodyHTML += content;
				else 
					bodyHTML = content;
				
				isStillBody = 1;
			}
		});
		
		
		if (isStillBody > 0 ) {
			if (isStillBody == 1)
				objHTML += '<div id="collapseOne' + accordIndex + '_' + localIndex + '" class="collapse ' + isOpen + '" aria-labelledby="headingOne" data-parent="#accordionExample' + index + '"><div class="card-body">' + bodyHTML + '</div></div>';
			else 
				objHTML += '<div><div class="card-body">' + bodyHTML + '</div></div>';
			isStillBody = 0;
			isOpen = '';
		}
		
		objHTML += '</div></div>';
		
		// if (debug)
			// console.log(objHTML);
	
		$(this).html(objHTML);
		
	});
	
	// Add minus icon for collapse element which is open by default
	$(".collapse.show").each(function(){
		$(this).prev(".card-header").find(".fa-collapse").html('<i class="fas fa-minus"></i> ');
	});
	
	// Toggle plus minus icon on show hide of collapse element
	$(".collapse").on('show.bs.collapse', function(){
		$(this).prev(".card-header").find(".fa-collapse").html('<i class="fas fa-minus"></i> ');
	}).on('hide.bs.collapse', function(){
		$(this).prev(".card-header").find(".fa-collapse").html('<i class="fas fa-plus"></i> ');
	});
	
	
	/* run def page script */
	if (window.initDone) initDone();


	/* run the lightbox if exists */
	$('.pl-lightbox:first').click();


}); /* READY End */


/* ONLOAD this will fire after the entire page is loaded, including images */
window.onload = function() {

	if(debug)
		console.log('window onload');
		
	//refresh pdf iframe
	$('#pdfviewer').attr( 'src', function ( i, val ) { return val; });
	
	var target = window.location.hash;
	//window.location.hash = "";
		
	if (target.indexOf('scroll-') != -1) {
			target = '#' + target.split('-')[1];
			$(target).scrollView(50);
		}
	
	
	if (target !== "" && target !== "#!")
		$(target).scrollView(50);
	
	// inside page hash (menu items) 
	
	$('a').click(function(e) {

		if (debug) {
			console.log('clicked on A link');
			console.log('a classes:', $(this).attr('class'));
		}
		
		if ($(this).hasClass('pl-lightbox')) 
			return;

		if ($(this).hasClass('local-href')) {
			
			var dest = $(this).attr('data-href');
			if (dest.indexOf('email:') !== -1 || dest.indexOf('tel:') !== -1 ) 
				return;
			e.preventDefault();
			e.stopPropagation();
			handleHref(dest);
			return;
		}
		
		if ($(this).hasClass('nav-link')) {
			if ($(this).parent().hasClass('nav-item')) {
				$('.nav-item').removeClass('active');
				$(this).parent().addClass('active');
				var i;
				var baseClass = 'nav-item-h';
				var	checkClass;
				for (i = 1; i < 20; i++) {
					checkClass = baseClass + i;
					if ($(this).parent().hasClass(checkClass)) {
						createCookie('amenu',i);
					}
				}
			}
		}
		
		var dest = $(this).attr('href');
		
		if (dest.indexOf('email:') !== -1 || dest.indexOf('tel:') !== -1 ) 
				return;
		
		if ($(this).hasClass('rem-href')) {
			dest = $(this).attr('data-href');
		}
		
		if (dest.indexOf('scroll-') == -1 && dest.indexOf('#') !== -1) return; /* dropdown menu */		
		if (!dest) return; /* tab clicks */
		
		if (dest.indexOf('javascript:') != -1)
			return;
		
		var dest_page = dest.split('/')[dest.split('/').length - 1];
		if (dest_page.indexOf('#') != -1)
			dest_page = dest_page.substring(0,dest_page.indexOf('#'));
		
		var loc_page = window.location.href;
		loc_page = loc_page.split('/')[loc_page.split('/').length - 1];
		if (loc_page.indexOf('#') != -1)
			loc_page = loc_page.substring(0,loc_page.indexOf('#'));
		
		if (debug)
			console.log('dest is:' + dest);
		
		if (typeof dest != "undefined") {
			
			/* scroll to current page */
			if (dest.indexOf('scroll-') != -1) {
				window.location.hash = dest.split('-')[1];
				gotoTop();
				if (dest_page == loc_page)
					location.reload();
			}
			
			/* mail to email address */
			if (dest.indexOf('mailto') != -1)
				return;
			
			if (dest == 'javascript:void(0);')
				return;
			
			/* handle destination */
			e.preventDefault();
			e.stopPropagation();
			handleHref(dest);
		}
		
	});
	
	
};


$.fn.scrollView = function (extra, speed) {
	
	speed = typeof speed !== 'undefined' ? speed : 1000;
	extra = typeof extra !== 'undefined' ? extra : 0;
	if (debug)
		console.log('scroll to:' + $(this));
	return this.each(function () {
		$('html, body').animate({
            scrollTop: $(this).offset().top - extra
        }, speed);
    });
}

function gotoTop() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function updateModalImage() {
	$('#ModalIMG').modal('show');
	var img = $('#owlImgSelected').attr('src');
	$('#imgModal').attr('src',img);
	
}


function handleHref(str) {
	
	if (debug)
		console.log('handleHref:' + str);
	
	/* special cases */
	
	if (!str)
		return;
	
	if (str.substring(0, 1) == "#")
		return;
	/*
	if (str.indexOf('autoComplete=') == -1 && str.indexOf('search.aspx') == -1) {
		//only if not search turn to lower case 
		str = str.toLowerCase();
	}
	*/
	if (str.toLowerCase().indexOf('search.aspx') != -1) {
		if (str.indexOf('=') != -1) {
			var searchStr = str.substring(str.indexOf('=')+1);
			str = "search:" + searchStr;
		}
	}
	
	
	if (str.indexOf('autoComplete=') != -1 || str.indexOf('autocomplete=') != -1) {
		/* shortcut to search.aspx */
		console.log('short cut');
		str = str.replace('autoComplete=','search.aspx?searchWord=');
		str = str.replace('autocomplete=','search.aspx?searchWord=');
	}
	
	if (str.indexOf('url:/') != -1) {
		/* url:/ is special for app to signal open in webview */
		str = str.replace("url:/","page:");
	}
	
	/* end of special app cases */
	
	if (str.indexOf('home_page.aspx?page=') != -1) {
		/* home_page.aspx = normal page in site */
		if(debug)
			console.log('str - has home_page.aspx?page= | ' + str);
		var str_array = str.split('?page=');
		str = 'page:' + str_array[1];
	} 
	else if (str.indexOf('http') != -1 && str.indexOf('url:') == -1 ) {
		if(debug)
			console.log('str - has http but no url: ' + str);
		str = 'url:' + str;
		
	} 
	else if (str.indexOf('http') == -1 && str.indexOf(':') == -1 ) {
		if(debug)
			console.log('str - no http no : |' + str);
		str = 'url:' + str;
	} 

	if (debug)
		console.log('str - has : |' + str);
	
	
	if (str.indexOf('url:') != -1 && str.indexOf('http') == -1 && str.indexOf('aspx') == -1 && str.indexOf('.html') == -1) {
		if(debug)
			console.log('str - has url: no http no aspx no .html |' + str);
		str = str.replace("url:","page:");
	}
	
	var str_array = str.split(':');
	var dest_type = str_array[0];
	var dest_replace = dest_type + ':';
	var dest = str.replace(dest_replace,'');
	
	if (dest_type == 'scroll') {
			if (debug)
				console.log('scroll to:' + str_array[1]);
			target = '#' + str_array[1];
			$(target).scrollView(50);
		} 
	
	
	if(dest_type == 'search') {
		$('#searchWord').val(dest);
		submitSearch();
		return;
	}
	
	if (dest_type == 'page') {
		if (debug)
			console.log('goto page: ' + dest);
		if (str.indexOf('site/pg') == -1 && 
			str.indexOf('site/logout') == -1 && 
			str.indexOf('.pdf') == -1 && 
			str.indexOf('site/search') == -1) {
			if (debug)
				console.log('going to: ' + '/site/pg/' + dest);
			window.location.href = '/site/pg/' + dest;
			}
		else {
			if (dest.substring(0, 5) == 'site/') dest = '/' + dest;
			if (debug)
				console.log('going to: ' + dest);
			window.location.href = dest;
		}
		
		/*
		if (str.indexOf('/site/pg') == -1 && str.indexOf('/site/logout') == -1 && str.indexOf('.pdf') == -1) {
			//console.log('debug - 1:' + dest);
			window.location.href = '/site/pg/' + dest;
		}
		else  {
			//console.log('debug - 2');
			window.location.href = dest;
			
		}
		*/
		
	} 
	else if (dest_type == 'url') {
		if (debug)
			console.log('goto url:' + dest);
		
		if (((dest.indexOf('.aspx') != -1 || dest.indexOf('.html') != -1) && dest.indexOf('http') == -1) ||	dest.indexOf('urlCall.aspx') != -1)
			{
			/*.aspx or .html in our site */
			if (debug)
				console.log('aspx or html dest:' + dest);
			if (dest.indexOf('staticpage.aspx') != -1) {
				/* if static page check if has _bs */
				var check = dest.toLowerCase();
				if (check.indexOf('_bs') == -1) {
					var fix = check.split('.');
					dest = fix[0] + '.' + fix[1] + '_bs.' + fix[2];
				}
			}
			
			dest = dest.replace('/manage/','');
			dest = dest.replace('/orders/orders/','/orders/');
			if (dest.substring(0,1) == '/')
				dest = site_url + dest.substring(1);
			else 
				dest = site_url + dest;
				
			if (debug)
				console.log('goto href:' + dest);
				
					
			if (dest.indexOf('urlCall.aspx') != -1) {
				out(dest,true);
			}	else {
				window.location.href = dest;
			}
		}
		else {
			if (debug)
				console.log('out of site dest:' + dest);
			var url = dest.split(',');
			
			if (url.length > 1)  {
				if (url[1] === '_blank')
					out (url[0],true);
			}
			else
				out (url[0]);
		}
	}
}



function out(url, isBlank) {
	if (debug)
		console.log('go out:' + url + ' is blank:' + isBlank);
	
	isBlank = typeof isBlank !== 'undefined' ? isBlank : false;
	
	  if (url) {
		if (url.indexOf("http") == -1) url = "http://" + url;
	  } else {
		return false;
	  }
	
	if (!isMcc) {
		confirm("אתה יוצא מאתר חבר. \r\nמאשר?", function(result){
			if (result) {
				if (isBlank)
					window.open(url,'_blank');
				else
					window.open(url);
				return true;
			}
			else {
				return false;
			}
		});
	} else {
	  if (confirm("אתה יוצא מאתר חבר. \r\nמאשר?")) {
		if (isBlank)
			window.open(url, new Date());
			//window.open(url,'_blank');
		else
			window.open(url, new Date());
	  } else {
		return false;
	  }
	}
  
  
}


function fixPage(page) {
	var fixed_page = '';
	var sep_pars = page.split('&');
	for (i=0;i<sep_pars.length;i++) {
				if (i==0)
					fixed_page = sep_pars[i];
				else if (i==1) 
					fixed_page += '?' + sep_pars[i];
				else
					fixed_page += '&' + sep_pars[i];
			}
	return fixed_page;
}

/* cookies support */

function createCookie(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	}
	else var expires = "";               

	document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name, "", -1);
}

/* url vars support 
ex:
var number = getUrlVars()["x"];
var mytext = getUrlVars()["text"];
*/

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

/* notify */

function notifyErr(message, title, type) {
	if (title == undefined) 
		title = "שימו לב:";
	if (type == undefined)
		type = "danger";
	
    $.notify({
        title: '<strong>' + title + '</strong>',
        message: message

    }, {
            type: type,
            delay: 3000,
            placement: {
                from: "top",
                align: "center"
            }
        });
}


/* search auto complete */
function fn_search(obj, id) {
	if (debug)
		console.log('fn_search:' + obj + ' id:' + id);
		
	if (location.pathname.indexOf('pre_order') >= 0)
		return false;

	if (undefined == id) {
		var str = $('#searchWord').val();
		if(!str) str = '';
			
		if (str.length < 3) {
			alert('מלל חיפוש קצר מידי');
			return false;
		}
		if (str == searchInit)
			return false;
		if (debug)
			console.log('!search v=1');
		
		if (obj == 'reshet')
			location.href = "/site/search/?w=" + encodeURIComponent($('#searchWord').val()) + '&type=בית עסק';
		else 
			location.href = "/site/search/?w=" + encodeURIComponent($('#searchWord').val());
		//location.href = "/site/search/?caller=ac&w=" + encodeURIComponent($('#searchWord').val());
		//var dest = "url:search.aspx?v=1&u=1&searchWord=" + encodeURIComponent($('#searchWord').val());
		//handleHref(dest);
	}
	else {
		if (debug)
			console.log('search by id: ' + id);	
		location.href = "/site/search/?w=" + encodeURIComponent($('#searchWord').val());
		//var dest = "url:search.aspx?id=" + id;
		//handleHref(dest);
	}

	return true;
}



/* Forms checks */
function isEnglishString(str) {
	var ENGLISH = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var index;
	for (index = str.length - 1; index >= 0; --index) {
		if (ENGLISH.indexOf(str.substring(index, index + 1)) < 0) {
			return false;
		}
	}
	return true;
}

function isValidEmailAddress(emailAddress) {
	var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
	return pattern.test(emailAddress);
};

function isValidateTZ(str) {
	//INPUT VALIDATION

	// Just in case -> convert to string
	var IDnum = String(str);

	// Validate correct input
	if ((IDnum.length > 9) || (IDnum.length < 5))
		return false;
	if (isNaN(IDnum))
		return false;

	// The number is too short - add leading 0000
	if (IDnum.length < 9) {
		while (IDnum.length < 9) {
			IDnum = '0' + IDnum;
		}
	}

	// CHECK THE ID NUMBER
	var mone = 0, incNum;
	for (var i = 0; i < 9; i++) {
		incNum = Number(IDnum.charAt(i));
		incNum *= (i % 2) + 1;
		if (incNum > 9)
			incNum -= 9;
		mone += incNum;
	}
	if (mone % 10 == 0)
		return true;
	else
		return false;
}



/* external remarks */
function setup_ext_form_remarks(ext_rem) {
        
	var rems_json = JSON.parse(ext_rem);
	var z1 = '',  z2 = '',  z3 = '', z4 = '';

	$.each(rems_json, function( index, value ) {
	   z1 = '';
	   z2 = '';
	   z3 = '';
	   z4 = '';
	   
	   if (value.link != '' && value.link != null) {
		   
			z1 = '<a href="javascript:void(0);" data-href="' + value.link + '"  class="';
			
			if (value.btn_link_id == "" || value.btn_link_id == "0" )
				z2 = 'rem-href';
			else
				z2 = 'rem-href btn btn-success';
			
			z3 = '">';
			z4 = '</a>';
	   }

	   $('.ext-remarks').append('<div class="ext-rem-item py-1"><b>' + value.title + ':</b> ' + z1 + z2 + z3 + value.text + z4 + '</div>');
	   $('.ext-remarks').parent().removeClass('hide-me');
	});
	
	/*
	$('.rem-href').click(function(e){
		e.stopPropagation();
		var dest = $(this).attr('data-href');
		handleHref(dest);
	});
	*/
	
	$('.ext-remarks').show();
}

/* Utilities */



var MD5 = function(e) {
    function h(a, b) {
        var c, d, e, f, g;
        e = a & 2147483648;
        f = b & 2147483648;
        c = a & 1073741824;
        d = b & 1073741824;
        g = (a & 1073741823) + (b & 1073741823);
        return c & d ? g ^ 2147483648 ^ e ^ f : c | d ? g & 1073741824 ? g ^ 3221225472 ^ e ^ f : g ^ 1073741824 ^ e ^ f : g ^ e ^ f
    }

    function k(a, b, c, d, e, f, g) {
        a = h(a, h(h(b & c | ~b & d, e), g));
        return h(a << f | a >>> 32 - f, b)
    }

    function l(a, b, c, d, e, f, g) {
        a = h(a, h(h(b & d | c & ~d, e), g));
        return h(a << f | a >>> 32 - f, b)
    }

    function m(a, b, d, c, e, f, g) {
        a = h(a, h(h(b ^ d ^ c, e), g));
        return h(a << f | a >>> 32 - f, b)
    }

    function n(a, b, d, c, e, f, g) {
        a = h(a, h(h(d ^ (b | ~c), e), g));
        return h(a << f | a >>> 32 - f, b)
    }

    function p(a) {
        var b = "",
            d = "",
            c;
        for (c = 0; 3 >= c; c++) d = a >>> 8 * c & 255, d = "0" + d.toString(16), b += d.substr(d.length - 2, 2);
        return b
    }
    var f = [],
        q, r, s, t, a, b, c, d;
    e = function(a) {
        a = a.replace(/\r\n/g, "\n");
        for (var b = "", d = 0; d < a.length; d++) {
            var c = a.charCodeAt(d);
            128 > c ? b += String.fromCharCode(c) : (127 < c && 2048 > c ? b += String.fromCharCode(c >> 6 | 192) : (b += String.fromCharCode(c >> 12 | 224), b += String.fromCharCode(c >> 6 & 63 | 128)), b += String.fromCharCode(c & 63 | 128))
        }
        return b
    }(e);
    f = function(b) {
        var a, c = b.length;
        a = c + 8;
        for (var d = 16 * ((a - a % 64) / 64 + 1), e = Array(d - 1), f = 0, g = 0; g < c;) a = (g - g % 4) / 4, f = g % 4 * 8, e[a] |= b.charCodeAt(g) << f, g++;
        a = (g - g % 4) / 4;
        e[a] |= 128 << g % 4 * 8;
        e[d - 2] = c << 3;
        e[d - 1] = c >>> 29;
        return e
    }(e);
    a = 1732584193;
    b = 4023233417;
    c = 2562383102;
    d = 271733878;
    for (e = 0; e < f.length; e += 16) q = a, r = b, s = c, t = d, a = k(a, b, c, d, f[e + 0], 7, 3614090360), d = k(d, a, b, c, f[e + 1], 12, 3905402710), c = k(c, d, a, b, f[e + 2], 17, 606105819), b = k(b, c, d, a, f[e + 3], 22, 3250441966), a = k(a, b, c, d, f[e + 4], 7, 4118548399), d = k(d, a, b, c, f[e + 5], 12, 1200080426), c = k(c, d, a, b, f[e + 6], 17, 2821735955), b = k(b, c, d, a, f[e + 7], 22, 4249261313), a = k(a, b, c, d, f[e + 8], 7, 1770035416), d = k(d, a, b, c, f[e + 9], 12, 2336552879), c = k(c, d, a, b, f[e + 10], 17, 4294925233), b = k(b, c, d, a, f[e + 11], 22, 2304563134), a = k(a, b, c, d, f[e + 12], 7, 1804603682), d = k(d, a, b, c, f[e + 13], 12, 4254626195), c = k(c, d, a, b, f[e + 14], 17, 2792965006), b = k(b, c, d, a, f[e + 15], 22, 1236535329), a = l(a, b, c, d, f[e + 1], 5, 4129170786), d = l(d, a, b, c, f[e + 6], 9, 3225465664), c = l(c, d, a, b, f[e + 11], 14, 643717713), b = l(b, c, d, a, f[e + 0], 20, 3921069994), a = l(a, b, c, d, f[e + 5], 5, 3593408605), d = l(d, a, b, c, f[e + 10], 9, 38016083), c = l(c, d, a, b, f[e + 15], 14, 3634488961), b = l(b, c, d, a, f[e + 4], 20, 3889429448), a = l(a, b, c, d, f[e + 9], 5, 568446438), d = l(d, a, b, c, f[e + 14], 9, 3275163606), c = l(c, d, a, b, f[e + 3], 14, 4107603335), b = l(b, c, d, a, f[e + 8], 20, 1163531501), a = l(a, b, c, d, f[e + 13], 5, 2850285829), d = l(d, a, b, c, f[e + 2], 9, 4243563512), c = l(c, d, a, b, f[e + 7], 14, 1735328473), b = l(b, c, d, a, f[e + 12], 20, 2368359562), a = m(a, b, c, d, f[e + 5], 4, 4294588738), d = m(d, a, b, c, f[e + 8], 11, 2272392833), c = m(c, d, a, b, f[e + 11], 16, 1839030562), b = m(b, c, d, a, f[e + 14], 23, 4259657740), a = m(a, b, c, d, f[e + 1], 4, 2763975236), d = m(d, a, b, c, f[e + 4], 11, 1272893353), c = m(c, d, a, b, f[e + 7], 16, 4139469664), b = m(b, c, d, a, f[e + 10], 23, 3200236656), a = m(a, b, c, d, f[e + 13], 4, 681279174), d = m(d, a, b, c, f[e + 0], 11, 3936430074), c = m(c, d, a, b, f[e + 3], 16, 3572445317), b = m(b, c, d, a, f[e + 6], 23, 76029189), a = m(a, b, c, d, f[e + 9], 4, 3654602809), d = m(d, a, b, c, f[e + 12], 11, 3873151461), c = m(c, d, a, b, f[e + 15], 16, 530742520), b = m(b, c, d, a, f[e + 2], 23, 3299628645), a = n(a, b, c, d, f[e + 0], 6, 4096336452), d = n(d, a, b, c, f[e + 7], 10, 1126891415), c = n(c, d, a, b, f[e + 14], 15, 2878612391), b = n(b, c, d, a, f[e + 5], 21, 4237533241), a = n(a, b, c, d, f[e + 12], 6, 1700485571), d = n(d, a, b, c, f[e + 3], 10, 2399980690), c = n(c, d, a, b, f[e + 10], 15, 4293915773), b = n(b, c, d, a, f[e + 1], 21, 2240044497), a = n(a, b, c, d, f[e + 8], 6, 1873313359), d = n(d, a, b, c, f[e + 15], 10, 4264355552), c = n(c, d, a, b, f[e + 6], 15, 2734768916), b = n(b, c, d, a, f[e + 13], 21, 1309151649), a = n(a, b, c, d, f[e + 4], 6, 4149444226), d = n(d, a, b, c, f[e + 11], 10, 3174756917), c = n(c, d, a, b, f[e + 2], 15, 718787259), b = n(b, c, d, a, f[e + 9], 21, 3951481745), a = h(a, q), b = h(b, r), c = h(c, s), d = h(d, t);
    return (p(a) + p(b) + p(c) + p(d)).toLowerCase()
};

function get_url_param(){
	var query = window.location.search.substring(1);
	urlParams = parse_query_string(query);
}

function parse_query_string(query) {
  var vars = query.split("&");
  var query_string = {};
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    var key = decodeURIComponent(pair[0]);
    var value = decodeURIComponent(pair[1]);
    // If first entry with this name
    if (typeof query_string[key] === "undefined") {
      query_string[key] = decodeURIComponent(value);
      // If second entry with this name
    } else if (typeof query_string[key] === "string") {
      var arr = [query_string[key], decodeURIComponent(value)];
      query_string[key] = arr;
      // If third or later entry with this name
    } else {
      query_string[key].push(decodeURIComponent(value));
    }
  }
  return query_string;
}

function goBack() {
  window.history.back();
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function removeBR(str) {
     return str.replaceAll('<br>',' ').replaceAll('<br/>',' ').replaceAll('<br />',' ').replaceAll('</br>',' ');
}

function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

jQuery.cachedScript = function( url, options ) {
 
	  // Allow user to set any option except for dataType, cache, and url
	  options = $.extend( options || {}, {
		dataType: "script",
		cache: true,
		url: url
	  });
	 
	  // Use $.ajax() since it is more flexible than $.getScript
	  // Return the jqXHR object so we can chain callbacks
	  return jQuery.ajax( options );
};

/*
function url_base()
    {
        return readCookie('logout').substr(0,readCookie('logout').indexOf( "signin.aspx" )).replace("https","https");
    }


function url_goto(v)
    {
        location.href = url_base() + v;
    }
*/

function home_page()
    {
			document.cookie = 'topNav=; path=/';
			document.cookie = 'topNavSub=; path=/';
			var root='';
			if ( location.pathname.substring(0,1) == '/')
			{
				var pos = location.pathname.indexOf('/',1);
				if ( pos > 0 )
					root = location.pathname.substring( 0, pos );
			}
			
			if (debug_checked)
				console.log('https://' + location.host + root + '/' + 'home_page.aspx?page=' + readCookie('home_page'));
			//location.href = 'https://' + location.host + root + '/' + 'home_page.aspx?page=' + $.cookie('home_page');
       
    }

	
function preSubmitSearch() {
	
	if (searchVal != '') 
		$('#searchWord').val(searchVal);
	
	submitSearch(true);
}

function submitSearch(isAll) {
	
	console.log('isAll:',isAll);
	
	var str = $('#searchWord').val();
	if (str == '')
		str = $('#searchWord_sm').val();
	if (str == '')
		str = searchVal;
	
	
	if (debug)
		console.log('submitSearch:' +  str);
	$('#searchWord').val(str);
	
	searchVal = '';
	var searchItem = str;
	if (searchItem != '') {
		if (isAll == 'reshet')
			fn_search(isAll, null);
		else 
			fn_search(null, null);
	}
}

function toggleNLV(toNLV,formatID) {
	if (typeof formatID === 'undefined') {
		formatID = 0;
	}
	if (toNLV) {
		//console.log('switch to nlv');
		if (formatID > 0) {
			var curNLV = '.nlv-' + formatID;
			var curShowAmit = '.show-amit-' + formatID;
			var curShowNLV = '.show-nlv-' + formatID;
			$(curNLV).slideDown();
			$(curShowAmit).addClass('hide-me');
			$(curShowNLV).removeClass('hide-me');
			return;
		} else {
			$('.show-amit').addClass('hide-me');
			$('.show-nlv').removeClass('hide-me');
		}
	} else {
		//console.log('switch to member price');
		if (formatID > 0) {
			var curNLV = '.nlv-' + formatID;
			var curShowAmit = '.show-amit-' + formatID;
			var curShowNLV = '.show-nlv-' + formatID;
			$(curNLV).slideUp();
			$(curShowNLV).addClass('hide-me');
			$(curShowAmit).removeClass('hide-me');
			return;
		} else {
			$('.show-nlv').addClass('hide-me');
			$('.show-amit').removeClass('hide-me');
		}
	}
}

/* hvr only */

function checkActiveMenu() {
	var activeMenu = readCookie('amenu');
	//console.log(activeMenu);
	if (activeMenu == ''|| activeMenu == '0') {
		$('.nav-item').removeClass('active');
	} else {
		var activeClass = '.nav-item-h' + activeMenu;
		//console.log(activeClass);
		$(activeClass).addClass('active');
	}
}

/* waiting dialogue */

var waitingDialog = waitingDialog || (function ($) {
    'use strict';

	// Creating modal dialog's DOM
	var $dialog = $(
		'<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
		'<div class="modal-dialog modal-m">' +
		'<div class="modal-content">' +
			'<div class="modal-header f-12"></div>' +
			'<div class="modal-body text-center">' +
			'<div class="spinner-border" role="status"><span class="sr-only">התוכן נטען...</span></div>' +
			'</div>' +
		'</div></div></div>');

	return {
		/**
		 * Opens our dialog
		 * @param message Custom message
		 * @param options Custom options:
		 * 				  options.dialogSize - bootstrap postfix for dialog size, e.g. "sm", "m";
		 * 				  options.progressType - bootstrap postfix for progress bar type, e.g. "success", "warning".
		 */
		show: function (message, options) {
			// Assigning defaults
			if (typeof options === 'undefined') {
				options = {};
			}
			if (typeof message === 'undefined') {
				message = 'אנא המתן. התוכן נטען ...';
			}
			var settings = $.extend({
				dialogSize: 'm',
				progressType: '',
				onHide: null // This callback runs after the dialog was hidden
			}, options);

			// Configuring dialog
			$dialog.find('.modal-header').attr('style', 'border-bottom:none;');
			$dialog.find('.modal-content').attr('style',options.contentStyle);
			$dialog.find('.modal-dialog').attr('class', 'modal-dialog').addClass('modal-' + settings.dialogSize);
			$dialog.find('.progress-bar').attr('class', 'progress-bar progress-bar-animated');
			if (settings.progressType) {
				$dialog.find('.spinner-border').addClass('text-' + settings.progressType);
			}
			$dialog.find('.modal-header').html(message);
			// Adding callbacks
			if (typeof settings.onHide === 'function') {
				$dialog.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
					settings.onHide.call($dialog);
				});
			}
			// Opening dialog
			$dialog.modal();
		},
		/**
		 * Closes dialog
		 */
		hide: function () {
			$dialog.modal('hide');
		}
	};

})(jQuery);