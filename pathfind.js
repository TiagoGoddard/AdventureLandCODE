define(["require", "scripts/utils", "scripts/graph", 'scripts/waypoints/travel/main'],function (require, utils, graph, travel_main) {

	var cur_map = null;

	var pathfind_mode = utils.get_bool_var('pathfind_mode');
	var pathfind_where_mode = utils.get_bool_var('pathfind_where_mode');
	var pathfind_destination = utils.get_var('pathfind_destination');

	var turn = 0;

	var is_pathfinding = false;

	var last_x = 0;
	var last_y = 0;

	var c_wayp = null;
	var future_path = null;

	var cur_path = null;
	var cur_points = null;

	var mainInterval = setInterval(function(){
		turn += 1;

		pathfind_mode = utils.get_bool_var('pathfind_mode');
		pathfind_where_mode = utils.get_bool_var('pathfind_where_mode');

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

				var waypointStart = cur_map.get_waypoint(character.real_x,character.real_y);
				var waypointDest = cur_map.get_waypoint_by_id(pathfind_destination);

				if(waypointStart && waypointDest) {
					set_message("Pathfinding to: "+waypointDest.id);

					if(!cur_path) {
						cur_path = graph.find_shortest_path(cur_map.get_graph_map(), waypointStart.id, waypointDest.id);
					}

					pathfind_mode = utils.get_bool_var('pathfind_mode');
					if(pathfind_mode) {

						if(!cur_points) {
							c_wayp = future_path;
							future_path = cur_map.get_waypoint_by_id(cur_path.shift());
						}

						if(c_wayp && future_path.id != waypointStart.id) {
							var d_transfer = utils.get_desired_transfers(c_wayp.id, future_path.id, c_wayp.transfers);
							if(!cur_points) {
								cur_points = d_transfer.points;

								var cx = character.real_x;
								var cy = character.real_y;
								cur_points.sort(function(a, b) {
									var distance_a = utils.get_distance(cx, cy, a.real_x, a.real_y);
									var distance_b = utils.get_distance(cx, cy, b.real_x, b.real_y);

									if(distance_a<distance_b) {
										return 1
									} else if(distance_a>distance_b) {
										return - 1;
									} else {
										return 0;
									}
								});
							}


							if(character.moving) return;

							if(cur_points.length > 0) {
								var cur_point = cur_points.shift();

								move(
									cur_point.real_x,
									cur_point.real_y
								);

								set_message('You are in: '+ c_wayp.id);
							} else {
								cur_points = null;
							}
						}
					}

				}
			}

			if(!cur_path || cur_path.length == 0) {
				if(cur_path.length == 0) {
					set_message('Arrived');
					cur_path = null;
				}

				pathfind_mode = false;
				utils.set_var('pathfind_mode', false);
				is_pathfinding = false;
			}
		}

		if(pathfind_where_mode && !is_pathfinding) {
			is_pathfinding = true;

			switch(parent.current_map) {
				case 'main':
					cur_map = travel_main;
					break;
				default:
					cur_map = null;
			}

			if(cur_map) {
				var cur_wayp = cur_map.get_waypoint(character.real_x,character.real_y);
				if(cur_wayp) {
					game_log('You are in: '+cur_wayp.id, '#0000FF');
				}
			}

			pathfind_where_mode = false;
			utils.set_var('pathfind_where_mode', false);
			is_pathfinding = false;
		}

	},1000/4);

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

});
