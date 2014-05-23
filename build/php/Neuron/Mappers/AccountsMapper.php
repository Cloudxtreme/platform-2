<?php
class Neuron_Mappers_AccountsMapper
{
	public static function getFromType ($sType)
	{
		switch ($sType)
		{
			case 'twitter':
				return new BMGroup_Models_Accounts_Twitter ();
			break;

			case 'facebook':
				return new BMGroup_Models_Accounts_Facebook ();
			break;

			case 'linkedin':
				return new BMGroup_Models_Accounts_LinkedIn ();
			break;

			case 'googleplus':
				return new BMGroup_Models_Accounts_GooglePlus ();
			break;
		}
	}

	public static function getAll ()
	{
		$out = array ();
		/*
		$out[] = new BMGroup_Models_Accounts_Twitter ();
		$out[] = new BMGroup_Models_Accounts_Facebook ();
		$out[] = new BMGroup_Models_Accounts_LinkedIn ();
		$out[] = new BMGroup_Models_Accounts_GooglePlus ();
		*/
		return $out;
	}

	public static function getFromUser (BMGroup_Models_User $user)
	{
		$db = Neuron_DB_Database::getInstance ();

		$data = $db->query 
		("
			SELECT
				*
			FROM
				accounts
			WHERE
				u_id = '{$user->getId ()}'
		");

		return self::getObjectsFromData ($data, $user);
	}

	public static function getFromId ($id)
	{
		$db = Neuron_DB_Database::getInstance ();

		$data = $db->query 
		("
			SELECT
				*
			FROM
				accounts
			WHERE
				a_id = '{$db->escape ($id)}'
		");

		return self::getSingle ($data);
	}

	private static function getSingle ($data)
	{
		$data = self::getObjectsFromData ($data);
		if (count ($data) > 0)
		{
			return $data[0];
		}
		return null;
	}

	/**
	* This is a bit difficult to understand, but it's pretty simple:
	* @param $account: a filled in account object
	* @return the account that has the same type & foreign id, but filled with user object.
	*/
	public static function getFromAccount (BMGroup_Models_Accounts_Base $account)
	{
		$db = Neuron_DB_Database::getInstance ();

		$id = $account->getForeignID ();

		$data = $db->query 
		("
			SELECT
				*
			FROM
				accounts
			WHERE
				a_type = '{$db->escape ($account->getType ())}' AND
				a_foreign_id = '{$db->escape ($id)}'
		");	

		return self::getSingle ($data);
	}

	public static function removeDuplicates (BMGroup_Models_Accounts_Base $account)
	{
		$db = Neuron_DB_Database::getInstance ();

		$id = $account->getForeignID ();

		if (!empty ($id))
		{
			$db->query 
			("
				DELETE FROM
					accounts
				WHERE
					a_type = '{$db->escape ($account->getType ())}' AND
					a_foreign_id = '{$db->escape ($id)}'
			");
		}
	}

	public static function remove (BMGroup_Models_Accounts_Base $account)
	{
		$db = Neuron_DB_Database::getInstance ();

		$db->query 
		("
			DELETE FROM
				accounts
			WHERE
				a_id = {$account->getId ()}
		");
	}

	public static function create (BMGroup_Models_Accounts_Base $account)
	{
		$db = Neuron_DB_Database::getInstance ();

		$data = $account->getAccountSpecificData ();

		$id = $db->query 
		("
			INSERT INTO
				accounts
			SET
				u_id = {$account->getUser ()->getId ()},
				a_type = '{$db->escape ($account->getType ())}',
				a_data = '{$db->escape ($data)}',
				a_foreign_id = '{$db->escape ($account->getForeignID ())}'
		");

		$account->setId ($id);

		return $account;
	}

	public static function countMessagesFromBrand (BMGroup_Models_User $user = null, BMGroup_Models_Brand $brand = null, $start = null, $end = null)
	{
		$db = Neuron_DB_Database::getInstance ();

		$where = "";
		if (!empty ($user))
		{
			$where .= "users.u_id = {$user->getId ()} AND ";
		}

		if (!empty ($brand))
		{
			$where .= "brands.b_id = {$brand->getId ()} AND ";
		}

		if (!empty ($start))
		{
			$where .= "accounts_messages.am_date >= FROM_UNIXTIME({$start}) AND ";
		}

		if (!empty ($end))
		{
			$where .= "accounts_messages.am_date < FROM_UNIXTIME({$end}) AND ";
		}

		$where = substr ($where, 0, -5);

		$sql = "
			SELECT 
				COUNT(*) AS aantal 
			FROM 
				accounts_messages
			LEFT JOIN 
				accounts ON accounts_messages.a_id = accounts.a_id 
			LEFT JOIN 
				users ON accounts.u_id = users.u_id 
			LEFT JOIN 
				products ON accounts_messages.p_id = products.p_id
			LEFT JOIN 
				brands ON products.b_id = brands.b_id 
			WHERE {$where}
		";

		$data = $db->query ($sql);
		if (count ($data) > 0)
		{
			return $data[0]['aantal'];
		}
		return 0;
	}

	public static function countMessagesFromProduct (BMGroup_Models_User $user = null, BMGroup_Models_Product $product = null, $start = null, $end = null)
	{
		$db = Neuron_DB_Database::getInstance ();

		$where = "";
		if (!empty ($user))
		{
			$where .= "users.u_id = {$user->getId ()} AND ";
		}

		if (!empty ($brand))
		{
			$where .= "accounts_messages.p_id = {$product->getId ()} AND ";
		}

		if (!empty ($start))
		{
			$where . "accounts_messages.am_date >= FROM_UNIXTIME({$start}) AND ";
		}

		if (!empty ($end))
		{
			$where . "accounts_messages.am_date < FROM_UNIXTIME({$end}) AND ";
		}

		$where = substr ($where, 0, -5);

		$sql = "
			SELECT 
				COUNT(*) AS aantal 
			FROM 
				accounts_messages
			LEFT JOIN 
				accounts ON accounts_messages.a_id = accounts.a_id 
			LEFT JOIN 
				users ON accounts.u_id = users.u_id 
			WHERE {$where}
		";

		$data = $db->query ($sql);
		if (count ($data) > 0)
		{
			return $data[0]['aantal'];
		}
		return 0;
	}

	private static function getObjectsFromData ($data, $user = false)
	{
		$out = array ();
		foreach ($data as $v)
		{
			$out[] = self::getObjectFromData ($v, $user);
		}
		return $out;
	}

	private static function getObjectFromData ($data, $user = false)
	{
		$object = self::getFromType ($data['a_type']);
		$object->setId ($data['a_id']);
		$object->setAccountSpecificData ($data['a_data']);

		if (!$user)
		{
			$user = BMGroup_Mappers_UserMapper::getFromId ($data['u_id']);

			if (!$user)
			{
				throw new Neuron_Exceptions_DataNotFound ("User of account " . $data['a_id'] . " not found.");
			}
		}

		$object->setUser ($user);

		return $object;
	}
}