# AdventureLandCODE
My complete AdventureLandCODE


// Write your own CODE: https://github.com/kaansoral/adventureland
// CODE Javascript:
var anchor_mode=true;
var attack_mode=true;

var anchor_x = 1100;
var anchor_y = 150;
var anchor_distance_x = 300;
var anchor_distance_y = 150;
var near_distance=60;
var near_distance_negative=-60;

function handle_command(command, args){
    switch(command){
        case "anchor":
            anchor_mode = !anchor_mode;

            if(anchor_mode) {
            	game_log('Anchoring', '#0000FF');
				anchor_x = character.real_x;
				anchor_y = character.real_y;

				if(args.length > 0 && args.length <= 2) {
					if(args.length == 1) {
						anchor_distance_x = parseInt(args[0]);
						anchor_distance_y = parseInt(args[0]);
					} else {
						anchor_distance_x = parseInt(args[0]);
						anchor_distance_y = parseInt(args[1]);
					}
				}
			} else {
				game_log('Un-Anchoring', '#0000FF');
			}
            break;
        case "near":
			if(args.length > 0 && args.length <= 1) {
				near_distance = parseInt(args[0]);
				near_distance_negative = 0 - near_distance;
			}
            break;
        case "attack":
            attack_mode = !attack_mode;
            break;
		case "where":
			game_log('X:'+character.real_x, '#00ff00');
			game_log('Y:'+character.real_y, '#00ff00');
			break;
    }
}

$.getScript('https://rawgit.com/TiagoGoddard/AdventureLandCODE/master/libs/require.js', function() {
	requirejs.config({
	    baseUrl: 'https://cdn.rawgit.com/TiagoGoddard/AdventureLandCODE/v0.2/',
	    paths: {
	        // the left side is the module ID,
	        // the right side is the path to
	        // the jQuery file, relative to baseUrl.
	        // Also, the path should NOT include
	        // the '.js' file extension. This example
	        // is using jQuery 1.9.0 located at
	        // js/lib/jquery-1.9.0.js, relative to
	        // the HTML page.
	        utils: 'scripts/utils'
	        draw: 'ui/draw'
	    }
	});

	requirejs(['main']);
});