<?php function iv_backend_bets() {
    global $wpdb;
    $bets=$wpdb->get_results("SELECT * FROM " . $wpdb->prefix . "iv_questions ORDER BY timelimit DESC");
    print_r($columns); //print_r($bets[0]->QID);
    foreach($bets as $bet) {
        echo "$bet->qphrase";
    }
    if(!class_exists('WP_List_Table')){
       require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
    }
    class Bets_List_Table extends WP_List_Table {
        function __construct() {
            parent::__construct( array( 
                'singular'=> 'wp_list_text_link', //Singular label
                'plural'=> 'wp_list_test_links', //plural label, also this well be one of the table css class
                'ajax'=> true //We won't support Ajax for this table
            ));
        }
        function get_columns() {
            return $columns=array(
                'col_qid'=>__('QID'), 
                'col_qtype'=>__('Type'), 
                'col_qphrase'=>__('Phrase'), 
                'col_timelimit'=>__('Timelimit'), 
                'col_userid'=>__('User')
            );
        }
        public function get_sortable_columns() {
            return $sortable=array( 
                'col_qid'=>'QID', 
                'col_qtype'=>'qtype', 
                'col_qphrase'=>'qphrase', 
                'col_timelimit'=>'timelimit', 
                'col_userid'=>'useridFK'
            );
        }
        function prepare_items() {
            global $wpdb, $_wp_column_headers;
            $screen=get_current_screen();
            /* -- Preparing your query -- */
            $query="SELECT * FROM " . $wpdb->prefix . "iv_questions";
            /* -- Pagination parameters -- */
        //Number of elements in your table?
        $totalitems = $wpdb->query($query); //return the total number of affected rows
        //How many to display per page?
        $perpage = 5;
        //Which page is this?
        $paged = !empty($_GET["paged"]) ? mysql_real_escape_string($_GET["paged"]) : '';
        //Page Number
        if(empty($paged) || !is_numeric($paged) || $paged<=0 ){ $paged=1; } 
            //How many pages do we have in total? 
            $totalpages = ceil($totalitems/$perpage); 
            //adjust the query to take pagination into account 
            if(!empty($paged) && !empty($perpage)){ $offset=($paged-1)*$perpage; $query.=' LIMIT '.(int)$offset.','.(int)$perpage; } 
            /* -- Register the pagination -- */ 
            $this->set_pagination_args( array(
             "total_items" => $totalitems,
             "total_pages" => $totalpages,
             "per_page" => $perpage,
      ) );
      //The pagination links are automatically built according to those parameters

   /* -- Register the Columns -- */
      $columns = $this->get_columns();
      $_wp_column_headers[$screen->id]=$columns;

   /* -- Fetch the items -- */
      $this->items = $wpdb->get_results($query);
}
        function display_rows() {
            print_r($columns);
            //Get the records registered in the prepare_items method
            $records=$this->items; //Get the columns registered in the get_columns and get_sortable_columns methods
            list( $columns, $hidden)=$this->get_column_info(); //Loop for each record
            if(!empty($records)) {
                foreach($records as $rec) {
                    //Open the line
                    echo '< tr id="record_'.$rec->QID.'">';
                    foreach ( $columns as $column_name=>$column_display_name) {
                        //Style attributes for each col
                        $class="class='$column_name column-$column_name'";
                        $style="";
                        if ( in_array( $column_name, $hidden)) $style=' style="display:none;"';
                        $attributes=$class . $style; //edit link
                        $editlink='/wp-admin/link.php?action=edit&link_id='.(int)$rec->QID; //Display the cell
                        switch ( $column_name) {
                            case "col_qid": echo '< td '.$attributes.'>'.stripslashes($rec->QID).'< /td>';
                            break;
                            case "col_qtype": echo '< td '.$attributes.'>'.stripslashes($rec->qtype).'< /td>';
                            break;
                            case "col_qphrase": echo '< td '.$attributes.'>'.stripslashes($rec->qphrase).'< /td>';
                            break;
                            case "col_timelimit": echo '< td '.$attributes.'>'.$rec->timelimit.'< /td>';
                            break;
                            case "col_user": echo '< td '.$attributes.'>'.$rec->useridFK.'< /td>';
                            break;
                        }
                    } //Close the line
                    echo'< /tr>';
                }
            }
        }
    }
    $iv_bets_table = new Bets_List_Table();
    $iv_bets_table->prepare_items();
    $iv_bets_table->display();
}

?>