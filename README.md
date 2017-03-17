# AdventureLandCODE
My complete AdventureLandCODE
// Write your own CODE: https://github.com/kaansoral/adventureland

## Inside Game CODE Javascript:
```javascript
var version = '1.3.1';

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

function on_cm(name,data) {
	if(character.party && (party_members.indexOf(name) > -1)) {
		if(data.going_to) {
			handle_command('gotosolo', data.going_to);
		}
	}
}

//Handle disconnect
setInterval(function () {
	var disconnect = $(".gamebutton.clickable").html();

	if(disconnect && disconnect == 'DISCONNECT') {
		parent.location.reload();
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

	return true;
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
							if(args[0]) {
								retrievedObject.anchor_distance_x = parseInt(args[0]);
								retrievedObject.anchor_distance_y = parseInt(args[0]);
							}
						} else {
							if(args[0] && args[1]) {
								retrievedObject.anchor_distance_x = parseInt(args[0]);
								retrievedObject.anchor_distance_y = parseInt(args[1]);
							}
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
				if(args[0]) {
					retrievedObject.near_distance = parseInt(args[0]);
					retrievedObject.near_distance_negative = 0 - retrievedObject.near_distance;
				}
			}
			break;
		case "attack":
			retrievedObject.attack_mode = !retrievedObject.attack_mode;
			if(retrievedObject.attack_mode) {
				game_log('Start attacking', '#0000FF');
			} else {
				game_log('Stopping attacks', '#0000FF');
			}
			break;
		case "gotosolo":
			if(retrievedObject.anchor_mode) {
				retrievedObject.anchor_mode = false;
				game_log('Un-Anchoring', '#0000FF');
			}
			if(retrievedObject.attack_mode) {
				retrievedObject.attack_mode = false;
				game_log('Stopping Attacks', '#0000FF');
			}

			if(retrievedObject.pathfind_mode) {
				retrievedObject.pathfind_mode = !retrievedObject.pathfind_mode;
				retrievedObject.hunting_monster = null;

				game_log('Stoping pathfind', '#0000FF');
			} else if(args.length > 0 && args.length <= 1) {
				retrievedObject.pathfind_destination = args[0];
				retrievedObject.pathfind_mode = !retrievedObject.pathfind_mode;

				if(G.monsters[retrievedObject.pathfind_destination]) {
					retrievedObject.hunting_monster = 'retrievedObject.pathfind_destination';
				}

				game_log('Starting pathfind', '#0000FF');
			}

			break;
		case "goto":
			if(retrievedObject.anchor_mode) {
				retrievedObject.anchor_mode = false;
				game_log('Un-Anchoring', '#0000FF');
			}
			if(retrievedObject.attack_mode) {
				retrievedObject.attack_mode = false;
				game_log('Stopping Attacks', '#0000FF');
			}

			if(retrievedObject.pathfind_mode) {
				retrievedObject.pathfind_mode = !retrievedObject.pathfind_mode;
				retrievedObject.hunting_monster = null;

				game_log('Stoping pathfind', '#0000FF');
			} else if(args.length > 0 && args.length <= 1) {
				retrievedObject.pathfind_destination = args[0];
				retrievedObject.pathfind_mode = !retrievedObject.pathfind_mode;

				if(G.monsters[retrievedObject.pathfind_destination]) {
					retrievedObject.hunting_monster = 'retrievedObject.pathfind_destination';
				}

				send_cm(party_members, {
					going_to: retrievedObject.pathfind_destination
				});

				game_log('Starting pathfind', '#0000FF');
			}
			break;
		case "where":
			if(retrievedObject.pathfind_where_mode) {
				retrievedObject.pathfind_where_mode = !retrievedObject.pathfind_where_mode;
			} else if(args.length > 0 && args.length <= 1) {
				retrievedObject.pathfind_destination = args[0];
				retrievedObject.pathfind_where_mode = !retrievedObject.pathfind_where_mode;
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
	'quited_upgrade_runner': false,

	'allow_potions_purchase': true,
	'is_buying': false,
	'buy_hp': true,
	'buy_mp': true,
	'pots_minimum': 50,
	'pots_to_buy': 500,

	'allow_item_purchase': true,
	'stop_on_success': true,
	'max_upgrade_level': 7,
	'max_compound_level': 3,
	'min_upg_gold': 1000000,

	'swhitelist': [],
	'ewhitelist': ['gem0','gem1','armorbox','weaponbox','candycane','mistletoe','ornament','armorbox','weaponbox','jewellerybox','candy1','candy0','seashell'],
	'uwhitelist': ['quiver','xmaspants', 'xmasshoes', 'xmassweater', 'xmashat', 'mittens'],
	'cwhitelist': ['wbook0', 'intamulet', 'stramulet', 'dexamulet', 'intearring', 'strearring', 'dexearring', 'hpbelt', 'hpamulet', 'ringsj', 'vitearring', 'amuletofm', 'orbofstr', 'orbofint', 'orbofres', 'orbofhp', 'orbofsc'],

	'allow_exchanging': true,
	'allow_selling': true,

	'anchor_mode': false,
	'anchor_x': 0,
	'anchor_y': 0,
	'anchor_distance_x': 300,
	'anchor_distance_y': 300,

	'pathfind_mode': false,
	'pathfind_destination': null,

	'near_distance': 60,
	'near_distance_negative': -60,

	'party_leader': party_leader,

	'attack_mode': true,
	'hunting_monster': null
};

// Put the config into storage
localStorage.setItem('storageVars_'+character.name, JSON.stringify(starter_vars));

$.getScript('https://cdn.rawgit.com/TiagoGoddard/AdventureLandCODE/v'+version+'/libs/require.js', function() {
	requirejs.config({
		baseUrl: 'https://cdn.rawgit.com/TiagoGoddard/AdventureLandCODE/v'+version+'/',
		paths: {
			classes: 'scripts/classes'
		}
	});

	requirejs(['main']);
	requirejs(['upgrades']);
	requirejs(['pathfind']);
	requirejs(['buying']);
});

window.aldc_apikey = 'API_KEY';
window.aldc_use_upgrade = true;
window.aldc_use_compound = true;
window.aldc_use_exchange = true;

// USAGE INFORMATION:
// When aldc_use_upgrade = true, send upgrade data when using parent.upgradeit(item_name, max_level, options_object).
//      options_object defaults to { buy_item: false, buy_scrolls: true, stop_on_success: false }
// When aldc_use_compound = true, send compound data when using parent.compoundit(item_name, item_level_to_compound); i.e compoundit('hpbelt', 0) tries to create an hpbelt+1
// When aldc_use_exchange = true, send exchange data when using parent.exchangeit(inventory_slot)

$.getScript('http://adventurecode.club/script?t='+(new Date).getTime(), function() {
    game_log('Thank you for contributing your drop data!', '#FFFF00');
});
```

## Merchant Game CODE Javascript:
```javascript
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
		//location.reload();
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