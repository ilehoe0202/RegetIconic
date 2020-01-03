<?php
function mytheme_add_woocommerce_support() {
    add_theme_support( 'woocommerce' );
    add_theme_support( 'wc-product-gallery-zoom' ); //Only if want woocommerce built in
    add_theme_support( 'wc-product-gallery-lightbox' );//Only if want woocommerce built in
    add_theme_support( 'wc-product-gallery-slider' );//Only if want woocommerce built in
}
add_action( 'after_setup_theme', 'mytheme_add_woocommerce_support' );
/**
 * Note: It's not recommended to add any custom code here. Please use a child theme so that your customizations aren't lost during updates.
 * Learn more here: http://codex.wordpress.org/Child_Themes
 */

/**
 * Register the 'Custom Column' column in the importer.
 *
 * @param array $options
 * @return array $options
 */
function add_column_to_importer( $options ) {

	// column slug => column name
	$options['brand'] = 'Brand';

	return $options;
}
add_filter( 'woocommerce_csv_product_import_mapping_options', 'add_column_to_importer' );

/**
 * Add automatic mapping support for 'Custom Column'. 
 * This will automatically select the correct mapping for columns named 'Custom Column' or 'custom column'.
 *
 * @param array $columns
 * @return array $columns
 */
function add_column_to_mapping_screen( $columns ) {
	
	// potential column name => column slug
	$columns['Brand'] = 'brand';
	$columns['brand'] = 'brand';

	return $columns;
}
add_filter( 'woocommerce_csv_product_import_mapping_default_columns', 'add_column_to_mapping_screen' );

/**
 * Process the data read from the CSV file.
 * This just saves the value in meta data, but you can do anything you want here with the data.
 *
 * @param WC_Product $object - Product being imported or updated.
 * @param array $data - CSV data read for the product.
 * @return WC_Product $object
 */
function process_import( $object, $data ) {
	
	if ( ! empty( $data['brand'] ) ) {
		$object->update_meta_data( 'brand', $data['brand'] );
	}

	return $object;
}
add_filter( 'woocommerce_product_import_pre_insert_product_object', 'process_import', 10, 2 );


/**
 * Add the custom column to the exporter and the exporter column menu.
 *
 * @param array $columns
 * @return array $columns
 */
function add_export_column( $columns ) {

	// column slug => column name
	$columns['brand'] = __('Brand','brand');
	
	return $columns;
}
add_filter( 'woocommerce_product_export_column_names', 'add_export_column' );
add_filter( 'woocommerce_product_export_product_default_columns', 'add_export_column' );

/**
 * Provide the data to be exported for one item in the column.
 *
 * @param mixed $value (default: '')
 * @param WC_Product $product
 * @return mixed $value - Should be in a format that can be output into a text file (string, numeric, etc).
 */
function add_export_data( $value, $product ) {
	$value = $product->get_meta( 'brand', true, 'edit' );
	
	return $value;
}
// Filter you want to hook into will be: 'woocommerce_product_export_product_column_{$column_slug}'.
add_filter( 'woocommerce_product_export_product_column_custom_column', 'add_export_data', 10, 2 );



***********
/**
 * Import
 */


/**
 * Register the 'Custom Column' column in the importer.
 *
 * @param  array  $columns
 * @return array  $columns
 */
function kia_map_columns( $columns ) {
	$columns[ 'custom_taxonomy' ] = __( 'Brand', 'flatsome' );
	return $columns;
}
add_filter( 'woocommerce_csv_product_import_mapping_options', 'kia_map_columns' );


/**
 * Add automatic mapping support for custom columns.
 *
 * @param  array  $columns
 * @return array  $columns
 */
function kia_add_columns_to_mapping_screen( $columns ) {

	$columns[ __( 'Brand', 'flatsome' ) ] 	= 'custom_taxonomy';

	// Always add English mappings.
	$columns[ 'Brand' ]	= 'custom_taxonomy';

	return $columns;
}
add_filter( 'woocommerce_csv_product_import_mapping_default_columns', 'kia_add_columns_to_mapping_screen' );


/**
 * Decode data items and parse JSON IDs.
 *
 * @param  array                    $parsed_data
 * @param  WC_Product_CSV_Importer  $importer
 * @return array
 */
function kia_parse_taxonomy_json( $parsed_data, $importer ) {

	if ( ! empty( $parsed_data[ 'Brand' ] ) ) {

		$data = json_decode( $parsed_data[ 'Brand' ], true );

		unset( $parsed_data[ 'Brand' ] );

		if ( is_array( $data ) ) {

			$parsed_data[ 'Brand' ] = array();

			foreach ( $data as $term_id ) {
				$parsed_data[ 'Brand' ][] = $term_id;
			}
		}
	}

	return $parsed_data;
}
add_filter( 'woocommerce_product_importer_parsed_data', 'kia_parse_taxonomy_json', 10, 2 );


/**
 * Set taxonomy.
 *
 * @param  array  $parsed_data
 * @return array
 */
function kia_set_taxonomy( $product, $data ) {

	if ( is_a( $product, 'WC_Product' ) ) {

		if( ! empty( $data[ 'custom_taxonomy' ] ) ) {
			wp_set_object_terms( $product->get_id(),  (array) $data[ 'custom_taxonomy' ], 'brand' );
		}

	}

	return $product;
}
add_filter( 'woocommerce_product_import_inserted_product_object', 'kia_set_taxonomy', 10, 2 );
