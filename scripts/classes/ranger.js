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