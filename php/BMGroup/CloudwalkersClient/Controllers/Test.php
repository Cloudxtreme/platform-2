<?php
class BMGroup_CloudwalkersClient_Controllers_Test
	extends BMGroup_CloudwalkersClient_Controllers_Base
{
	/** @var BMGroup_CloudwalkersClient_Client $client */
	private $client;
	private $start;

	public function dispatch (Neuron_Page $page)
	{
		$this->client = BMGroup_CloudwalkersClient_Client::getInstance ();

		if (!$this->client->isLogin ())
		{
			echo '<p>Please login.</p>' . Neuron_URLBuilder::getUrl ('login');
			$this->client->logout (Neuron_URLBuilder::getURL('login'));
			exit;
		}

		$code = Neuron_Core_Tools::getInput ('_GET', 'secret', 'varchar');
		if ($code != 'bmgroupcw')
		{
			echo '<p>Please provide the secret token.</p>';
			exit;
		}

		$user = $this->client->getUserData ();

		echo '<pre>';
		echo "Testing endpoints for user " . $user['displayname'] . "\n";

		$this->start = microtime (true);

		$this->log ('API endpoint test');

		// Go trough all popular endpoints
		$data = $this->testEndpoint ('user/me');

		// Go trough accounts
		foreach ($data['user']['accounts'] as $account)
		{
			$this->processAccount ($account);

			// Only do one.
			break;
		}
	}

	private function processAccount ($account)
	{
		$accountinfo = $this->testEndpoint ('account/' . $account['id']);
		$this->log ('Processing account ' . $accountinfo['account']['name']);

		$channels = $accountinfo['account']['channels'];

		foreach ($channels as $channel)
		{
			$this->processChannel ($channel);

			// Only test one
			break;
		}

		// Test stream endpoints
		$streams = $this->testEndpoint ('account/' . $account['id'] . '/streams');
		foreach ($streams['streams'] as $stream)
		{
			$this->processStream ($stream);

			// Only test one
			break;
		}

		// Test creating a draft message
		$message = array
		(
			'subject' => 'Automatically created test message',
			'body' => 'This message was created by the test script and should actually already be removed.',
			'attachments' => array (
				array (
					'type' => 'link',
					'url' => 'http://www.catlab.eu/'
				),
				array (
					'type' => 'image',
					'data' => base64_encode (file_get_contents ('http://devapi.cloudwalkers.be/misc/profile.png'))
				)
			)
		);

		// Drafts
		$this->testEndpoint ('account/' . $account['id'] . '/drafts');
		$this->testEndpoint ('account/' . $account['id'] . '/scheduled');

		$post = $this->testEndpoint ('message', 'post', array ('account' => $account['id']), $message);

		// Fetch this specific message
		$messagedata = $this->testEndpoint ('message/' . $post['message']['id']);

		// Update
		$messagedata = $this->testEndpoint ('message/' . $messagedata['message']['id'], 'put', array ('account' => $account['id']), $message);

		// Read
		$read = $this->testEndpoint ('message/' . $messagedata['message']['id'] . '/read');

		// Delete message
		$delete = $this->testEndpoint ('message/' . $messagedata['message']['id'], 'delete');


	}

	private function processChannel ($channel)
	{
		// Regular
		$messages = $this->testEndpoint ('channel/' . $channel['id']);

		$count = count ($messages['channel']['messages']);
		$this->log ('- Found ' . $count . ' messages in ' . $channel['name']);

		// Trending
		$messages = $this->testEndpoint ('trending/' . $channel['id']);

		$count = count ($messages['channel']['messages']);
		$this->log ('- Found ' . $count . ' messages in ' . $channel['name']);
	}

	private function processStream ($stream)
	{
		$streamdata = $this->testEndpoint ('stream/' . $stream['id']);
		$count = count ($streamdata['stream']['messages']);

		$this->log ('- Found ' . $count . ' messages');
	}

	private function testEndpoint ($url, $method = 'get', $get = array (), $post = array ())
	{
		$this->log ('- Fetching ' . $url . ' ' . strtoupper ($method) . ' ... ');

		switch (strtolower ($method))
		{
			case 'put':
				$data = $this->client->put ($url, $get, $post);
			break;

			case 'post':
				$data = $this->client->post ($url, $get, $post);;
			break;

			case 'delete':
				$data = $this->client->delete ($url, $get, $post);;
			break;

			case 'get':
			default:
				$data = $this->client->get ($url, $get, $post);;
			break;
		}

		$this->log ('done!', false);

		return $data;
	}

	private function log ($message, $newline = true)
	{
		$time = microtime (true) - $this->start;
		if ($newline)
		{
			echo "\n" . str_pad (number_format ($time, 4), 10, " ", STR_PAD_LEFT) . ' ';
		}

		echo $message;

		$this->flush ();
	}

	private function flush ()
	{
		if (@ob_get_contents())
		{
			@ob_end_flush();
		}
		flush();
	}
}