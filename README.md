# AdventureLandCODE
My complete AdventureLandCODE
// Write your own CODE: https://github.com/kaansoral/adventureland

## Inside Game CODE Javascript:
```javascript
var version = '0.21';

// Handle party
var party_leader = 'Washer';
var merchant_name = 'Necrotico';

var party_members = [
	'Washer',
	'Annebriwien',
	'Arwin',
	'Omnilight'
];

if(character.name == party_leader) {
	setInterval(function(){
		var entities=parent.entities;
		for(var i in entities) {
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

//Handle disconnect
setInterval(function () {
var disconnect = $(".gamebutton.clickable").html();
	if(disconnect = 'DISCONNECT') {
		location.reload();
		//Use this to login:
		//log_in(starter_vars.character,starter_vars.login,starter_vars.password);
	}
}, 60000);

function handle_death() {
	var respawnInterval = setInterval(function() {
		respawn();
		if(!character.rip) {
			clearInterval(respawnInterval);
		}
	},15000);
}

// Config commands
function handle_command(command, args){
	args = args.split(" ");
	var retrievedObject = JSON.parse(localStorage.getItem('storageVars_'+character.name));

	switch(command){
		case "anchor":
			retrievedObject.anchor_mode = !retrievedObject.anchor_mode;
			if(character.name == party_leader) {
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
			} else {
				game_log('Only Party Leader: '+party_leader, '#0000FF');
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
		case "goto":
			console.log(args);
			if(retrievedObject.pathfind_mode) {
				retrievedObject.pathfind_mode = !retrievedObject.pathfind_mode;
				game_log('Stoping pathfind', '#0000FF');
			} else if(args.length > 0 && args.length <= 1) {
				retrievedObject.pathfind_destination = args[0];
				retrievedObject.pathfind_mode = !retrievedObject.pathfind_mode;
				game_log('Starting pathfind', '#0000FF');
			}
			break;
		case "end":
			retrievedObject.global_runner = true;
			break;
	}

	localStorage.setItem('storageVars_'+character.name, JSON.stringify(retrievedObject));
}

var starter_vars = {
	'global_runner': false,
	'quited_runner': false,

	'allow_potions_purchase': true,
	'buy_hp': true,
	'buy_mp': true,
	'hp_potion': 'hpot0',
	'mp_potion': 'mpot0',
	'pots_minimum': 50,
	'pots_to_buy': 1000,

	'anchor_mode': false,
	'anchor_x': 1100,
	'anchor_y': 150,
	'anchor_distance_x': 300,
	'anchor_distance_y': 150,

	'pathfind_mode': false,
	'pathfind_destination': 'town',

	'character': '',
	'login': '',
	'password': '',

	'near_distance': 60,
	'near_distance_negative': -60,

	'party_leader': party_leader,

	'attack_mode': true,
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
			classes: 'scripts/classes',
			waypoints: 'scripts/waypoints'
		}
	});

	requirejs(['main']);
});
```

## PositionFinder Game CODE Javascript:
```
//TODO AutoBuy and Sell itens for set price
var party_leader = 'Washer';

var party_members = [
	'Washer',
	'Annebriwien',
	'Arwin',
	'Omnilight'
];

var starter_vars = {
	'party_leader': party_leader,
	'character': '',
	'login': '',
	'password': ''
};

localStorage.setItem('storageVars_'+character.name, JSON.stringify(starter_vars));

//Handle disconnect
setInterval(function () {
var disconnect = $(".gamebutton.clickable").html();
	if(disconnect = 'DISCONNECT') {
		location.reload();
		//Use this to login:
		//log_in(starter_vars.character,starter_vars.login,starter_vars.password);
	}
}, 60000);

function handle_death() {
	var respawnInterval = setInterval(function() {
		respawn();
		if(!character.rip) {
			clearInterval(respawnInterval);
		}
	},15000);
}

function handle_command(command, args){
	args = args.split(" ");
	var retrievedObject = JSON.parse(localStorage.getItem('storageVars_'+character.name));

	switch(command){
		case "where":
			game_log('X:'+character.real_x, '#00ff00');
			game_log('Y:'+character.real_y, '#00ff00');
			break;
		case "info":
			show_json(parent.ctarget);
			break;
		case "map":
			show_json(parent.G.maps[parent.current_map]);
			break;
	}

	localStorage.setItem('storageVars_'+character.name, JSON.stringify(retrievedObject));
}
```