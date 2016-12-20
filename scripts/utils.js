define(function () {
	return {
		get_random: function (min, max) {
			return Math.random() * (max - min) + min;
		},
		get_monsters_targeted: function(entity) {
			var targeted = [];
			for(id in parent.entities) {
				var current=parent.entities[id];
				if(current.type!="monster" || current.dead) continue;
				if(current.target!=entity.name) continue;
				targeted.push(current);
			}
			return targeted;
		},
		get_party_players: function(partyName) {
			var entities=parent.entities;
			var party = [];
			for(i in entities) {
				if(entities[i].type=="character" && entities[i].party==partyName && entities[i].name != character.name) {
					party.push(entities[i]);
				}
			}
			return party;
		},

		has_range: function(target, range) {
			if(!target) return false;
			if(parent.distance(character,target)<=range) return true;
			return false;
		},
		has_attack_range: function(entity, target) {
			if(!target) return false;
			if(target.type == 'character') {
				if(parent.distance(target,entity)<=target.range+10) return true;
				return false;
			} else if(target.type == 'monster') {
				var monster = G.monsters[target.mtype];
				if(parent.distance(target,entity)<=monster.range+10) return true;
				return false;
			} else {
				return false;
			}
		},

		is_north: function(character, target) {
			return target.real_y-character.real_y < 0;
		},
		is_south: function(character, target) {
			return !isNorth(character, target);
		},
		is_west: function(character, target) {
			return target.real_x-character.real_x < 0;
		},
		is_east: function(character, target) {
			return !isWest(character, target);
		},
		is_away_from: function(x, y, distance_x, distance_y) {
			return character.real_x < x - distance_x || character.real_x > x + distance_x || character.real_y < y - distance_y || character.real_y > y + distance_y;
		},
		is_missing_hp: function(entity, percentage) {
			return (entity.hp  / entity.max_hp) < percentage;
		},
		is_missing_mp: function(entity, percentage) {
			return (entity.mp  / entity.max_mp) < percentage;
		}

	};
});