$(function(){

	var admin = (function(){

		// Private Vars
		//////////////////////
		var $admin = $('#sr-admin'),
			geocoder,
			map,
			options,
			loading = false,
			timeout = false,
			pinImage;


		// Intialize
		//////////////////////
		var init = function(){

			//create active pin image
			pinImage = new google.maps.MarkerImage("https://chart.googleapis.com/chart?chst=d_map_pin_icon_withshadow&chld=star|00EE00",
				new google.maps.Size(40, 37),
				new google.maps.Point(0,0),
				new google.maps.Point(10, 34)
			);

			//create geocoder
			geocoder = new google.maps.Geocoder();

			//load user options
			$.ajax('options/get').done(function(result){ 

				//get admin options
				options = result;

				//set options to int
				options.groups = parseInt( options.groups, 10 );

				//load geolocator by default
				loadGeolocator();

				//change tab on click
				$admin.find('nav li a').on('click', changeTab);
			});
		}

		// Private Functions
		//////////////////////
		var changeTab = function(e){

			var $this = $(this),
				$nav,
				$loading,
				selected;
			
			//get nav
			$nav = $this.parents('nav');

			//remove active from all tabs
			$nav.find('a').removeClass('active');

			//find selected
			selected = $this.data('tab');

			//create loading
			$loading = $('<div />', { id: 'sr-loading' });

			//empty all from admin
			$admin.find('section').empty().append( $loading );

			//set defaults
			loading = false;
			timeout = false;

			//based on selected
			switch( selected ){

				case "geolocator" :
				loadGeolocator();
				break;

				case "groups" :
				loadGroups();
				break;

				case "settings" :
				loadSettings();
				break;
			}

			//add active to tab
			$this.addClass('active');

			e.preventDefault();
		};

		var loadSettings = function(){

			//load view
			$.ajax('admin/settings').done(function(html){

				//empty all from admin - remove loader
				$admin.find('section').empty();

				//append html
				$admin.find('section').append(html);
			});
		};

		// Groups
		//////////////////////
		var loadGroups = function(){

			//load view
			$.ajax('admin/groups').done(function(html){

				//empty all from admin - remove loader
				$admin.find('section').empty();

				//append html
				$admin.find('section').append(html);

				//events
				$('#sr-create form').on('submit', newGroup);
				$('#sr-manage').on('change', '.sr-group-default', saveGroupDefault);
				$('#sr-manage').on('click', '.sr-edit', editGroup);
				$('#sr-manage').on('click', '.sr-delete', deleteGroup);
			});
		};

		var newGroup = function(e){

			var $this = $(this),
				data = {};

			//get name
			data.name = $this.find('#sr-group-name').val().trim();

			//find if default is checked
			if( $this.find('#sr-default').is(':checked') ){

				data.default = 1;
			}
			else{

				data.default = 0;
			}

			//save group
			$.ajax({

				data: data,
				type: 'POST',
				url: 'groups/save'
			})
			.done(function(result){

				var $table,
					$tr,
					$td,
					$label,
					$input,
					$img,
					$errors;

				if( result.id ){

					//remove any existing errors
					$('#sr-errors').remove();

					//remove no groups message
					$('#sr-manage').find('p').remove();

					//check if table exists
					if( $('#sr-manage table').length > 0 ){

						$table = $('#sr-manage table');
					}
					else{

						//create table
						$table = $('<table />').appendTo( '#sr-manage' );

						//create table row
						$tr = $('<tr />').appendTo( $table );

						//create table headers
						$('<th />', { colspan: '2' })
						.html('Group Name')
						.appendTo( $tr );

						$('<th />', { colspan: '2' })
						.html('Default')
						.appendTo( $tr );
					}

					//create row, add id, append to table
					$tr = $('<tr />',{
						class: 'sr-group'
					})
					.data( 'id', result.id )
					.insertAfter( $table.find('tr').first() );

					//create td, add group name
					$td = $('<td />')
					.html( '<span>' + data.name + '</span>')
					.appendTo( $tr );

					//create edit
					$img = $('<img />', {
						alt: 'Edit',
						class: 'sr-edit',
						src: 'assets/img/edit.png',
						title: 'Edit'
					})
					.appendTo( $td );

					//create label for checkbox
					$label = $('<label />', {
						for: 'sr-group-default',
						html: 'Default: '
					});

					//create checkbox
					$input = $('<input />', {

						id: 'sr-group-default',
						name: 'sr-group-default',
						type: 'checkbox'
					});

					//check if necessary
					if( data.default ){

						$input.prop('checked', true);
					}

					//add default checkbox
					$td = $('<td />').append( $label, $input ).appendTo( $tr );

					//add save icon
					$td = $('<td />').prepend('<span>Saved!</span>').appendTo( $tr );

					//create save
					$img = $('<img />', {
						alt: 'Saved!',
						src: 'assets/img/save.png',
						title: 'Saved!'
					})
					.appendTo( $td );

					//add actions
					$td = $('<td />').appendTo( $tr );

					//create delete
					$img = $('<img />', {
						alt: 'Delete',
						class: 'sr-delete',
						src: 'assets/img/delete.png',
						title: 'Delete'
					})
					.appendTo( $td );

					//fade saved message
					$tr.find('td:nth-child(3)')
					.children()
					.delay( 2000 )
					.fadeOut( 500 );
				}
				else if( result.errors ){

					//remove any existing errors
					$('#sr-errors').remove();

					//create errors div
					$errors = $('<div />', { 
						html: result.errors,
						id: 'sr-errors' });

					//insert errors
					$errors.insertAfter('#sr-create')

					//animate, remove
					$errors.delay(2000).slideUp(200, function(){

						//remove
						$errors.remove();
					});

					//fade text out
					$errors.find('p').delay(2000).animate({ opacity: 0 }, 100);
				}
			});

			e.preventDefault();
		};

		var saveGroupDefault = function(){

			var $parent,
				data = {};

			//get parent
			$parent = $(this).parents('tr');

			//set data
			data.id = $parent.data('id');

			//get checked status
			data.checked = ( $(this).prop('checked') ) ? 1 : 0;

			//save default
			$.ajax({
				data: data,
				type: 'POST',
				url: 'groups/save_default'
			})
			.done(function(r){

				var $td,
					$img;

				if(r){ //if success

					//create save image
					$img = $('<img />', {
						alt: 'Saved!',
						src: 'assets/img/save.png',
						title: 'Saved!'
					});

					//get third td
					$td = $parent.find('td').eq(2).empty();

					//append save message, fade message
					$td
					.append('<span>Saved!</span>', $img)
					.children()
					.delay( 2000 )
					.fadeOut( 500 );
				}
			});
		}
		
		var editGroup = function(){

			var data = {},
				name,
				$input,
				$parent,
				$td,
				$img;

			//get parent
			$parent = $(this).parents('tr');

			//find td
			$td = $parent.find('td').eq(0);

			//get current name
			name = $td.find('span').html().trim();

			//create input box
			$input = $('<input />', {
				class: 'sr-save-name',
				value: name
			});

			//empty td
			$td.empty();

			//append input box
			$td.append( $input );

			//focus on input box
			$input.focus();

			$input.keypress(function(e){

				if(e.which == 13){

					data.id = $parent.data('id');
					data.name = $input.val();

					$.ajax({
						data: data,
						type: 'POST',
						url: 'groups/save_name'
					})
					.done(function(r){

						if(r){ //if success

							//add group name
							$td.html( '<span>' + data.name + '</span>');

							//create edit
							$img = $('<img />', {
								alt: 'Edit',
								class: 'sr-edit',
								src: 'assets/img/edit.png',
								title: 'Edit'
							})
							.appendTo( $td );

							//create save image
							$img = $('<img />', {
								alt: 'Saved!',
								src: 'assets/img/save.png',
								title: 'Saved!'
							});

							//get third td
							$td = $parent.find('td').eq(2).empty();

							//append save message, fade message
							$td
							.append('<span>Saved!</span>', $img)
							.children()
							.delay( 2000 )
							.fadeOut( 500 );
						}
						else{ //reset

							//add group name
							$td.html( '<span>' + name + '</span>');

							//create edit
							$img = $('<img />', {
								alt: 'Edit',
								class: 'sr-edit',
								src: 'assets/img/edit.png',
								title: 'Edit'
							})
							.appendTo( $td );
						}
					});
				}
			});
		};

		var deleteGroup = function(){

			var $parent,
				name,
				data = {},
				id;

			//get parent
			$parent = $(this).parents('tr');

			//get info
			id   = $parent.data('id');
			name = $parent.find('td').first().html().trim();

			//store id in data object
			data.id = id;

			if( confirm('Are you sure you want to delete the ' + name + ' group?') ){

				$.ajax({
					data: data,
					type: 'POST',
					url: 'groups/delete'
				})
				.done(function(r){

					//if complete, remove from list
					if(r) $parent.remove();
				});
			}
		};

		// Geolocator
		//////////////////////
		var loadGeolocator = function(){

			//load view
			$.ajax('admin/geolocator').done(function(html){

				//empty all from admin - remove loader
				$admin.find('section').empty();

				//append html
				$admin.find('section').append(html);

				//get all reps
				$.ajax('admin/all').done(function(data){
					
					//create map, center on USA
					map = new google.maps.Map(document.getElementById("sr-map"), {

						center: new google.maps.LatLng(38.555474, -95.664999),
						zoom: 4,
						mapTypeId: google.maps.MapTypeId.ROADMAP
					});

					//set data
					map.sr = {

						activeMarker: false,
						country: false,
						countries: data.countries,
						infoBoxHeight: false,
						location: false,
						locations: data.locations,
						markers: [],
						reps: data.reps
					}

					//get groups
					if(options.groups) $.ajax('groups/all').done(function(groups){ 

						var $div,
							$label,
							$select,
							$option,
							i, l;

						//save groups
						map.sr.groups = groups;

						//create dropdown
						$div = $('<div />', {
							class: 'sr-rep-groups'
						})
						.appendTo('.sr-rep-info div:first-child');

						$label = $('<label />').html('Groups: ').appendTo( $div );

						$select = $('<select />')
						.prop('multiple', 'multiple')
						.attr('data-placeholder', 'Click to Assign a Group...')
						.appendTo( $div );

						//create options for dropdown
						for( i = 0, l = groups.length; i < l; ++i){

							//create option tag
							$option = $('<option />', {
								html: groups[i].name,
								value: groups[i].id
							});

							//add option
							$option.appendTo( $select );
						}

						//add chosen plugin
						map.sr.chosen = $select.chosen({ width: '45%' });
					});

					//create markers
					createMarkers();
				});

				//events
				$('form.sr-search').on('submit', searchRep);
				$('form.sr-info').on('submit', saveRep);
				$('form.sr-info').on('reset', resetRep);
				$('.sr-delete').on('click', deleteRep);
				$('.sr-hide').on('click', hideInfoBox);
			});
		};

		var createMarkers = function(){

			var location,
				marker,
				reps,
				i, l;

			//get reps
			reps = map.sr.reps;

			for(i = 0, l = reps.length; i < l; ++i){

				location = new google.maps.LatLng(reps[i].lat, reps[i].lng);

				//create marker
				marker = new google.maps.Marker({
					map: map,
	    			draggable: true,
					position: location
				});

				//set attributes
				marker.attr = {

					'id' : reps[i].id,
					'name' : reps[i].name,
					'address' : reps[i].address,
					'state' : reps[i].state,
					'city' : reps[i].city,
					'zip' : reps[i].zip,
					'company' : reps[i].company,
					'phone' : reps[i].phone,
					'cell' : reps[i].cell,
					'fax' : reps[i].fax,
					'email' : reps[i].email,
					'web' : reps[i].web,
					'lat' : reps[i].lat,
					'lng' : reps[i].lng
				}

				//add groups if enabled
				if(options.groups){

					marker.attr.groups = reps[i].groups;
				}

				//add click event
				google.maps.event.addListener(marker, 'click', markerClick);

				//add to markers array
				map.sr.markers.push(marker);
			}
		};

		var markerClick = function(){

			//show hide button
			$('button.sr-hide').show();

			//show info box, pass attributes
			showInfoBox(this.attr);

			//if no marker attributes, just remove altogether
			if(!map.sr.activeMarker.attr && map.sr.activeMarker) map.sr.activeMarker.setMap(null);

			//if active marker is saved, set default image
			if(map.sr.activeMarker.attr) map.sr.activeMarker.setIcon(null);

			//this is active marker now
			map.sr.activeMarker = this;

			//set active marker icon to active
			map.sr.activeMarker.setIcon(pinImage);
		};

		var showInfoBox = function(obj){

			var editBox = $('.sr-edit-info'),
				children = editBox.children(),
				groups,
				i, l;

			//clear inputs
			editBox.find('input').val('');

			//fill in values if provided
			if(obj.name) editBox.find('#sr-name').val(obj.name);
			if(obj.address) editBox.find('#sr-address').val(obj.address);
			if(obj.city) editBox.find('#sr-city').val(obj.city);
			if(obj.state) editBox.find('#sr-state').val(obj.state);
			if(obj.zip) editBox.find('#sr-zip').val(obj.zip);
			if(obj.company) editBox.find('#sr-company').val(obj.company);
			if(obj.phone) editBox.find('#sr-phone').val(obj.phone);
			if(obj.cell) editBox.find('#sr-cell').val(obj.cell);
			if(obj.fax) editBox.find('#sr-fax').val(obj.fax);
			if(obj.email) editBox.find('#sr-email').val(obj.email);
			if(obj.web) editBox.find('#sr-web').val(obj.web);
			if(obj.id) editBox.find('#sr-id').val(obj.id);

			//if id is set, set save var to 1 else 0, indicates to update and not create new record
			(obj.id) ? editBox.find('#sr-save').val(0) : editBox.find('#sr-save').val(1);

			//if groups are enabled and we have groups, select necessary options
			if( options.groups ){

				if( typeof obj.groups !=='undefined' ){

					//deselect all options
					$('.sr-rep-groups').find('option').prop('selected', false);

					if(obj.groups){

						//select options
						for(i = 0, l = obj.groups.length; i < l; ++i){

							$('.sr-rep-groups').find('option[value="' +  obj.groups[i] + '"]').prop('selected', true);

						}
					}
					
					//update chosen plugin
					map.sr.chosen.trigger('chosen:updated');
				}
				else{ //load defaults

					//set groups
					groups = map.sr.groups;

					//select options
					for(i = 0, l = groups.length; i < l; ++i){

						//if a default group
						if( parseInt( groups[i].default, 10 ) ){

							$('.sr-rep-groups').find('option[value="' +  groups[i].id + '"]').prop('selected', true);
						}

						//update chosen plugin
						map.sr.chosen.trigger('chosen:updated');
					}
				}
			}

			//if editBox is open, just return
			if(editBox.css('display') === 'block') return;

			//set height
			if(!map.sr.infoBoxHeight) map.sr.infoBoxHeight = editBox.css('height');

			//set height to zero
			editBox.css({
				'display': 'block',
				'height' : '0px'
			});

			//set children opacity to zero
			children.css({
				'opacity' : '0'
			});

			editBox.animate({
				'height' : map.sr.infoBoxHeight
			}, 100, function(){

				children.animate({
					'opacity' : '1'
				}, 200);
			});
		};

		var hideInfoBox = function(){

			var editBox = $('.sr-edit-info'),
				children = editBox.children();

			if(editBox.css('display') !== 'block') return;

			children.animate({'opacity' : '0'}, 50);

			editBox.animate({'height' : 0}, 50, function(){

				$(this).css('display', 'none');
			});
		};

		var showErrorMessage = function(msg){

			var ctn = $('.sr-msg');

			ctn.css('display', 'block');

			ctn.html(msg);

			if(timeout) window.clearTimeout(timeout);

			timeout = window.setTimeout(function(){

				ctn.fadeOut(100);
				timeout = false;
			}, 2000);
		};

		var findCountry = function(components){

			var country = {},
				component,
				i, l, x, y;

			//for each address component
			for(i = 0, l = components.length; i < l; ++i){

				//store component
				component = components[i];

				//check each type
				for(x = 0, y = component.types.length; x < y; ++ x){

					//if type is country
					if(component.types[x] === 'country'){

						//success - store values
						country.short_name = component['short_name'];
						country.long_name  = component['long_name'];

						return country;
					}
				}
			}

			return false;
		};

		var findLocation = function(components){

			var location = {},
				area1 = false,
				area2 = false,
				area3 = false,
				area4 = false,
				area5 = false,
				component,
				i, l, x, y;

			for(i = 0, l = components.length; i < l; ++i){

				//store component
				component = components[i];

				//check each type
				for(x = 0, y = component.types.length; x < y; ++ x){

					//depending on type, assign to var
					switch(component.types[x]){

						case 'administrative_area_level_1':
						area1 = component;
						break;

						case 'administrative_area_level_2':
						area2 = component;
						break;

						case 'administrative_area_level_3':
						area3 = component;
						break;

						case 'administrative_area_level_4':
						area4 = component;
						break;

						case 'administrative_area_level_5':
						area5 = component;
						break;
					}
				}
			}

			//return the highest level
			if(area1){

				location.short_name = area1['short_name'];
				location.long_name = area1['long_name'];

				return location;
			}

			if(area2){

				location.short_name = area2['short_name'];
				location.long_name = area2['long_name'];

				return location;
			}

			if(area3){

				location.short_name = area3['short_name'];
				location.long_name = area3['long_name'];

				return location;
			}

			if(area4){

				location.short_name = area4['short_name'];
				location.long_name = area4['long_name'];

				return location;
			}

			if(area5){

				location.short_name = area5['short_name'];
				location.long_name = area5['long_name'];

				return location;
			}

			return false;
		};

		var getCoords = function(obj, address){

			var lat, lng;

			//get lat/lng - country
			geocoder.geocode({'address' : address}, function(results, status){

				if(status == google.maps.GeocoderStatus.OK){

					lat = results[0].geometry.location.lat();
					lng = results[0].geometry.location.lng();

					obj.coords = [lat, lng];

					return obj;
				}
				else if(status == google.maps.GeocoderStatus.ZERO_RESULTS){

					return false;
				}
				else if(status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT){

					return false;
				}
				else if(status == google.maps.GeocoderStatus.REQUEST_DENIED){

					return false;
				}
				else if(status == google.maps.GeocoderStatus.INVALID_REQUEST){

					return false;
				}
				else{

					return false;
				}
			});

			return obj;
		};

		var searchRep = function(e){

			e.preventDefault();

			var address = $(this).find('input#sr-address').val(),
				city    = $(this).find('input#sr-city').val(),
				state   = $(this).find('input#sr-state').val(),
				zip     = $(this).find('input#sr-zip').val(),
				ctry    = $(this).find('input#sr-country').val(),
				full_address = '',
				obj;

			//create full_address
			if(address) full_address      += address + ' ';
			if(city) full_address         += city;
			if(state || zip) full_address += ', '
			if(state) full_address        += state + ' ';
			if(zip) full_address          += zip;
			if(ctry) full_address         += ctry;

			//set icon back to default
			if(map.sr.activeMarker) map.sr.activeMarker.setIcon(null);

			//if new marker exists, remove
			if(!map.sr.activeMarker.attr && map.sr.activeMarker) map.sr.activeMarker.setMap(null);

			//get lat/lng of full_address
			geocoder.geocode({'address' : full_address}, function(results, status){

				if(status == google.maps.GeocoderStatus.OK){

					//find country
					map.sr.country = findCountry( results[0].address_components );

					//find location
					map.sr.location = findLocation( results[0].address_components );

					//check if already present
					$.when( 
						$.ajax( 'countries/check', { data: map.sr.country, type: 'POST' } ), 
						$.ajax( 'locations/check', { data: map.sr.location, type: 'POST' } ) 
					)
					.then(function(c, l){

						//store ids
						map.sr.country.id  = c[0];
						map.sr.location.id = l[0];

						//get coords
						map.sr.country  = getCoords(map.sr.country, map.sr.country.long_name);
						map.sr.location = getCoords(map.sr.location, map.sr.location.short_name + ', ' + map.sr.country.long_name);

						//if results missing
						if( !map.sr.country ){

							//show error
							showErrorMessage('Please be more specific with location.');

							$('.sr-edit-info').hide();

							//set back to false
							map.sr.country = false;
							map.sr.location = false;

							return;
						}

						//set map and zoom to marker location
						map.setCenter(results[0].geometry.location);
						map.setZoom(4);
						
						//create marker
						map.sr.activeMarker = new google.maps.Marker({
							draggable: true,
							map: map,
							position: results[0].geometry.location,
							icon: pinImage
						});

						//create obj with form values
						obj = {

							'address' : address,
							'state' : state,
							'city' : city,
							'zip' : zip
						};

						//hide the hide button
						$('button.sr-hide').hide();

						//show info box, send form values
						showInfoBox(obj);

					}, function(){

						//set back to false
						map.sr.country = false;
						map.sr.location = false;

						$('.sr-edit-info').hide();

						showErrorMessage('Unknown Error, Contact Administrator.');

						return;
					});
				}
				else if(status == google.maps.GeocoderStatus.ZERO_RESULTS){

					$('.sr-edit-info').hide();

					showErrorMessage('No Results Found.');
				}
				else if(status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT){

					$('.sr-edit-info').hide();
					
					showErrorMessage('Over Query Limit, Try Again Later.');
				}
				else if(status == google.maps.GeocoderStatus.REQUEST_DENIED){

					$('.sr-edit-info').hide();
					
					showErrorMessage('Request Denied.');
				}
				else if(status == google.maps.GeocoderStatus.INVALID_REQUEST){

					$('.sr-edit-info').hide();
					
					showErrorMessage('Invalid Request');
				}
				else{

					$('.sr-edit-info').hide();

					showErrorMessage('Unknown Error, Contact Administrator');
				}
			});
		};

		var saveRep = function(e){

			var name    = $(this).find('input#sr-name').val(),
				address = $(this).find('input#sr-address').val(),
				city    = $(this).find('input#sr-city').val(),
				state   = $(this).find('input#sr-state').val(),
				zip     = $(this).find('input#sr-zip').val(),
				company = $(this).find('input#sr-company').val(),
				phone   = $(this).find('input#sr-phone').val(),
				cell    = $(this).find('input#sr-cell').val(),
				fax     = $(this).find('input#sr-fax').val(),
				email   = $(this).find('input#sr-email').val(),
				web     = $(this).find('input#sr-web').val(),
				id      = $(this).find('input#sr-id').val(),
				save    = $(this).find('input#sr-save').val(),
				groups,
				lat,
				lng,
				data,
				marker;

			e.preventDefault();

			//set lat/lng
			lat = map.sr.activeMarker.position.lat();
			lng = map.sr.activeMarker.position.lng();

			data = {
				'name' : name.trim(),
				'address' : address.trim(),
				'state' : state.trim(),
				'city' : city.trim(),
				'zip' : zip.trim(),
				'company' : company.trim(),
				'phone' : phone.trim(),
				'cell' : cell.trim(),
				'fax' : fax.trim(),
				'email' : email.trim(),
				'web' : web.trim(),
				'lat' : lat,
				'lng' : lng,
				'save' : save
			};

			//set id if present
			if(id) data.id = id;

			//if country
			if( map.sr.country ){

				//set country data
				if( parseInt(map.sr.country.id) ){

					data.country_id = map.sr.country.id;
				}
				else{ //set extra info

					data.country_id         = map.sr.country.id;
					data.country_short_name = map.sr.country.short_name;
					data.country_long_name  = map.sr.country.long_name;
					data.country_lat        = map.sr.country.coords[0];
					data.country_lng        = map.sr.country.coords[1];
				}
			}

			//if location
			if( map.sr.location ){

				//location present
				data.location = true;

				//set location data
				if( parseInt(map.sr.location.id) ){

					data.location_id         = map.sr.location.id;
				}
				else{ //set extra info

					data.location_id         = map.sr.location.id;
					data.location_short_name = map.sr.location.short_name;
					data.location_long_name  = map.sr.location.long_name;
					data.location_lat        = map.sr.location.coords[0];
					data.location_lng        = map.sr.location.coords[1];
				}
			}
			else{

				//no location
				data.location = false;
			}

			//if groups are enabled, get groups
			if( options.groups ){

				//get multi-select values
				groups = $(this).find('.sr-rep-groups select').val();

				//add to data object
				data.groups      = groups;
				data.groups_save = true;
			}

			if(loading) return;

			//now loading
			loading = true;
			
			$('.sr-loading').css('display', 'block');

			//do ajax
			$.ajax({

				data : data,
				dataType : 'json',
				type : 'POST',
				url : 'admin/save/'

			})
			.then(function(data){

				//hide edit window
				$('.sr-edit-info').css('display', 'none');

				//reset search form
				$('.sr-search')[0].reset();

				//if no attribute are set, add to marker array
				if(!map.sr.activeMarker.attr){

					marker = map.sr.activeMarker;

					map.sr.activeMarker = false;

					marker.attr = {

						'id' : data.id,
						'name' : data.name,
						'address' : data.address,
						'state' : data.state,
						'city' : data.city,
						'zip' : data.zip,
						'company' : data.company,
						'phone' : data.phone,
						'cell' : data.cell,
						'fax' : data.fax,
						'email' : data.email,
						'web' : data.web,
						'lat' : data.lat,
						'lng' : data.lng
					}

					//if groups are enabled, set groups for marker
					if( options.groups ){

						//add to data object
						marker.attr.groups = data.groups;
					}

					marker.setIcon(null);

					google.maps.event.addListener(marker, 'click', markerClick);

					map.sr.markers.push(marker);

					//not loading
					loading = false;

					$('.sr-loading').css('display', 'none');
				}
				else{

					marker = map.sr.activeMarker;

					map.sr.activeMarker = false;

					marker.setIcon(null);

					//remove and replace marker
					if(marker != -1) {

						map.sr.markers.splice(marker, 1);

						marker.attr = {

							'id' : data.id,
							'name' : data.name,
							'address' : data.address,
							'state' : data.state,
							'city' : data.city,
							'zip' : data.zip,
							'company' : data.company,
							'phone' : data.phone,
							'cell' : data.cell,
							'fax' : data.fax,
							'email' : data.email,
							'web' : data.web,
							'lat' : data.lat,
							'lng' : data.lng
						}

						//if groups are enabled, set groups for marker
						if( options.groups ){

							//add to data object
							marker.attr.groups = data.groups;
						}

						map.sr.markers.push(marker);

						//not loading
						loading = false;

						$('.sr-loading').css('display', 'none');
					}
				}
			}, function(){

				//not loading
				loading = false;

				$('.sr-loading').css('display', 'none');

				showErrorMessage('Unable to Save, Try Again and Contact Administrator if Problem Persists.');
			});
		};

		var resetRep = function(e){

			var groups;

			//reset input boxes
			$(this).find('input').val('');

			//if groups are enabled, set back to default
			if( options.groups ){

				//set groups
				groups = map.sr.groups;

				//deselect all options
				$('.sr-rep-groups').find('option').prop('selected', false);

				//select options
				for(i = 0, l = groups.length; i < l; ++i){

					//if a default group
					if( parseInt( groups[i].default, 10 ) ){

						$('.sr-rep-groups').find('option[value="' +  groups[i].id + '"]').prop('selected', true);
					}

					//update chosen plugin
					map.sr.chosen.trigger('chosen:updated');
				}
			}

			e.preventDefault();
		};

		var deleteRep = function(){

			var data;

			if(loading) return;

			if(confirm('DELETE: Are you sure?')){

				if(!map.sr.activeMarker.attr && map.sr.activeMarker){

					//remove marker
					map.sr.activeMarker.setMap(null);

					//clear inputs, hide edit window
					$('.sr-edit-info').hide().find('input').val('');				
				}
				else if(map.sr.activeMarker.attr){

					//now loading
					loading = true;
					$('.sr-loading').css('display', 'block');

					//create data to send
					data = { id: map.sr.activeMarker.attr.id };

					//do ajax, remove from DB
					$.ajax({

						'data' : data,
						'dataType' : 'json',
						'type' : 'POST',
						'url' : 'admin/delete/'

					}).then(function(data){

						//if deleted successfully, remove marker
						if(data.success){

							//hide edit window
							$('.sr-edit-info').css('display', 'none');

							//remove marker
							map.sr.activeMarker.setMap(null);
						}

						//not loading
						loading = false;
						$('.sr-loading').css('display', 'none');

					}, function(){

						//not loading
						loading = false;
						$('.sr-loading').css('display', 'none');

						//show error message
						showErrorMessage('Cannot Delete, Try Again and Contact Administrator if Problem Persists.');
					});		
				}
			}
		};

		return {

			init: init
		}
	})();

	//start admin
	admin.init(); 
});