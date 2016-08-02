<?php
defined( 'ABSPATH' ) and $this->verify_instance( $_instance, $bits[1] ) or die;

//* @todo.
//$extra ? '' : '';

if ( $level = $this->get_option( '_activation_level' ) ) {
	if ( 'Premium' === $level ) {
		$more_mottos = array( 'premium' );
	} else {
		$more_mottos = array( 'free' );
	}
} else {
	$more_mottos = array( 'free', 'premium' );
}

/**
 * Because positivity.
 *
 * Translating this would mean that:
 * a) we might cause misinterpertations, and
 * b) the mottos need to be assigned as female/male l10n and with inflections.
 * c) we stray away from what the footer is about: recognition and branding.
 */
$mottos = array(
	'better',
	'fair',
	'supreme',
	'clean',
	'future',
	'prospective',
	'stronger',
	'sustainable',
	'state of the art',
	'social',
	'fast',
	'secure',
	'logical',
);
$mottos = array_merge( $mottos, $more_mottos );

$motto_key = array_rand( $mottos );
$motto = 'A ' . $mottos[ $motto_key ] . ' Initiative';

?>
<p class="tsfem-footer-title">
	The SEO Framework Extension Manager
</p>
<p class="tsfem-footer-motto">
	<?php echo esc_html( $motto ); ?>
</p>
<?php
