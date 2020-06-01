<?php
// update the gfullmap options
if (isset($_POST['iv_update'])) {
    update_option('iv_update', iv_updates());
}

function iv_backend_optionsmenu()
{
    //echo '<pre>'; print_r($GLOBALS['menu']);
    $option = $_GET['edit'];

    if ($_GET["edit"]) {
        $option = $_GET['edit'];
    } else {
        $option = 'iv_options';
    }

    ?>
    <div class="wrap"> <!--wrap div start-->
        <div id="icon-themes" class="icon32"></div>
        <h2> <?php _e('Video Comments Settings', 'iv'); ?> </h2>
    </div>  <!--wrap div end-->
    <?php
    if (isset($_REQUEST['settings-updated']) && $_REQUEST['settings-updated'] == "true") {
        _e('<div class="show-message-edit updated">Settings Saved</div>', 'iv');
    }
    ?>
    <h3 class="hndle"><span><?php _e("General settings", 'iv'); ?></span></h3>
    <div class="inside" style="padding: 15px;margin: 0;">
        <form method="post" name="iv_details" id="iv_details" action="options.php">
            <?php
            wp_nonce_field('update-options');
            $options = get_option($option);
            //print_r($options);
            ?>
            <table class="form-table">
                <tbody>

                <tr>
                    <th scope="row"> <?php _e('Colors of "Video Comments" batches','iv'); ?></th>
                    <td colspan="2">
                        <p><i><?php _e('The filling of the batch','iv'); ?></i><br /><input class="wpcolorpicker" type="text" size="23" name="<?php echo $option; ?>[iv_batches_color]" value="<?php echo $options['iv_batches_color']; ?>" data-alpha="true" /></p>
                        <p><i><?php _e('The font of the batch','iv'); ?></i><br /><input class="wpcolorpicker" type="text" size="23" name="<?php echo $option; ?>[iv_batches_fontcolor]" value="<?php echo $options['iv_batches_fontcolor']; ?>" data-alpha="true" /></p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><?php _e('Comment Colors', 'iv'); ?></th>
                    <td>
                        <p><i><?php _e('The thread(s) with the most comments', 'iv'); ?></i><br /><input class="wpcolorpicker" type="text" size="23" name="<?php echo $option; ?>[iv_commentcolors_max]" value="<?php echo $options['iv_commentcolors_max']; ?>" data-alpha="true" /></p>
                        <p><i><?php _e('The thread(s) with the fewest comments', 'iv'); ?></i><br /><input class="wpcolorpicker" type="text" size="23" name="<?php echo $option; ?>[iv_commentcolors_min]" value="<?php echo $options['iv_commentcolors_min']; ?>" data-alpha="true" /></p>
                        <p><i>Threads by moderators</i><br /><input class="wpcolorpicker" type="text" size="23" name="<?php echo $option; ?>[iv_commentcolors_mod]" value="<?php echo $options['iv_commentcolors_mod']; ?>" data-alpha="true" /></p>
                    </td>
                <tr>
                    <th scope="row"> <?php _e('Who can comment when?', 'iv'); ?></th>
                    <td>
                        <p><label><input type="checkbox" <?php if (isset($options['iv_showlogin'])) checked(1, $options['iv_showlogin'], true); ?> name="<?php echo $option; ?>[iv_showlogin]" value="1"><i><?php _e('Display login link?', 'iv'); ?></i></label></p>
                        <p><i><?php _e('Select moderators', 'iv'); ?></i><br />
                            <ul>
                                <?php $usr = get_users();
                                foreach ($usr as $u) { ?>
                                    <label><input type="checkbox" <?php if (isset($options['moderators']) && in_array($u->ID, $options['moderators'])) echo 'checked="checked" ';?> name="<?php echo $option; ?>[moderators][]" value="<?php echo $u->ID; ?>"> <?php echo $u->display_name; ?></label>
                                    <?php } ?>
                            </ul>
                        </p>
                        <p><i><?php _e('Block new threads x seconds before and after moderator threads (&infin; = only moderator comments allowed)', 'iv'); ?></i><br />
                        <div class="iv_slidercontainers"><span class="iv_slideroutputs"><?php if(isset($options['iv_moderatorreservetime'])) { $str = ($options['iv_moderatorreservetime'] != 61) ? $options['iv_moderatorreservetime'] : "&infin;"; echo $str; } ?></span><input type="range" min="0" max="61" value="<?php if(isset($options['iv_moderatorreservetime'])) echo $options['iv_moderatorreservetime']; ?>" class="iv_sliders" name="<?php echo $option; ?>[iv_moderatorreservetime]"></div>
                        </p>
                        <p><i><?php _e('Block new threads if there are x or more threads in the 5 seconds before and after it.', 'iv'); ?></i><br />
                        <div class="iv_slidercontainers"><span class="iv_slideroutputs"><?php if(isset($options['iv_commentslimit'])) { $str = ($options['iv_commentslimit'] != 61) ? $options['iv_commentslimit'] : "&infin;"; echo $str; } ?></span><input type="range" min="1" max="61" value="<?php if(isset($options['iv_commentslimit'])) echo $options['iv_commentslimit']; ?>" class="iv_sliders" name="<?php echo $option; ?>[iv_commentslimit]"></div>
                        </p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"> <?php _e('How to load', 'iv'); ?></th>
                    <td>
                        <p><i><?php _e('Lazy load Youtube videos?', 'iv'); ?></i><br /><input type="checkbox" <?php if (isset($options['iv_lazyloadv'])) checked(1, $options['iv_lazyloadv'], true); ?> name="<?php echo $option; ?>[iv_lazyloadv]" value="1"></p>
                        <p><i><?php _e('Preload all video comments?', 'iv'); ?></i><br /><input type="checkbox" <?php if (isset($options['iv_preloadcomments'])) checked(1, $options['iv_preloadcomments'], true); ?> name="<?php echo $option; ?>[iv_preloadcomments]" value="1"></p>
                    </td>
                </tr>
                </tbody>
            </table>
            <input type="hidden" name="action" value="update"/>
            <input type="hidden" name="page_options" value="<?php echo $option; ?>"/>
            <p class="button-controls">
                <input type="submit" value="<?php _e('Save Settings', 'iv'); ?>" class="button-primary" id="iv_update"
                       name="iv_update">
            </p>
        </form>
    </div>

    <?php
}

?>