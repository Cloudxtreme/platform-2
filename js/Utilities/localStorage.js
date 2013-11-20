var StorageClass = function(successCallback, errorCallback) {
	
	/*
	 * GET function
	 *
	 * Return single object if found, null otherwise.
	 * if no selector is given, return first occurance of type
	 */
	 
	this.get = function(type, selector, callback) {
		
		var group = JSON.parse(window.localStorage.getItem(type));  
		
		if(!group) 			callback(null);
		else if(!selector)	callback(group.shift());
		else {
		
			for(key in selector)
				group = group.filter(function(el){ return (el[key] == selector[key]); });
			
			callback(group.length? group.shift(): null)
		}
		
		return this;
	}
	
	/*
	 * FILTER function
	 *
	 * Return matching array, empty array otherwise.
	 * if no selector is given, return all memebers of type
	 */
	 
	 this.filter = function(type, selector, callback) {
		
		var group = JSON.parse(window.localStorage.getItem(type));  
		
		if(!group) 			callback([]);
		else if(!selector)	callback(group);
		else {
		
			for(key in selector)
				group = group.filter(function(el){ return (el[key] == selector[key]); });
			
			callback(group.length? group: [])
		}
		
		return this;
	}
	
	/*
	 * POST function
	 *
	 * Insert a new entry in local storage
	 */
	 
	 this.post = function(type, content, callback) {
		
		var group = JSON.parse(window.localStorage.getItem(type));  
		if(!group)
			group = [];
			
		group.push(content);
		window.localStorage.setItem(type, JSON.stringify(group))
		
		if(callback) callback(content, group.length-1);
		
		return this;
	}
	
	/*
	 * POST desc function
	 *
	 * Insert a new entry in local storage, desc
	 */
	 
	 this.post_descending = function(type, content, callback) {
		
		var group = JSON.parse(window.localStorage.getItem(type));  
		if(!group)
			group = [];
			
		group.unshift(content);
		window.localStorage.setItem(type, JSON.stringify(group))
		
		if(callback) callback(content, group.length-1);
		
		return this;
	}
	
	/*
	 * WRITE function
	 *
	 * Insert a new entry in local storage, overwriting previous ones
	 */
	 
	 this.write = function(type, content, callback) {
		
		
		window.localStorage.setItem(type, JSON.stringify(content))
		
		if(callback) callback(content);
		
		return this;
	}
	
	/*
	 * UPDATE function (id based)
	 *
	 * Update (an) existing (entry|entries) with new data, overwriting existing data
	 * Calls null if no object is found, the object(s) if updated
	 */
	 
	 this.update = function(type, selector, content, callback) {
		
		var collection = JSON.parse(window.localStorage.getItem(type));  
		var group = collection;
		
		if(!group) 			callback(content);
		else if(!selector)	callback(group.shift());
		else {
		
			for(key in selector)
				group = group.filter(function(el, id){ return (el[key] == selector[key]); });
			
			for(n in group)
				for(i in collection)
					if(collection[i].id == group[i].id) collection[i] = $.extend(group[n], content);			
			
			window.localStorage.setItem(type, JSON.stringify(collection));
			
			if(callback) callback(group);
		}
		
		return this;
	}
	
	/*
	 * DELETE function
	 *
	 * Delete the object or complete group.
	 * Returns the object (group) on deletion.
	 */
	 
	 this.remove = function(type, selector, content, callback) {
		
		var collection = JSON.parse(window.localStorage.getItem(type)); 
		
		if(!selector)	{
			window.localStorage.removeItem(type);
			return collection;
		}
		
		var removed = [];
		
		for(key in selector)
			for(n in collection)
				if(collection[n][key]==selector[key]) removed.push(collection.splice(n,1));
			
		window.localStorage.setItem(type, JSON.stringify(collection));
		
		if(callback) callback(removed);
		
		return this;
	}
}