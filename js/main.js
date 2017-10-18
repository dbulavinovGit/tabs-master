jQuery(function() {
	initTab();
});

function initTab() {
	var select = jQuery("select");
	var options = select.children();

	jQuery('.tab-hodler').tab({
		opener: '.opener',
		openDefault: true,
		classToParent: true,
		dataAttr: 'href',

		onInit: function(self) {
			select.on('change', function() {
				var item = jQuery(this)
				var activeIndex = item.children('option:selected').index();

				self.getActiveItems(activeIndex);
				self.toggleTab();
			});
		}
	});
	jQuery('.tab-hodler2').tab({
		opener: 'input[type=checkbox]',
		hideOnSecondClick: true,
	});
	jQuery('.tab-hodler3').tab({
		opener: 'input[type=radio]'
	});
}

;(function($){
	function Tab(options) {
		this.options = $.extend({
			activeClass: 'active',
			classToParent: false,
			opener: 'input[type=checkbox]',
			slide: '.tab',
			dataAttr: 'data-target',
			event: 'click',
			hideOnSecondClick: false,
			openDefault: true,
		}, options);
		this.init();
	}

	Tab.prototype = {
		init: function() {
			if (this.options.holder) {
				this.findElements();
				this.attachEvents();
				this.opendDefaultTab();
				this.makeCallback('onInit', this);
			}
		},
		findElements: function() {
			this.holder = $(this.options.holder);
			this.openers = this.holder.find(this.options.opener);
			this.tabs = this.holder.find(this.options.slide);
		},
		attachEvents: function() {
			var self = this;

			this.eventHandler = function(e) {
				e.preventDefault();
				self.currentOpener = e.target;
				self.activeIndex = self.getClassTarget(self.openers).index(self.getClassTarget($(self.currentOpener)));
				self.getActiveItems(self.activeIndex);
				self.toggleTab();
			}

			this.openers.on(this.options.event, this.eventHandler);
		},
		opendDefaultTab: function() {
			if (this.options.openDefault) {
				this.activeIndex = this.getClassTarget(this.openers).index(this.getClassTarget(this.openers).filter('.' + this.options.activeClass));
				this.getActiveItems(this.activeIndex);
				this.showTab();
				this.makeCallback('onShowDefault', this);
			}
		},
		isOpened: function() {
			return this.activeLink.hasClass(this.options.activeClass);
		},
		getClassTarget: function(item) {
			return this.options.classToParent ? item.parent() : item;
		},
		getActiveItems: function(index) {
			this.activeTab = $(this.openers.eq(index).attr(this.options.dataAttr));
			this.activeLink = this.getClassTarget(this.openers.eq(index));
		},
		showTab: function() {
			this.activeTab.addClass(this.options.activeClass);
			this.activeLink.addClass(this.options.activeClass);
			this.makeCallback('onShow', this);
		},
		hideTab: function() {
			this.getClassTarget(this.openers).removeClass(this.options.activeClass);
			this.tabs.removeClass(this.options.activeClass);
			this.makeCallback('onHide', this);
		},
		toggleTab: function() {
			if(this.options.hideOnSecondClick) {
				if(this.isOpened()) {
					this.hideTab();
				} else {
					this.hideTab();
					this.showTab();
				}
			} else {
				this.hideTab();
				this.showTab();
			}
		},
		destroy: function() {
			this.openers.off(this.options.event, this.eventHandler);
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
		var args = Array.prototype.slice.call(arguments);
		var method = args[0];

		return this.each(function() {
			var $holder = jQuery(this);
			var instance = $holder.data('Tab');

			if (typeof opt === 'object' || typeof opt === 'undefined') {
				$holder.data('Tab', new Tab($.extend({
					holder: this
				}, opt)));
			} else if (typeof method === 'string' && instance) {
				if (typeof instance[method] === 'function') {
					args.shift();
					instance[method].apply(instance, args);
				}
			}
		});
	};
}(jQuery));