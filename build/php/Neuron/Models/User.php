<?php
class Neuron_Models_User
{
	private $id;
	private $email;

	/*
	* Array of emails that are registered with this account.
	* (only one active at any time.)
	*/
	private $emails;

	private $password;

	private $name;
	private $firstname;

	private $accounts;

	private $blnIsManager;
	private $blnIsLover;

	private $errors;
	private $feedbacks;

	private $discountshare;
	private $commissionshares;

	private $brands;
	private $emailValidated;

	public function __construct ($id)
	{
		$this->setId ($id);
	}

	public function setId ($id)
	{
		$this->id = $id;
	}

	public function getId ()
	{
		return $this->id;
	}

	public function setEmail ($email)
	{
		$this->email = $email;
	}

	public function getEmail ()
	{
		return $this->email;
	}

	public function getPendingEmails ()
	{
		return BMGroup_Mappers_EmailMapper::getPendingEmail ($this);
	}

	/**
	* Only used during registration.
	*/
	public function setPassword ($password)
	{
		$this->password = $password;
	}

	/**
	* Only used during registration.
	*/
	public function getPassword ()
	{
		return $this->password;
	}

	public function setName ($name)
	{
		$this->name = $name;
	}

	public function getName ()
	{
		return $this->name;
	}

	public function setFirstname ($name)
	{
		$this->firstname = $name;
	}

	public function getFirstname ()
	{
		return $this->firstname;
	}

	public function getFullName ()
	{
		return $this->getFirstname () . ' ' . $this->getName ();
	}

	public function getDisplayName ()
	{
		return Neuron_Core_Tools::output_varchar ($this->getFullName ());
	}

	/**
	* Return a list of all accounts this user has.
	* Lazy loading, mysql query is done first time the accounts are requested.
	*/
	public function getAccounts ()
	{
		if (!isset ($this->accounts))
		{
			$this->accounts = BMGroup_Mappers_AccountsMapper::getFromUser ($this);
		}
		return $this->accounts;
	}

	public function hasAccount (BMGroup_Models_Accounts_Base $type)
	{
		$typename = get_class ($type);

		foreach ($this->getAccounts () as $v)
		{
			if ($v instanceof $typename)
			{
				return true;
			}
		}
		return false;
	}

	public function addAccount (BMGroup_Models_Accounts_Base $account)
	{
		$account->setUser ($this);

		BMGroup_Mappers_AccountsMapper::removeDuplicates ($account);
		BMGroup_Mappers_AccountsMapper::create ($account);
	}

	public function removeAccount (BMGroup_Models_Accounts_Base $account)
	{
		if ($account->getUser ()->equals ($this))
		{
			BMGroup_Mappers_AccountsMapper::remove ($account);
		}
	}

	/**
	* Password. Now here is something special.
	* It is possible that no password is set (when logged in through third party)
	*/
	public function hasPassword ()
	{
		return Neuron_Mappers_UserMapper::hasPassword ($this);
	}

	public function hasEmail ()
	{
		$email = $this->getEmail ();
		return !empty ($email);
	}

	public function doesPasswordMatch ($password)
	{
		return Neuron_Mappers_UserMapper::checkPassword ($this, $password);
	}

	public function changePassword ($oldpassword, $password, $repeatpassword, $ignoreOldPassword = false)
	{
		if (!$this->hasEmail ())
		{
			$this->addError ('Please first set an email address before setting a password.');
			return false;
		}

		if (empty ($password) || strlen ($password) < 6)
		{
			$this->addError ('Your password is too short. Please pick a password of at least 6 characters.');
			return false;
		}

		if ($password != $repeatpassword)
		{
			$this->addError ('Your passwords do not match.');
			return false;
		}

		if ($this->hasPassword () && !$ignoreOldPassword && !$this->doesPasswordMatch ($oldpassword))
		{
			$this->addError ('Your old password is not correct.');
			return false;
		}

		// Aaaand we change the password.
		$this->addFeedback ('Your password was changed.');

		$this->setPassword ($password);
		Neuron_Mappers_UserMapper::update ($this);

		return true;
	}

