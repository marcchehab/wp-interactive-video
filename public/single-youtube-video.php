<?php 
    get_header(); 
	$videoID = $post->post_title; 	 
	$videodur = get_post_meta($post->ID, 'video_duration',true);
	$count = 1;	
?>  
<div class="container comment-wrap" id="iv_main_wrapper" data-attr-ajaxurl = "<?php echo admin_url('admin-ajax.php'); ?>">	
   <div class="video-wrap" data-video-duration = "<?php echo $videodur; ?>">		  
		<iframe id="existing-iframe-example" type="text/html" height="550" src="https://www.youtube.com/embed/<?php echo $videoID; ?>?enablejsapi=1&version=3" frameborder="0" allowfullscreen style="width:100%;">
		</iframe>

		<?php  $pixelwidth = getDuration($videoID, $post);  //===== update dynamic ====== 

				$options = get_option('iv_options');		   
				$moderators = $options[moderators];
				$mcolor = $options[iv_commentcolors_mod];

				$btncolor = $options[iv_batches_color];
		?>

		<div class="open-btn <?php if($pixelwidth == 0 && $count ==1 ){ echo 'hide_comment'; } ?>" style="background:<?php echo '#'.$btncolor; ?>">Comments</div> <!--end open-btn-->

		<div class="iv_video_controls">
		   <?php
		    
			    $args = array(
				  'post_id' => $post->ID,	
				  'orderby' => 'iv_video_current_time',
				  'order' => 'ASC',	
				  'status' => 'approve'
				);

			$have_comments = get_comments($args);
		
	        // Need to update	
			if($pixelwidth == 0 && $count ==1 ){
				echo '<div class="iv_error"> Youtube Domain Key Not configured properly </div>';
				$count = 2;
			}

			if ($have_comments) : 

				   $display_comments_array = array();				
				   $i = 2; 		
				   
				   foreach($have_comments as $c){	

				    $cid = $c->comment_ID;  
                    $iv_video_current_time = get_comment_meta($cid, 'iv_video_current_time', true);
                     
                    if($iv_video_current_time){ 

                          $commentId_attr = 'comment-'.$c->comment_ID;  
                      	  $comment_author_id = $c->user_id;					    				    	  	 		 
				    	  $time_arr = explode(":", $iv_video_current_time );
				    	  $count = count($time_arr);

  						  if($count == 2){ 
  						  	
  						   	$time_arr_secs = ($time_arr[0] * 60) + $time_arr[1];

  						  }else{

  						  	$time_arr_secs = ($time_arr[0] * 60 * 60) + ($time_arr[1] * 60) + $time_arr[2];

  						  }	  							
  						 
					    if(!(is_string($pixelwidth))){   	
		    	  				    	 
					    	  $dot_pos_secs = $time_arr_secs * $pixelwidth;	
					    	  //$dot_pos_secs = $dot_pos_secs+ 0.70; // Constant 0.70 addded to get Dot exact position

					    	  $dot_pos_secs = $dot_pos_secs + 0.50;
					    
					    	  if($moderators && in_array($comment_author_id, $moderators)){
					    	  	   $color = $mcolor;
					    	  }else{ 
					    	       $color = $options[iv_commentcolors_min];
					    	  } 					 
							
							  $sum = 0; $dot_top_pos = 9; $max_comment = 0;

							foreach($display_comments_array as $arr => $val){

								if($val['iv_video_current_time'] == $iv_video_current_time){
									$sum = $sum + 1;
									$dot_top_pos = $dot_top_pos + 2;
								}
							} 

							//echo $max_comment."max_comment";					    	
				    	    $comments_array = array(
	                	  		'comment_author_id' => $comment_author_id,
	                	  		'dot_left_pos' => $dot_pos_secs,
	                	  		'dot_top_pos' => $dot_top_pos,
	                	  		'dot_color' => $color,
	                	  		'commentID_attr' => $commentId_attr,
	                	  		'dot_recursion' => $sum,
	                	  		'iv_video_current_time' => $iv_video_current_time,
	                	  		'comment_id' => $c->comment_ID,
	                	  		'comment_count' => child_comment_counter($c->comment_ID),
	                	    ); 
	                	    
	                	    array_push($display_comments_array, $comments_array);  

                   		 }else{

                    		echo $pixelwidth;	
                    	 }	

				   }
			    }//foreach ends

			 endif;

			 if(is_array($display_comments_array)){
			 	usort($display_comments_array, 'sortByOrder');	
			 }
			 		
		
     $HideDotCount = 3;	 
     

    //=========== making comments array global to be retrived in walker ==============
    	update_option('iv_comments_counts_arr', $display_comments_array, false);
    //=========== making comments array global to be retrived in walker ==============


    $max_count = max_with_key($display_comments_array, 'comment_count');     

     if(is_array($display_comments_array)){		

		foreach($display_comments_array as $childarr){ 		

			if(($childarr[comment_count] != $max_count) || ($childarr[comment_count] == 0)){ $bgcolor = $childarr[dot_color]; }else{ $bgcolor =   $options[iv_commentcolors_max]; }

	 		$max_time = max_with_key($display_comments_array, 'dot_recursion', 'iv_video_current_time', $childarr[iv_video_current_time]);

		  	$time_var = str_replace(":","_",$childarr[iv_video_current_time]);

		  	$time_dot_time = str_replace(":","",$childarr[iv_video_current_time]);

		  	$data_comment_time = $time_var.'_comment_time';

		  	if($childarr[dot_recursion] > ($HideDotCount-1)){ $class = 'hide_dot';  }else{ $class = 'show_dot'; } 

    			if($childarr[dot_recursion] == $max_time){ $lastclass = 'last'; }else{ $lastclass = null; } 	

    					$childarr[dot_recursion]."dot_recursion";	

    					$HideDotCount."dot_recursion";  

    			  	if($childarr[dot_recursion] == $HideDotCount){ ?>

    	<span id="<?php echo $data_comment_time; ?>" data-dot-time = "<?php echo $time_dot_time; ?>" data-bottom = "<?php echo $childarr[dot_top_pos]; ?>" style="bottom:<?php echo $childarr[dot_top_pos].'%'; ?>; left:<?php echo $childarr[dot_left_pos].'%'; ?>" class="expand_dots inactive"> </span>    		
    		<?php }	

    		  $left = intval($childarr[dot_left_pos])+ 50;    		  
    		?>   
		<span data-dot-time = "<?php echo $time_dot_time; ?>" style="background:#<?php echo $bgcolor; ?>; bottom:<?php echo $childarr[dot_top_pos].'%'; ?>; left: <?php echo $childarr[dot_left_pos].'%'; ?>" data-bottom = "<?php echo $childarr[dot_top_pos]; ?>" data-commentid-attr="<?php echo $childarr[commentID_attr]; ?>"  class="user-dot <?php echo $class.' '.$data_comment_time.' '.$lastclass; ?>">
			<span class="comment_tooltip"><?php echo $childarr[comment_count]; ?></span>
		</span>

	    <?php }  

	        } ?>		 

		   <div class="iv_timeline"> </div>		  
		</div> 
	</div> <!--video-wrap --> 

	<div class="comment_box cmt-holder">	
	       <div class="cmt-icon">
			    <a href="javascript:void(0)" class="fa fa-plus plus-icon"></a>		
				<button id="stopscroll_btn" class="fa fa-unlink link-icon" onclick="myCustomStopScroll()"></button>
			</div><!-- end cmt-icon-->
			 
			<div id="add_comment_wrapper" class="pop-box">

					<input id="iv_video_current_time_holder" name="iv_video_current_time_holder" type="hidden" />

				<?php 
					$comment_args = array(
				       'comment_field' => '<p class="comment-form-comment"><textarea id="comment" placeholder= "Comment :" name="comment" cols="45" rows="6" aria-required="true">'.'</textarea><input id="iv_video_current_time" name="iv_video_current_time" type="hidden" /></p>',			  
					  // 'fields' => apply_filters('comment_form_default_fields', $fields),
					);
					comment_form($comment_args);
				?>			
			</div> <!--end pop-box-->			


	     <span id="iv_current-time"> </span>

	     <div id="iv_comments" class="iv_comments-area">      

			<?php 
				global $wpdb;	
				$comment_tbl = $wpdb->prefix.'comments';
				$comment_meta_tbl = $wpdb->prefix.'commentmeta';
				$post_tbl = $wpdb->prefix.'posts';

   				$sql = ("SELECT C.*, CM.*, P.* FROM $comment_tbl C JOIN $comment_meta_tbl CM ON C.comment_ID = CM.comment_id AND C.comment_approved = 1 JOIN $post_tbl P ON P.ID = C.comment_post_ID AND P.ID = $post->ID AND CM.meta_key = 'iv_video_current_time' ORDER BY CAST(REPLACE(CM.meta_value, ':', '')as UNSIGNED INT) ASC");
   				
				$have_comments = $wpdb->get_results($sql);			

				if ($have_comments) : 						
					    the_comments_navigation();
					
					    $c_args = array(
							'walker'            => new comment_walker,
							'max_depth'         => '',
							'style'             => 'ul',
							'callback'          => null,
							'end-callback'      => null,
							'type'              => 'all',
							'reply_text'        => 'Reply',
							'page'              => '',
							'per_page'          => '',
							'avatar_size'       => 64,
							'reverse_top_level' => null,
							'reverse_children'  => '',
							'format'            => 'html5', // or 'xhtml' if no 'HTML5' theme support
							'short_ping'        => false,   // @since 3.6
						    'echo'              => true     // boolean, default is true
						);
						wp_list_comments($c_args, $have_comments);
					 endif; //Check for have_comments(). 

		           if(!comments_open() && get_comments_number() && post_type_supports( get_post_type(), 'comments' )) :
				?>
				  	 <p class="iv_no-comments"><?php _e('Comments are closed.', 'twentysixteen'); ?></p> 
				<?php endif; ?>	
			
   			</div><!-- .comments-area -->
   			 <a href="javascript:void(0)" class="fa fa-times-circle close-btn"></a>
   			<div class="btm-txt"> <span> Add New Video Comment </span></div>
   		</div><!-- .comments-area -->
   		<!-- <div class="comment_note"> Add New Video Comment </div>	 -->	

	</div><!-- .comment_box -->		
<!-- </div> -->
<script type="text/javascript"></script>
<?php get_footer(); ?>
