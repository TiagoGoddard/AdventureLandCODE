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
		get_hp_potion: function() {
			return 'hpot0';
		},
		get_mp_potion: function() {
			return 'mpot0';
		},
		use_skill: function(target, time_since) {
			if (!time_since || new Date() - time_since > 60000) {
				time_since = new Date();
			}
			return time_since;
		}
	};
});