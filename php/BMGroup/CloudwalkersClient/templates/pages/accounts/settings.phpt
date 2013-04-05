<form method="post">
	<h2><?php echo __('Settings'); ?></h2>

	<table>
		<?php foreach ($account['settings'] as $v) { ?>
			<tr>
				<td>
					<?php echo $v['name']; ?>
				</td>

				<td>
					<input type="text" name="<?php echo $v['key']; ?>" value="<?php echo $v['value']; ?>" />
				</td>
			</tr>
		<?php } ?>
	</table>

	<h2><?php echo __('Streams'); ?></h2>

	<?php foreach ($account['streams'] as $stream) { ?>
		<h3><?php echo $stream['name']; ?></h3>

		<table>
			<?php foreach ($stream['settings'] as $setting) { ?>
				<tr>
					<td>
						<?php echo $setting['name']; ?>
					</td>

					<td>
						<input type="text" name="streams[<?php echo $stream['id']; ?>][<?php echo $setting['key']; ?>]" value="<?php echo $setting['value']; ?>" />
					</td>
				</tr>
			<?php } ?>

			<tr>
				<th colspan="2"><?php echo __('Channels'); ?></th>
			</tr>
			<?php foreach ($channels as $channel) { ?>
				<tr>
					<td colspan="2">
						<input 
							name="streams[<?php echo $stream['id']; ?>][channels][<?php echo $channel['id']; ?>]" 
							<?php if (in_array ($channel['id'], $stream['channels'])) { ?>checked="checked"<?php } ?> 
							type="checkbox" />
						<?php echo $channel['name']; ?>
					</td>
				</tr>			
			<?php } ?>
		</table>


	<?php } ?>

	<button type="submit"><?php echo __('Store settings'); ?></button>

	<a onclick="return confirm('Are you sure you want to remove this account?');" href="<?php echo Neuron_URLBuilder::getUrl ('accounts', array ('remove' => $account['id'])); ?>">Remove</a>
</form>