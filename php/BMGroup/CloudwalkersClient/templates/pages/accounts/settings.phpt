<?php if (isset ($errors)) { ?>
	<?php foreach ($errors as $error) { ?>
		<p class="false"><?php echo $error; ?></p>
	<?php } ?>
<?php } ?>

<?php function showStreams ($streams, $channels, $account, $onlyParentStreams = true) { ?>

	

	<?php foreach ($streams as $stream) { ?>

		<?php if ($onlyParentStreams && isset ($stream['parent'])) { continue; } ?>

		<h3>
			<?php echo $stream['id']; ?> 
			<?php echo $stream['name']; ?>

			<?php $caps = $stream['direction']; ?>
			<?php $capabilities = '[ '; ?>
			<?php foreach ($caps as $key => $value) {
				if ($value) {
					$capabilities .= $key . ' - ';
				}
			} ?>
			<?php $capabilities = substr ($capabilities, 0, -2) . ']'; ?>

			<?php echo $capabilities; ?>
		</h3>

		<?php if (isset ($stream['parent'])) { ?>
			<p>Child stream of <?php echo $stream['parent']['id']; ?> <?php echo $stream['parent']['customname']; ?> (<?php echo $stream['parent']['name']; ?>)</p>
		<?php } ?>

		<?php if (isset ($stream['description'])) { ?>
			<p class="description"><?php echo $stream['description']; ?></p>
		<?php } ?>

		<p>
			<a href="<?php echo Neuron_URLBuilder::getURL ('services/settings/' . $account['id'] . '/createsubstream', array ('stream' => $stream['id'])); ?>">Create child stream</a>

			<a href="<?php echo Neuron_URLBuilder::getURL ('services/settings/' . $account['id'] . '/reset', array ('stream' => $stream['id'])); ?>">Reset stream</a>
		</p>

		<table>
			<tr>
				<td class="first">
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

			<tr>
				<td class="first">Custom name</td>

				<td>
					<input type="text" name="streams[<?php echo $stream['id']; ?>][customname]" value="<?php echo str_replace ('"', '\"', htmlentities ($stream['customname'])); ?>" />
				</td>
			</tr>

			<?php foreach ($stream['settings'] as $setting) { ?>
				<tr>
					<td class="first">
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

			<?php if ($caps['INCOMING']) { ?>
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

		<?php if ($caps['INCOMING']) { ?>
			<div class="last-messages">
				<a href="javascript:void(0);" class="load-message-link" data-stream-id="<?php echo $stream['id']; ?>">Load last 3 messages</a>
			</div>
		<?php } ?>

		<!-- SUBSTREAMS -->
		<?php 

			$substreams = array ();
			foreach ($streams as $v)
			{
				if (isset ($v['parent']) && $v['parent']['id'] == $stream['id']) {
					$substreams[] = $v;
				}
			}

			if (count ($substreams) > 0)
			{
				echo '<div class="substreams">';
				showStreams ($substreams, $channels, $account, false);
				echo '</div>';
			}

		?>

	<?php } ?>

<?php } ?>

<form method="post">
	<h2><?php echo __('Settings'); ?></h2>

	<table>
		<?php foreach ($account['settings'] as $v) { ?>
			<tr>
				<td class="first">
					<?php echo $v['name']; ?>
				</td>

				<td>
					<input type="text" name="<?php echo $v['key']; ?>" value="<?php echo $v['value']; ?>" />
				</td>
			</tr>
		<?php } ?>
	</table>

	<h2><?php echo __('Streams'); ?></h2>

	<?php showStreams ($account['streams'], $channels, $account); ?>

	<button type="submit"><?php echo __('Store settings'); ?></button>

	<a onclick="return confirm('Are you sure you want to remove this account?');" href="<?php echo Neuron_URLBuilder::getUrl ('services', array ('remove' => $account['id'])); ?>">Remove</a>
</form>