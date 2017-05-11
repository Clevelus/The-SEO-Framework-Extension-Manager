/**
 * This file holds The SEO Framework Extension Manager plugin's JS code.
 * Serve JavaScript as an addition, not as an ends or means.
 *
 * @author Sybre Waaijer https://cyberwire.nl/
 * @link https://wordpress.org/plugins/the-seo-framework-extension-manager/
 */

/**
 * The SEO Framework - Extension Manager plugin
 * Copyright (C) 2016-2017 Sybre Waaijer, CyberWire (https://cyberwire.nl/)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as published
 * by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @output_file_name tsfem.min.js
// @externs_url https://raw.githubusercontent.com/google/closure-compiler/master/contrib/externs/jquery-1.9.js
// @externs_url https://raw.githubusercontent.com/sybrew/The-SEO-Framework-Extension-Manager/master/lib/js/tsfem.externs.js
// ==/ClosureCompiler==
// http://closure-compiler.appspot.com/home

/**
 * Holds tsfem values in an object to avoid polluting global namespace.
 *
 * @since 1.0.0
 *
 * @constructor
 */
window[ 'tsfem' ] = {

	/**
	 * @since 1.0.0
	 * @type {String} nonce Ajax nonce
	 */
	nonce : tsfemL10n.nonce,

	/**
	 * @since 1.0.0
	 * @param {Object} i18n Localized strings
	 */
	i18n : tsfemL10n.i18n,

	/**
	 * @since 1.0.0
	 * @param {Boolean|undefined} rtl RTL enabled
	 */
	rtl : tsfemL10n.rtl,

	/**
	 * @since 1.0.0
	 * @param {Boolean|undefined} debug Debugging enabled
	 */
	debug : tsfemL10n.debug,

	/**
	 * @since 1.0.0
	 * @param {Boolean} touchBuffer Maintains touch-buffer
	 */
	touchBuffer : false,

	/**
	 * Sets touch buffer to set ms. After which it resets.
	 *
	 * @since 1.0.0
	 *
	 * @function
	 * @param {integer} ms The touch buffer in miliseconds.
	 */
	setTouchBuffer: function( ms ) {
		'use strict';

		tsfem.touchBuffer = true;

		setTimeout( function() {
			tsfem.touchBuffer = false;
		}, ms );
	},

	/**
	 * Initializes the description balloon hover and click actions.
	 *
	 * @since 1.0.0
	 *
	 * @function
	 */
	initDescHover: function() {
		'use strict';

		var elem = '.tsfem-has-hover-balloon',
			$item = jQuery( elem );

		/**
		 * Clear all handlers and callbacks, prevent action stack. Yes, also third party callbacks.
		 * There's a change for a bug through plugin conflict, although extremely low.
		 * Why would other plugins even start interfering with the namespaced description elements?
		 */
		$item.off( 'mouseenter mousemove mouseleave mouseout' );
		$item.children( '*' ).off( 'mouseenter mousemove mouseleave' );

		//* Clear body handler + callback.
		jQuery( document.body ).off( 'click touchstart MSPointerDown', tsfem.touchLeaveDescHover );

		//* Force delagation.
		$item.children( '*' ).on( {
			mouseenter: function( event ) {
				jQuery( event.target ).parents( elem ).trigger( 'mouseenter' );
			},
			mousemove: function( event ) {
				jQuery( event.target ).parents( elem ).trigger( 'mousemove', event.pageX );
			},
			mouseleave: function( event ) {
				jQuery( event.target ).parents( elem ).trigger( 'mouseleave' );
			},
		} );

		/**
		 * mouseout is required for when hovering through the balloon on non-bubbled items.
		 * mouseleave is in favor of mouseout for bubbled and/or propagated items to prevent flickering.
		 */
		$item.on( {
			'mouseenter' : tsfem.enterDescHover,
			'mousemove'  : tsfem.moveDescHover,
			'mouseleave' : tsfem.leaveDescHover,
			'mouseout'   : tsfem.leaveDescHover,
		} );

		jQuery( document.body ).on( 'click touchstart MSPointerDown', tsfem.touchLeaveDescHover );
	},

	/**
	 * Animates the description balloon and arrow on mouse or touch enter.
	 *
	 * @since 1.0.0
	 * TODO compare this with TSF, I believe it has a bugfix.
	 *
	 * @function
	 * @param {jQuery.event} event jQuery event
	 * @return {boolean} false If event is propagated.
	 */
	enterDescHover: function( event ) {
		'use strict';

		var $item = jQuery( event.target );

		if ( ! $item.hasClass( 'tsfem-has-hover-balloon' ) )
			return false;

		var desc = $item.data( 'desc' ),
			hasBalloon = $item.next( 'div.tsfem-desc-balloon' ).length || $item.children( 'div.tsfem-desc-balloon' ).length;

		// Only run if a desc is present and no balloon has yet been added.
		if ( desc && ! hasBalloon ) {

			// Remove default browser title behavior as this replaces it.
			// No removeProp(): "Do not use this method to remove native properties."
			$item.prop( 'title', '' );

			$item.append( '<div class="tsfem-desc-balloon"><span>' + desc + '</span><div></div></div>' );

			var $balloon = $item.children( 'div.tsfem-desc-balloon' ),
				height = $item.outerHeight() + 8;

			$balloon.css( 'bottom', height + 'px' );

			var $wrap = $balloon.closest( '.tsfem-pane-content' ),
				$text = $balloon.children( 'span' );

			// Fix overflow right. To fix left we'd have to substract width.
			// But that's not needed, yet.
			// 20 = padding
			if ( $wrap !== 'undefined' && $wrap.length > 0 ) {
				var wrapOffset = $wrap.offset().left + $wrap.outerWidth(),
					textOffset = $text.offset().left + $text.outerWidth(),
					overflown = tsfem.rtl ? textOffset < $text.width() : textOffset > ( wrapOffset - 20 );

				if ( overflown ) {
					var left = tsfem.rtl ? 'right' : 'left',
						offset = tsfem.rtl ? - ( textOffset + 20 ) : ( wrapOffset - textOffset - 20 );

					$balloon.css( left, offset + 'px' );
				}
			}
		}
	},

	/**
	 * Animates the description balloon arrow on mouse move.
	 *
	 * @since 1.0.0
	 * TODO compare this with TSF, I believe it has a bugfix.
	 *
	 * @function
	 * @param {object} event jQuery event
	 * @param {number} pageX Page X location from trigger.
	 * @return {boolean} false If event is propagated.
	 */
	moveDescHover: function( event, pageX ) {
		'use strict';

		var $item = jQuery( event.target );

		if ( ! $item.hasClass( 'tsfem-has-hover-balloon' ) )
			return false;

		let desc = $item.data( 'desc' );

		if ( desc ) {
			let $balloon = $item.children( 'div.tsfem-desc-balloon' ),
				$text = $balloon.children( 'span' );

			if ( 0 === $text.length )
				return;

			let $arrow = $balloon.children( 'div' ),
				halfArrow = $arrow.outerWidth() / 2,
				cpageX = pageX ? pageX : event.pageX,
				textOffset = $text.offset().left,
				mousex = cpageX - textOffset - halfArrow,
				left = tsfem.rtl ? 'right' : 'left';

			if ( mousex < 1 ) {
				let leftSide = tsfem.rtl ? $text.width() : 0;
				// Overflown left.
				$arrow.css( left, leftSide + 'px' );
			} else {
				let width = $text.outerWidth(),
					maxOffset = textOffset + width - halfArrow,
					overflown = cpageX > maxOffset;

				if ( overflown ) {
					// Overflown right.
					let rightSide = tsfem.rtl ? 0 : $text.width();

					$arrow.css( left, rightSide + "px" );
				} else {
					// In-between.
					let difference = tsfem.rtl ? - $text.width() : ( ( width - $text.width() ) / 2 ) - halfArrow,
						offset = tsfem.rtl ? - ( mousex + difference ) : mousex + difference;

					$arrow.css( left, offset + "px" );
				}
			}
		}
	},

	/**
	 * Removes the description balloon and arrow on mouse leave.
	 *
	 * @since 1.0.0
	 *
	 * @function
	 * @param {jQuery.event} event jQuery event
	 * @return {boolean} false If event is propagated.
	 */
	leaveDescHover: function( event ) {
		'use strict';

		if ( tsfem.touchBuffer )
			return;

		var $item = jQuery( event.target );

		if ( ! $item.hasClass( 'tsfem-has-hover-balloon' ) )
			return false;

		jQuery( event.target ).find( 'div.tsfem-desc-balloon' ).remove();
	},

	/**
	 * Removes the description balloon and arrow at aside touches or clicks.
	 *
	 * @since 1.0.0
	 * TODO iOS bugfix: can't fetch balloon anymore on remove (unless clicked on other target).
	 *
	 * @function
	 * @param {jQuery.event} event jQuery event
	 */
	touchLeaveDescHover: function( event ) {
		'use strict';

		if ( tsfem.touchBuffer )
			return;

		tsfem.setTouchBuffer( 200 );

		var $target = jQuery( event.target ),
			hasBalloon = $target.next( 'div.tsfem-desc-balloon' ).length || $target.children( 'div.tsfem-desc-balloon' ).length;

		// Do not remove if current target has balloon.
		if ( ! hasBalloon ) {
			var $item = jQuery( '.tsfem-has-hover-balloon' ),
				$balloon = $item.find( 'div.tsfem-desc-balloon' );

			if ( $balloon.length ) {
				$balloon.detach();
				//* Reset cache.
				tsfem.initDescHover();
			}
		}
	},

	/**
	 * Visualizes AJAX loading time through target class change.
	 *
	 * @since 1.0.0
	 *
	 * @function
	 * @param {string} target
	 */
	setAjaxLoader: function( target ) {
		'use strict';

		jQuery( target ).toggleClass( 'tsfem-loading' );
	},

	/**
	 * Adjusts class loaders on Ajax response.
	 *
	 * @since 1.0.0
	 *
	 * @function
	 * @param {string} target
	 * @param {number} success
	 * @param {string} notice
	 * @param {number} html
	 */
	unsetAjaxLoader: function( target, success, notice, html ) {
		'use strict';

		var newclass = 'tsfem-success',
			fade = 2500;

		if ( ! success ) {
			newclass = 'tsfem-error';
			fade = html ? 20000 : 10000;
		} else if ( 2 === success ) {
			newclass = 'tsfem-unknown';
			fade = 7500;
		}

		//* Slow down if there's a notice.
		fade = notice ? fade * 2 : fade;

		if ( html ) {
			jQuery( target ).removeClass( 'tsfem-loading' ).addClass( newclass ).html( notice ).fadeOut( fade );
		} else {
			notice = jQuery( '<span/>' ).html( notice ).text();
			jQuery( target ).removeClass( 'tsfem-loading' ).addClass( newclass ).text( notice ).fadeOut( fade );
		}
	},

	/**
	 * Cleans and resets Ajax wrapper class and contents to default.
	 * Also stops any animation and resets fadeout to beginning.
	 *
	 * @since 1.0.0
	 *
	 * @function
	 * @param {string} target
	 */
	resetAjaxLoader: function( target ) {
		'use strict';

		//* Reset CSS, with IE compat.
		jQuery( target ).stop().empty().prop( 'class', 'tsfem-ajax' ).css( { 'opacity' : '1', 'display' : 'initial' } ).prop( 'style', '' );
	},

	/**
	 * Updates the feed option.
	 *
	 * @since 1.0.0
	 *
	 * @function
	 * @param {jQuery.Event} event
	 */
	updateFeed: function( event ) {
		'use strict';

		var disabled = 'tsfem-button-disabled',
			$button = jQuery( event.target ),
			loader = '#tsfem-feed-ajax',
			status = 0;

		if ( $button.prop( 'disabled' ) )
			return;

		$button.addClass( disabled );
		$button.prop( 'disabled', true );

		//* Reset ajax loader
		tsfem.resetAjaxLoader( loader );

		//* Set ajax loader.
		tsfem.setAjaxLoader( loader );

		//* Setup external update.
		var settings = {
			method: 'POST',
			url: ajaxurl,
			datatype: 'json',
			data: {
				'action' : 'tsfem_enable_feeds',
				'nonce' : tsfem.nonce,
			},
			timeout: 12000,
			async: true,
			success: function( response ) {

				response = tsfem.convertJSONResponse( response );

				if ( tsfem.debug ) console.log( response );

				let data = response && response.data || undefined,
					type = response && response.type || undefined;

				if ( 'success' === type && data ) {

					let content = data.content;

					switch ( content.status ) {
						case 'success' :
							status = 1;

							//* Insert wrap.
							jQuery( '.tsfem-trends-wrap' ).empty().css( 'opacity', 0 ).append( content.wrap ).animate(
								{ 'opacity' : 1 },
								{ 'queue' : true, 'duration' : 250 },
								'swing'
							);

							var duration = 400,
								total = content.data.length,
								wait = 0;

							//* Calculate loader wait.
							// Remove last entry from calculation (total-1) as it has adds no timing effect.
							for ( let i = 1; i < total - 1; i++ ) {
								wait += Math.round( 400 / Math.pow( 1 + ( i / 2 ) / 100, 2 ) );
							}
							// Remove first and last entries from calculation as they have no timing effects.
							wait -= duration * 2 + 200;

							//* Loop through each issue and slowly insert it. It's run asynchronously...
							jQuery.each( content.data, function( index, value ) {
								duration = Math.round( 400 / Math.pow( 1 + ( index / 2 ) / 100, 2 ) );
								setTimeout( function() {
									jQuery( value ).hide().appendTo( '.tsfem-feed-wrap' ).slideDown( duration );
								}, 200 * index );
							} );

							//* Expected to be done in 3.858 seconds
							setTimeout( function() { tsfem.updatedResponse( loader, status, '', 0 ); }, wait );
							break;

						case 'parse_error' :
						case 'unknown_error' :
						default :
							jQuery( '.tsfem-trends-wrap' ).empty().css( 'opacity', 0 ).append( content.error_output ).css( 'opacity', 1 ).find( '.tsfem-feed-wrap' ).css(
								{ 'opacity' : 0 }
							).animate(
								{ 'opacity' : 1 },
								{ queue: true, duration: 2000 },
								'swing'
							);
							//* 2 means the feed is offline. 0 means a server parsing error.
							// Don't enable the button. Make the user reload.
							status = 'unknown_error' === content.status ? 2 : 0;
							setTimeout( function() { tsfem.updatedResponse( loader, status, tsfem.i18n['UnknownError'], 0 ); }, 1000 );
							break;
					}
				} else if ( 'unknown' === response.type ) {
					status = 2;
					settings.unknownError;
				} else {
					settings.unknownError;
				}
			},
			error: function( jqXHR, textStatus, errorThrown ) {
				let _error = tsfem.getAjaxError( jqXHR, textStatus, errorThrown );

				$button.removeClass( disabled );
				$button.prop( 'disabled', false );
				tsfem.updatedResponse( loader, 0, _error, 0 );
			},
			unknownError: function() {
				$button.removeClass( disabled );
				$button.prop( 'disabled', false );
				tsfem.updatedResponse( loader, status, tsfem.i18n['UnknownError'], 0 );
			},
			complete: function() { },
		}

		jQuery.ajax( settings );
	},

	/**
	 * Updates the selected extension state.
	 *
	 * @since 1.0.0
	 *
	 * @function
	 * @param {jQuery.event} event jQuery event
	 */
	updateExtension: function( event ) {
		'use strict';

		var disabled = 'tsfem-button-disabled',
			$button = jQuery( event.target ),
			$buttons = jQuery( '.tsfem-button-extension-activate, .tsfem-button-extension-deactivate' ).not( jQuery( '.' + disabled ) ),
			loader = '#tsfem-extensions-ajax',
			actionSlug = $button.data( 'slug' ),
			actionCase = $button.data( 'case' );

		if ( $button.prop( 'disabled' ) )
			return;

		//* Disable buttons
		$buttons.map( function() {
			jQuery( this ).addClass( disabled );
			jQuery( this ).prop( 'disabled', true );
		} );

		//* Reset ajax loader
		tsfem.resetAjaxLoader( loader );

		//* Set ajax loader.
		tsfem.setAjaxLoader( loader );

		//* Setup external update.
		var settings = {
			method: 'POST',
			url: ajaxurl,
			datatype: 'json',
			data: {
				'action' : 'tsfem_update_extension',
				'nonce' : tsfem.nonce,
				'slug' : actionSlug,
				'case' : actionCase,
			},
			timeout: 10000,
			async: true,
			success: function( response ) {

				response = tsfem.convertJSONResponse( response );

				if ( tsfem.debug ) console.log( response );

				let data = response && response.data || undefined,
					type = response && response.type || undefined;

				if ( ! data || ! type ) {
					//* Erroneous input.
					tsfem.updatedResponse( loader, 0, tsfem.i18n['InvalidResponse'], 0 );
				} else {

					var status = data.status['success'],
						notice = data.status['notice'];

					if ( -1 === status ) {
						//* Erroneous input.
						tsfem.updatedResponse( loader, 0, notice, 0 );
					} else {
						if ( 'activate' === actionCase ) {
							if ( false === status ) {
								/**
								 * Not activated as no extension has been put in.
								 * This should never happen.
								 */
								tsfem.updatedResponse( loader, 0, notice, 0 );
							} else {
								switch ( status ) {
									case 10001 :
										//* No extensions checksum found.
										tsfem.updatedResponse( loader, 0, notice, 0 );
										break;

									case 10002 :
										//* Extensions checksum mismatch.
										tsfem.updatedResponse( loader, 0, notice, 0 );
										break;

									case 10003 :
										//* Method outcome mismatch.
										tsfem.updatedResponse( loader, 0, notice, 0 );
										break;

									case 10004 :
										//* Account isn't allowed to use premium extension.
										tsfem.updatedResponse( loader, 0, notice, 0 );
										break;

									case 10005 :
										//* Extension caused fatal error.
										tsfem.updatedResponse( loader, 0, notice, 1 );
										//* Update hover cache.
										tsfem.initDescHover();
										// TODO set copy error button.
										break;

									case 10006 :
										//* Option update failed for unknown reason. Maybe overload.
										tsfem.updatedResponse( loader, 2, notice, 0 );
										break;

									default :
										//* Extension is activated.
										$button.removeClass( 'tsfem-button-extension-activate' ).addClass( 'tsfem-button-extension-deactivate' );
										$button.data( 'case', 'deactivate' );
										$button.text( tsfem.i18n['Deactivate'] );
										tsfem.updatedResponse( loader, 1, notice, 0 );
										jQuery( '#' + actionSlug + '-extension-entry' ).removeClass( 'tsfem-extension-deactivated' ).addClass( 'tsfem-extension-activated' );
										tsfem.updateExtensionDescFooter( actionSlug, actionCase );
										break;
								}
							}
						} else if ( 'deactivate' === actionCase ) {
							if ( false === status ) {
								//* Not deactivated.
								tsfem.updatedResponse( loader, 0, notice, 0 );
							} else {
								//* Deactivated.
								$button.removeClass( 'tsfem-button-extension-deactivate' ).addClass( 'tsfem-button-extension-activate' );
								$button.data( 'case', 'activate' );
								$button.text( tsfem.i18n['Activate'] );
								tsfem.updatedResponse( loader, 1, notice, 0 );
								jQuery( '#' + actionSlug + '-extension-entry' ).removeClass( 'tsfem-extension-activated' ).addClass( 'tsfem-extension-deactivated' );
								tsfem.updateExtensionDescFooter( actionSlug, actionCase );
							}
						} else {
							//* Erroneous input.
							tsfem.updatedResponse( loader, 0, tsfem.i18n['UnknownError'], 0 );
						}
					}
				}
			},
			error: function( jqXHR, textStatus, errorThrown ) {
				let _error = tsfem.getAjaxError( jqXHR, textStatus, errorThrown );
				tsfem.updatedResponse( loader, 0, _error, 0 );
			},
			complete: function() {
				$buttons.removeClass( disabled );
				$buttons.prop( 'disabled', false );
			},
		}

		jQuery.ajax( settings );
	},

	/**
	 * Tries to convert JSON response to values if not already set.
	 *
	 * @since 1.2.0
	 *
	 * @function
	 * @param {(Object|Array|String|undefined)} response
	 * @return {(Object|Array|undefined)}
	 */
	convertJSONResponse: function( response ) {
		'use strict';

		let testJSON = response.json || false,
			isJSON = 1 === testJSON || false;

		if ( ! isJSON ) {
			let _response = response;

			try {
				response = jQuery.parseJSON( response );
				isJSON = true;
			} catch ( error ) {
				isJSON = false;
			}

			if ( ! isJSON ) {
				// Reset response.
				response = _response;
			}
		}

		return response;
	},

	/**
	 * Visualizes the AJAX response to the user.
	 *
	 * @since 1.0.0
	 *
	 * @function
	 * @param {String} target
	 * @param {Integer} success 0 = error, 1 = success, 2 = unknown but success.
	 * @param {String} notice The updated notice.
	 * @param {Integer} html
	 */
	updatedResponse: function( target, success, notice, html ) {
		'use strict';

		switch ( success ) {
			case 0 :
				tsfem.unsetAjaxLoader( target, 0, notice, html );
				break;
			case 1 :
				tsfem.unsetAjaxLoader( target, 1, notice, html );
				break;
			case 2 :
				tsfem.unsetAjaxLoader( target, 2, notice, html );
				break;
			default :
				tsfem.resetAjaxLoader( target );
				break;
		}
	},

	/**
	 * Returns bound AJAX reponse error with the help from i18n.
	 *
	 * @since 1.0.0
	 *
	 * @function
	 * @param {(jQuery.xhr|jqXHR|Object)} jqXHR
	 * @param {String} textStatus
	 * @param {String} errorThrown
	 * @return {String}
	 */
	getAjaxError: function( jqXHR, textStatus, errorThrown ) {
		'use strict';

		if ( tsfem.debug ) {
			console.log( jqXHR.responseText );
			console.log( errorThrown );
		}

		let _error = '';

		switch ( errorThrown ) {
			case 'abort' :
			case 'timeout' :
				_error = tsfem.i18n['TimeoutError'];
				break;

			case 'Internal Server Error' :
				_error = tsfem.i18n['FatalError'];
				break;

			case 'parsererror' :
				_error = tsfem.i18n['ParseError'];
				break;

			default :
				// @TODO use ajaxOptions.status? i.e. 400, 401, 402, 503.
				_error = tsfem.i18n['UnknownError'];
				break;
		}

		return _error;
	},

	/**
	 * Converts multidimensional arrays to single array with key wrappers.
	 * All first array keys become the new key. The final value becomes its value.
	 *
	 * Great for creating form array keys.
	 * matosa: "Multidimensional Array TO Single Array"
	 *
	 * The latest value must be scalar.
	 *
	 * Example: a = [ 1 => [ 2 => [ 3 => [ 'value' ] ] ] ];
	 * Becomes: '1[2][3]' => 'value';
	 *
	 * @since 1.2.0
	 *
	 * @param {(String|Object)} value The array or string to loop.
	 * @param {String} start The start wrapper.
	 * @param {String} end The end wrapper.
	 * @return {(Object|Boolean)} The iterated array to string. False if input isn't array.
	 */
	matosa: function( value, start, end ) {
		'use strict';

		start = start || '[';
		end = end || ']';

		var last = null,
			output = '';

		(function _matosa( _value, _i ) {
			_i++;
			if ( typeof _value === 'object' ) {
				let _index, _item;
				for ( _index in _value ) {
					_item = _value[ _index ];
				}

				last = _item;

				if ( 1 === _i ) {
					output += _index + _matosa( _item, _i );
				} else {
					output += start + _index + end + _matosa( _item, _i );
				}
			} else if ( 1 === _i ) {
				last = null;
				return output = false;
			}

			return output;
		})( value, 0 );

		if ( false === output )
			return false;

		let retval = {};
		retval[ output ] = last;

		return retval;
	},

	/**
	 * Gets and inserts the AJAX response for the Extension Description Footer.
	 *
	 * @since 1.0.0
	 *
	 * @function
	 * @param {String} actionSlug The extension slug.
	 * @param {String} actionCase The update case. Either 'activate' or 'deactivate'.
	 */
	updateExtensionDescFooter: function( actionSlug, actionCase ) {
		'use strict';

		var settings = {
			method: 'POST',
			url: ajaxurl,
			datatype: 'json',
			data: {
				'action' : 'tsfem_update_extension_desc_footer',
				'nonce' : tsfem.nonce,
				'slug' : actionSlug,
				'case' : actionCase,
			},
			timeout: 3000,
			async: true,
			success: function( response ) {

				response = tsfem.convertJSONResponse( response );

				if ( tsfem.debug ) console.log( response );

				let data = response && response.data || undefined,
					type = response && response.type || undefined;

				if ( data ) {

					var $footer = jQuery( '#' + actionSlug + '-extension-entry .tsfem-extension-description-footer' ),
						direction = 'activate' === actionCase ? 'up' : 'down';

					$footer.addClass( 'tsfem-flip-hide-' + direction );

					setTimeout( function() {
						$footer.empty().append( data );
						//* Update hover cache.
						tsfem.initDescHover();
					}, 250 );
					setTimeout( function() {
						$footer.addClass( 'tsfem-flip-show-' + direction );
					}, 500 );
					setTimeout( function() {
						$footer.removeClass( 'tsfem-flip-hide-' + direction + ' tsfem-flip-show-' + direction );
					}, 750 );
				}
			},
			error: function( jqXHR, textStatus, errorThrown ) {
				// Don't invoke anything fancy, yet. This is automatically called.
				if ( tsfem.debug ) {
					console.log( jqXHR.responseText );
					console.log( errorThrown );
				}
			},
			complete: function() { },
		}

		jQuery.ajax( settings );
	},

	/**
	 * Prevents browser default actions.
	 *
	 * @since 1.0.0
	 *
	 * @function
	 * @param {Object} event jQuery event
	 */
	preventDefault: function( event ) {
		'use strict';

		event.preventDefault();
		event.stopPropagation();
	},

	/**
	 * Resets switcher button to original state if clicked outside of its wrap.
	 *
	 * @since 1.0.0
	 *
	 * @function
	 * @param {Object} event jQuery event
	 */
	resetSwitcher: function( event ) {
		'use strict';

		var $switcher = jQuery( '.tsfem-switch-button-container > input[type="checkbox"]:checked' );

		if ( 'undefined' !== typeof $switcher && $switcher.length > 0 ) {
			var $wrap = $switcher.parents( '.tsfem-switch-button-container-wrap' );

			if ( jQuery( event.target ).closest( $wrap ).length < 1 ) {
				$switcher.prop( 'checked', false );
			}
		}
	},

	/**
	 * Sets last uneven extension wrapper to be the same width as the first.
	 *
	 * @since 1.0.0
	 * @todo set Resizebuffer rather than use jQ().delay().
	 *
	 * @function
	 */
	setLastExtensionEntry: function() {
		'use strict';

		var $extensions = jQuery( '.tsfem-extensions-overview-content' ).children( '.tsfem-extension-entry-wrap' ),
			amount = $extensions.length;

		if ( amount % 2 && amount > 2 ) {
			//* Uneven amount.
			var $first = $extensions.first(),
				$last = $extensions.last();

			if ( window.innerWidth < 782 ) {
				$last.delay( 10 ).css( { 'max-width' : '' } );
			} else {
				$last.delay( 10 ).css( { 'max-width' : $first.width() } );
			}
		}
	},

	/**
	 * Initialises all aspects of the scripts.
	 *
	 * Generally ordered with stuff that inserts new elements into the DOM first,
	 * then stuff that triggers an event on existing DOM elements when ready,
	 * followed by stuff that triggers an event only on user interaction. This
	 * keeps any screen jumping from occuring later on.
	 *
	 * @since 1.0.0
	 *
	 * @param {Object} jQ jQuery
	 * @function
	 */
	ready: function( jQ ) {
		'use strict';

		// Move the page updates notices below the top-wrap.
		jQ( 'div.updated, div.error, div.notice-warning' ).insertAfter( 'section.tsfem-top-wrap' );

		// AJAX feed update.
		jQ( 'a#tsfem-enable-feeds' ).on( 'click', tsfem.updateFeed );

		// AJAX extension update.
		jQ( 'a.tsfem-button-extension-activate, a.tsfem-button-extension-deactivate' ).on( 'click', tsfem.updateExtension );

		// AJAX on-heartbeat active extension check to update buttons accordingly on multi-admin sites or after timeout. @TODO
		//jQ( document ).on( 'heartbeat-tick', tsfem.checkExtensions );

		// Disable semi-disabled buttons.
		jQ( 'a.tsfem-button-disabled' ).on( 'click', tsfem.preventDefault );

		// Initialize the balloon hover effects.
		jQ( document.body ).ready( tsfem.initDescHover );

		// Proportionate uneven amounts of extension entry boxes.
		jQ( document.body ).ready( tsfem.setLastExtensionEntry );
		jQ( window ).on( 'resize orientationchange', tsfem.setLastExtensionEntry );

		// Reset switcher button to default on non-click.
		jQ( window ).on( 'click touchend MSPointerUp', tsfem.resetSwitcher );
	}
};
jQuery( tsfem.ready );