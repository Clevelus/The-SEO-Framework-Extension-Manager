<?php
defined( 'ABSPATH' ) and $this->verify_instance( $_instance, $bits[1] ) or die;

$class_form = isset( $classes_form ) && count( $classes_form ) > 0 ? implode( ' ', $classes_form ) : '';
$submit_class = isset( $classes ) && count( $classes ) > 0 ? implode( ' ', $classes ) : 'button button-primary';

?>
<form name="<?php echo esc_attr( $name ); ?>" action="<?php echo esc_url( $this->get_admin_page_url() ); ?>" method="post" id="<?php echo esc_attr( $id ) ?>" class="<?php echo esc_attr( $class_form ); ?>">
	<input id="<?php $this->field_id( 'key' ); ?>" name="<?php $this->field_name( 'key' ); ?>" type="text" size="15" value="" class="regular-text code" placeholder="<?php esc_html_e( 'License key', 'the-seo-framework-extension-manager' ); ?>">
	<input id="<?php $this->field_id( 'email' ); ?>" name="<?php $this->field_name( 'email' ); ?>" type="email" size="15" value="" class="regular-text code" placeholder="<?php esc_html_e( 'License email', 'the-seo-framework-extension-manager' ); ?>">
	<?php $this->nonce_action_field( $this->request_name['activate-key'] ); ?>
	<?php wp_nonce_field( $this->nonce_action['activate-key'], $this->nonce_name ); ?>
	<input type="submit" name="submit" id="submit" class="<?php echo esc_attr( $submit_class ); ?>" value="<?php echo esc_attr( $text ); ?>">
</form>
<?php
