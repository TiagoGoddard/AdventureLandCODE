define(["scripts/utils"],function (utils) {
	return {
		is_healer: function() {
			return false;
		},
		is_ranged: function() {
			return false;
		},
		is_tank: function() {
			return true;
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
			return 'mpot0';
		},
		use_skill: function(target, time_since) {
			//Charge only if charge is off of cd (cd is 40sec).
			if (!time_since || new Date() - time_since > 40000) {
				time_since = new Date();
				parent.socket.emit("ability", {
					name: "charge",
				});
			}

			return time_since;
		},
		use_tank_skill: function(target, time_since) {
			if(target) {
				//Taunt only if target hasn't been taunted and if taunt is from cd (cd is 6sec).
				if ((!time_since || new Date() - time_since > 6000) && !target.taunted) {
					time_since = new Date();
					parent.socket.emit("ability", {
						name: "taunt",
						id: target.id
					});
				}
			}

			return time_since;
		}
	};
});