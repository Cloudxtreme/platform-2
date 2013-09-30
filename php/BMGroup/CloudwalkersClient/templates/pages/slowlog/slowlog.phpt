<?php foreach ($data['processes'] as $v) { ?>

	<h2><?php echo $v['process']; ?></h2>
	<p>Stream: <?php echo $v['stream']; ?></p>
	<p>Duration: <?php echo round($v['duration'] * 1000) / 1000; ?> seconds</p>

<pre>
<strong><?php echo str_pad ('Time', 10, " ", STR_PAD_LEFT) . ' | ' . str_pad ('Memory', 10, " ", STR_PAD_LEFT) . ' | Message'; ?></strong>
<?php foreach ($v['log'] as $log) { ?>
<?php echo str_pad ((number_format ($log[0], 3)), 10, " ", STR_PAD_LEFT); ?> | <?php echo str_pad ((number_format ($log[1], 3)), 10, " ", STR_PAD_LEFT); ?> | <?php echo $log[2]; ?>

<?php } ?>
</pre>

<?php } ?>