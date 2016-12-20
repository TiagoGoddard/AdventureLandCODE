# AdventureLandCODE
My complete AdventureLandCODE
// Write your own CODE: https://github.com/kaansoral/adventureland

## Inside Game CODE Javascript:
```javascript
var version = '0.8';

var starter_vars = {
	'anchor_mode': true,
	'attack_mode': true,
	'anchor_x': 1100,
	'anchor_y': 150,
	'anchor_distance_x': 300,
	'anchor_distance_y': 150,
	'near_distance': 60,
	'near_distance_negative': -60
};

// Put the object into storage
localStorage.setItem('storageVars_'+character.name, JSON.stringify(starter_vars));

function handle_command(command, args){
	var retrievedObject = JSON.parse(localStorage.getItem('storageVars_'+character.name));

	switch(command){
		case "anchor":
			retrievedObject.anchor_mode = !anchor_mode;

			if(retrievedObject.anchor_mode) {
				game_log('Anchoring', '#0000FF');
				retrievedObject.anchor_x = character.real_x;
				retrievedObject.anchor_y = character.real_y;

				if(args.length > 0 && args.length <= 2) {
					if(args.length == 1) {
						retrievedObject.anchor_distance_x = parseInt(args[0]);
						retrievedObject.anchor_distance_y = parseInt(args[0]);
					} else {
						retrievedObject.anchor_distance_x = parseInt(args[0]);
						retrievedObject.anchor_distance_y = parseInt(args[1]);
					}
				}
			} else {
				game_log('Un-Anchoring', '#0000FF');
			}
			break;
		case "near":
			if(args.length > 0 && args.length <= 1) {
				retrievedObject.near_distance = parseInt(args[0]);
				retrievedObject.near_distance_negative = 0 - near_distance;
			}
			break;
		case "attack":
			retrievedObject.attack_mode = !attack_mode;
			break;
		case "where":
			game_log('X:'+character.real_x, '#00ff00');
			game_log('Y:'+character.real_y, '#00ff00');
			break;
	}

	localStorage.setItem('storageVars_'+character.name, JSON.stringify(retrievedObject));
}

$.getScript('https://cdn.rawgit.com/TiagoGoddard/AdventureLandCODE/v'+version+'/libs/require.js', function() {
	requirejs.config({
		baseUrl: 'https://cdn.rawgit.com/TiagoGoddard/AdventureLandCODE/v'+version+'/',
		paths: {
			utils: 'scripts/utils',
			draw: 'ui/draw'
		}
	});

	requirejs(['main']);
});
```