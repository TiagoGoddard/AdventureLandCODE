# AdventureLandCODE
My complete AdventureLandCODE
// Write your own CODE: https://github.com/kaansoral/adventureland

## Inside Game CODE Javascript:
```javascript
var version = '0.10';

// Handle party
var party_leader = 'Washer';

var party_members = [
	'Washer',
	'Annebriwien',
	'Arwin'
];

if(character.name == party_leader) {
	setInterval(function(){
		var entities=parent.entities;
		for(i in entities) {
			if(entities[i].type=="character" && (party_members.indexOf(entities[i].name) !== -1) && entities[i].party !== party_leader) {
				send_party_invite(entities[i].name,0);
			}
		}
	}, 10000);
}

function on_party_invite(name) {
	if(!character.party && (party_members.indexOf(name) !== -1)) {
		accept_party_invite(name);
	}
}

function on_party_request(name) {
	if(character.party && (party_members.indexOf(name) !== -1)) {
		accept_party_request(name);
	}
}

//Nothing good comes from combiend damage
function on_combined_damage() {
	var random_x = Math.random() * (120) - 60;
	var random_y = Math.random() * (120) - 60;
	move(character.real_x+random_x,character.real_y+random_y);
}

// Config commands
function handle_command(command, args){
	var retrievedObject = JSON.parse(localStorage.getItem('storageVars_'+character.name));

	switch(command){
		case "anchor":
			retrievedObject.anchor_mode = !retrievedObject.anchor_mode;

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
			retrievedObject.attack_mode = !retrievedObject.attack_mode;
			break;
		case "where":
			game_log('X:'+character.real_x, '#00ff00');
			game_log('Y:'+character.real_y, '#00ff00');
			break;
		case "end":
			retrievedObject.global_runner = true;
			break;
	}

	localStorage.setItem('storageVars_'+character.name, JSON.stringify(retrievedObject));
}

var starter_vars = {
	'global_runner': false,
	'anchor_mode': false,
	'attack_mode': true,
	'anchor_x': 1100,
	'anchor_y': 150,
	'anchor_distance_x': 300,
	'anchor_distance_y': 150,
	'near_distance': 60,
	'near_distance_negative': -60,
	'party_leader': party_leader,
	'min_xp': 800,
	'max_att': 79
};

// Put the config into storage
localStorage.setItem('storageVars_'+character.name, JSON.stringify(starter_vars));

$.getScript('https://cdn.rawgit.com/TiagoGoddard/AdventureLandCODE/v'+version+'/libs/require.js', function() {
	requirejs.config({
		baseUrl: 'https://cdn.rawgit.com/TiagoGoddard/AdventureLandCODE/v'+version+'/',
		paths: {
			utils: 'scripts/utils',
			draw: 'ui/draw',
			classes: 'scripts/classes'
		}
	});

	requirejs(['main']);
});
```