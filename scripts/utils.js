define(function () {
	return {
		get_var: function(desired) {
			return JSON.parse(localStorage.getItem('storageVars_'+character.name))[desired];
		},
		get_int_var: function(desired) {
			var saved = JSON.parse(localStorage.getItem('storageVars_'+character.name));
			return parseInt(saved[desired]);
		},
		get_bool_var: function(desired) {
			var saved = JSON.parse(localStorage.getItem('storageVars_'+character.name));
			if(saved[desired] === true || (typeof saved[desired] == "string" && saved[desired].toLowerCase() == "true") || (typeof saved[desired] == 'number' && saved[desired] > 0)) {
				return true;
			} else {
				return false;
			}
		},
		get_random: function (min, max) {
			return Math.random() * (max - min) + min;
		},
		get_monsters_targeted: function(entity) {
			var targeted = [];
			var current = null;

			for(id in parent.entities) {
				current = parent.entities[id];
				if(current.type!="monster" || current.dead) continue;
				if(current.target!=entity.name) continue;
				targeted.push(current);
			}

			return targeted;
		},
		get_party_players: function() {
			var entities=parent.entities;
			var party = [];
			if(character.party) {
				for(i in entities) {
					if(entities[i].type=="character" && entities[i].party==character.party && entities[i].name != character.name) {
						party.push(entities[i]);
					}
				}
			}
			return party;
		},
		get_monsters_targeted_party: function() {
			var entities=parent.entities;
			var party = [];
			var targeted = [];

			var entity = null;
			var current = null;

			if(character.party) {
				for(i in entities) {
					if(entities[i].type=="character" && entities[i].party==character.party && entities[i].name != character.name) {
						party.push(entities[i]);
					}
				}
				for(j in party) {
					entity = party[j];
					for(id in parent.entities) {
						current=parent.entities[id];
						if(current.type!="monster" || current.dead) continue;
						if(current.target!=entity.name) continue;
						targeted.push(current);
					}
				}
			}

			return targeted;
		},
		get_item: function(filter) {
			for (let i = 0; i < character.items.length; i++) {
				let item = character.items[i];
				if (item && filter(item)) return [i, character.items[i]];
			}

			return [-1, null];
		},
		get_item_slot: function(filter, search_slot) {
			let slot = search_slot;
			if (!slot)
				slot = 0

			for (let i = slot; i < character.items.length; i++) {
				let item = character.items[i];

				if (item && filter(item))
				return [i, character.items[i]];
			}

			return [-1, null];
		},
		get_item_info: function(item) {
  			return parent.G.items[item.name];
		},

		set_var: function(desired, value) {
			var retrievedObject = JSON.parse(localStorage.getItem('storageVars_'+character.name));
			retrievedObject[desired] = value;
			localStorage.setItem('storageVars_'+character.name, JSON.stringify(retrievedObject));
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
			return target.real_y-character.real_y > 0;
		},
		is_west: function(character, target) {
			return target.real_x-character.real_x < 0;
		},
		is_east: function(character, target) {
			return target.real_x-character.real_x > 0;
		},
		is_away_from: function(x, y, distance_x, distance_y) {
			return character.real_x < x - distance_x || character.real_x > x + distance_x || character.real_y < y - distance_y || character.real_y > y + distance_y;
		},
		is_missing_hp: function(entity, percentage) {
			return ((entity.hp  / entity.max_hp) < percentage) && !character.rip;
		},
		is_missing_mp: function(entity, percentage) {
			return (entity.mp  / entity.max_mp) < percentage;
		},
		is_inside: function(waypoint,x,y) {
			return  	waypoint.top_left.real_x <= x && waypoint.top_left.real_y <= y
					&&	waypoint.top_right.real_x >= x && waypoint.top_right.real_y <= y
					&&	waypoint.bottom_left.real_x <= x && waypoint.bottom_left.real_y >= y
					&&	waypoint.bottom_right.real_x >= x && waypoint.bottom_right.real_y >= y;
		},

		do_use_hp: function() {
			if(safeties && mssince(last_potion)<600) return;
			var used=false;
			if(new Date()<parent.next_potion) return;
			if(character.hp<character.max_hp) parent.use('hp'),used=true;
			if(used) last_potion=new Date();
		},
		do_use_mp: function() {
			if(safeties && mssince(last_potion)<600) return;
			var used=false;
			if(new Date()<parent.next_potion) return;
			if(character.mp<character.max_mp) parent.use('mp'),used=true;
			if(used) last_potion=new Date();
		}
	};
});