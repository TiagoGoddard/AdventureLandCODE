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
			return true;
		},
		has_attack: function() {
			return true;
		},
		get_hp_potion: function() {
			return 'hpot1';
		},
		get_mp_potion: function() {
			return 'mpot1';
		},
		use_skill: function(target, time_since) {
			//Cast supershot whenever your off cd (cd is 30sec).
			if (!time_since || new Date() - time_since > 30000) {
				time_since = new Date();
				parent.socket.emit("ability", {
					name: "supershot",
					id: target.id
				});
			}

			return time_since;
		}
	};
});