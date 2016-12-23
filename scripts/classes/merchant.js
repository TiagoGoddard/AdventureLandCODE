define(["scripts/utils"],function (utils) {
	return {
		is_healer: function() {
			return false;
		},
		is_ranged: function() {
			return true;
		},
		is_tank: function() {
			return false;
		},
		is_skill_attack: function() {
			return false;
		},
		has_attack: function() {
			return false;
		},
		use_skill: function(target, time_since) {
			if (!time_since || new Date() - time_since > 60000) {
				time_since = new Date();
			}
			return time_since;
		}
	};
});