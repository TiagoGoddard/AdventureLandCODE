function randomize(min, max) {
    return Math.random() * (max - min) + min;
}

function can_attack_me(mtarget) {
	var monster = G.monsters[mtarget.mtype];
	if(!mtarget) return false;
	if(parent.distance(mtarget,character)<=monster.range+5) return true;
	return false;
}

function get_monsters_targeted_me() {
	var targeted = [];
	for(id in parent.entities) {
		var current=parent.entities[id];
		if(current.type!="monster" || current.dead) continue;
		if(current.target!=character.name) continue;
		targeted.push(current);
	}
	return targeted;
}
function get_party_players() {
	var entities=parent.entities;
	var party = [];
	for(i in entities) {
		if(entities[i].type=="character" && entities[i].party==character.party && entities[i].name != character.name) {
			party.push(entities[i]);
		}
	} 
	return party;
}

function has_range(target, range) {
	if(!target) return false;
	if(parent.distance(character,target)<=range) return true;
	return false;
}

function is_north(character, target) {
	return target.real_y-character.real_y < 0;
}
function is_south(character, target) {
	return !isNorth(character, target);
}
function is_west(character, target) {
	return target.real_x-character.real_x < 0;
}
function is_east(character, target) {
	return !isWest(character, target);
}
function is_away_from(x, y, distance_x, distance_y) {
	return character.real_x < x - distance_x || character.real_x > x + distance_x || character.real_y < y - distance_y || character.real_y > y + distance_y;
}

function is_missing_hp(entity, percentage) {
	return (entity.hp  / entity.max_hp) < percentage;
}
function is_missing_mp(entity, percentage) {
	return (entity.mp  / entity.max_mp) < percentage;
}