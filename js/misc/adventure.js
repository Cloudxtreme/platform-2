function Adventure ()
{
	this.rootdiv = null;
	this.console = null;
	this.input = null;
	this.currentRoom = null;

	this.inventory = {};

	this.obodyoverflow = null;

	this.start = function ()
	{
		var self = this;
	
		var div = document.createElement ('div');
		this.rootdiv = div;
		
		document.body.appendChild (div);
		div.style.margin = '0px';
		div.style.padding = '0px';
		div.style.width = '100%';
		div.style.height = '100%';
		div.style.zIndex = '10000';
		div.style.position = 'absolute';
		div.style.background = 'black';
		div.style.fontFamily = 'monospace';
		div.style.color = 'green';
		div.style.top = '0px';
		div.style.left = '0px';
		div.style.fontWeight = 'bold';
		div.style.fontSize = '15px';
		div.style.overflow = 'auto';
	
		/*
		document.body.style.margin = '0px';
		document.body.style.padding = '0px';
		*/

		this.console = document.createElement ('div');
		this.console.style.padding = '20px';
		div.appendChild (this.console);
		
		// Add handler on enter
		div.onkeypress = function (e)
		{
			if((!e && !(e = window.event)))
			{
				return;
			}

			//console.log (e);
			var keycode = 0;

			if(e.keyCode)
			{
				keycode = e.keyCode;
			}

			else if(e.which)
			{
				keycode = e.which;
			}
			
			if (keycode === 13)
			{
				self.command ();
			}
		};
		
		div.onclick = function ()
		{
			self.input.focus ();
		};

		// Load the game
		this.loadGame ();

		// First sentence: describe the room
		this.lookAround ();
		this.out ();

		// Show the console
		this.addinput ();

		// Scroll to top
		window.scrollTo(0, 0);

		// Hide scrollbars for body
		this.obodyoverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
	};

	this.finish = function () {};
	
	this.out = function (string)
	{
		if (typeof (string) === 'undefined')
		{
			string = '&nbsp;';
		}

		var p = document.createElement ('pre');
		p.style.margin = '0px';
		p.style.padding = '0px';
		p.style.background = 'black';
		p.style.borderRadius = '0px';
		p.style.MozBorderRadius = '0px';
		p.style.WebkitBorderRadius = '0px';
		p.style.color = 'inherit';
		p.style.fontSize = 'inherit';
		p.style.font = 'inherit';

		p.innerHTML = string;
		this.console.appendChild (p);
	};

	this.showHelp = function ()
	{
		this.out ('You can use any of the following commands:');
		this.out ('- LOOK (AROUND)');
		this.out ('- GO        [ie: "go north"]');
		this.out ('- ASK:      [ie: "ask about chat noir"]');
		this.out ('- SAY:      [ie: "say hi"]');
		this.out ('- TAKE      [ie: "take leaflet"]');
		this.out ('- EXAMINE   [ie: "examine leaflet"]');
		this.out ('- USE       [ie: "use crowbar"]');
		this.out ('- EXIT');
	};

	this.lookAround = function ()
	{
		var room = this.getCurrentRoom ();

		if (typeof (room.LOOK) !== 'undefined')
		{
			room.LOOK ();
		}
		else
		{
			this.out ('There is nothing special to see here.');
		}

		// Are there items to see?
		if (typeof (room.ITEMS) !== 'undefined')
		{
			for (var item in room.ITEMS)
			{
				if (typeof (room.ITEMS[item].LOOK) !== 'undefined')
				{
					room.ITEMS[item].LOOK ();
				}
				else
				{
					this.out ('You see a <span class="catlab-adventure-item">' + item + '</span>');
				}
			}
		}
		
		// What directions can we go to?
		if (typeof (room.GO) !== 'undefined')
		{
			var directions = "You can go ";
			for (var direction in room.GO)
			{
				directions += '<span class="catlab-adventure-direction">' + direction + "</span>, ";
			}
			directions = directions.substr (0, directions.length - 2) + ".";
			
			// Replace the last "," with "and"
			var n = directions.lastIndexOf (',');
			if (n > 0)
			{
				directions = directions.substr (0, n) + " and " + directions.substr (n + 2);
			}
			
			this.out (directions);
		}
	};

	/**
		Return an item that matches any word
		in the sentence.
	*/
	this.getItem = function (parts)
	{
		var room = this.getCurrentRoom ();

		if (typeof (room.ITEMS) !== 'undefined')
		{
			for (var item in room.ITEMS)
			{
				var pparts = item.split (' ');
				for (var j = 0; j < pparts.length; j ++)
				{
					for (var i = 0; i < parts.length; i ++)
					{
						if (pparts[j].toLowerCase () === parts[i].toLowerCase ())
						{
							room.ITEMS[item].NAME = item;
							return room.ITEMS[item];
						}
					}
				}
			}
		}

		// Check inventory as well
		for (var item in this.inventory)
		{
			for (var i = 0; i < parts.length; i ++)
			{
				var pparts = item.split (' ');
				for (var j = 0; j < pparts.length; j ++)
				{
					if (pparts[j].toLowerCase () === parts[i].toLowerCase ())
					{
						this.inventory[item].NAME = item;
						return this.inventory[item];
					}
				}
			}
		}

		return false;
	};

	this.addItemToInventory = function (part)
	{
		this.inventory[part.NAME] = part;
	};

	this.getDirection = function (parts)
	{
		var room = this.getCurrentRoom ();

		if (typeof (room.GO) !== 'undefined')
		{
			for (var direction in room.GO)
			{
				for (var i = 0; i < parts.length; i ++)
				{
					if (direction.toLowerCase () === parts[i].toLowerCase ())
					{
						return room.GO[direction];
					}
				}
			}
		}

		return false;
	};

	this.examine = function (parts)
	{
		var item = this.getItem (parts);

		if (item)
		{
			if (typeof (item.EXAMINE) !== 'undefined')
			{
				item.EXAMINE ();
			}
			else
			{
				this.out ('It looks like a regular <span class="catlab-adventure-item">' + item.NAME + '</item>');
			}
		}
		else
		{
			this.out ('I don\'t know what you are trying to examine.');
		}
	};

	this.use = function (parts)
	{
		var item = this.getItem (parts);

		if (item)
		{
			if (typeof (item.USE) !== 'undefined')
			{
				item.USE ();
			}
			else
			{
				this.out ('The <span class="catlab-adventure-item">' + item.NAME + '</item> doesn\'t do anything here.');
			}
		}
		else
		{
			this.out ('I don\'t know what you are trying to use.');
		}
	};

	this.take = function (parts)
	{
		var item = this.getItem (parts);

		if (item)
		{
			if (typeof (item.TAKE) !== 'undefined')
			{
				item.TAKE ();
			}
			else
			{
				this.addItemToInventory (item);
				this.out ('You\'ve taken the <span class="catlab-adventure-item">' + item.NAME + '</span> with you.');
			}
		}
		else
		{
			this.out ('I don\'t know what you are trying to take.');
		}
	}

	this.go = function (parts)
	{
		var direction = this.getDirection (parts);
		if (direction)
		{
			direction ();
		}
		else
		{
			this.out ('I don\'t know where you want to go.');
		}
	};
	
	this.command = function ()
	{
		var command = this.input.value;
		var parts = command.split (' ');

		this.out ('> ' + command);

		switch (parts[0].toLowerCase ())
		{
			case 'look':
				if (typeof (parts[1]) !== 'undefined' && parts[1].toLowerCase () === 'at')
				{
					this.examine (parts);
				}
				else
				{
					this.lookAround ();
				}
			break;

			case 'examine':
			case 'read':
				this.examine (parts);
			break;

			case 'help':
				this.showHelp ();
			break;

			case 'exit':
				this.stop ();
			break;

			case 'go':
				this.go (parts);
			break;

			case 'use':
			case 'play':
				this.use (parts);
			break;

			case 'take':
				this.take (parts);
			break;

			default:
				this.out ('I don\'t understand what you are trying to do.');
				this.out ('If you would like help, say "HELP".');
			break;
		}
		
		this.out ();
		this.addinput ();
	};

	this.getCurrentRoom = function ()
	{
		return this.currentRoom;
	};

	this.setCurrentRoom = function (room)
	{
		this.currentRoom = room;
	};
	
	this.addinput = function ()
	{
		var self = this;
	
		if (this.input && this.input.parentNode)
		{
			this.input.parentNode.parentNode.removeChild (this.input.parentNode);
		}
		
		var inputContainer = document.createElement ('div');
		inputContainer.innerHTML = '> ';
	
		this.input = document.createElement ('input');
		this.input.style.border = '0px none black';
		this.input.style.color = 'green';
		this.input.style.fontFamily = 'monospace';
		this.input.style.background = 'black';
		this.input.style.outline = 'none';
		this.input.style.fontWeight = 'bold';
		this.input.style.fontSize = '15px';
		this.input.style.margin = '0px';
		this.input.style.padding = '0px';
		this.input.style.marginLeft = '-1px';
		this.input.style.width = '90%';
		
		inputContainer.appendChild (this.input);
		this.console.appendChild (inputContainer);
		
		setTimeout (function () {
			self.input.focus ();
		}, 1);
		
	};

	this.loadGame = function ()
	{
		var self = this;
		var out = function (s) { self.out (s); };
		var look = function () { self.lookAround (); };
		var move = function (newRoom) { self.setCurrentRoom (newRoom); self.lookAround (); };

		// These need to be loaded dynamically
		var rooms =
		{
			'welcome' : function ()
			{
				out ('=================');
				out ('Welcome to Ghent!');
				out ('=================');

				out ('While wandering around in beautiful city of Ghent,');
				out ('you come across an open door. Adventurous as you');
				out ('are, you decide to go in. Right behind you, the door');
				out ('closes and you hear steel bars lock the door shut.');
				out ('It seems you won\'t be able to get out anytime soon...');
				out ();
			},

			'start' : {
				'LOOK' : function ()
				{
					out ('You are standing in the entrance of an office.');
					out ('The logo on the door reads "bmgroup".');
				},
				'ITEMS' :
				{
					'LEAFLET' : {
						'LOOK' : function ()
						{
							out ('There is a <span class="catlab-adventure-item">LEAFLET</span> on the ground.');
						},
						'EXAMINE' : function ()
						{
							out ('The <span class="catlab-adventure-item">LEAFLET</span> sais:');
							out ('"Free shots tonight at Le <span class="catlab-adventure-subject">CHAT NOIR!</span>."');
							out ('Suddenly you feel very thirsty.');
						}
					}
				},
				'GO' : {
					'OUT' : function ()
					{
						out ('The door is locked.');
					},
					
					'NORTH' : function ()
					{
						move (rooms.rewsDesk);
					},
					
					'WEST' : function ()
					{
						move (rooms.vincentDesk);
					}
				}
			},

			'rewsDesk' : {
				'LOOK' : function ()
				{
					out ('You are standing near Rew\'s desk.');
				},

				'GO' :
				{
					'SOUTH' : function ()
					{
						move (rooms.start);
					},

					'NORTH' : function ()
					{
						move (rooms.helensDesk);
					},

					'EAST' : function ()
					{
						move (rooms.footballTable);
					}
				},
				'ITEMS' : 
				{
					'HELICOPTER' : {
						'LOOK' : function ()
						{
							out ('On the helicopter you see a <span class="catlab-adventure-item">REMOTE HELICOPTER</span>.');
						},
						'EXAMINE' : function ()
						{
							out ('The helicopter is quite small, in comparison with Emmanuel\'s helicopter,');
							out ('but it seems fun to play with.');
						},
						'USE' : function ()
						{
							out ('After crashing the helicopter a few time you grow bored of it.');
						}
					}
				}
			},

			'helensDesk' : {
				'LOOK' : function ()
				{
					out ('You are standing near Hélènes desk.');
					out ('You see some stairs.');
				},

				'GO' :
				{
					'EAST' : function ()
					{
						move (rooms.rewsDesk);
					},

					'WEST' : function ()
					{
						move (rooms.kevinsDesk);
					},

					'NORTH' : function ()
					{
						move (rooms.pierreDesk);
					},

					'UP' : function ()
					{
						move (rooms.serverRoom);
					}
				}
			},

			'kevinsDesk' : {
				'LOOK' : function ()
				{
					out ('You are standing near Kevins desk.');
				},

				'GO' :
				{
					'EAST' : function ()
					{
						move (rooms.helensDesk);
					},

					'WEST' : function ()
					{
						move (rooms.raphaelsDesk);
					}
				}
			},

			'raphaelsDesk' : {
				'LOOK' : function ()
				{
					out ('You are standing near Raphaels desk.');
				},

				'GO' :
				{
					'EAST' : function ()
					{
						move (rooms.kevinsDesk);
					},

					'WEST' : function ()
					{
						move (rooms.dineshDesk);
					}
				}
			},

			'dineshDesk' : {
				'LOOK' : function ()
				{
					out ('You are standing near Dinesh\'s desk.');
				},

				'GO' :
				{
					'EAST' : function ()
					{
						move (rooms.raphaelsDesk);
					},

					'WEST' : function ()
					{
						move (rooms.thijsDesk);
					}
				}
			},

			'thijsDesk' : {
				'LOOK' : function ()
				{
					out ('You are standing near Thijs\' desk.');
				},

				'GO' :
				{
					'EAST' : function ()
					{
						move (rooms.dineshDesk);
					},

					'WEST' : function ()
					{
						move (rooms.tanguyDesk);
					},

					'SOUTH' : function ()
					{
						move (rooms.loicDesk);
					}
				}
			},

			'tanguyDesk' : {
				'LOOK' : function ()
				{
					out ('You are standing near Tanguy\'s desk.');
				},

				'GO' :
				{
					'EAST' : function ()
					{
						move (rooms.thijsDesk);
					},

					'WEST' : function ()
					{
						move (rooms.emmanuelsDesk);
					}
				}
			},

			'emmanuelsDesk' : {
				'LOOK' : function ()
				{
					out ('You are standing near Emmanuel\'s desk.');
				},

				'GO' :
				{
					'EAST' : function ()
					{
						move (rooms.tanguyDesk);
					},

					'SOUTH' : function ()
					{
						move (rooms.juliaDesk);
					},

					'NORTH' : function ()
					{
						move (rooms.alexisDesk);
					}
				}
			},

			'juliaDesk' : {
				'LOOK' : function ()
				{
					out ('You are standing near Julia\'s desk.');
				},

				'GO' :
				{
					'SOUTH' : function ()
					{
						move (rooms.bossDesk);
					},

					'NORTH' : function ()
					{
						move (rooms.emmanuelsDesk);
					}
				},

				'ITEMS' : 
				{
					'ACCESS CARD' : {
						'LOOK' : function ()
						{
							out ('On the desk there is an electronic <span class="catlab-adventure-item">ACCESS CARD</span>.');
						},

						'EXAMINE' : function ()
						{
							out ('It looks like an access card for a door.');	
						},

						'USE' : function ()
						{
							if (self.getCurrentRoom.NAME === 'start')
							{
								out ('The <span class="catlab-adventure-item">ACCESS CARD</span> opens the door.');
							}
							else
							{
								out ('I don\'t know what you want to do with an <span class="catlab-adventure-item">ACCESS CARD</span> here.');
							}
						}
					}
				}
			},

			'alexisDesk' : {
				'LOOK' : function ()
				{
					out ('You are standing near Alexis\' desk.');
				},

				'GO' :
				{
					'SOUTH' : function ()
					{
						move (rooms.emmanuelsDesk);
					}
				}
			},

			'bossDesk' : {
				'LOOK' : function ()
				{
					out ('You are standing near the Emmanuel the CEO\'s desk.');
				},

				'GO' :
				{
					'NORTH' : function ()
					{
						move (rooms.juliaDesk);
					}
				}
			},

			// Line 2
			'loicDesk' : {
				'LOOK' : function ()
				{
					out ('You are standing near the Loïc\'s desk.');
				},

				'GO' :
				{
					'NORTH' : function ()
					{
						move (rooms.thijsDesk);
					},

					'SOUTH' : function ()
					{
						move (rooms.manuelDesk);
					}
				}
			},

			'manuelDesk' : {
				'LOOK' : function ()
				{
					out ('You are standing near the Manuel\'s desk.');
				},

				'GO' :
				{
					'NORTH' : function ()
					{
						move (rooms.loicDesk);
					},

					'SOUTH' : function ()
					{
						move (rooms.manuelDesk);
					}
				}
			},

			'aloisDesk' : {
				'LOOK' : function ()
				{
					out ('You are standing near the Aloïs\' desk.');
				},

				'GO' :
				{
					'NORTH' : function ()
					{
						move (rooms.manuelDesk);
					},

					'EAST' : function ()
					{
						move (rooms.vincentDesk);
					}
				}
			},

			'vincentDesk' : {
				'LOOK' : function ()
				{
					out ('You are standing near the Vincent\'s desk.');
				},

				'GO' :
				{
					'EAST' : function ()
					{
						move (rooms.jeanbaptisteDesk);
					},

					'WEST' : function ()
					{
						move (rooms.aloisDesk);
					},

					'SOUTH' : function ()
					{
						move (rooms.samirDesk);
					}
				}
			},

			'jeanbaptisteDesk' : {
				'LOOK' : function ()
				{
					out ('You are standing near the Aloïs\' desk.');
				},

				'GO' :
				{
					'EAST' : function ()
					{
						move (rooms.marijanDesk);
					},

					'WEST' : function ()
					{
						move (rooms.vincentDesk);
					}
				}
			},

			'marijanDesk' : {
				'LOOK' : function ()
				{
					out ('You are standing near the Marijan\'s desk.');
				},

				'GO' :
				{
					'EAST' : function ()
					{
						move (rooms.start);
					},

					'WEST' : function ()
					{
						move (rooms.jeanbaptisteDesk);
					}
				}
			},

			// A little tour to the right
			'samirDesk' : {
				'LOOK' : function ()
				{
					out ('You are standing near the Samir\'s desk.');
				},

				'GO' :
				{
					'WEST' : function ()
					{
						move (rooms.jeanDesk);
					},

					'NORTH' : function ()
					{
						move (rooms.vincentDesk);
					}
				}
			},

			'jeanDesk' : {
				'LOOK' : function ()
				{
					out ('You are standing near the Jean\'s desk.');
				},

				'GO' :
				{
					'EAST' : function ()
					{
						move (rooms.samirDesk);
					}
				}
			},

			// And let's not forget about piere & guillaume
			'pierreDesk' : {
				'LOOK' : function ()
				{
					out ('You are standing near the Pierre\'s desk.');
				},

				'GO' :
				{
					'NORTH' : function ()
					{
						move (rooms.guillaumeDesk);
					},

					'SOUTH' : function ()
					{
						move (rooms.helensDesk);
					}
				}
			},

			'guillaumeDesk' : {
				'LOOK' : function ()
				{
					out ('You are standing near the Guillaume\'s desk.');
				},

				'GO' :
				{
					'SOUTH' : function ()
					{
						move (rooms.pierreDesk);
					}
				}
			},

			'footballTable' : {
				'LOOK' : function ()
				{
					out ('You are standing near the table football.');
				},

				'GO' :
				{
					'WEST' : function ()
					{
						move (rooms.rewsDesk);
					}
				}
			},

			'serverRoom' : {
				'LOOK' : function ()
				{
					out ('You are in the server room.');
				},

				'GO' :
				{
					'DOWN' : function ()
					{
						move (rooms.helensDesk);
					}
				}
			}
		};

		rooms.welcome ();

		// name all roms
		for (var room in rooms)
		{
			rooms[room].NAME = room;
		}

		this.setCurrentRoom (rooms.start);
	};
	
	this.stop = function ()
	{
		this.rootdiv.parentNode.removeChild (this.rootdiv);
		document.body.style.overflow = this.obodyoverflow;
	};
}
