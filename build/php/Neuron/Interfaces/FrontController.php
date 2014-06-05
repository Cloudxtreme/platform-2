<?php
interface Neuron_Interfaces_FrontController
{
	public function canDispatch ();
	public function dispatch (Neuron_Page $page);
	public function setParentController (Neuron_FrontController $input);
};