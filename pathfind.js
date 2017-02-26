define(["require", "scripts/utils"],function (require, utils) {

	var cur_map = null;

	var pathfind_mode = utils.get_bool_var('pathfind_mode');
	var pathfind_destination = utils.get_var('pathfind_destination');

	var turn = 0;

	var last_x = 0;
	var last_y = 0;

	var c_wayp = null;
	var future_path = null;

	var cur_path = null;
	var cur_points = null;

	var mainInterval = setInterval(function(){
		turn += 1;

		pathfind_mode = utils.get_bool_var('pathfind_mode');

		if(pathfind_mode) {
			pathfind_mode = false;
			utils.set_var('pathfind_mode', false);

			pathfind_destination = utils.get_var('pathfind_destination');

			smart_move({to:pathfind_destination},function(r){

			});
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
