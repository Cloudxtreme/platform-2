<?php

header ('P3P: CP="CAO PSA OUR"');
require ('php/connect.php');

$date = Neuron_Core_Tools::getInput ('_POST', 'date', 'varchar');

echo '<pTesting</p><form method="post"><ol><li><label for="date">Date</label><input type="text" id="date" name="date" value="' . htmlentities ($date) . '" /></li><li><button type="submit">Go</button></li></ol></form>';
echo '<pre>';

echo 'Current gmtime: ' . gmdate ('d/m/Y H:i:s') . "\n";

if ($date)
{
	$timestamp = strtotime ($date);
	echo 'Date: ' . $timestamp . "\n";
	echo 'gmdate: ' . gmdate ('d/m/Y H:i:s', $timestamp) . "\n";
	echo 'localdate: ' . date ('d/m/Y H:i:s', $timestamp);
}
