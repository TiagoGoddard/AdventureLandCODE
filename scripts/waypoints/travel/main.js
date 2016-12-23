define(["scripts/utils"],function (utils) {
	var map = {};

	map.name = "main";
	map.npcs = parent.G.maps[map.name].npcs;
	map.doors = parent.G.maps[map.name].doors;
	map.parts = [];

	var town = {
		id: "town",
		monsters: [],
		transfers: [],
		npcs: [],
		top_left: {
			real_x: -141,
			real_y: -238
		},
		top_right: {
			real_x: 413,
			real_y: -238
		},
		bottom_left: {
			real_x: -141,
			real_y: -60
		},
		bottom_right: {
			real_x: 413,
			real_y: -60
		}
	};

	var goobee = {
		id: "goobee",
		monsters: ["bee","goo"],
		transfers: [],
		npcs: [],
		top_left: {
			real_x: -118,
			real_y: 23
		},
		top_right: {
			real_x: 757,
			real_y: 23
		},
		bottom_left: {
			real_x: -118,
			real_y: 237
		},
		bottom_right: {
			real_x: 757,
			real_y: 237
		}
	};

	var transfer_town_goobee = {
		between: ["town","goobee"],
		points: [{
			real_x: 41,
			real_y: -54
		},{
			real_x: 41,
			real_y: 20
		}]
	};

	goobee.transfers.push(transfer_town_goobee);
	town.transfers.push(transfer_town_goobee);

	var transfer_town_goobee2 = {
		between: ["town","goobee"],
		points: [{
			real_x: 328,
			real_y: -54
		},
		{
			real_x: 328,
			real_y: 20
		}]
	};

	goobee.transfers.push(transfer_town_goobee2);
	town.transfers.push(transfer_town_goobee2);

	var bank = {
		id: "bank",
		monsters: [],
		doors: ['bank'],
		transfers: [],
		npcs: [],
		top_left: {
			real_x: 571,
			real_y: -57
		},
		top_right: {
			real_x: 629,
			real_y: -57
		},
		bottom_left: {
			real_x: 571,
			real_y: -52
		},
		bottom_right: {
			real_x: 629,
			real_y: -52
		}
	};

	var transfer_goobee_bank = {
		between: ["goobee","bank"],
		points: [{
			real_x: 600,
			real_y: -54
		},
		{
			real_x: 600,
			real_y: 20
		}]
	};

	goobee.transfers.push(transfer_goobee_bank);
	bank.transfers.push(transfer_goobee_bank);

	var squig = {
		id: "squig",
		monsters: ["squig"],
		transfers: [],
		npcs: [],
		top_left: {
			real_x: 267,
			real_y: 237
		},
		top_right: {
			real_x: 757,
			real_y: 237
		},
		bottom_left: {
			real_x: 267,
			real_y: 332
		},
		bottom_right: {
			real_x: 757,
			real_y: 332
		}
	};

	var transfer_squig_goobee = {
		between: ["squig","goobee"],
		points: [{
			real_x: 513,
			real_y: 244
		}]
	};

	goobee.transfers.push(transfer_squig_goobee);
	squig.transfers.push(transfer_squig_goobee);

	var croc = {
		id: "croc",
		monsters: ["croc"],
		transfers: [],
		npcs: [],
		top_left: {
			real_x: 803,
			real_y: 151
		},
		top_right: {
			real_x: 1389,
			real_y: 151
		},
		bottom_left: {
			real_x: 803,
			real_y: 477
		},
		bottom_right: {
			real_x: 1389,
			real_y: 477
		}
	};

	var transfer_squig_croc = {
		between: ["squig","croc"],
		points: [{
			real_x: 761,
			real_y: 286
		},
		{
			real_x: 800,
			real_y: 286
		}]
	};

	squig.transfers.push(transfer_squig_croc);
	croc.transfers.push(transfer_squig_croc);

	var spidscorp = {
		id: "spidscorp",
		monsters: ["spider", "scorpion"],
		transfers: [],
		npcs: [],
		top_left: {
			real_x: 803,
			real_y: 151
		},
		top_right: {
			real_x: 1389,
			real_y: 151
		},
		bottom_left: {
			real_x: 803,
			real_y: 477
		},
		bottom_right: {
			real_x: 1389,
			real_y: 477
		}
	};

	var transfer_croc_spidscorp = {
		between: ["croc","spidscorp"],
		points: [{
			real_x: 1200,
			real_y: 475
		}]
	};

	croc.transfers.push(transfer_croc_spidscorp);
	spidscorp.transfers.push(transfer_croc_spidscorp);

	var armabee = {
		id: "armabee",
		monsters: ["armadillo", "bee", "squigtoad"],
		transfers: [],
		npcs: [],
		top_left: {
			real_x: -37,
			real_y: 375
		},
		top_right: {
			real_x: 756,
			real_y: 375
		},
		bottom_left: {
			real_x: -37,
			real_y: 685
		},
		bottom_right: {
			real_x: 756,
			real_y: 685
		}
	};

	var transfer_armabee_spidscorp = {
		between: ["armabee","spidscorp"],
		points: [{
			real_x: 768,
			real_y: 565
		},{
			real_x: 985,
			real_y: 565
		},{
			real_x: 1024,
			real_y: 565
		}]
	};

	armabee.transfers.push(transfer_armabee_spidscorp);
	spidscorp.transfers.push(transfer_armabee_spidscorp);

	var transfer_armabee_goobee = {
		between: ["armabee","goobee"],
		points: [{
			real_x: 129,
			real_y: 241
		},{
			real_x: 129,
			real_y: 275
		},{
			real_x: 129,
			real_y: 363
		}]
	};

	armabee.transfers.push(transfer_armabee_goobee);
	goobee.transfers.push(transfer_armabee_goobee);

	var batcave = {
		id: "batcave",
		monsters: [],
		doors: ['batcave'],
		transfers: [],
		npcs: [],
		top_left: {
			real_x: -303,
			real_y: 25
		},
		top_right: {
			real_x: -172,
			real_y: 25
		},
		bottom_left: {
			real_x: -303,
			real_y: 69
		},
		bottom_right: {
			real_x: -172,
			real_y: 69
		}
	};

	var transfer_batcave_goobee = {
		between: ["batcave","goobee"],
		points: [{
			real_x: -117,
			real_y: 46
		},
		{
			real_x: -170,
			real_y: 46
		}]
	};

	batcave.transfers.push(transfer_batcave_goobee);
	goobee.transfers.push(transfer_batcave_goobee);

	var arena = {
		id: "arena",
		monsters: [],
		doors: ['arena'],
		transfers: [],
		npcs: [],
		top_left: {
			real_x: -37,
			real_y: 375
		},
		top_right: {
			real_x: -347,
			real_y: 75
		},
		bottom_left: {
			real_x: -37,
			real_y: 685
		},
		bottom_right: {
			real_x: 756,
			real_y: 685
		}
	};

	var transfer_batcave_arena = {
		between: ["batcave","arena"],
		points: [{
			real_x: -312,
			real_y: -1
		},{
			real_x: -346,
			real_y: -1
		}]
	};

	arena.transfers.push(transfer_batcave_arena);
	batcave.transfers.push(transfer_batcave_arena);

	// Map parts
	map.waypoints.push(town);
	map.waypoints.push(bank);
	map.waypoints.push(goobee);
	map.waypoints.push(squig);
	map.waypoints.push(croc);
	map.waypoints.push(spidscorp);
	map.waypoints.push(armabee);
	map.waypoints.push(arena);
	map.waypoints.push(batcave);

	map.get_waypoint_by_monster = function(monster) {
		var waypm = [];

		for(var wayp in map.waypoints) {
			if(wayp.monsters.indexOf(monster) > -1) {
				waypm.push(wayp);
			}
		}

		return waypm;
	};

	map.get_waypoint_by_id = function(id) {
		for(var wayp in map.waypoints) {
			if(wayp.id == id) {
				return wayp;
			}
		}
		return null;
	};

	map.get_waypoint = function(x,y) {
		for(var wayp in map.waypoints) {
			if(utils.is_inside(wayp, x, y)) {
				return wayp;
			}
		}
		return null;
	};

	map.get_waypoint_recursive = function(path, count, wayp_cur, wayp_str, wayp_des) {
		path.push(wayp_cur);
		count += 1;
    if(count > 99) {
			path.push(wayp_str);
      return path;
    } else if(wayp_cur.id == wayp_str.id && count > 0) {
			return path;
    }	else if(wayp_cur.id == wayp_des.id) {
			return path;
    }	else {
			var connectedPaths = wayp_cur.transfers.between;
			var possibleWayps = [];

			for(var wayp in map.waypoints) {
				for(var pathId in connectedPaths) {
					if(wayp_cur.id != pathId) {
						possibleWayps.push(wayp);
					}
				}
			}

			var successFuturePath = [];
			for(var possibleWayp in possibleWayps) {
				var futurePath = map.get_waypoint_recursive(path, count, possibleWayp, wayp_str, wayp_des);
				var lastFutureWayp = futurePath[futurePath.length - 1];

				if(lastFutureWayp.id == wayp_des.id) {
					successFuturePath.push(futurePath);
				}
			}

			var bestPath = null;
			for(var successFutureWayp in successFuturePath) {
				if(!bestPath) {
					bestPath = successFutureWayp;
				} else {
					if(successFutureWayp.length < bestPath.length) {
						bestPath = successFutureWayp;
					}
				}
			}

			return bestPath;
		}
	};

	map.get_waypoint_path = function(wayp_str, wayp_des) {
		if(wayp_str.id == wayp_des.id){
			return false;
		} else {
			var curpath = [];
			var path = map.get_waypoint_recursive(curpath, 0, null, wayp_str, wayp_des);
			var lastWayp = path[path.length - 1];
			if(lastWayp.id == wayp_des.id) {
				console.log(path);
				return path;
			} else {
				return false;
			}
		}
	};

	return map;
});