<?php get_header(); ?> 

	<div class="iv_container">
		<div class="row">
		<?php 

			$args = array(
				'posts_per_page'   => -1,				
				'orderby'          => 'date',
				'order'            => 'DESC',
				'post_type'        => 'youtube-video',
				'post_status'      => 'publish',
				'suppress_filters' => true 
			);

			$posts_array = get_posts( $args );

			//print_r($posts_array);

			if($posts_array){

				foreach($posts_array as $post_ar){
					$img_url = 'https://img.youtube.com/vi/'.$post_ar->post_title.'/hqdefault.jpg';
					$video_link = get_permalink($post_ar->ID);
				?>
					<div class = "list_video_con col-sm-4">
						<a href="<?php echo $video_link; ?>" target="_blank"><img src="<?php echo $img_url; ?>" /></a>
					</div>
						
			   <?php } 

			}else{	

				echo "No video Added";

			}


			?>
       </div>
	</div>

<?php get_footer(); ?>