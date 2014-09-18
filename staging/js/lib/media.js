/**
 *	Example usage: Photo Booth
 *	1. Add	<videao autoplay></video>
 *			<img src="">
 *			<canvas style="display:none;"></canvas>
 *
 *	2. Create Media object with {video: true}
 *	3. Start the Video capture with Media.start()
 *	4. Trigger the snapshot function on user action
 *
 *	Credit: the HTML5 Rocks tutorial
 *	http://www.html5rocks.com/en/tutorials/getusermedia/intro/
 *
 **/

var MediaClass = function(requires) {
	
	this.parameters = requires;
	this.videoloaded = false;
	
	/*
	 *	Set up user approval
	 *	
	 */
	this.start = function(func)
	{
		// Browser dependencies
		navigator.getMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
		
		// Add approval notification
		if (this.parameters.video)
			Cloudwalkers.RootView.information("", "Approve the camera request <small>(top part of your browserview)</small>", "#compose [data-type=post]");
		
		// Get User Media
		navigator.getMedia(this.parameters, function(localMediaStream) {
		
			this.video = document.querySelector('video');
			this.video.src = window.URL.createObjectURL(localMediaStream);
			
			this.mediastream = localMediaStream;

			this.video.onloadedmetadata = function(e)
			{
				Cloudwalkers.RootView.closeInformation();
				this.videoloaded = true
			
			}.bind(this);
			
		}.bind(this), errorCallback);
  
	}
	
	/*
	 *	Take Snapshot
	 *	
	 */
	this.snapshot = function(image)
	{	
		// Check start
		if (!this.videoloaded)
			return Cloudwalkers.RootView.information("No Video", "You seem to have declined the Camera Access", "#camera-data");
		
		// Select dom elements	
		var canvas = document.querySelector('canvas');
		
		var ctx = canvas.getContext('2d');
		
		// Add image
		ctx.drawImage(this.video, 0, 0, 640, 480);
		
		// Turn off that green light
		this.mediastream.stop();
		
		if(image)
		{
			image.attr('src', canvas.toDataURL('image/webp'));
			return image.attr("src");
		
		} else return canvas.toDataURL('image/webp');
	}
	
	/*
	 *	If approval goes south
	 *
	 */
	var errorCallback = function(e)
	{
		console.log('Rejected:', e);
	}
		 
	return this;
}