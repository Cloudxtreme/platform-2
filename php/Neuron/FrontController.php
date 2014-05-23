<?php
class Neuron_FrontController
{
	private $controllers = array ();
	private $input = array ();
	private $page;

	public static function getInstance ()
	{
		static $in;
		if (!isset ($in))
		{
			$in = new self ();
		}
		return $in;
	}

	public function addController (Neuron_Interfaces_FrontController $controller)
	{
		$this->controllers[] = $controller;
		$controller->setParentController ($this);
	}

	public function canDispatch ()
	{
		return true;
	}

	public function setInput (array $fields)
	{
		$this->input = $fields;
	}

	public function getInput ()
	{
		return $this->input;
	}

	public function setPage (Neuron_Page $page)
	{
		$this->page = $page;
	}

	public function getPage ()
	{
		if (!isset ($this->page))
		{
			$this->page = new Neuron_Page ();
		}
		return $this->page;
	}

	public function dispatch ()
	{
		foreach ($this->controllers as $v)
		{
			if ($v->canDispatch ())
			{
				$v->dispatch ($this->getPage ());
				return;
			}
		}

		// Nothing found? Last one it is.
		if (count ($this->controllers) > 0)
		{
			$this->controllers[count ($this->controllers) - 1]->dispatch ($this->getPage ());
		}
		else
		{
			echo 'No controllers set.';
		}
	}
}