$(function(){

	var srep = (function(){

		// Private Vars
		//////////////////////
		var map,
			infoWindow,
			options,
			color,
			$locator = $('#sr-locator'),
			$info = $('#sr-reps-info'),
			$selectMenu,
			$countryMenu,
			$locationMenu,
			selectedCountry = false,
			selectedLocation = false,
			markers = [],
			countries = false,
			locations = false,
			reps = false;

		// Intialize
		//////////////////////
		var init = function(){

			//load user options
			$.ajax(baseURL + 'options/get').done(function(result){ 

				//get admin options
				options = result;

				//set options to int
				options.groups = parseInt( options.groups, 10 );

				//ajax on load, retrieve all db records
				$.ajax({

					url : baseURL + 'reps/all'
				})
				.done(function(data){

					var groupId;

					//store info
					countries = data.countries;
					locations = data.locations;
					reps      = data.reps;
					
					//create map, center on USA
					map = new google.maps.Map(document.getElementById("sr-map"), {

						center: new google.maps.LatLng(38.555474, -95.664999),
						zoom: 4,
						mapTypeId: google.maps.MapTypeId.ROADMAP
					});

					//create info window	
					infoWindow = new google.maps.InfoWindow();

					//if groups are enable
					if( options.groups ){

						//get map id
						groupId =  $('#sr-map').data('group-id');
						groupId = parseInt(groupId, 10);

						//get color
						color = $('#sr-map').data('color');

						if(groupId){

							//filter reps
							reps 	  = filterGroups(reps, groupId);
							locations = filterLocations(reps, locations);
							countries = filterCountries(reps, countries);
						}
					}

					//create selectMenu
					createSelectMenu();

					//create reps
					createReps();

					//create event for info box
					$info.on('mouseenter', '.sr-rep', markerBounce);
					$info.on('mouseleave', '.sr-rep', markerBounceStop);
				});
			});
		};

		// Private Functions
		//////////////////////
		var createSelectMenu = function(){

			var $label;

			//create select menu
			$selectMenu = $('<section />', { class: 'sr-select-menu' });

			//create label
			$label = $('<section />', { class: 'sr-select-label '})
			.html('Select a Location: ');

			//append label to select menu
			$selectMenu.append( $label );

			//create sub menus
			createCountryMenu();
			createLocationMenu();

			//append select menu to locator
			$locator.append( $selectMenu );
		};

		var createCountryMenu = function(){

			var select,
				option,
				i, l;

			//if more than 1 country
			if( countries.length > 1 ){

				//create country menu
				$countryMenu = $('<section />', { class: 'sr-select-country' });

				//create country dropdown
				select = $('<select />', { class: 'sr-countries' });

				//for each country create an option
				for(i = 0, l = countries.length; i < l; ++i){

					//create option
					option = $('<option />', {
						html: countries[i].long_name,
						value: countries[i].id
					});

					//add as selected if US
					if( countries[i].short_name === 'US' ){

						option.attr('selected', 'selected');

						selectedCountry = countries[i];

						//make top option
						select.prepend(option);
					}
					else{

						//append option to select element
						select.append(option);
					}
				}

				//if no selected country, select first
				if( !selectedCountry ){

					//default country
					selectedCountry = countries[0];
				}

				//bind event
				select.on('change', countryChange);

				//append select to country menu
				$countryMenu.append( select );

				//append country menu to container
				$selectMenu.append( $countryMenu );

				//initialize chosen plugin
				select.chosen({ 
					disable_search_threshold: 10,
					width: '100%'
				});
			}
			else{

				//default country is first
				selectedCountry = countries[0];
			}
		};

		var countryChange = function(){

			var id = $(this).find(':selected').val(),
				coords,
				i, l;

			//for each country find selected
			for(i = 0, l = countries.length; i < l; ++i){

				//if match
				if( countries[i].id === id ){

					//change selected
					selectedCountry = countries[i];

					//update location menu
					updateLocationMenu();

					//store coords
					coords = new google.maps.LatLng(countries[i].lat, countries[i].lng);

					//update map
					map.setCenter( coords );
					map.setZoom( 4 );

					//clear reps
					clearReps();

					//create reps
					createReps();

					//close info window
					infoWindow.close();

					break;
				}
			}
		};

		var createLocationMenu = function(){

			var selected = [],
				select,
				option,
				i, l, x, y;

			//create location menu
			$locationMenu = $('<section />', { class: 'sr-select-location' });

			//for each location create an option
			for(i = 0, l = locations.length; i < l; ++i){

				//skip if not correct id
				if( locations[i].country_id != selectedCountry.id ) continue;

				//add to selected array
				selected.push( locations[i] );
			}

			//if we have locations selected, create menu
			if( selected.length > 1 ){

				//create location dropdown
				select = $('<select />', { class: 'sr-locations' });

				//for each selected
				for(x = 0, y = selected.length; x < y; ++x){

					//create option
					option = $('<option />', {
						html: selected[x].long_name,
						value: selected[x].id
					});

					//append option to select element
					select.append(option);
				}

				//create default option
				option = $('<option />', {
					html: '--- Select a Location ---',
					selected: 'selected',
					value: '0'
				})
				.prependTo( select );

				//bind event
				select.on('change', locationChange);

				//append select to location menu
				$locationMenu.append( select );

				//append location menu to container
				$selectMenu.append( $locationMenu );

				//initialize chosen plugin
				select.chosen({ 
					disable_search_threshold: 10,
					width: '100%'
				});
			}
		};

		var updateLocationMenu = function(){

			var selected = [],
				select,
				option,
				i, l, x, l;

			//remove existing menu
			$locationMenu.empty();

			//no location selected
			selectedLocation = false;

			//for each location create an option
			for(i = 0, l = locations.length; i < l; ++i){

				//skip if not correct id
				if( locations[i].country_id != selectedCountry.id ) continue;

				//add to selected array
				selected.push( locations[i] );
			}

			//if we have locations selected, create menu
			if( selected.length > 1 ){

				//create location dropdown
				select = $('<select />', { class: 'sr-locations' });

				//for each selected
				for(x = 0, y = selected.length; x < y; ++x){

					//create option
					option = $('<option />', {
						html: selected[x].long_name,
						value: selected[x].id
					});

					//append option to select element
					select.append(option);
				}

				//create default option
				option = $('<option />', {
					html: '--- Select a Location ---',
					selected: 'selected',
					value: '0'
				})
				.prependTo( select );

				//bind event
				select.on('change', locationChange);

				//append select to location menu
				$locationMenu.append( select );

				//append location menu to container
				$selectMenu.append( $locationMenu );

				//initialize chosen plugin
				select.chosen({ 
					disable_search_threshold: 10,
					width: '100%'
				});
			}
		};

		var locationChange = function(){

			var id = $(this).find(':selected').val();

			//for each location find selected
			for(i = 0, l = locations.length; i < l; ++i){

				//if match
				if( locations[i].id === id ){

					//change selected
					selectedLocation = locations[i];

					//store coords
					coords = new google.maps.LatLng(locations[i].lat, locations[i].lng);

					//update map
					map.setCenter( coords );
					map.setZoom( 6 );

					//clear reps
					clearReps();

					//create reps
					createReps(true);

					break;
				}
			}

			//close info window
			infoWindow.close();
		};

		var createReps = function(animate){

			var $rep,
				coords,
				marker,
				markerCount,
				h2,
				html = '',
				i, l;

			//find if we need to animate
			animate = typeof animate !== 'undefined' ? true : false;

			for(i = 0, l = reps.length; i < l; ++i){

				if( selectedCountry ){ //if country is selected

					//make sure country id matches
					if( reps[i].country_id != selectedCountry.id ) continue;
				}

				if( selectedLocation ){ //if location is selected

					//make sure location id matches
					if( reps[i].location_id != selectedLocation.id ) continue;
				}

				//store location
				coords = new google.maps.LatLng(reps[i].lat, reps[i].lng);

				//add animation if option is set
				if(animate){

					//if color is selected
					if(color){

						//create marker
						marker = new google.maps.Marker({

							animation: google.maps.Animation.DROP,
							icon: baseURL + 'assets/img/marker-' + color + '.png',
							map: map,
							position: coords
						});
					}
					else{

						//create marker
						marker = new google.maps.Marker({

							animation: google.maps.Animation.DROP,
							map: map,
							position: coords
						});
					}
				}
				else{

					if(color){

						//create marker
						marker = new google.maps.Marker({

							icon: baseURL + 'assets/img/marker-' + color + '.png',
							map: map,
							position: coords
						});
					}
					else{

						//create marker
						marker = new google.maps.Marker({

							map: map,
							position: coords
						});
					}
				}

				//parse rep
				$rep = parseText( reps[i] );

				$info.append( $rep.clone() );

				//set attributes
				marker.attr = {

					id : reps[i].id,
					content : $rep,
					lat : reps[i].lat,
					lng : reps[i].lng
				}

				//add click event
				google.maps.event.addListener(marker, 'click', markerClick);

				//add to markers array
				markers.push(marker);
			}

			//if there are reps
			if( markers.length > 0 ){

				//create h2
				h2 = $('<h2 />');

				//create inner html
				if( selectedLocation ) html = selectedLocation.long_name + ', ';
				if( selectedCountry ) html += selectedCountry.long_name + ' - ';

				html += markers.length + ' Located';

				//store html
				h2.html(html);

				//prepend h2
				$info.prepend(h2);
			}
		};

		var clearReps = function(){

			var i, l;

			//for each marker
			for(i = 0, l = markers.length; i < l; ++i){

				//remove
				markers[i].setMap(null);
			}

			//empty info window
			$info.empty();

			//set markers as empty
			markers.length = 0;
		}

		var markerClick = function(){

			//stop any running animations
			markerBounceStop();

			//if any content
			if( this.attr.content.html().trim() ){

				//add content to info window
				infoWindow.setContent( this.attr.content[0] );

				//open info window
				infoWindow.open(map, this);
			}
		};

		var markerBounce = function(){

			var id = $(this).attr('id'),
				i, l;

			for(i = 0, l = markers.length; i < l; ++i){

				if(markers[i].attr.id === id){

					markers[i].setAnimation( google.maps.Animation.BOUNCE );
				}
				else{

					markers[i].setAnimation( null );
				}
			}
		};

		var markerBounceStop = function(){

			var i, l;

			for(i = 0, l = markers.length; i < l; ++i){

				markers[i].setAnimation( null );
			}
		};

		var parseText = function(rep){

			var $content,
				name,
				company,
				email,
				address,
				city,
				state,
				zip,
				phone,
				cell,
				fax,
				web;

			//create div
			$content = $('<div />', { 
				class: 'sr-rep',
				id: rep.id
			});

			//create shorthand names
			name    = ( rep.name )    ? rep.name.trim()    : false;
			company = ( rep.company ) ? rep.company.trim() : false;
			email   = ( rep.email )   ? rep.email.trim()   : false;
			address = ( rep.address ) ? rep.address.trim() : false;
			city    = ( rep.city )    ? rep.city.trim()    : false;
			state   = ( rep.state )   ? rep.state.trim()   : false;
			zip     = ( rep.zip )     ? rep.zip.trim()     : false;
			phone   = ( rep.phone )   ? rep.phone.trim()   : false;
			cell    = ( rep.cell )    ? rep.cell.trim()    : false;
			fax     = ( rep.fax )     ? rep.fax.trim()     : false;
			web     = ( rep.web )     ? rep.web.trim()     : false;

			//parse text
			if( name ) 
				$content.append( parseName( name ) );
			if( company ) 
				$content.append( parseCompany( company ) );
			if( email ) 
				$content.append( parseEmail( email ) );
			if( address ) 
				$content.append( parseAddress( address ) );
			if( city || state || zip )
				$content.append( parseAddress2( city, state, zip ) );
			if( phone ) 
				$content.append( parsePhone( phone ) );
			if( cell ) 
				$content.append( parseCell( cell ) );
			if( fax ) 
				$content.append( parseFax( fax ) );
			if( web ) 
				$content.append( parseWeb( web ) );

			return $content;
		};

		var parseName = function(name){

			return $('<div />').html(name);
		};

		var parseCompany = function(company){

			return $('<div />').html(company);
		};

		var parseEmail = function(email){

			var link;

			link = $('<a />', {

				href: 'mailto:' + email
			})
			.html(email);

			return $('<div />').append( link );
		};

		var parseAddress = function(address){

			return $('<div />').html(address);
		};

		var parseAddress2 = function(city, state, zip){

			var text = '';

			//text for various combinations of city, state, and/or zip
			if(city && state){

				text = city + ', ' + state;

				if(zip){

					text += ' ' + zip;
				}
			}
			else if(city || state){

				if(city && zip){ 

					text = city + ', ' + zip;
				}
				else if(city && !zip){

					text = city;
				}
				else if(state && zip){

					text = state + ', ' + zip;
				}
				else{

					text = state;
				}
			}
			else{

				text = zip;
			}

			return $('<div />').html(text);
		};

		var parsePhone = function(phone){

			var link;

			link = $('<a />', {

				href: 'mailto:' + phone
			})
			.html(phone);

			return $('<div />').append( 'Phone: ', link );
		};

		var parseCell = function(cell){

			var link;

			link = $('<a />', {

				href: 'mailto:' + cell
			})
			.html(cell);

			return $('<div />').append( 'Cell: ', link );
		};

		var parseFax = function(fax){

			return $('<div />').html('Fax: ' + fax);
		};

		var parseWeb = function(web){

			var link;

			link = $('<a />',{

				href: web
			})
			.html(web);

			return $('<div />').append( link );
		};

		var filterGroups = function(reps, groupId){

			var newReps = [],
				groups,
				id,
				i, l, x, y;

			for(i = 0, l = reps.length; i < l; ++i){

				//if groups
				if(reps[i].groups){

					//get groups
					groups = reps[i].groups;

					for(x = 0, y = groups.length; x < y; ++x){

						//store id
						id = parseInt(groups[x], 10);

						//if match
						if( id === groupId ){

							//add to new reps
							newReps.push(reps[i]);

							break;
						}
					}
				}
			}

			return newReps;
		}

		var filterLocations = function(reps, locations){

			var newLocations = [],
				locationId,
				i, l, x, y;

			for(i = 0, l = reps.length; i < l; ++i){

				//if location id
				if(reps[i].location_id){

					//store location id
					locationId = parseInt(reps[i].location_id, 10);

					for(x = 0, y = locations.length; x < y; ++x){

						//if match
						if( locationId === parseInt( locations[x].id, 10 ) ){

							//add to locations if not already there
							if( !isInArray(locations[x], newLocations) ){

								newLocations.push( locations[x] );
							}
						}
					}
				}
			}

			return newLocations.sort(alphabetical);
		}

		var filterCountries = function(reps, countries){

			var newCountries = [],
				countryId,
				i, l, x, y;

			for(i = 0, l = reps.length; i < l; ++i){

				//if country id
				if(reps[i].country_id){

					//store country id
					countryId = parseInt(reps[i].country_id, 10);

					for(x = 0, y = countries.length; x < y; ++x){

						//if match
						if( countryId === parseInt( countries[x].id, 10 ) ){

							//add to countries if not already there
							if( !isInArray(countries[x], newCountries) ){

								newCountries.push( countries[x] );
							}
						}
					}
				}
			}

			return newCountries.sort(alphabetical);
		}

		function alphabetical(a, b){

			if(a.long_name < b.long_name)
				return -1;
			if(a.long_name > b.long_name)
				return 1;
			return 0;
		}

		function isInArray(value, array){

  			return array.indexOf(value) > -1;
		}

		return{

			init: init
		}
	})();

	//start map
	if( $('#sr-map').length > 0 ) srep.init(); 
});