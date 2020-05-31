<?php function iv_backend_bets() {
    global $wpdb;
    $bets=$wpdb->get_results("SELECT * FROM " . $wpdb->prefix . "iv_questions ORDER BY timelimit DESC");
    $betsjson=$wpdb->get_results("SELECT * FROM " . $wpdb->prefix . "iv_questions FOR JSON AUTO");
    echo "$betsjson"; //print_r($bets[0]->QID);
    foreach($bets as $bet) {
        echo "$bet->qphrase";
    }
    ?>
    <table class="widefat iv_betlists" cellspacing="0">
    <thead>
    <tr>
            <th id="iv_qphrase" class="manage-column column-qphrase" scope="col">Question</th>
            <th id="iv_username" class="manage-column column-author" scope="col">Author</th>
            <th id="iv_username" class="manage-column column-qtype" scope="col">Bet type</th>
            <th id="iv_timelimit" class="manage-column column-timelimit" scope="col">Timelimit</th>
    </tr>
    </thead>

    <tfoot>
    <tr>
            <th class="manage-column column-qphrase" scope="col">Question</th>
            <th class="manage-column column-author" scope="col">Author</th>
            <th class="manage-column column-qtype" scope="col">Bet type</th>
            <th class="manage-column column-timelimit" scope="col">Timelimit</th>
    </tr>
    </tfoot>
    <tbody>
    <?php
    foreach($bets as $bet) {
        ?>
        <tr valign="top" data-qid="<?php echo "$bet->QID"; ?>">
            <td class="column-qphrase">
                <strong><?php echo "$bet->qphrase"; ?></strong>
                <div class="row-actions">
                    <span><a href="#" class="edits">Edit</a> |</span>
                    <span><a href="#" class="deletes">Delete</a></span>
                </div>
            </td>
            <td class="column-author" data-userid="<?php echo "$bet->useridFK"; ?>"><?php echo "$bet->useridFK"; ?></td>
            <td class="column-qtype" data-qtype="<?php echo "$bet->qtype"; ?>"><?php echo "$bet->qtype"; ?></td>
            <td class="column-timelimit"><?php echo "$bet->timelimit"; ?></td>
        </tr>
        <?php
    }
    ?>
    </tbody>
</table>
<?php
}
?>