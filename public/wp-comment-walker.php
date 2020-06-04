<?php

//maybe there's a better place to put this?
function seconds2human($s)
{
    $txt = "";
    $s = floor($s);
    $twodigits = false;
    if ($s>=3600) { $txt .= floor($s/3600) . ":"; $twodigits = true; }
    if ($s>=60) { $txt .= ($twodigits) ? sprintf("%02d", floor(($s%3600)/60)) : floor(($s%3600)/60) . ":"; $twodigits = true; }
    $txt .= ($twodigits) ? sprintf("%02d", $s%60) : $s%60;
    return $txt;
}

	class comment_walker extends Walker_Comment {
		var $tree_type = 'comment';
		var $db_fields = array('parent' => 'comment_parent', 'id' => 'comment_ID');
        var $childrencount = 0;

        // constructor – wrapper for the comments list
		function __construct() { ?>
			<!-- <section class="comments-list"> -->
			<ol class='iv_comment-list'>
		<?php }

		// start_lvl – wrapper for child comments list
		function start_lvl( &$output, $depth = 0, $args = array()){
			$GLOBALS['comment_depth'] = $depth + 1; ?>
			<ul class="children">
		<?php }
	
		// end_lvl – closing wrapper for child comments list
		function end_lvl( &$output, $depth = 0, $args = array() ){
			$GLOBALS['comment_depth'] = $depth + 1;?>
            <data class="childrencounts" data-childrencount="<?php echo $this->childrencount; ?>"></data>
            </ul>
		<?php }
		// start_el – HTML for comment template
		function start_el( &$output, $comment, $depth = 0, $args = array(), $id = 0 ){

			$depth++;
			$GLOBALS['comment_depth'] = $depth;
			$GLOBALS['comment'] = $comment;
			$parent_class = ( empty( $args['has_children'] ) ? '' : 'parent' );

            $iv_comment_time = get_comment_meta($comment->comment_ID, 'iv_comment_time', true);
            $comments_Arr = get_option('iv_comments_counts_arr');

		    $options = get_option('iv_options');
		    $moderators = $options[moderators];
		    $comment_author_id = $comment->user_id;
            if ($depth == 1) {
                $this->childrencount = 0;
            }
		    if ($depth >= 2) {
                $this->childrencount++;
            }

        ?>
			<li <?php if($moderators && in_array($comment_author_id, $moderators)) {
                comment_class(array(empty( $args['has_children'] ), "moderatorcomments"));
            } else {
                comment_class(empty( $args['has_children'] ));
            }?> data-comment-id="<?php comment_ID() ?>" data-comment-time = "<?php echo  $iv_comment_time; ?>" id="comment-<?php comment_ID() ?>">
			  <article  class="iv_commentbodies">
				<div class="gravatars"><?php echo get_avatar($comment_author_id, $size, $default, $alt, array( 'class' => array( 'rounded-circle', 'h-100', 'w-100' ) ) ); ?></div>
				<div class="iv_commentcontents">
					<div class="iv_comment-byline">
						<span class="iv_comment-authors"><a class="iv_comment-author-link" href="<?php comment_author_url(); ?>" itemprop = "author"><?php comment_author(); ?></a></span><span class="separators">&bull;</span>
                        <?php edit_comment_link('<span class="dashicons dashicons-edit"></span> Edit<span class="separators">&bull;</span>','',''); ?>
                        <?php
                            $iv_comment_time = get_comment_meta($comment->comment_ID, 'iv_comment_time',true);
                            if($iv_comment_time) { ?>
                            <span class="iv_comment_times"><a href="javascript:void(0)"><span class="dashicons dashicons-controls-play"></span> <?php echo seconds2human($iv_comment_time); ?></a></span><span class="separators">&bull;</span>
                        <?php } ?>
                        <span class="iv_comment_dates" datetime="<?php comment_date("F j\, Y") ?>T<?php comment_time('H:iP') ?>"><?php comment_date('F j\, Y') ?></span>
					</div>
					<div class="comment-content post-content" itemprop="text">
						<?php comment_text() ?>
                    </div>
                    <div class="iv_comment-belowline">
                        <a class="iv_replylinks"><span class="dashicons dashicons-undo
"></span> Reply</a>
                        <span class="separators">&bull;</span>
                        <a class="iv_expand_comment_thread"><span class="dashicons dashicons-arrow-down-alt2"></span> Expand<span class="iv_childrencountnumber"></span></a>
                    </div>
				</div>
			</article>

		 <?php
		}

		// end_el – closing HTML for comment template
		function end_el(&$output, $comment, $depth = 0, $args = array() ) { ?>
			</li>
		<?php }

		// destructor – closing wrapper for the comments list
		function __destruct() { ?>
			<!-- </section> -->	
			</ol>	
		<?php }
}