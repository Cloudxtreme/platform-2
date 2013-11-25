<?php if (isset ($errors)) { ?>
	<?php foreach ($errors as $error) { ?>
		<p class="false"><?php echo $error; ?></p>
	<?php } ?>
<?php } ?>

<?php function showChannels ($stream, $channels) { ?>
	<tr>
		<th colspan="2"><?php echo __('Channels'); ?></th>
	</tr>

	<tr>
		<td colspan="2">
			<?php showChannelsRecursive ($stream, $channels); ?>
		</td>
	</tr>
<?php } ?>

<?php function showChannelsRecursive ($stream, $channels, $level = 0) { ?>

	<ul>
		<?php foreach ($channels as $channel) { ?>
			<li>
				<input 
					name="streams[<?php echo $stream['id']; ?>][channels][<?php echo $channel['id']; ?>]" 
					<?php if (in_array ($channel['id'], $stream['channels'])) { ?>checked="checked"<?php } ?> 
					type="checkbox" />

					<?php echo $channel['name']; ?>

					<?php showChannelsRecursive ($stream, $channel['channels'], $level + 1); ?>
			</li>
		<?php } ?>
	</ul>

<?php } ?>


<?php function showStreams ($streams, $channels, $account, $onlyParentStreams = true) { ?>

	<?php if (count ($streams) == 0) { return; } ?>

	<div class="substreams">

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
			<?php if ($stream['canHaveChildren']) { ?>
			<a href="<?php echo Neuron_URLBuilder::getURL ('services/settings/' . $account['id'] . '/createsubstream', array ('stream' => $stream['id'])); ?>">Create child stream</a>
			<?php } ?>

			<a href="<?php echo Neuron_URLBuilder::getURL ('services/settings/' . $account['id'] . '/reset', array ('stream' => $stream['id'])); ?>">Reset stream</a>
		</p>

		<table>
			<?php foreach ($stream['settings'] as $setting) { ?>
				<tr>
					<td class="first">
						<?php echo $setting['name']; ?>
					</td>

					<td>
						<?php switch ($setting['type']) {
							case 'boolean':
								
								echo '<input type="checkbox" name="streams['.$stream['id'].']['.$setting['key'] . ']" value="1" '.($setting['value'] == 1 ? 'checked="checked"' : null).' />';

							break;

							case 'enum':
								echo '<select name="streams['.$stream['id'].']['.$setting['key'] . ']">';
								foreach ($setting['values'] as $v)
								{
									echo '<option value="WEB" ';
									if ($setting['value'] == $v['key']) { 
										echo 'selected="selected"'; 
									}

									echo '>' . $v['value'] . '</option>';
								}
								echo '</select>';
							break;

							default:

								echo '<input type="text" name="streams['.$stream['id'].']['.$setting['key'].']" value="'.$setting['value'].'" />';

							break;

						} ?>
					</td>
				</tr>
			<?php } ?>

			<?php if ($caps['INCOMING'] && $stream['canSetChannels']) { ?>
				<?php showChannels ($stream, $channels); ?>
			<?php } ?>
		</table>

		<?php if ($caps['INCOMING']) { ?>
			<div class="last-messages">
				<a href="<?php echo BASE_URL; ?>json/stream/<?php echo $stream['id']; ?>?records=3&refresh=1&forcerefresh=1&debug=1&output=table" class="load-message-link" data-stream-id="<?php echo $stream['id']; ?>">Load last 3 messages</a>
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
				showStreams ($substreams, $channels, $account, false);
			}

		?>

	<?php } ?>

	</div>

<?php } ?>

<form method="post">
	<h2><?php echo __('Settings'); ?></h2>

	<table>
		<?php foreach ($account['settings'] as $v) { ?>
			<?php if ($v['type'] == 'link') { ?>

				<tr>
					<td class="first">
						&nbsp;
					</td>

					<td>
						<a href="<?php echo $v['url'] . '?return=' . urlencode (Neuron_URLBuilder::getURL ('services/settings/' . $account['id'])); ?>"><?php echo $v['name']; ?></a>
					</td>
				</tr>

			<?php } else if ($v['type'] == 'message') { ?>

				<tr>
					<td class="first">
						&nbsp;
					</td>

					<td>
						<?php echo $v['message']; ?>
					</td>
				</tr>

			<?php } elseif ($v['type'] == 'boolean') { ?>
				<tr>
					<td class="first">
						<?php echo $v['name']; ?>
					</td>

					<td>
						<input type="checkbox" name="<?php echo $v['key']; ?>" value="1" <?php if ($v['value']) { ?>checked="checked"<?php } ?> />
					</td>
				</tr>
			<?php } else { ?>
					<tr>
						<td class="first">
							<?php echo $v['name']; ?>
						</td>

						<td>
							<input type="text" name="<?php echo $v['key']; ?>" value="<?php echo $v['value']; ?>" />
						</td>
					</tr>
				<?php } ?>
		<?php } ?>
	</table>

	<h2><?php echo __('Streams'); ?></h2>

	<?php showStreams ($account['streams'], $channels, $account); ?>

	<button type="submit"><?php echo __('Store settings'); ?></button>

	<a onclick="return confirm('Are you sure you want to remove this account?');" href="<?php echo Neuron_URLBuilder::getUrl ('services', array ('remove' => $account['id'])); ?>">Remove</a>
</form>