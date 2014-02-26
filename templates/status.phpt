<h1>Cloudwalker Status Report</h1>

<?php foreach ($user['accounts'] as $account) { ?>

    <h2><?php echo $account['name']; ?></h2>
    <table>

        <tr>
            <th style="padding: 10px;">Service</th>
            <th style="padding: 10px;">Stream ID</th>
            <th style="padding: 10px;">Name</th>
			<th style="padding: 10px;">Average messages / day</th>
            <th style="padding: 10px;">Last Refresh</th>
            <th style="padding: 10px;">Next Refresh</th>
        </tr>

        <?php foreach ($account['streams'] as $stream) { ?>

            <tr style="background: <?php echo $stream['warningcolor'][0]; ?>; color: <?php echo $stream['warningcolor'][1]; ?>;">

                <td style="padding: 10px;"><?php echo $stream['service']['name']; ?></td>
                <td style="padding: 10px;"><?php echo $stream['id']; ?></td>
                <td style="padding: 10px;"><?php echo $stream['name']; ?></td>
				<td style="padding: 10px;"><?php echo $stream['averageMessagesDay']; ?></td>
                <td style="padding: 10px;"><?php echo date ('c', $stream['lastRefresh']); ?></td>
                <td style="padding: 10px;"><?php echo date ('c', $stream['nextRefresh']); ?></td>

            </tr>

        <?php } ?>

    </table>

<?php } ?>