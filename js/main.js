jQuery(function() {
	initTab();
});

function initTab() {
	jQuery('.tab-hodler').tab({
		opener: 'input[type=checkbox]'
	});
	jQuery('.tab-hodler').tab({
		opener: 'input[type=radio]'
	});
	jQuery('.tab-hodler').tab({
		opener: '.opener',
		dataAttr: 'href'
	});
	jQuery('.tab-hodler').tab({
		opener: 'select',
		dataAttr: 'data-tab',
		event: 'change',
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
		}, options);
		this.init();
	}

	Tab.prototype = {
		init: function() {
			if (this.options.holder) {
				this.findElements();
				this.attachEvents();
				this.opendDefaultTab(this.activeTab);
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

				if (self.isOpenerSelect()) {
					slide = $(target.val());
				} else {
					slide = $(target.attr(self.options.dataAttr))
				}

				self.toggleTab(slide, target);
			}

			if (this.isOpenerSelect()) {
				this.opendDefaultTab($(this.opener.attr(this.options.dataAttr)));
			}

			this.opener.on(this.options.event, this.eventHandler);
		},
		opendDefaultTab: function(activeTab) {
			if (this.options.openDefault) {
				activeTab.css({
					display: 'block'
				});
			}
		},
		isOpenerSelect: function() {
			return this.options.opener == 'select'
		},
		toggleTab: function(slide, opener) {
			this.opener.removeClass(this.options.activeClass);
			this.tabs.css({
				display: 'none'
			});

			slide.css({
				display: 'block'
			});

			opener.addClass(this.options.activeClass);
		},
		destroy: function() {
			this.opener.off(this.options.event, this.eventHandler);
			this.tabs.css({
				display: 'none'
			});
		}
	};

	// jQuery plugin interface
	$.fn.tab = function(opt) {
		return this.each(function() {
			jQuery(this).data('Tab', new Tab($.extend(opt, { holder: this })));
		});
	};
}(jQuery));