<ul class="page-sidebar-menu">
	<li>
		<!-- BEGIN SIDEBAR TOGGLER BUTTON -->
		<div class="sidebar-toggler hidden-phone"></div>
		<!-- BEGIN SIDEBAR TOGGLER BUTTON -->
	</li>
	
	<li>
		<!-- NO QUICK SEARCH... -->
	</li>
	
	<li class="start write">
		<a href="#write">
		<i class="icon-share-sign"></i> 
		<span class="title">Compose message</span>
		<span class="selected"></span>
	</a>
	</li>
	
	<li class="dashboard">
		<a href="#dashboard">
		<i class="icon-dashboard"></i> 
		<span class="title">Dashboard</span>
		<span class="selected"></span>
		</a>
	</li>
	
	{{#channels}}
		<li class="channel_{{channelid}}">
			<a href="#channel/{{channelid}}" onclick="document.location='#channel/{{channelid}}';">
				<i class="icon-inbox"></i> 
				<span class="title">{{name}}</span>
				<span class="selected"></span>
			</a>

			<ul class="sub-menu">
				{{#streams}}
					<li><a href="#channel/{{channelid}}/{{id}}">{{customname}}</a></li>
				{{/streams}}
			</ul>
		</li>
	{{/channels}}
	
	<li class="schedule">
		<a href="#schedule">
		<i class="icon-time"></i> 
		<span class="title">Schedule</span>
		<span class="selected"></span>
		</a>
	</li>

	<li class="drafts">
		<a href="#drafts">
		<i class="icon-time"></i> 
		<span class="title">Drafts</span>
		<span class="selected"></span>
		</a>
	</li>
	
	<!--
	<li class="">
		<a href="monitoring.html">
		<i class="icon-tags"></i> 
		<span class="title">Keyword monitoring</span>
		<span class="arrow "></span>
		<span class="selected"></span>
		</a>
	</li>
	
	<li class="">
		<a href="pages.html">
		<i class="icon-briefcase"></i> 
		<span class="title">Company pages</span>
		<span class="arrow "></span>
		</a>
	</li>
	
	<li class="">
		<a href="feeds.html">
		<i class="icon-globe"></i> 
		<span class="title">Social Feeds</span>
		<span class="arrow"></span>
		</a>
	</li>
	
	<li class="">
		<a href="reports.html">
		<i class="icon-bar-chart"></i> 
		<span class="title">Reports</span>
		<span class="selected"></span>
		</a>					
	</li>
	-->
	
	<li class="">
		<a href="#users">
		<i class="icon-group"></i> 
		<span class="title">User Management</span>
		<span class="selected"></span>
		</a>
	</li>
</ul>