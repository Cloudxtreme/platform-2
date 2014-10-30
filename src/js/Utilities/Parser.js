/**
* This class will help process certain strings and fill in the attributes of that string
*/
define(
	[],
	function ()
	{
		var Parser = 
		{
			'parseFromMessage' : function (str, message)
			{
				str = str.replace ('{{from.name}}', message.get('from') ? message.get ('from')[0].username : null);
				str = str.replace ('{{body.plaintext}}', message.get('body') ? message.get ('body').plaintext : null);

				return str;
			}
		}

		return Parser;

});