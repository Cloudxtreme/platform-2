<h1>Messages</h1>

<?php foreach ($messages as $message) { ?>
	<div class="message">
		<?php if (!empty ($message['subject'])) { ?>
			<h2>
				<?php echo !empty ($message['subject']) ? $message['subject'] : 'None'; ?>
			</h2>
		<?php } ?>

		<?php if (isset ($message['body']) && isset ($message['body']['html'])) { ?>
			<div><?php echo $message['body']['html']; ?></div>
		<?php } ?>

		<p class="date"><?php echo date ('d m Y H:i:s', strtotime ($message['date'])); ?></p>
	</div>
<?php } ?>