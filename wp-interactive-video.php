<?php
/*Plugin Name: WP Video Comments
Plugin URI : http://www.logikunsererzeit.ch/
Description: A commenting system for embedded Youtube videos.
Author     : Marc Chéhab
Version    : 1.0 
Author URI : https://twitter.com/marcchehab
*/

// ----------------------------------------------------------------------------------
// Setup + Enqueue
// ----------------------------------------------------------------------------------

define('IV_PLUGIN_URL', __FILE__);

// INCLUDE required files
include_once('admin/admin.php');
include_once('admin/adminbets.php');
include_once('public/frontend.php');
include_once('public/wp-comment-walker.php');
include_once('blocks/iv-block-setup.php');

// DEFAULT OPTIONS when plugin is activated
add_action('init', 'iv_rewrite_flush');
function iv_rewrite_flush() {
    iv_plugin_install();
    flush_rewrite_rules();
}
function iv_plugin_install(){

    $iv_options = get_option('iv_options');
	if(!$iv_options){}
	add_option('iv_options', iv_options_defaults()); 

	$labels = array(
		'name'               => _x( 'IV Videos', 'post type general name', 'iv' ),
		'singular_name'      => _x( 'IV Video', 'post type singular name', 'iv' ),
		'menu_name'          => _x( 'IV Videos', 'admin menu', 'iv' ),
		'name_admin_bar'     => _x( 'IV Video', 'add new on admin bar', 'iv' ),
		'add_new'            => _x( 'Add New', 'iv' ),
		'add_new_item'       => __( 'Add New Youtube Video ID', 'iv' ),
		'new_item'           => __( 'New IV Video', 'iv' ),
		'edit_item'          => __( 'Edit IV Video', 'iv' ),
		'view_item'          => __( 'View IV Video', 'iv' ),
		'all_items'          => __( 'All IV Videos', 'iv' ),
		'search_items'       => __( 'Search IV Videos', 'iv' ),
		'parent_item_colon'  => __( 'Parent IV Videos:', 'iv' ),
		'not_found'          => __( 'No IV Videos found.', 'iv' ),
		'not_found_in_trash' => __( 'No IV Videos found in Trash.', 'iv' )
	);

	$args = array(
		'labels'             => $labels,
        'description'        => __( 'Pseudoposts to store IV video info.', 'iv' ),
		'public'             => true,
		'publicly_queryable' => true,
		'show_ui'            => true,
		'show_in_menu'       => false,
		'query_var'          => true,
		'rewrite'            => array( 'slug' => 'iv-video' ),
		'capability_type'    => 'post',
		'has_archive'        => true,
		'hierarchical'       => false,		
		'supports'           => array( 'title','comments' )
	);
	register_post_type('iv-video', $args );

	if(get_page_by_title('IV Video List') == NULL ){
		$user_id = get_current_user_id();
		$args_ARR = array(
		                'post_author' => $user_id,
		                'post_title' => "IV Video List",
		                'post_type' => 'page',
		                'post_status' => 'publish',
		                'post_name' => sanitize_title_with_dashes("IV Video List")
		            );
		$insertedId = wp_insert_post($args_ARR);

	}
    
    // Setup tables for betting
    
    global $wpdb;
    add_option( 'iv_db_version', '2' );
	require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
	
	$charset_collate = $wpdb->get_charset_collate();

	dbDelta("CREATE TABLE " . $wpdb->prefix . "iv_questions (
		QID mediumint(9) UNSIGNED NOT NULL AUTO_INCREMENT,
        qtype mediumint(9) NOT NULL,
		qphrase tinytext,
		timelimit datetime,
        useridFK bigint(20) UNSIGNED NOT NULL,
		PRIMARY KEY  (QID),
        FOREIGN KEY (useridFK) REFERENCES " . $wpdb->prefix . "users(ID)
	) $charset_collate;");

	dbDelta("CREATE TABLE " . $wpdb->prefix . "iv_answers (
		AID mediumint(9) UNSIGNED NOT NULL AUTO_INCREMENT,
        qidFK mediumint(9) UNSIGNED NOT NULL,
		aphrase tinytext NOT NULL,
		PRIMARY KEY  (AID),
        FOREIGN KEY (qidFK) REFERENCES " . $wpdb->prefix . "iv_questions(QID)
	) $charset_collate;");
    
	dbDelta("CREATE TABLE " . $wpdb->prefix . "iv_userbets (
		BID mediumint(9) UNSIGNED NOT NULL AUTO_INCREMENT,
        qidFK mediumint(9) UNSIGNED NOT NULL,
        aidFK mediumint(9) UNSIGNED NOT NULL,
		bidtime datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        useridFK bigint(20) UNSIGNED NOT NULL,
		PRIMARY KEY  (BID),
        FOREIGN KEY (qidFK) REFERENCES " . $wpdb->prefix . "iv_questions(QID),
        FOREIGN KEY (aidFK) REFERENCES " . $wpdb->prefix . "iv_answers(AID),
        FOREIGN KEY (useridFK) REFERENCES " . $wpdb->prefix . "users(ID)
	) $charset_collate;");
}