	private function loadEmails ()
	{
		if (!isset ($this->emails))
		{
			$this->emails = BMGroup_Mappers_EmailMapper::getEmails ($this);
		}
	}

	public function changeEmail ($email)
	{
		if ($email != $this->getEmail ())
		{
			// Email must be unique.
			$emailuser = Neuron_Mappers_UserMapper::getFromEmail ($email);
			$unique = $emailuser ? $emailuser->equals ($this) : true;

			if (!$unique)
			{
				$this->addError ('Some other account is already using this email address.');
			}
			else
			{
				Neuron_Mappers_EmailMapper::removePendingEmails ($this);
				$this->emails = null;

				$this->loadEmails ();

				$dbemail = null;
				foreach ($this->emails as $v)
				{
					if ($v->getEmail () == $email)
					{
						$dbemail = $v;
					}
				}

				if (!$dbemail)
				{
					$dbemail = BMGroup_Models_Email::create ($this, $email);
					$this->emails = null;
				}

				if ($dbemail->isConfirmed ())
				{
					// Email must be unique.
					$emailuser = Neuron_Mappers_UserMapper::getFromEmail ($dbemail->getEmail ());
					$unique = $emailuser ? $emailuser->equals ($this) : true;

					if ($unique)
					{
						$this->setEmail ($dbemail->getEmail ());
						Neuron_Mappers_UserMapper::update ($this);
					}
					else
					{
						$this->addError ('Some other account is already using this email address.');
					}
				}
				else
				{
					$dbemail->sendConfirmatiomEmail ();
				}
			}
		}
	}

	public function getIp ()
	{
		return isset ($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : null;
	}

	/**
	* Initialise a reset password procedure:
	* send an email to the user.
	*/
	public function startResetPassword ()
	{
		// Create the code
		$code = BMGroup_Utilities_TokenGenerator::getToken (10);
		Neuron_Mappers_UserMapper::addPasswordResetToken ($this, $code, $this->getIp ());

		$page = new Neuron_Core_Template ();
		$page->set ('codeurl', BMGroup_URLBuilder::getUrl ('login/lostpassword', array ('id' => $this->getId (), 'code' => $code)));
		$page->set ('code', $code);
		$page->set ('user', $this);
		$body = $page->parse ('emails/resetpassword.phpt');

		$email = new BMGroup_Utilities_Email ();
		$email->setTarget ($this->getEmail ());
		$email->setSubject (_ ('Brandlovers password recovery'));
		$email->setBody ($body);
		$email->send ();
	}

	public function hasResetToken ($strcode)
	{
		$codes = Neuron_Mappers_UserMapper::getPasswordResetTokens ($this);
		foreach ($codes as $code)
		{
			if ($code['code'] == $strcode)
			{
				return true;
			}
		}

		return false;
	}

	private function addError ($message)
	{
		$this->errors[] = $message;
	}

	public function getErrors ()
	{
		return $this->errors;
	}

	private function addFeedback ($message)
	{
		$this->feedbacks[] = $message;
	}

	public function getFeedback ()
	{
		return $this->feedbacks;
	}

	public function setEmailValidated ($validated)
	{
		$this->emailValidated = $validated;
	}

	/**
	* Return true if email is validated
	*/
	public function isEmailValidated ()
	{
		return $this->emailValidated;
	}

	public function isEmailSet ()
	{
		$email = $this->getEmail ();

		// If email is set, email is confirmed.
		if (!empty ($email))
		{
			return true;
		}

		// If not, check if email is found.
		$this->loadEmails ();
		return count ($this->emails) > 0;
	}

	/**
	* Notification
	*/
	public function getNotifications ()
	{
		$notifications = array ();

		if ($this->isEmailSet () && !$this->isEmailValidated ())
		{
			$notifications[] = 'We have sent a confirmation email to your email address. Please confirm your email address to unlock all features.';
		}

		return $notifications;
	}

	public function equals ($other)
	{
		return $this->getId () === $other->getId ();
	}
}