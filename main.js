define(["require", "scripts/utils", "ui/draw", 'scripts/classes/priest', 'scripts/classes/warrior', 'scripts/classes/ranger'],function (require, utils, drawer, priest, warrior, ranger) {

	var pclass = null;

	switch(character.ctype) {
		case 'priest':
			pclass = priest;
			break;
		case 'warrior':
			pclass = warrior;
			break;
		case 'ranger':
			pclass = ranger;
			break;
	}

	if(pclass) {
		var anchor_mode=true;
		var attack_mode=true;

		var party_leader = utils.get_var('party_leader');

		var anchor_x = utils.get_int_var('anchor_x');
		var anchor_y = utils.get_int_var('anchor_y');
		var anchor_distance_x = utils.get_int_var('anchor_distance_x');
		var anchor_distance_y = utils.get_int_var('anchor_distance_y');

		var near_distance = utils.get_int_var('near_distance');
		var near_distance_negative = utils.get_int_var('near_distance_negative');

		var min_xp = utils.get_int_var('min_xp');
		var max_att = utils.get_int_var('max_att');

		var turn = 0;
		var last_turn = 0;
		var last_x = 0;
		var last_y = 0;

		var mainInterval = setInterval(function(){
			turn += 1;

			anchor_mode=utils.get_bool_var('anchor_mode');
			attack_mode=utils.get_bool_var('attack_mode');

			if (turn >= 60) {
				turn = 0;

				anchor_x = utils.get_int_var('anchor_x');
				anchor_y = utils.get_int_var('anchor_y');
				anchor_distance_x = utils.get_int_var('anchor_distance_x');
				anchor_distance_y = utils.get_int_var('anchor_distance_y');

				near_distance = utils.get_int_var('near_distance');
				near_distance_negative = utils.get_int_var('near_distance_negative');

				min_xp = utils.get_int_var('min_xp');
				max_att = utils.get_int_var('max_att');
			}

			if(pclass.is_healer()) {
				if(utils.is_missing_hp(character, 0.7)) {
					if(can_heal(character)) {
						heal(character);
					}
				}
			}

			if(utils.is_missing_hp(character, 0.5)) {
				utils.use_hp();
			} else if (utils.is_missing_mp(character, 0.5)) {
				utils.use_mp();
			}

			//TODO Gold Boosters
			loot();

			var party = utils.get_party_players(character.name);
			for(id in party) {
				var partyPlayer = party[id];
				if(character.name!=party_leader && !in_attack_range(partyPlayer)) {
					move(
						character.real_x+(partyPlayer.real_x-character.real_x)/2,
						character.real_y+(partyPlayer.real_y-character.real_y)/2
					);
				}
				if(pclass.is_healer()) {
					if(!partyPlayer.rip && utils.is_missing_hp(partyPlayer, 0.5)) {
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

			if(!target) {
				var targetParty = false;
				for(id in party) {
					var partyPlayer = party[id];
					var targetParty = get_target_of(partyPlayer);
					if(!utils.has_range(targetParty, 100)) {
						targetParty = false;
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
							target=get_nearest_monster({'min_xp':min_xp,'max_att':max_att,'no_target':true});
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

				if(!runningAway) {
					if(!in_attack_range(target)) {
						move(
							character.real_x+(target.real_x-character.real_x)/4,
							character.real_y+(target.real_y-character.real_y)/4
							);
					} else {
						if(can_attack(target)) {
							set_message("Attacking");
							attack(target);
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
				}
			}
		},1000);

	}
});
