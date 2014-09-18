var IDBstores = function(event) {
			
	console.log("Upgrading IDB.")
	
	var db = event.target.result;
	var objectStore;
	
	// Me (current user)
	objectStore = db.createObjectStore("me", { keyPath: "id" });
	
	// Accounts
	objectStore = db.createObjectStore("accounts", { keyPath: "id" });
	
	// Channels
	objectStore = db.createObjectStore("channels", { keyPath: "id" });
	objectStore.createIndex("type", "type", { unique: false });
	
	// Streams
	objectStore = db.createObjectStore("streams", { keyPath: "id" });
	objectStore.createIndex("type", "token", { unique: false });
	
	// Messages
	objectStore = db.createObjectStore("messages", { keyPath: "id" });
	objectStore.createIndex("stream", "stream", { unique: false });
	
	// Notifications
	objectStore = db.createObjectStore("notifications", { keyPath: "id" });
	objectStore.createIndex("stream", "stream", { unique: false });
	
	// Users
	objectStore = db.createObjectStore("users", { keyPath: "id" });
	objectStore.createIndex("name", "displayname", { unique: false });
	
	// Contacts
	objectStore = db.createObjectStore("contacts", { keyPath: "id" });
	objectStore.createIndex("name", "displayname", { unique: false });
	
	// Campaigns
	objectStore = db.createObjectStore("campaigns", { keyPath: "id" });
	
	// Ping
	objectStore = db.createObjectStore("ping", { keyPath: "id" });
	
	// Touches
	objectStore = db.createObjectStore("touches", { keyPath: "id" });
}