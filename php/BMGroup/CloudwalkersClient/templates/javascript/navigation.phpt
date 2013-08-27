<ul class="page-sidebar-menu">
	<li>
		<!-- BEGIN SIDEBAR TOGGLER BUTTON -->
		<div class="sidebar-toggler hidden-phone"></div>
		<!-- BEGIN SIDEBAR TOGGLER BUTTON -->
	</li>
	
	<li>
		<!-- NO QUICK SEARCH... -->
	</li>

	<li class="start dashboard">
		<a href="#dashboard">
		<i class="icon-dashboard"></i> 
		<span class="title">Dashboard</span>
		<span class="selected"></span>
		</a>
	</li>
	
	<li class="write">
		<a href="#write">
		<i class="icon-share-sign"></i> 
		<span class="title">Compose message</span>
		<span class="selected"></span>
	</a>
	</li>

	<li class="trending">
		<a href="#trending">
			<i class="icon-thumbs-up"></i> 
			<span class="title">Trending topics</span>
			<span class="selected"></span>
		</a>

		<ul class="sub-menu">

			{{#sortedchannels.news}}
				<li class="trending_{{id}}">
					<a href="#trending/{{channelid}}">
						<i class="icon-{{icon}}"></i> 
						Followed Pages
					</a>
				</li>
			{{/sortedchannels.news}}

			{{#sortedchannels.profiles}}
				<li class="trending_{{id}}">
					<a href="#trending/{{channelid}}">
						<i class="icon-{{icon}}"></i> 
						{{name}}
					</a>
				</li>
			{{/sortedchannels.profiles}}

		</ul>
	</li>
	
	{{#sortedchannels.inbox}}
		<li class="channel_{{channelid}}">
			<a href="#channel/{{channelid}}" onclick="document.location='#channel/{{channelid}}';">
				<i class="icon-{{icon}}"></i> 
				<span class="title">{{name}}</span>
				<span class="selected"></span>
			</a>

			<ul class="sub-menu">
				{{#streams}}
					<li class="channel_{{channelid}}_{{id}}"><a href="#channel/{{channelid}}/{{id}}"><i class="icon-{{network.icon}}"></i> {{customname}}</a></li>
				{{/streams}}
			</ul>
		</li>
	{{/sortedchannels.inbox}}

	<li class="drafts">
		<a href="#drafts">
		<i class="icon-edit"></i> 
		<span class="title">Drafts</span>
		<span class="selected"></span>
		</a>
	</li>	

	<li class="schedule">
		<a href="#schedule" onclick="document.location='#schedule';">
			<i class="icon-time"></i> 
			<span class="title">Schedule</span>
			<span class="selected"></span>
		</a>

		<ul class="sub-menu">
			{{#scheduledstreams}}
				<li class="schedule_{{id}}">
					<a href="#schedule/{{id}}">
						<i class="icon-{{network.icon}}"></i>
						{{customname}}
					</a>
				</li>
			{{/scheduledstreams}}
		</ul>
	</li>

	{{#sortedchannels.profiles}}
		<li class="channel_{{channelid}}">
			<a href="#channel/{{channelid}}" onclick="document.location='#channel/{{channelid}}';">
				<i class="icon-{{icon}}"></i> 
				<span class="title">{{name}}</span>
				<span class="selected"></span>
			</a>

			<ul class="sub-menu">
				{{#streams}}
					<li class="channel_{{channelid}}_{{id}}"><a href="#channel/{{channelid}}/{{id}}"><i class="icon-{{network.icon}}"></i> {{customname}}</a></li>
				{{/streams}}
			</ul>
		</li>
	{{/sortedchannels.profiles}}

	{{#sortedchannels.news}}
		<li class="channel_{{channelid}}">
			<a href="#channel/{{channelid}}" onclick="document.location='#channel/{{channelid}}';">
				<i class="icon-{{icon}}"></i> 
				<span class="title">{{name}}</span>
				<span class="selected"></span>
			</a>

			<ul class="sub-menu">
				{{#streams}}
					<li class="channel_{{channelid}}_{{id}}"><a href="#channel/{{channelid}}/{{id}}"><i class="icon-{{network.icon}}"></i> {{customname}}</a></li>
				{{/streams}}
			</ul>
		</li>
	{{/sortedchannels.news}}

	
	{{#sortedchannels.monitoring}}
		<li class="channel_{{channelid}}">
			<a href="#channel/{{channelid}}" onclick="document.location='#channel/{{channelid}}';">
				<i class="icon-{{icon}}"></i> 
				<span class="title">{{name}}</span>
				<span class="selected"></span>
			</a>

			<ul class="sub-menu">
				{{#streams}}
					<li class="channel_{{channelid}}_{{id}}"><a href="#channel/{{channelid}}/{{id}}"><i class="icon-{{network.icon}}"></i> {{customname}}</a></li>
				{{/streams}}
			</ul>
		</li>
	{{/sortedchannels.monitoring}}

	
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
	-->


	<li class="reports">
		<a href="#reports">
			<i class="icon-bar-chart"></i> 
			<span class="title">Reports</span>
			<span class="selected"></span>
		</a>

		<ul class="sub-menu">
			{{#statisticchannels}}
				<li class="reports_{{id}}"><a href="#reports/{{id}}"><i class="icon-{{network.icon}}"></i> {{customname}}</a></li>
			{{/statisticchannels}}
		</ul>
	</li>
	
	<li class="">
		<a href="#users">
		<i class="icon-group"></i> 
		<span class="title">User Management</span>
		<span class="selected"></span>
		</a>
	</li>
</ul>