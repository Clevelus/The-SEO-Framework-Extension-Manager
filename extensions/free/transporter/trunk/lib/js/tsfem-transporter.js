/**
 * This file holds Transporter extension for The SEO Framework plugin's JS code.
 * Serve JavaScript as an addition, not as an ends or means.
 *
 * @author Sybre Waaijer https://cyberwire.nl/
 * @pluginURI https://wordpress.org/plugins/the-seo-framework-extension-manager/
 */

/**
 * Transporter extension for The SEO Framework
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
// @output_file_name tsfem_e_transporter.min.js
// @externs_url https://raw.githubusercontent.com/google/closure-compiler/master/contrib/externs/jquery-1.9.js
// @externs_url https://raw.githubusercontent.com/sybrew/The-SEO-Framework-Extension-Manager/master/lib/js/tsfem.externs.js
// @externs_url https://raw.githubusercontent.com/sybrew/The-SEO-Framework-Extension-Manager/master/extensions/free/transporter/trunk/lib/js/tsfem-transporter.externs.js
// ==/ClosureCompiler==
// http://closure-compiler.appspot.com/home

/**
 * Holds tsfem_e_transporter values in an object to avoid polluting global namespace.
 *
 * @since 1.0.0
 *
 * @constructor
 */
window[ 'tsfem_e_transporter' ] = {

	/**
	 * @since 1.0.0
	 * @param {String} nonce Ajax nonce
	 */
	nonce : tsfem_e_transporterL10n.nonce,

	/**
	 * @since 1.0.0
	 * @param {Array} i18n Localized strings
	 */
	i18n : tsfem_e_transporterL10n.i18n,

	requestExport: function( event ) {
		'use strict';

		var loading = 'tsfem-button-disabled tsfem-button-loading',
			$button = jQuery( event.target ),
			loader = '#tsfem-e-transporter-settings-pane .tsfem-pane-header .tsfem-ajax';

		if ( $button.prop( 'disabled' ) )
			return;

		$button.addClass( loading );
		$button.prop( 'disabled', true );

		//* Reset ajax loader
		tsfem.resetAjaxLoader( loader );

		//* Set ajax loader.
		tsfem.setAjaxLoader( loader );

		//* Get external data.
		let settings = {
			method: 'POST',
			url: ajaxurl,
			datatype: 'json',
			data: {
				'action' : 'tsfem_e_transporter_request_export',
				'nonce' : tsfem_e_transporter.nonce,
			},
			timeout: 10000,
			async: true,
			success: function( response ) {

				response = tsfem.convertJSONResponse( response );

				if ( tsfem.debug ) console.log( response );

				let data = response && response.data || undefined,
					type = response && response.type || undefined;

				if ( ! data || ! type ) {
					//* Erroneous output.
					tsfem.updatedResponse( loader, 0, tsfem.i18n['InvalidResponse'], 0 );
				} else {

					let status = data.type,
						html = data.html,
						notice = data.notice;

					if ( 'success' === status ) {
						if ( html ) {
							//* Expected to be inputting a single div.
							jQuery( '.tsfem-e-transporter-step-2' ).empty().css( 'opacity', 0 ).append( html ).animate(
								{ 'opacity' : 1 },
								{ queue: true, duration: 1000 },
								'swing'
							);
						} else {
							/* TODO error handling?
							let issuesOutput = '<div class="tsfem-pane-inner-wrap tsfem-e-monitor-issues-wrap tsfem-flex tsfem-flex-row">' + issues.data + '</div>';

							jQuery( '.tsfem-e-transporter-steps' ).empty().css( 'opacity', 0 ).append( issuesOutput ).animate(
								{ 'opacity' : 1 },
								{ queue: true, duration: 1000 },
								'swing'
							);*/
						}

						setTimeout( function() { tsfem.updatedResponse( loader, 1, notice, 0 ); }, 1000 );
					} else {
						tsfem.updatedResponse( loader, 0, notice, 0 );
					}
				}
			},
			error: function( xhr, ajaxOptions, thrownError ) {
				if ( tsfem.debug ) {
					console.log( xhr.responseText );
					console.log( thrownError );
				}
				tsfem.updatedResponse( loader, 0, '', 0 );
			},
			complete: function() {
				$button.removeClass( loading );
				$button.prop( 'disabled', false );
			},
		}

		jQuery.ajax( settings );
	},


	requestDownload: function( event ) {
		'use strict';

		var loading = 'tsfem-button-disabled tsfem-button-loading',
			$button = jQuery( event.target ),
			loader = '#tsfem-e-transporter-settings-pane .tsfem-pane-header .tsfem-ajax';

		if ( $button.prop( 'disabled' ) )
			return;

		$button.addClass( loading );
		$button.prop( 'disabled', true );

		//* Reset ajax loader
		tsfem.resetAjaxLoader( loader );

		//* Set ajax loader.
		tsfem.setAjaxLoader( loader );

		//* Get external data.
		let settings = {
			method: 'POST',
			url: ajaxurl,
			datatype: 'json',
			data: {
				'action' : 'tsfem_e_transporter_request_download',
				'nonce' : tsfem_e_transporter.nonce,
			},
			timeout: 10000,
			async: true,
			success: function( response ) {

				response = tsfem.convertJSONResponse( response );

				if ( tsfem.debug ) console.log( response );

				let data = response && response.data || undefined,
					type = response && response.type || undefined;

				if ( ! data || ! type ) {
					//* Erroneous output.
					tsfem.updatedResponse( loader, 0, tsfem.i18n['InvalidResponse'], 0 );
					settings._complete();
				} else {

					let results = data.results,
						code = results.code,
						notice = results.notice,
						success = results.success;

					if ( success ) {
						tsfem.updatedResponse( loader, 1, notice, 0 );

						let frameTarget = 'iframe-' + event.target.id,
							targetForm = 'iform-' + event.target.id;

						jQuery( '#' + frameTarget ).remove();
						jQuery( '#' + targetForm ).remove();

						var form = document.createElement( 'form' );
						form.setAttribute( 'method', data.post['method'] );
						form.setAttribute( 'action', data.post['url'] );
						form.setAttribute( 'target', frameTarget );
						form.setAttribute( 'id', targetForm );
						form.style.display = 'none';
						form.style.visibility = 'hidden';

						var postData = data.post['data'];

						for ( let key in postData ) {
							if ( postData.hasOwnProperty( key ) ) {
								let item = {};
								item[ key ] = postData[ key ];

								//* Convert multi-dimension array to single array for POST-data forms.
								let _item = tsfem.matosa( item );

								for ( let _key in _item ) {
									let input = document.createElement( 'input' );
									input.setAttribute( 'type', 'hidden');
									input.setAttribute( 'name', _key );
									input.setAttribute( 'value', _item[ _key ] );

									form.appendChild( input );
								}
							}
						}

						var targetFrame = document.createElement( 'iframe' );

						targetFrame.style.display = 'none';
						targetFrame.style.visibility = 'hidden';
						targetFrame.setAttribute( 'name', frameTarget );
						targetFrame.setAttribute( 'id', frameTarget );
						targetFrame.setAttribute( 'onload', "jQuery(this).trigger( '" + frameTarget + "-onload' );" );

						//* Prepare on-load trigger.
						jQuery( targetFrame ).on( frameTarget + '-onload', function() {
							// @TODO error handling? i.e. @ nonce fail?
							// 750 is chosen by Chrome animation.
							setTimeout( function() {
								settings._complete();
							}, 750 );
						} );

						document.body.appendChild( targetFrame );
						document.body.appendChild( form );

						setTimeout( function() {
							form.submit();
						}, 250 );
					} else {
						tsfem.updatedResponse( loader, 0, notice, 0 );
					}
				}
			},
			error: function( xhr, ajaxOptions, thrownError ) {
				if ( tsfem.debug ) {
					console.log( xhr.responseText );
					console.log( thrownError );
				}
				tsfem.updatedResponse( loader, 0, '', 0 );
				settings._complete();
			},
			_complete: function() {
				$button.removeClass( loading );
				$button.prop( 'disabled', false );
			},
		}

		jQuery.ajax( settings );
	},

	/**
	 *
	 * For future draft:
	 * @see https://www.w3.org/TR/clipboard-apis/#dfn-datatransfer
	 *
	 */
	storeClipboard: function( event ) {

		let $button = jQuery( event.target ),
			targetText = $button.data( 'clipboardid' ),
			$targetText = jQuery( '#' + targetText );

		let val = $targetText.length ? $targetText.val() || '' : '';

		if ( val ) {
			$targetText.select();
			document.execCommand( 'copy' );
			document.getSelection().removeAllRanges();
		/** Future:
		let type = $button.data( 'clipboardtype' ) || 'text/plain';
		document.addEventListener( 'copy', function( e ) {
			e.clipboardData.setData( type, val );
		} );
		*/
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

		// AJAX request export data.
		jQ( 'a#tsfem-e-transporter-export-button' ).on( 'click', tsfem_e_transporter.requestExport );
		// This requires a RESET on ajax call.... see ^^
		jQ( 'a#tsfem-e-transporter-transport-data-text-clipboard-button' ).on( 'click', tsfem_e_transporter.storeClipboard );
		// This requires a RESET on ajax call.... see ^^^^
		jQ( 'a#tsfem-e-transporter-download-button' ).on( 'click', tsfem_e_transporter.requestDownload );

	}
};
jQuery( tsfem_e_transporter.ready );
