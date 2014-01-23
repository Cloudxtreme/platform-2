<?php
class Neuron_DB_MySQL extends Neuron_DB_Database
{
	private $connection;
	
	/*
		define ('DB_USERNAME', 'myuser');
		define ('DB_PASSWORD', 'myuser');
		define ('DB_SERVER', 'localhost');
		define ('DB_DATABASE', 'dolumar');
	*/
	public function connect ()
	{
		if (!isset ($this->connection))
		{
			try
			{
				$this->connection = @ new MySQLi (DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_DATABASE);
			}
			catch (Exception $e)
			{
				echo $e;
			}
			
			if (mysqli_connect_errno ()) 
			{
				printf ("Connect failed: %s\n", mysqli_connect_error());
				exit();
			}
		}
	}
	
	public function getConnection ()
	{
		return $this->connection;
	}
	
	/*
		Execute a query and return a result
	*/
	public function query ($sSQL)
	{
		$this->addQueryLog ($sSQL);
		
		$this->connect ();
		
		// Increase the counter
		$this->query_counter ++;
		
		$result = $this->connection->query ($sSQL);
		
		if (!$result)
		{
			throw new Exception ('MySQL Error: '.$this->connection->error);
		}
		
		elseif ($result instanceof MySQLi_Result)
		{
			return new Neuron_DB_Result ($result);
		}
		
		// Insert ID will return zero if this query was not insert or update.
		$this->insert_id = intval ($this->connection->insert_id);
		
		// Affected rows
		$this->affected_rows = intval ($this->connection->affected_rows);
		
		if ($this->insert_id > 0)
			return $this->insert_id;
		
		if ($this->affected_rows > 0)
			return $this->affected_rows;
		
		return $result;
	}
	
	public function escape ($txt)
	{
		if (is_array ($txt))
		{
			throw new Neuron_Core_Error ('Invalid parameter: escape cannot handle arrays.');
		}
		return $this->connection->real_escape_string ($txt);
	}
	
	public function fromUnixtime ($timestamp)
	{
		$query = $this->query ("SELECT FROM_UNIXTIME('{$timestamp}') AS datum");
		return $query[0]['datum'];
	}
	
	public function toUnixtime ($date)
	{
		$query = $this->query ("SELECT UNIX_TIMESTAMP('{$date}') AS datum");
		return $query[0]['datum'];
	}
}
?>
