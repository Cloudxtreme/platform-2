define(
	['backbone'],
	function (Backbone)
	{
		var Widgets = Backbone.Collection.extend({

			'model' : Cloudwalkers.Models.Widget,
			'widgets' :
			{
				'widget_1' : { widget: "messagescounters", type: "inbox", source: "streams", size: 4, icon: "inbox", open: true, counter: true, typelink: "#inbox", countString: "incomingUnread", scrollable: 'scrollable', translation: {'title': 'inbox'} },
			    'widget_2' : { widget: "messagescounters", type: "monitoring", source: "channels", size: 4, icon: "tags", open: true, counter: true, countString: "incoming", scrollable: 'scrollable', translation: { 'title': 'keywords'} },
			    'widget_3' : { widget: "schedulecounter", type: "schedule", source: "outgoing", size: 4, icon: "time", open: true, counter: true, countString: "scheduled", link: "#scheduled", scrollable: 'scrollable', translation:{ 'title': 'schedule'} },
			    'widget_4' : { widget: "coworkers", type: "coworkers", size: 4, color: "grey", icon: "edit", open: true, link: "#coworkers", scrollable: 'scrollable', translation: { 'title': 'co-workers_wall'} },
				'widget_5' : { widget: "trending", type: "profiles", size: 4, color : "red", icon: "thumbs-up", open: true, since: 7, sublink: "#trending/", scrollable: 'scrollable', translation:{ 'title': 'trending_company_posts'} },
				'widget_6' : { widget: "trending", type: "news", size: 4, color: "red", icon: "thumbs-up", open: true, since: 1, sublink: "#trending/", scrollable: 'scrollable', translation:{ 'title': 'trending_accounts_we_follow'} },

				// New Widgets
				'widget_7' : { widget: "accountswefollow", type: "news", size: 4, color: "blue", icon: "globe", open: true, since: 1, sublink: "#trending/", scrollable: 'scrollable', translation:{ 'title': 'accounts_we_follow'} },
				'widget_8' : { widget: "drafts", type: "draft", size: 4, color: "blue", icon: "edit", open: true, since: 1, link: "#drafts", scrollable: 'scrollable', translation:{ 'title': 'drafts'} },

				// Webcare
				'widget_9' : { widget: "webcarecounter", type:'open_me', size: 3, assigneduser: 'me', status: 'open', translation:{ 'title': 'open_messages_assigned_to_me'} },
				'widget_10' : { widget: "webcarecounter", type:'open_mygroups', size: 3, assigned: 'me', status: 'open', translation:{ 'title': 'open_messages_assigned_to_my_groups'} },
				'widget_11' : { widget: "webcarecounter", type:'handled_me', size: 3, assigneduser: 'me', status: 'closed', translation:{ 'title': 'messages_handled_this_week_by_me'} },
				'widget_12' : { widget: "webcarecounter", type:'handled_mygroups', size: 3, assigned: 'me', status: 'closed', translation:{ 'title': 'messages_handled_this_week_by_my_groups'} },

				// Write
				'widget_13' : { widget: "write", type: "draft", size: 4, color: "blue", icon: "edit", open: true, since: 1, link: "#drafts", scrollable: 'scrollable', translation:{ 'title': 'quick_draft'} },
				'widget_14' : { widget: "write", type: "note", size: 4, color: "blue", icon: "edit", open: true, since: 1, link: "#drafts", scrollable: 'scrollable', translation:{ 'title': 'quick_note'} },

				// Conversation
				'widget_15' : { widget: "conversation", size: 12, since: 7, translation:{ 'title': 'top_post_on_company_page'} },
				'widget_16' : { widget: "conversation", sort: "date", size: 12, since: 7, translation:{ 'title': 'latest_company_post'} }
			},

			'initialize' : function(options)
			{
				if(options) $.extend(this, options);
			},

			'startWidgets': function(widgets) {

				for(i in widgets)
				{
					var widget = new this.model(this.widgets[widgets[i]]);
					this.add(widget);
					
				}
			}
		});

		return Widgets;
});