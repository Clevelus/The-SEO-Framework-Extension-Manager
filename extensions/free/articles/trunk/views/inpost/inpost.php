<?php
/**
 * @package TSF_Extension_Manager\Extension\Articles\Views
 * @subpackage TSF_Extension_Manager\Inpost\Structure;
 */
namespace TSF_Extension_Manager\Extension\Articles;

/**
 * @package TSF_Extension_Manager\Classes
 */
use \TSF_Extension_Manager\InpostGUI as InpostGUI;

defined( 'ABSPATH' ) and InpostGUI::verify( $_secret ) or die;

/**
 * @TODO move what's below to a framework.
 */

create_type_field :;
	$type_title = sprintf( '<div><strong>%s</strong></div>', $post_meta['type']['title'] );

	$type_option_key = InpostGUI::get_option_key( $post_meta['type']['option']['name'], $post_meta['pm_index'] );
	$type_option_value = $post_meta['type']['option']['value'];

	$type_select_fields = '';
	foreach ( $post_meta['type']['option']['select_values'] as $_value => $_name ) :
		$_selected = $_value === $type_option_value ? ' selected=selected' : '';
		$type_select_fields .= sprintf(
			'<option value="%s"%s>%s</option>',
			\esc_attr( $_value ),
			$_selected,
			\esc_html( $_name )
		);
	endforeach;

	$type_field = vsprintf(
		'<select name=%s id=%s>%s</select>',
		[
			$type_option_key,
			$type_option_key,
			$type_select_fields,
		]
	);

	type_field_output :;
		InpostGUI::wrap_flex_multi( 'block', [
			InpostGUI::construct_flex_wrap( 'label-input', $type_title, $type_option_key ),
			InpostGUI::construct_flex_wrap( 'input', $type_field ),
		] );