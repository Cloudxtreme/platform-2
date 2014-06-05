<?php
class Neuron_Mappers_UserMapper
{
	public static function getFromId ($id)
	{
		$db = Neuron_DB_Database::getInstance ();

		$data = $db->query
		("
			SELECT 
				*
			FROM
				users
			WHERE
				u_id = '{$db->escape ($id)}'
		");

		$data = self::getObjectsFromData ($data);
		if (count ($data) > 0)
		{
			return $data[0];
		}
		return null;
	}

	public static function getFromEmail ($email)
	{
		$db = Neuron_DB_Database::getInstance ();

		$data = $db->query
		("
			SELECT 
				*
			FROM
				users
			WHERE
				u_email = '{$db->escape ($email)}'
		");

		$data = self::getObjectsFromData ($data);
		if (count ($data) > 0)
		{
			return $data[0];
		}
		return null;
	}

	public static function getFromLogin ($email, $password)
	{
		$db = Neuron_DB_Database::getInstance ();

		$data = $db->query 
		("
			SELECT
				*
			FROM
				users
			WHERE
				u_email = '{$db->escape ($email)}' AND 
				u_password = MD5(CONCAT('{$db->escape ($password)}', u_salt))
		");

		$data = self::getObjectsFromData ($data);
		if (count ($data) > 0)
		{
			return $data[0];
		}
		return null;
	}

	/**
	* Return hashed password & salt.
	*/
	private static function hashPassword ($password)
	{
		// To be replaced by something more ... smart.
		$salt = md5 (mt_rand (0, 1000000) . ' ' . time ());
		$password .= $salt;
		return array (md5 ($password), $salt);
	}

	/**
	* Little helper method for update & create
	*/
	private static function prepareFieldSql (Neuron_Models_User $user)
	{
		$db = Neuron_DB_Database::getInstance ();

		//  Hash the password & add some salt.
		$sql = '';
		$password = $user->getPassword ();
		if (!empty ($password))
		{
			$hashes = self::hashPassword ($user->getPassword ());

			$sql .= "
				u_password = '{$db->escape ($hashes[0])}',
				u_salt = '{$db->escape ($hashes[1])}',
			";
		}

		// Name & firstname
		$name = $user->getName ();
		$firstname = $user->getFirstname ();
		if (!empty ($name))
		{
			$sql .= "u_name = '{$db->escape ($name)}', ";
		}

		if (!empty ($firstname))
		{
			$sql .= "u_firstname = '{$db->escape ($user->getFirstname ())}', ";
		}

		$email = $user->getEmail ();
		if (!empty ($email))
		{
			$sql .= "u_email = '{$db->escape ($user->getEmail ())}', ";
		}
		else
		{
			$sql .= "u_email = NULL, ";
		}

		$sql = substr ($sql, 0, -2);

		return $sql;
	}

	public static function create (Neuron_Models_User $user)
	{
		$db = Neuron_DB_Database::getInstance ();

		$sql = self::prepareFieldSql ($user);

		$id = $db->query 
		("
			INSERT INTO
				users
			SET
				{$sql}
		");

		// Set ID in object
		$user->setId ($id);

		return $user;
	}

	public static function update (Neuron_Models_User $user)
	{
		$db = Neuron_DB_Database::getInstance ();

		$sql = self::prepareFieldSql ($user);

		$db->query 
		("
			UPDATE
				users
			SET
				{$sql}
			WHERE
				u_id = {$user->getId ()}
		");
	}

	public static function checkPassword (Neuron_Models_User $user, $password)
	{
		$db = Neuron_DB_Database::getInstance ();

		$chk = $db->query 
		("
			SELECT
				*
			FROM
				users
			WHERE
				u_id = {$user->getId ()} AND
				u_password = MD5(CONCAT('{$db->escape ($password)}', u_salt))
		");

		return count ($chk) > 0;
	}

	public static function hasPassword (Neuron_Models_User $user)
	{
		$db = Neuron_DB_Database::getInstance ();

		$chk = $db->query 
		("
			SELECT
				*
			FROM
				users
			WHERE
				u_id = {$user->getId ()} AND
				u_password IS NOT NULL
		");

		return count ($chk) > 0;
	}

	public static function removeExpiredPasswordResetTokens ()
	{
		$db = Neuron_DB_Database::getInstance ();

		$db->query 
		("
			DELETE FROM
				users_passwordreset
			WHERE
				upw_date < NOW() - INTERVAL 1 DAY
		");
	}

	public static function addPasswordResetToken (Neuron_Models_User $user, $token, $ip)
	{
		self::removeExpiredPasswordResetTokens ();

		$db = Neuron_DB_Database::getInstance ();

		$ip = inet_pton ($ip);

		$db->query 
		("
			INSERT INTO
				users_passwordreset
			SET
				u_id = {$user->getId ()},
				upw_token = '{$db->escape ($token)}',
				upw_date = NOW(),
				upw_ip = '{$db->escape ($ip)}'
		");
	}

	public static function getPasswordResetTokens (Neuron_Models_User $user)
	{
		$db = Neuron_DB_Database::getInstance ();

		$data = $db->query 
		("
			SELECT
				*,
				UNIX_TIMESTAMP(upw_date) AS datum
			FROM
				users_passwordreset
			WHERE
				u_id = {$user->getId ()} AND
				upw_date > NOW() - INTERVAL 1 DAY
		");

		$out = array ();
		foreach ($data as $v)
		{
			$out[] = array 
			(
				'code' => $v['upw_token'],
				'date' => $v['datum'],
				'ip' => inet_ntop ($v['upw_ip'])
			);
		}
		return $out;
	}

	private static function getObjectsFromData ($data)
	{
		$out = array ();
		foreach ($data as $v)
		{
			$out[] = self::getObjectFromData ($v);
		}
		return $out;
	}

	public static function getObjectFromData ($data)
	{
		$user = new Neuron_Models_User ($data['u_id']);

		if (!empty ($data['u_email']))
			$user->setEmail ($data['u_email']);

		if (!empty ($data['u_name']))
			$user->setName ($data['u_name']);

		if (!empty ($data['u_firstname']))
			$user->setFirstname ($data['u_firstname']);

		$user->setEmailValidated ($data['u_isEmailValidated'] == 1);

		return $user;
	}
}