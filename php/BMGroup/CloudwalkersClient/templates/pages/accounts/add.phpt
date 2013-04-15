<h2><?php echo __('Add a new service'); ?></h2>

<p>

<?php if (isset ($available)) { ?>
	<ul>
		<?php foreach ($available as $account) { ?>
			<li>
				<a href="<?php echo Neuron_URLBuilder::getURL ('services/add', array ('id' => $account['id'])); ?>">
					<?php echo $account['name']; ?>
				</a>
			</li>
		<?php } ?>
	</ul>
<?php } else { ?>
	<p><?php echo __('Currently there are no services available.'); ?></p>
<?php } ?>