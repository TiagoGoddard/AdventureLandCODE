define(["require", "scripts/utils", "ui/draw"],function (require, utils, drawer) {

	var pclass = utils.get_class(character.ctype);

	if(pclass) {
		var anchor_mode=utils.get_bool_var('anchor_mode');
		var	attack_mode=utils.get_bool_var('attack_mode');

		var party_leader = utils.get_var('party_leader');

		var anchor_x = utils.get_int_var('anchor_x');
		var anchor_y = utils.get_int_var('anchor_y');
		var anchor_distance_x = utils.get_int_var('anchor_distance_x');
		var anchor_distance_y = utils.get_int_var('anchor_distance_y');

		var near_distance = utils.get_int_var('near_distance');
		var near_distance_negative = utils.get_int_var('near_distance_negative');

		var hunting_monster = utils.get_var('hunting_monster');

		var turn = 0;
		var last_turn = 0;
		var last_attack = 0;
		var last_skill = null;
		var last_tank_skill = null;
		var last_target = null;

		var last_x = 0;
		var last_y = 0;

		var mainInterval = setInterval(function(){
			turn += 1;

			anchor_mode = utils.get_bool_var('anchor_mode');

			anchor_x = utils.get_int_var('anchor_x');
			anchor_y = utils.get_int_var('anchor_y');

			attack_mode = utils.get_bool_var('attack_mode');

			anchor_distance_x = utils.get_int_var('anchor_distance_x');
			anchor_distance_y = utils.get_int_var('anchor_distance_y');

			near_distance = utils.get_int_var('near_distance');
			near_distance_negative = utils.get_int_var('near_distance_negative');

			hunting_monster = utils.get_var('hunting_monster');

			if (turn >= 60) {
				turn = 0;
			}

			if(pclass.is_healer()) {
				if(utils.is_missing_hp(character, 0.7)) {
					if(can_heal(character)) {
						heal(character);
					}
				}
			}

			if(utils.is_missing_hp(character, 0.5)) {
				utils.do_use_hp();
			} else if (utils.is_missing_mp(character, 0.7)) {
				utils.do_use_mp();
			}

			//TODO Gold Boosters
			loot();

			if(!pclass.has_attack()) {
				//Merchant can't attack, so shouldn't really try
				return;
			}

			var party = utils.get_party_players();
			var partyPlayer = null;

			for(var id in party) {
				partyPlayer = party[id];
				if(pclass.is_ranged()) {
					// Make ranged characters stay near the leader and other party members
					if(character.name!=party_leader && !in_attack_range(partyPlayer)) {
						move(
							character.real_x+(partyPlayer.real_x-character.real_x)/2,
							character.real_y+(partyPlayer.real_y-character.real_y)/2
						);

						if(utils.has_attack_range(character, target)) {
							attack(target);
						}
					}
				} else {
					// Make melee stay near the leader and other party members
					if(character.name != party_leader && !utils.has_range(partyPlayer, near_distance * 3)) {
						move(
							character.real_x+(partyPlayer.real_x-character.real_x)/4,
							character.real_y+(partyPlayer.real_y-character.real_y)/4
						);

						if(utils.has_attack_range(character, target)) {
							attack(target);
						}
					}
				}
				if(pclass.is_healer()) {
					if(!partyPlayer.rip && utils.is_missing_hp(partyPlayer, 0.7)) {
						if(can_heal(partyPlayer)) {
							heal(partyPlayer);
						}
					}
				}
			}

			if(!attack_mode || character.moving) return;

			if(anchor_mode && character.name == party_leader && utils.is_away_from(anchor_x, anchor_y, anchor_distance_x, anchor_distance_y)) {
				move(anchor_x, anchor_y);
			}

			var target=get_targeted_monster();
			var targeted=utils.get_monsters_targeted(character);

			if(target && last_attack > 20) {
				last_attack = 0;
				target = null;
			}

			//TODO xp
			if(!target) {
				var targetParty = false;
				for(id in party) {
					partyPlayer = party[id];
					targetParty = get_target_of(partyPlayer);

					if(targetParty == last_target) {
						targetParty = null;
					}

					if(targetParty) break;
				}

				if(!targetParty) {
					var targetMe = false;
					for(id in targeted) {
						targetMe = targeted[id];
					}
					if(!targetMe) {
						var targetedParty = false;
						var monstersTargetedParty = utils.get_monsters_targeted_party();

						if(monstersTargetedParty.length > 0) {
							targetedParty = monstersTargetedParty[0];
						}

						if(!targetedParty) {
							if(hunting_monster) {
								target=get_nearest_monster({'type':hunting_monster,'no_target':true});
							} else {
								target=get_nearest_monster({'no_target':true,'max_att':(character.hp/2)});
							}

							if(target) {
								change_target(target);
							} else {
								set_message("No Monsters");
							}
						} else {
							target = targetedParty;
							change_target(target);
						}
					} else {
						target = targetMe;
						change_target(target);
					}
				} else {
					target = targetParty;
					change_target(target);
				}
			} else {
				if(pclass.is_tank()) {
					if(target.target != character.name && !utils.is_missing_hp(target, 0.4)) {
						last_tank_skill = pclass.use_tank_skill(target, last_tank_skill);
					}
				}

				var runningAway = false;
				if(pclass.is_ranged()) {
					for(id in targeted) {
						var monster = targeted[id];

						if(utils.has_attack_range(character,monster)) {
							runningAway = true;
							set_message("Running Away");
							game_log('Moster is near', '#FF0000');

							last_x = character.real_x;
							last_y = character.real_y;
							var runX = 0;
							var runY = 0;

							if(utils.is_north(character, monster)) {
								runX = near_distance_negative;
							}
							if(utils.is_south(character, monster)) {
								runX = near_distance;
							}
							if(utils.is_west(character, monster)) {
								runY = near_distance;
							}
							if(utils.is_east(character, monster)) {
								runY = near_distance_negative;
							}

							move(
								character.real_x+(runX*1.5),
								character.real_y+(runY*1.5)
								);

							if(utils.has_attack_range(character, target)) {
								attack(target);
							}

							if(character.real_x == last_x || character.real_y == last_y) {
								last_turn += 1;
								if(last_turn > 2) {
									game_log('Character is blocked', '#FF0000');
									move(
										character.real_x+utils.get_random(near_distance_negative, near_distance),
										character.real_y+utils.get_random(near_distance_negative, near_distance)
										);
									last_turn = 0;
								}
							}
						}
					}
				}

				last_attack += 1;

				if(!runningAway) {
					if(!in_attack_range(target)) {
						move(
							character.real_x+(target.real_x-character.real_x)/4,
							character.real_y+(target.real_y-character.real_y)/4
							);
					} else {
						if(can_attack(target)) {
							set_message("Attacking");

							if(pclass.is_skill_attack() && !utils.is_missing_hp(target, 0.5)) {
								last_skill = pclass.use_skill(target, last_skill);
							}

							attack(target);
							last_attack = 0;
							last_target = null;
						}
					}
				}
			}

		},1000/4);

		var drawInterval = setInterval(drawer.draw, 100);

		var quit = false;
		var global_runner = false;

		setInterval(function() {
			if(!quit) {
				global_runner = utils.get_bool_var('global_runner');
				if(global_runner === true) {
					quit = true;

					clearInterval(drawInterval);
					clearInterval(mainInterval);

					utils.set_var('quited_runner', true);
				}
			}
		},1000);

	}
});
