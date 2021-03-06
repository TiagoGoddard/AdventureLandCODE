define(["scripts/utils"],function (utils) {
	return {
		is_healer: function() {
			return true;
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
			return 'hpot0';
		},
		get_mp_potion: function() {
			return 'mpot1';
		},
		use_skill: function(target, time_since) {
			//Curse only if target hasn't been cursed and if curse is off cd (cd is 5sec).
			if ((!time_since || new Date() - time_since > 5000) && !target.cursed) {
				time_since = new Date();
				parent.socket.emit("ability", {
					name: "curse",
					id: target.id
				});
			}

			return time_since;
		}
	};
});