<h1><?php echo $user['name']; ?></h1>

<?php if (!empty ($errors)) { ?>
	<ul>
		<?php foreach ($errors as $v) { ?>
			<li>
				<?php echo $v; ?>
			</li>
		<?php } ?>
	</ul>
<?php } ?>

<h2>User information</h2>
<form method="post" enctype="multipart/form-data">
	<ol>
		<li>
			<label for="firstname">First name:</label>
			<input type="text" name="firstname" value="<?php echo $user['firstname']; ?>" id="firstname" />
		</li>

		<li>
			<label for="name">Name:</label>
			<input type="text" name="name" value="<?php echo $user['name']; ?>" id="name" />
		</li>

		<li>
			<label for="avatar">Avatar</label>
			<input type="file" name="avatar" id="avatar" />
		</li>

		<li>
			<button type="submit" value="edit" name="action">Store</button>
		</li>
	</ol>
</form>

<h2>Password</h2>
<form method="post">
	<ol>
		<li>
			<label for="oldpassword">Old password:</label>
			<input type="password" name="oldpassword" id="oldpassword" />
		</li>

		<li>
			<label for="newpassword">New password:</label>
			<input type="password" name="newpassword" id="newpassword" />
		</li>

		<li>
			<button type="submit" value="password" name="action">Change password</button>
		</li>
	</ol>
</form>