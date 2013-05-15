<form method="post">
	<h2><?php echo __('Settings'); ?></h2>

	<?php if (isset ($errors)) { ?>
		<?php foreach ($errors as $error) { ?>
			<p class="false"><?php echo $error; ?></p>
		<?php } ?>
	<?php } ?>

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
		<h3>
			<?php echo $stream['name']; ?>

			<?php $caps = $stream['capabilities']; ?>
			<?php $capabilities = '[ '; ?>
			<?php foreach ($caps as $key => $value) {
				if ($value) {
					$capabilities .= $key . ' - ';
				}
			} ?>
			<?php $capabilities = substr ($capabilities, 0, -2) . ']'; ?>

			<?php echo $capabilities; ?>
		</h3>

		<p>
			<a href="<?php echo Neuron_URLBuilder::getURL ('messages', array ('stream' => $stream['id'])); ?>">Watch messages</a>
		</p>

		<table>
			<tr>
				<td>
					Type
				</td>

				<td>
					<select name="streams[<?php echo $stream['id']; ?>][type]">
						<option value="SOCIAL" <?php if ($stream['type'] == 'SOCIAL') { echo 'selected="selected"'; } ?>>Social media</option>
						<option value="WEB" <?php if ($stream['type'] == 'WEB') { echo 'selected="selected"'; } ?>>Web alerts</option>
						<option value="COWORKERS" <?php if ($stream['type'] == 'COWORKERS') { echo 'selected="selected"'; } ?>>Internal, co-workers</option>
					</select>
				</td>
			</tr>

			<?php foreach ($stream['settings'] as $setting) { ?>
				<tr>
					<td>
						<?php echo $setting['name']; ?>
					</td>

					<td>
						<?php switch ($setting['type']) {
							case 'checkbox':
								
								echo '<input type="checkbox" name="streams['.$stream['id'].']['.$setting['key'] . ']" value="1" '.($setting['value'] == 1 ? 'checked="checked"' : null).' />';

							break;


							default:

								echo '<input type="text" name="streams['.$stream['id'].']['.$setting['key'].']" value="'.$setting['value'].'" />';

							break;

						} ?>
					</td>
				</tr>
			<?php } ?>

			<?php if ($caps['incoming']) { ?>
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
			<?php } ?>
		</table>


	<?php } ?>

	<button type="submit"><?php echo __('Store settings'); ?></button>

	<a onclick="return confirm('Are you sure you want to remove this account?');" href="<?php echo Neuron_URLBuilder::getUrl ('services', array ('remove' => $account['id'])); ?>">Remove</a>
</form>