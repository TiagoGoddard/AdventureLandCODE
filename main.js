define(["require", "scripts/utils", "ui/draw", 'scripts/classes/priest', 'scripts/classes/warrior', 'scripts/classes/ranger', 'scripts/classes/rougue', 'scripts/classes/mage', 'scripts/classes/merchant', 'scripts/waypoints/travel/main'],function (require, utils, drawer, priest, warrior, ranger, rougue, mage, merchant, travel_main) {

	var pclass = null;
	var cur_map = null;

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
		case 'mage':
			pclass = mage;
			break;
		case 'rougue':
			pclass = rougue;
			break;
		case 'merchant':
			pclass = merchant;
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

		var allow_potions_purchase = utils.get_bool_var('allow_potions_purchase');
		var buy_hp = utils.get_bool_var('buy_hp');
		var buy_mp = utils.get_bool_var('buy_mp');
		var hp_potion = utils.get_var('hp_potion');
		var mp_potion = utils.get_var('mp_potion');
		var pots_minimum = utils.get_int_var('pots_minimum');
		var pots_to_buy = utils.get_int_var('pots_to_buy');

		var pathfind_mode = utils.get_bool_var('pathfind_mode');
		var pathfind_destination = utils.get_var('pathfind_destination');

		var turn = 0;
		var last_turn = 0;
		var last_attack = 0;
		var last_skill = null;
		var last_target = null;

		var is_pathfinding = false;

		var last_x = 0;
		var last_y = 0;

		var mainInterval = setInterval(function(){
			turn += 1;

			anchor_mode=utils.get_bool_var('anchor_mode');

			anchor_x = utils.get_int_var('anchor_x');
			anchor_y = utils.get_int_var('anchor_y');

			attack_mode=utils.get_bool_var('attack_mode');
			pathfind_mode = utils.get_bool_var('pathfind_mode');

			if (turn >= 60) {
				turn = 0;

				anchor_distance_x = utils.get_int_var('anchor_distance_x');
				anchor_distance_y = utils.get_int_var('anchor_distance_y');

				near_distance = utils.get_int_var('near_distance');
				near_distance_negative = utils.get_int_var('near_distance_negative');

				min_xp = utils.get_int_var('min_xp');
				max_att = utils.get_int_var('max_att');

				//Check for potions
				if(allow_potions_purchase) {
					let [hpslot, hppot] = utils.get_item(i => i.name == hp_potion);
					let [mpslot, mppot] = utils.get_item(i => i.name == mp_potion);

					if (buy_hp && (!hppot || hppot.q < pots_minimum)) {
						parent.buy(hp_potion, pots_to_buy);
						set_message("Buying HP pots, slot: "+hpslot);
					}
					if (buy_mp && (!mppot || mppot.q < pots_minimum)) {
						parent.buy(mp_potion, pots_to_buy);
						set_message("Buying MP pots, slot: "+mpslot);
					}
				}
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
			} else if (utils.is_missing_mp(character, 0.5)) {
				utils.do_use_mp();
			}

			//TODO Gold Boosters
			loot();

			if(pathfind_mode && !is_pathfinding) {
				is_pathfinding = true;

				switch(parent.current_map) {
					case 'main':
						cur_map = travel_main;
						break;
					default:
						cur_map = null;
				}
				if(cur_map) {
					pathfind_destination = utils.get_var('pathfind_destination');

					var waypointStart = cur_map.get_waypoint_by_id('town');
					var waypointDest = cur_map.get_waypoint_by_id(pathfind_destination);
					var path = cur_map.get_waypoint_path(waypointStart, waypointDest);

					utils.set_var('pathfind_mode', false);
					is_pathfinding = false;
				}
			}

			if(!pclass.has_attack()) {
				//Only merchant class dosn't have attack

				return;
			}

			var party = utils.get_party_players();
			var partyPlayer = null;

			for(var id in party) {
				partyPlayer = party[id];
				if(pclass.is_ranged()) { // Make ranged characters stay near the leader and other party members
					if(character.name!=party_leader && !in_attack_range(partyPlayer)) {
						move(
							character.real_x+(partyPlayer.real_x-character.real_x)/2,
							character.real_y+(partyPlayer.real_y-character.real_y)/2
						);
					}
				} else { // Make melee stay near the leader and other party members
					if(character.name != party_leader && !utils.has_range(partyPlayer, near_distance * 3)) {
						move(
							character.real_x+(partyPlayer.real_x-character.real_x)/4,
							character.real_y+(partyPlayer.real_y-character.real_y)/4
						);
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

			if(!attack_mode || character.moving || pathfind_mode) return;

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
				if(pclass.is_tank()) {
					if(target.target != character.name && !utils.is_missing_hp(target, 0.4)) {
						pclass.use_tank_skill();
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