// ENQUEUE: Styles and Script in head section
add_action('wp_enqueue_scripts', 'iv_frontend_scripts');
add_action('admin_init', 'iv_backend_scripts');
add_action('enqueue_block_editor_assets', 'iv_enqueue_block_editor_assets');
function iv_backend_scripts() {
	if(is_admin()){
		wp_enqueue_style('iv_backend_style',plugins_url('admin/iv_admin.css',IV_PLUGIN_URL));
        //wp_register_script('jscolor', plugins_url('admin/jscolor.min.js',IV_PLUGIN_URL));
        //if(isset($_GET['page']) && $_GET['page']=="iv"){
		//	wp_enqueue_script( 'jscolor', 'jscolor.min.js', false );
		//}
        wp_enqueue_style( 'wp-color-picker' );
        wp_enqueue_script( 'wp-color-picker-alpha', plugins_url('admin/wp-color-picker-alpha.min.js',IV_PLUGIN_URL), array( 'wp-color-picker' ), null, false );
        wp_enqueue_script('iv_backend_script',plugins_url('admin/iv_admin.js',IV_PLUGIN_URL), array('jquery', 'wp-color-picker'),null,false);
		add_action('admin_head', 'admin_head' );
	}
}
function iv_frontend_scripts() {
	if(!is_admin()){
	    // Frontend Javascript + passing options
		wp_enqueue_script('iv-public',plugins_url('public/iv_frontend.js',IV_PLUGIN_URL), array('jquery'),null,false);
        $options = get_option('iv_options');
        $is_moderator = (is_array($options['moderators']) && in_array(get_current_user_id(), $options['moderators'])) ? 1 : 0;
        wp_localize_script('iv-public', 'ivData', array(
            'ivUrl' => plugin_dir_url( IV_PLUGIN_URL ),
            'PostCommentUrl' => get_site_url(null, "wp-comments-post.php", null),
            'ajaxUrl' => admin_url( 'admin-ajax.php' ),
            'minColor' => $options['iv_commentcolors_min'],
            'maxColor' => $options['iv_commentcolors_max'],
            'modColor' => $options['iv_commentcolors_mod'],
            'textColor' => $options['iv_commentcolors_text'],
            'moderatorreservetime' => $options['iv_moderatorreservetime'],
			'isModerator' => $is_moderator,
            'commentslimit' => $options['iv_commentslimit']
        ));

        //Frontend CSS + passing options (options unnecessary for the moment)
       wp_register_script(
    'iv_blocks_bundle',
    plugins_url('/blocks/dist/bundle.js', IV_PLUGIN_URL),
    [ 'wp-i18n', 'wp-element', 'wp-blocks', 'wp-components', 'wp-editor', 'wp-api' ],
    filemtime( plugin_dir_path( IV_PLUGIN_URL).'/blocks/dist/bundle.js')
  );
        
        wp_register_style(
            'iv_front_style',
            plugins_url('/public/iv_frontend.css', IV_PLUGIN_URL),
            [],
            filemtime( plugin_dir_path( IV_PLUGIN_URL).'/public/iv_frontend.css')
        );
        wp_enqueue_style('iv_front_style');
        
        add_action( 'wp_enqueue_scripts', 'load_dashicons_front_end' );
        wp_enqueue_style( 'dashicons' );

        $inlinecss = "
        :root {
            --iv_batches_color: {$options['iv_batches_color']};
            --iv_batches_fontcolor: {$options['iv_batches_fontcolor']};
            --iv_commentcolors_max: {$options['iv_commentcolors_max']};
            --iv_commentcolors_min: {$options['iv_commentcolors_min']};
            --iv_commentcolors_mod: {$options['iv_commentcolors_mod']};
            --iv_commentcolors_text: {$options['iv_commentcolors_text']};
        }";
        wp_add_inline_style( 'iv_front_style', $inlinecss );

        // Adding URL arguments when sharing comments

        function add_query_vars_filter( $vars ) {
            $vars[] = "iv_embedid";
            $vars[] = "iv_commentid";
            return $vars;
        }
        add_filter( 'query_vars', 'add_query_vars_filter' );
	}
}


//-------------------------------------------------------------------------------------
// Admin stuff
//-------------------------------------------------------------------------------------

add_action('admin_menu', 'iv_plugin_admin_menu');
function iv_plugin_admin_menu(){
	add_menu_page('iv', 'Video Comments','administrator', 'iv', 'iv_backend_optionsmenu',plugins_url('assets/iv_logo_white.svg',IV_PLUGIN_URL));
    add_submenu_page('iv', 'iv-bets', 'IV Bets', 'manage_options', 'iv-bets', 'iv_backend_bets');
    add_submenu_page('iv', 'iv-videolist', 'IV Videos', 'manage_options', 'edit.php?post_type=iv-video'); // Create submenu with href to view custom_plugin_post_type
}

