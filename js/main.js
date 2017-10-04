jQuery(function() {
	initTab();
});

function initTab() {
	jQuery('.tab-hodler').tab({
		opener: 'input[type=checkbox]',
		hideOnSecondClick: true
	});
	jQuery('.tab-hodler').tab({
		opener: 'input[type=radio]'
	});
	jQuery('.tab-hodler').tab({
		opener: '.opener',
		openDefault: false,
		hideOnSecondClick: true,
		dataAttr: 'href'
	});
	jQuery('.select-tab-hodler').tab({
		opener: 'select',
		dataAttr: 'data-tab',
		event: 'change',
		openDefault: true,

		onInit: function(self) {
			var opener = jQuery(self.options.opener);
			var slide;

			function clickHandler() {
				slide = jQuery(opener.val());

				self.showTab(slide, opener)
			}

			if (self.options.openDefault) {
				slide = jQuery(opener.attr(self.options.dataAttr));

				self.showTab(slide, opener)
			}

			opener.on(self.options.event, clickHandler);
		}
	});
}

;(function($){
	function Tab(options) {
		this.options = $.extend({
			activeClass: 'active',
			opener: 'input[type=checkbox]',
			slide: '.tab',
			dataAttr: 'data-target',
			event: 'click',
			openDefault: true,
			hideOnSecondClick: false,
		}, options);
		this.init();
	}

	Tab.prototype = {
		init: function() {
			if (this.options.holder) {
				this.findElements();
				this.attachEvents();
				this.opendDefaultTab(this.activeTab);
				this.makeCallback('onInit', this);
			}
		},
		findElements: function() {
			this.holder = $(this.options.holder);
			this.opener = this.holder.find(this.options.opener);
			this.tabs = this.holder.find(this.options.slide);
			this.activeLink = this.opener.filter('.' + this.options.activeClass);
			this.activeTab = $(this.activeLink.attr(this.options.dataAttr));
		},
		attachEvents: function() {
			var self = this;

			this.eventHandler = function(e) {
				e.preventDefault();
				var target = $(e.target);
				var slide;

				slide = $(target.attr(self.options.dataAttr))
				self.toggleTab(slide, target);
			}

			this.opener.on(this.options.event, this.eventHandler);
		},
		opendDefaultTab: function(activeTab) {
			if (this.options.openDefault) {
				activeTab.addClass(this.options.activeClass);
			}
		},
		isOpened: function(opener) {
			return opener.hasClass(this.options.activeClass);
		},
		showTab: function(activeTab, opener) {
			this.hideTab(activeTab, opener);

			activeTab.addClass(this.options.activeClass);
			opener.addClass(this.options.activeClass);
			this.makeCallback('onShow', activeTab, opener);
		},
		hideTab: function(activeTab, opener) {
			this.opener.removeClass(this.options.activeClass);
			this.tabs.removeClass(this.options.activeClass);
			this.makeCallback('onHide', activeTab, opener);
		},
		toggleTab: function(activeTab, opener) {
			if(!this.isOpened(opener)) {
				this.showTab(activeTab, opener);
			} else {
				if(this.options.hideOnSecondClick) {
					this.hideTab(activeTab, opener);
				}
			}
		},
		destroy: function() {
			this.opener.off(this.options.event, this.eventHandler);
			this.tabs.removeClass(this.options.activeClass);
		},
		makeCallback: function(name) {
			if (typeof this.options[name] === 'function') {
				var args = Array.prototype.slice.call(arguments);
				args.shift();
				this.options[name].apply(this, args);
			}
		}
	};

	// jQuery plugin interface
	$.fn.tab = function(opt) {
		return this.each(function() {
			jQuery(this).data('Tab', new Tab($.extend(opt, { holder: this })));
		});
	};
}(jQuery));