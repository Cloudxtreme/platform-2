/**
* This class will help process certain strings and fill in the attributes of that string
*/
Cloudwalkers.Utilities.Parser = 
{
	'parseFromMessage' : function (str, message)
	{
		str = str.replace ('{{from.name}}', message.get('from') ? message.get ('from')[0].name : null);
		str = str.replace ('{{body.plaintext}}', message.get('body') ? message.get ('body').plaintext : null);

		return str;
	}
}