var StorageClassLocal = function(successCallback, errorCallback) {
	
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
	 * if no selector is given, return all members of type
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
	 * EXISTS function
	 *
	 * Return true or false if storage item exists.
	 * This function DOES return synchronic (if no callback is provided), but asyncronic callback usage is strongly advised.
	 */
	 
	 this.exists = function(type, selector, callback) {
		
		var group = JSON.parse(window.localStorage.getItem(type));  
		
		if(group && selector)
			for(key in selector)
				group = group.filter(function(el){ return (el[key] == selector[key]); });
		
		var exists = (group && group.length);
		
		if(callback)
		{
			callback(exists);
			return this;
		}
		
		return exists;
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
	 * POST Backbone Collection
	 *
	 * Insert a new entry in local storage, desc
	 */
	 
	 this.postCollection = function(type, collection, callback) {
		
		var group = JSON.parse(window.localStorage.getItem(type));  
		if(!group)
			group = [];
			
		collection.each(function(model){
			group.push(model.attributes);
		});
		
		window.localStorage.setItem(type, JSON.stringify(group))
		
		if(callback) callback(content, group.length);
		
		return this;
	}
	
	/*
	 * WRITE function
	 *
	 * Insert a new entry in local storage, overwriting previous ones
	 */
	 
	 this.write = function(type, content, callback) {
		
		try {
		  	window.localStorage.setItem(type, JSON.stringify(content));
		} catch(e) {
			if(e.name === 'QUOTA_EXCEEDED_ERR') {
			    // reset to make space
				window.localStorage.clear();
			}
		}
		
		if(callback) callback(content);
		
		return this;
	}
	
	/*
	 * SET Backbone Model function
	 *
	 * Update existing or insert a new entry in local storage
	 */
	 
	 this.set = function(type, content, callback) {
		
		var set = false;
		 
		var group = JSON.parse(window.localStorage.getItem(type));  
		if(!group)
			group = [];
			
		for (var n in  group) if(group[n].id == content.id)
		{
			$.extend(group[n], content);
			set = true;
		}
		
		if(!set) group.push(content);
		
		window.localStorage.setItem(type, JSON.stringify(group));
		
		if(callback) callback(content);
		
		return this;
	}
	
	/*
	 * UPDATE function (id based)
	 *
	 * Update an existing entry with new data, overwriting existing data
	 * Calls null if no object is found, the object(s) if updated
	 */
	 
	 this.update = function(type, selector, content, callback) {
		
		var collection = JSON.parse(window.localStorage.getItem(type));  
		var group = collection;
		
		if(!selector || !group)	callback(null, content);
		else {
		
			for(key in selector)
				group = group.filter(function(el, id){ return (el[key] == selector[key]); });
			
			for (var n in group)
				for(i in collection)
					if(collection[i].id == group[i].id) collection[i] = $.extend(group[n], content);			
			
			window.localStorage.setItem(type, JSON.stringify(collection));
			
			if(callback)
				if(group.length)	callback(group)
				else				callback(null, content);
		}
		
		return this;
	}
	
	/*
	 * UPDATE BY ID function (id based)
	 *
	 * Update an existing entry with new data, overwriting existing data
	 * Calls null if no object is found, the object if updated
	 */
	 
	 this.updateById = function(type, content, callback) {
		
		var collection = JSON.parse(window.localStorage.getItem(type));
		var entry = false;
		
		if(!collection || !content.id)	callback(null, content);
		else {
		
			for (var n in collection)
				if(collection[n].id == content.id)
					collection[n] = entry = $.extend(collection[n], content);		
			
			window.localStorage.setItem(type, JSON.stringify(collection));
			
			if(callback)
				if(entry)	callback(entry)
				else		callback(null, content);
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
			for (var n in collection)
				if(collection[n][key]==selector[key]) removed.push(collection.splice(n,1));
			
		window.localStorage.setItem(type, JSON.stringify(collection));
		
		if(callback) callback(removed);
		
		return this;
	}
	
	/*
	 * COUNT function
	 *
	 * Count the group.
	 * Returns the number directly.
	 */
	 
	 this.count = function(type) {
		
		var collection = JSON.parse(window.localStorage.getItem(type)); 
		
		return (collection)? collection.length : 0;
	}
	
	/**
	 *	CALC function
	 *	log total localStorage size
	 **/
	 
	 this.calc = function(){
		 
		var total = 0;
		for(var x in localStorage) {
			var amount = (localStorage[x].length * 2) / 1024 / 1024;
			total += amount;
			console.log( x, amount.toFixed(4) + " MB");
		}
		
		console.log( "Total localStorage", total.toFixed(2) + " MB");
		
		return total.toFixed(2);
	 } 

}