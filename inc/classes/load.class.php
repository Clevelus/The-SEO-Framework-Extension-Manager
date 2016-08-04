<?php
/**
 * @package TSF_Extension_Manager\Classes
 */
namespace TSF_Extension_Manager;

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
 * Facade Class TSF_Extension_Manager\Load.
 *
 * Extending upon parent classes.
 *
 * @since 1.0.0
 * @final Please don't extend this extension.
 */
final class Load extends Extensions {

	/**
	 * Cloning is forbidden.
	 */
	private function __clone() { }

	/**
	 * Unserializing instances of this class is forbidden.
	 */
	private function __wakeup() { }

	/**
	 * Constructor, loads parent constructor.
	 */
	public function __construct() {

		//* Don't execute this instance twice.
		$count = 0; $count < 1 or die; $count++;

		parent::__construct();

		add_action( 'admin_notices', array( $this, 'check_external_blocking' ) );
		add_action( 'admin_notices', array( $this, 'do_activation_notice' ) );
	}

	/**
	 * Checks whether the WP installation blocks external requests.
	 * Shows notice if external requests are blocked through the WP_HTTP_BLOCK_EXTERNAL constant
	 *
	 * @since 1.0.0
	 */
	public function check_external_blocking() {

		if ( false === $this->is_tsf_extension_manager_page() || false === $this->can_do_settings() )
			return;

		if ( defined( 'WP_HTTP_BLOCK_EXTERNAL' ) && WP_HTTP_BLOCK_EXTERNAL === true ) {
			//* Check if our API endpoint is in the allowed hosts
			$host = parse_url( $this->get_api_url(), PHP_URL_HOST );
			if ( ! defined( 'WP_ACCESSIBLE_HOSTS' ) || stristr( WP_ACCESSIBLE_HOSTS, $host ) === false ) {

				$warning = '<strong>' . esc_html__( 'Warning!', 'the-seo-framework-extension-manager' ) . '</strong>';
				/* translators: %1$s: Warning!. %2$s Plugin API host URL. %3$s, WordPress PHP constant. */
				$notice = sprintf(
					esc_html__( '%1$s Your website is blocking external requests. This means you will not be able to download software. Please add %2$s to %3$s', 'the-seo-framework-extension-manager' ),
					$warning, $host, '<code>WP_ACCESSIBLE_HOSTS</code>'
				);

				?><div class="error"><p><?php echo $notice; ?></p></div><?php
			}
		}
	}

	/**
	 * Adds dashboard notice for when the user still needs to choose a license.
	 * The goal is to eliminate confusion, although slightly annoying.
	 *
	 * @since 1.0.0
	 */
	public function do_activation_notice() {

		if ( $this->is_plugin_connected() || false === $this->can_do_settings() || $this->is_tsf_extension_manager_page() )
			return;

		$text = __( 'Your extensions are only three clicks away', 'the-seo-framework-extension-manager' );
		$url = $this->get_admin_page_url();
		$title = __( 'Activate the SEO Extension Manager', 'the-seo-framework-extension-manager' );

		$notice_link = '<a href="' . esc_url( $url ) . '" title="' . esc_attr( $title ) . '" target="_self">' . esc_html( $title ) . '</a>';
		$notice = esc_html( $text ) . ' &mdash; ' . $notice_link;

		echo the_seo_framework()->generate_dismissible_notice( $notice );

	}

	/**
	 * Determines whether we're on the SEO extension manager settings page.
	 *
	 * @since 1.0.0
	 * @staticvar bool $cache
	 *
	 * @return bool
	 */
	public function is_tsf_extension_manager_page() {

		static $cache = null;

		if ( isset( $cache ) )
			return $cache;

		return $cache = the_seo_framework()->is_menu_page( $this->seo_extensions_menu_page_hook, $this->seo_extensions_page_slug );
	}
}