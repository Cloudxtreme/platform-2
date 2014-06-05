<?php
/*
* Translator functions
*/
define ('GETTEXT_PARAM_PREFIX', '$');
define ('GETTEXT_PARAM_SUFFIX', '');

// DEBUG OUTPUT: set TRUE to add a css class
// to easily spot untranslated strings.
if (!defined ('GETTEXT_DEBUG_OUTPUT'))
{
	define ('GETTEXT_DEBUG_OUTPUT', false);
}

function getCurrentLanguage ()
{
	return 'en';
}

function __ ($strText)
{
	// To be changed
	$arguments = func_get_args ();
	array_shift ($arguments);

	$strReturn = vsprintf ($strText, $arguments);

	return $strReturn;	
}

function _n ($strSingle, $strPlural, $nbrAmount)
{
	// To be changed!
	// To be changed
	$arguments = func_get_args ();
	array_shift ($arguments);
	array_shift ($arguments);
	array_shift ($arguments);

	if ($nbrAmount > 1)
	{
		$strReturn = vsprintf ($strPlural, $arguments);
	}
	else
	{
		$strReturn = vsprintf ($strSingle, $arguments);;
	}

	if (GETTEXT_DEBUG_OUTPUT)
	{
		return '<span class="i18n-string">' . $strReturn . '</span>';
	}
	else
	{
		return $strReturn;	
	}
}

/** 
* Return all languages
*/
function getLanguages ()
{
	return array 
	(
		array 
		(
			'code' => 'en',
			'name' => 'English'
		),

		array 
		(
			'code' => 'nl',
			'name' => 'Dutch'
		),

		array 
		(
			'code' => 'de',
			'name' => 'German'
		)
	);
}