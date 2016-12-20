var attack_mode=true;
var near_distance=60;
var near_distance_negative=-60;

var anchor_mode=true;
var anchor_x = 1100;
var anchor_y = 150;
var anchor_distance_x = 300;
var anchor_distance_y = 150;

var turn = 0;
var last_turn = 0;
var last_x = 0;
var last_y = 0;


function handle_command(command, args){
    switch(command){
        case "targetInfo":
            show_json(target);
            break;

        case "selfInfo":
            show_json(character);
            break;
		case "where":
			game_log('X:'+character.real_x, '#00ff00');
			game_log('Y:'+character.real_y, '#00ff00');
			break;
    }
}

setInterval(function(){
	turn += 1;
	if (turn >= 60) {
		turn = 0;
	}
	if(checkHp(character, 0.7)) {
		if(can_heal(character)) {
			heal(character);
		}
	}
	if(checkHp(character, 0.5) || checkMp(character, 0.5)) {
		use_hp_or_mp();
	}
	loot();
	
	var party = get_party_players();
	for(id in party) {
		var partyPlayer = party[id];
		if(partyPlayer.name!='Arwin' && !in_attack_range(partyPlayer)) {
			move(
				character.real_x+(partyPlayer.real_x-character.real_x)/2,
				character.real_y+(partyPlayer.real_y-character.real_y)/2
			);
		}
		if(checkHp(partyPlayer, 0.5)) {
			if(can_heal(partyPlayer)) {
				heal(partyPlayer);
			}
		}
	}

	if(!attack_mode || character.moving) return;
	
	if(anchor_mode && is_away_from_anchor(anchor_x, anchor_y, anchor_distance_x, anchor_distance_y)) {
		move(anchor_x, anchor_y);
	}

	var target=get_targeted_monster();
	var targeted = get_monsters_targeted_me();

	if(!target) {
		var targetParty = false;
		for(id in party) {
			var partyPlayer = party[id];
			var targetParty = get_target_of(partyPlayer);
			if(!has_range(targetParty, 100)) {
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
				target=get_nearest_monster({min_xp:800,max_att:79});
				if(target) {
					change_target(target); 
				} else {
					set_message("No Monsters");
					return;
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
		if(!in_attack_range(target)) {
			move(
				character.real_x+(target.real_x-character.real_x)/2,
				character.real_y+(target.real_y-character.real_y)/2
				);
			// Walk half the distance
		} else {
			if(can_attack(target)) {
				set_message("Attacking");
				attack(target);
			}

			for(id in targeted) {
				var monster = targeted[id];
				
				if(can_attack_me(monster)) {
					game_log('Moster is near', '#FF0000');

					last_x = character.real_x;
					last_y = character.real_y;
					var runX = 0;
					var runY = 0;

					if(isNorth(character, monster)) {
						runX = near_distance_negative;
					}
					if(isSouth(character, monster)) {
						runX = near_distance;
					}
					if(isWest(character, monster)) {
						runY = near_distance;
					}
					if(isEast(character, monster)) {
						runY = near_distance_negative;
					}

					move(
						character.real_x+(runX*1.5),
						character.real_y+(runY*1.5)
						);

					if(character.real_x == last_x || character.real_y == last_y) {
						last_turn += 1;
						if(last_turn > 2) {
							move(
								character.real_x+getRandomDistance(),
								character.real_y+getRandomDistance()
								);
							game_log('Character is blocked', '#FF0000');
							last_turn = 0;
						}
					}
				}
			}
		}
	}

},1000/4);

setInterval(draw, 100);