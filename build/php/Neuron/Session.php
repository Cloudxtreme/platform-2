<?php
class Neuron_Session
{
	private $user;

	public static function getInstance ()
	{
		static $in;
		if (empty ($in))
		{
			$in = new self ();
		}
		return $in;
	}

	private function __construct ()
	{

	}

	public function isLogin ()
	{
		return isset ($_SESSION['user']);
	}

	private function loadUser ()
	{
		if (!isset ($this->user))
		{
			if (isset ($_SESSION['user']))
			{
				$this->user = Neuron_Mappers_UserMapper::getFromId ($_SESSION['user']);
			}
			else
			{
				$this->user = false;
			}
		}
	}

	public function getUser()
	{
		$this->loadUser ();
		return $this->user;
	}

	public function login (Neuron_Models_User $user)
	{
		$_SESSION['user'] = $user->getId ();
		$this->user = $user;

		return $user;
	}

	public function logout ()
	{
		$_SESSION['user'] = null;
		$this->user = null;
	}

	public function register (Neuron_Models_User $user)
	{
		// Create the user
		$user = Neuron_Mappers_UserMapper::create ($user);

		// Login the user
		$this->login ($user);

		return $user;
	}

	public function isEmailUnique ($email)
	{
		$user = Neuron_Mappers_UserMapper::getFromEmail ($email);
		if ($user)
		{
			return false;
		}
		return true;
	}
}