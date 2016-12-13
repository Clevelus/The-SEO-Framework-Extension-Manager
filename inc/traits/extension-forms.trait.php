<?php
/**
 * @package TSF_Extension_Manager\Traits
 */
namespace TSF_Extension_Manager;

defined( 'ABSPATH' ) or die;

/**
 * The SEO Framework - Extension Manager plugin
 * Copyright (C) 2016 Sybre Waaijer, CyberWire (https://cyberwire.nl/)
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

/**
 * Holds Form generation functionality.
 *
 * @since 1.0.0
 * @access private
 * @uses trait TSF_Extension_Manager\Extension_Options
 * @see TSF_Extension_Manager\Traits\Extension_Options
 */
trait Extension_Forms {

	/**
	 * Helper function that constructs name attributes for use in form fields.
	 *
	 * Other page implementation classes may wish to construct and use a
	 * _get_field_id() method, if the naming format needs to be different.
	 *
	 * @since 1.0.0
	 * @uses TSF_EXTENSION_MANAGER_EXTENSION_OPTIONS
	 * @uses $this->o_index
	 * @see TSF_Extension_Manager\Traits\Extension_Options
	 * @access private
	 *
	 * @param string $name Field name base
	 * @return string Full field name
	 */
	public function _get_field_name( $name ) {
		return sprintf( '%s[%s][%s]', TSF_EXTENSION_MANAGER_EXTENSION_OPTIONS, $this->o_index, $name );
	}

	/**
	 * Echo constructed name attributes in form fields.
	 *
	 * @since 1.0.0
	 * @access private
	 * @uses $this->_get_field_name() Construct name attributes for use in form fields.
	 *
	 * @param string $name Field name base
	 */
	public function _field_name( $name ) {
		echo esc_attr( $this->_get_field_name( $name ) );
	}

	/**
	 * Helper function that constructs id attributes for use in form fields.
	 *
	 * @since 1.0.0
	 * @uses TSF_EXTENSION_MANAGER_EXTENSION_OPTIONS
	 * @uses $this->o_index
	 * @see TSF_Extension_Manager\Traits\Extension_Options
	 * @access private
	 *
	 * @param string $id Field id base
	 * @return string Full field id
	 */
	public function _get_field_id( $id ) {
		return sprintf( '%s[%s][%s]', TSF_EXTENSION_MANAGER_EXTENSION_OPTIONS, $this->o_index, $id );
	}

	/**
	 * Echo constructed id attributes in form fields.
	 *
	 * @since 1.0.0
	 * @access private
	 * @uses $this->_get_field_id() Constructs id attributes for use in form fields.
	 *
	 * @param string $id Field id base
	 * @param boolean $echo echo or return
	 * @return string Full field id
	 */
	public function _field_id( $id, $echo = true ) {

		if ( $echo ) {
			echo esc_attr( $this->_get_field_id( $id ) );
		} else {
			return $this->_get_field_id( $id );
		}
	}

	/**
	 * Outputs hidden form nonce input fields.
	 *
	 * @since 1.0.0
	 * @uses $this->nonce_action
	 * @uses $this->nonce_name
	 * @access private
	 *
	 * @param string $action_name Nonce action name.
	 */
	public function _nonce_field( $action_name ) {
		//* Already escaped.
		echo $this->_get_nonce_field( $action_name );
	}

	/**
	 * Returns hidden form nonce input fields.
	 *
	 * @since 1.0.0
	 * @uses $this->nonce_name
	 * @access private
	 *
	 * @param string $action_name Nonce action name.
	 * @return string Escaped WordPress nonce fields for $action_name.
	 */
	public function _get_nonce_field( $action_name ) {
		return wp_nonce_field( $this->nonce_action[ $action_name ], $this->nonce_name, true, false );
	}

	/**
	 * Outputs hidden nonce-action field.
	 *
	 * @since 1.0.0
	 * @access private
	 *
	 * @param string $request_name Nonce request name.
	 */
	public function _nonce_action_field( $request_name ) {
		//* Already escaped.
		echo $this->_get_nonce_action_field( $request_name );
	}

	/**
	 * Returns a hidden form nonce-action input field.
	 *
	 * @since 1.0.0
	 * @uses $this->request_name
	 * @access private
	 *
	 * @param string $request_name Nonce request name.
	 * @return string Hidden form action input.
	 */
	public function _get_nonce_action_field( $request_name ) {
		return '<input type="hidden" name="' . $this->_get_field_name( 'nonce-action' ) . '" value="' . esc_attr( $this->request_name[ $request_name ] ) . '">';
	}

	/**
	 * Outputs a submit button for a form.
	 *
	 * @since 1.0.0
	 * @access private
	 *
	 * @param string $name The submit button displayed name.
	 * @param string $title The submit button on-hover title.
	 * @param string $class The submit button class. When empty it defaults to 'tsfem-button-primary'.
	 */
	public function _submit_button( $name, $title = '', $class = '' ) {
		//* Already escaped.
		echo $this->_get_submit_button( $name, $title, $class );
	}

	/**
	 * Returns a submit button for a form.
	 *
	 * @since 1.0.0
	 * @access private
	 *
	 * @param string $name The submit button displayed name.
	 * @param string $title The submit button on-hover title.
	 * @param string $class The submit button class. When empty it defaults to 'tsfem-button-primary'.
	 * @return string The input submit button.
	 */
	public function _get_submit_button( $name, $title = '', $class = '' ) {

		$title = $title ? sprintf( ' title="%s" ', esc_attr( $title ) ) : '';
		$class = $class ? sprintf( ' class="%s"', esc_attr( $class ) ) : ' class="tsfem-button-primary"';

		return sprintf( '<input type="submit" name="submit" id="submit" value="%s"%s%s>', $name, $class, $title );
	}
}