// Create default values
function iv_options_defaults(){
	$default = array(
		'iv_api_key'   => '',
		'iv_commentcolors_max'=> 'rgba(255,76,76,0.8)',
		'iv_commentcolors_mod' => 'rgba(255,255,255,0.8)',
		'iv_commentcolors_min' => 'rgba(76,232,76,0.8)',
		'iv_commentcolors_text' => '#000000',
		'moderators' => '',
		'iv_batches_color' => 'rgba(255,76,76,0.8)',
        'iv_batches_fontcolor' => '#000000',
        'iv_showlogin' => true,
        'iv_lazyloadv' => true,
        'iv_preloadcomments' => false,
        'iv_moderatorreservetime' => 5,
		'iv_commentslimit' => 5
    );
	return $default;
}

function iv_updates() {
    $options = $_POST['iv_options'];
    $update_val = array(
        'iv_commentcolors_max'=> $options['iv_commentcolors_max'],
		'iv_commentcolors_mod'=> $options['iv_commentcolors_mod'],
		'iv_commentcolors_min' => $options['iv_commentcolors_min'],
		'iv_commentcolors_text' => $options['iv_commentcolors_text'],
		'moderators' => $options['moderators'],	
        'iv_batches_color' => $options['iv_batches_color'],
        'iv_batches_fontcolor' => $options['iv_batches_fontcolor'],
        'iv_showlogin' => $options['iv_showlogin'],
        'iv_preloadcomments' => $options['iv_preloadcomments'],
        'iv_moderatorreservetime' => $options['iv_moderatorreservetime'],
        'iv_commentslimit' => $options['iv_commentslimit']
    );

   return $update_val;
}

add_filter( 'manage_edit_iv_columns', 'edit_iv_columns' ) ;
function edit_iv_columns($columns){
	$columns = array(
		'cb' => '<input type="checkbox" />',
		'title' => __( 'Video' ),
		'shortcode' => __( 'Shortcode' ),		
		'date' => __( 'Date' )
	);
	return $columns;
}

// Trying embed stuff

/**
 * admin_head
 * calls your functions into the correct filters
 * @return void
 */
function admin_head() {
    // check user permissions
    if ( !current_user_can( 'edit_posts' ) && !current_user_can( 'edit_pages' ) ) {
        return;
    }

    // check if WYSIWYG is enabled
    if ( 'true' == get_user_option( 'rich_editing' ) ) {
        add_filter( 'mce_external_plugins', 'mce_external_plugins' );
    }
}

/**
 * mce_external_plugins
 * Adds tinymce plugin
 * @param  array $plugin_array
 * @return array
 */
function mce_external_plugins( $plugin_array ) {
    $plugin_array["ivvideo"] = plugins_url( 'admin/mce.js' , IV_PLUGIN_URL );
    return $plugin_array;
}

function plugin_mce_css( $mce_css ) {
    if ( ! empty( $mce_css ) )
        $mce_css .= ',';

    $mce_css .= plugins_url( 'admin/iv_admin.css', IV_PLUGIN_URL );

    return $mce_css;
}
add_filter( 'mce_css', 'plugin_mce_css' );

/**
 * override_mce_options
 * Makes tinymce allow our <span>-Slider
 * @return void
 */
function override_mce_options($init) {
    $ext = 'span[class]';
    if ( isset( $init['extended_valid_elements'] ) ) {
        $init['extended_valid_elements'] .= ',' . $ext;
    } else {
        $init['extended_valid_elements'] = $ext;
    }
    return $init;
} add_filter('tiny_mce_before_init', 'override_mce_options');

/**
 * 
 */

add_action( 'show_user_profile', 'iv_showcustomuserfield' );
add_action( 'edit_user_profile', 'iv_showcustomuserfield' );

function iv_showcustomuserfield( $user ) {
    $iv_userluz = get_the_author_meta( 'iv_userluz', $user->ID );
	?>

	<table class="form-table">
		<tr>
			<th><label for="iv_userluz"><?php esc_html_e( 'User Luz', 'iv' ); ?></label></th>
			<td><?php echo esc_html( get_the_author_meta( 'iv_userluz', $user->ID ) ); ?></td>
		</tr>
	</table>
	<?php
} 
 
add_action( 'personal_options_update', 'iv_updatecustomuserfield' );
add_action( 'edit_user_profile_update', 'iv_updatecustomuserfield' );

function iv_updatecustomuserfield( $user_id ) {
	if ( ! current_user_can( 'edit_user', $user_id ) ) {
		return false;
	}

	if ( ! empty( $_POST['iv_userluz'] ) && intval( $_POST['iv_userluz'] ) >= 0 ) {
		update_user_meta( $user_id, 'iv_userluz', intval( $_POST['iv_userluz'] ) );
	}
}

?>
