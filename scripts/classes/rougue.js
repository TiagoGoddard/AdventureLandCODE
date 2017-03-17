define(["scripts/utils"],function (utils) {
	return {
		is_healer: function() {
			return false;
		},
		is_ranged: function() {
			return false;
		},
		is_tank: function() {
			return false;
		},
		is_skill_attack: function() {
			return false;
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
			//Vanish one invis is off cd (cd is 12sec).
			if (!time_since || new Date() - time_since > 12000) {
				time_since = new Date();
				parent.socket.emit("ability", {
					name: "invis",
				});
			}

			return time_since;
		}
	};
});