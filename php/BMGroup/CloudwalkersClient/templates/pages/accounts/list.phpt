<h2><?php echo __('Accounts'); ?></h2>

<?php if (isset ($accounts)) { ?>
	<table>
		<tr>
			<th>Account name</th>
		</tr>

		<?php foreach ($accounts as $account) { ?>
			<tr>
				<td>
					<?php echo $account['name']; ?>
				</td>
			</tr>
		<?php } ?>
	</table>
<?php } else { ?>
	<p><?php echo __('You have no accounts.'); ?></p>
<?php } ?>

<p>
	<a href="<?php echo Neuron_URLBuilder::getURL ('accounts/add'); ?>"><?php echo __('Link a new account'); ?></a>
</p>