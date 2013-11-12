<h1>Account</h1>

<?php if (isset ($errors)) { ?>
	<ul>
		<?php foreach ($errors as $v) { ?>
			<li><?php echo $v; ?></li>
		<?php } ?>
	</ul>
<?php } ?>

<h2>Account settings</h2>
<form method="post">
	<fieldset>
		<ol>
			<li>
				<label for="name">Name</label>
				<input type="text" id="name" value="<?php echo $account['name']; ?>" name="name" />
			</li>

			<li>
				<button type="submit" value="edit" name="action">Store</button>
			</li>
		</ol>
	</fieldset>
</form>

<h2>User invite</h2>
<form method="post">
	<fieldset>
		<ol>
			<li>
				<label for="email">Email</label>
				<input type="text" id="email" value="" name="email" />
			</li>

			<li>
				<button type="submit" value="invite" name="action">Email</button>
			</li>
		</ol>
	</fieldset>
</form>