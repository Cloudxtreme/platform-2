<p>
	<?php echo __('You must select which account you want to use.'); ?>
</p>

<?php if (count ($accounts) == 0) { ?>
	<p>You are not assigned to any account yet.</p>
<?php } else { ?>
	<ul>
		<?php foreach ($accounts as $account) { ?>
			<li>
				<a href="<?php echo $account['url']; ?>"><?php echo $account['name']; ?></a>
			</li>
		<?php } ?>
	</ul>
<?php } ?>