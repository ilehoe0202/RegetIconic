<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
/**
* Add CSV columns for exporting extra data.
*
* @param  array  $columns
* @return array  $columns
*/
function kia_add_columns( $columns ) {
	$columns[ 'custom_taxonomy' ] = __( 'Your taxonomy', 'flatsome' );
	return $columns;
}
add_filter( 'woocommerce_product_export_column_names', 'kia_add_columns' );
add_filter( 'woocommerce_product_export_product_default_columns', 'kia_add_columns' );


/**
* MnM contents data column content.
*
* @param  mixed       $value
* @param  WC_Product  $product
* @return mixed       $value
*/
function kia_export_taxonomy( $value, $product ) {

	$terms = get_terms( array( 'object_ids' => $product->get_ID(), 'taxonomy' => 'your-taxonomy-slug' ) );

	if ( ! is_wp_error( $terms ) ) {

		$data = array();

		foreach ( (array) $terms as $term ) {
			$data[] = $term->name;
		}

		$value2 = str_replace(array('["','"]'), '', json_encode( $data ) );
		$value = str_replace(array('[]'), '', $value2 );

	}

	return $value;
}
add_filter( 'woocommerce_product_export_product_column_custom_taxonomy', 'kia_export_taxonomy', 10, 2 );



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
	$columns[ 'temp_brand' ] = __( 'Brand', 'flatsome' );
	$columns[ 'temp_gender' ] = __( 'Gender', 'flatsome' );
	$columns[ 'temp_subcate' ] = __( 'Sub Category', 'flatsome' );
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

	$columns[ __( 'Brand', 'flatsome' ) ] 	= 'temp_brand';
	$columns[ __( 'Gender', 'flatsome' ) ] 	= 'temp_gender';
	$columns[ __( 'Sub Category', 'flatsome' ) ] 	= 'temp_subcate';
	// Always add English mappings.
	$columns[ 'Brand' ]	= 'temp_brand';
	$columns[ 'Gender' ]	= 'temp_gender';
	$columns[ 'Sub Category' ]	= 'temp_subcate';
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
	if ( ! empty( $parsed_data[ 'Gender' ] ) ) {

		$data = json_decode( $parsed_data[ 'Gender' ], true );
		
		unset( $parsed_data[ 'Gender' ] );

		if ( is_array( $data ) ) {

			$parsed_data[ 'Gender' ] = array();

			foreach ( $data as $term_id ) {
				$parsed_data[ 'Gender' ][] = $term_id;
			}
		}
	}
	if ( ! empty( $parsed_data[ 'Sub Category' ] ) ) {

		$data = json_decode( $parsed_data[ 'Sub Category' ], true );

		unset( $parsed_data[ 'Sub Category' ] );

		if ( is_array( $data ) ) {

			$parsed_data[ 'Sub Category' ] = array();
			
			foreach ( $data as $term_id ) {
				$parsed_data[ 'Sub Category' ][] = $term_id;
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

		if( ! empty( $data[ 'temp_brand' ] ) ) {
			wp_set_object_terms( $product->get_id(),  (array) $data[ 'temp_brand' ], 'brand' );
		}

	}
	if ( is_a( $product, 'WC_Product' ) ) {

		if( ! empty( $data[ 'temp_gender' ] ) ) {
			wp_set_object_terms( $product->get_id(),  (array) $data[ 'temp_gender' ], 'gender' );
		}

	}
	if ( is_a( $product, 'WC_Product' ) ) {

		if( ! empty( $data[ 'temp_subcate' ] ) ) {
			wp_set_object_terms( $product->get_id(),  (array) $data[ 'temp_subcate' ], 'sub-category' );
		}

	}
	return $product;
}
add_filter( 'woocommerce_product_import_inserted_product_object', 'kia_set_taxonomy', 10, 2 );
