define(["require", "scripts/utils"],function (require, utils) {

	var pclass = utils.get_class(character.ctype);

	var allow_potions_purchase = utils.get_bool_var('allow_potions_purchase');
	var buy_hp = utils.get_bool_var('buy_hp');
	var buy_mp = utils.get_bool_var('buy_mp');

	var pots_minimum = utils.get_int_var('pots_minimum');
	var pots_to_buy = utils.get_int_var('pots_to_buy');

	var turn = 0;

	var mainInterval = setInterval(function(){
		turn += 1;

		if (turn >= 60) {
			turn = 0;
		}

		allow_potions_purchase = utils.get_bool_var('allow_potions_purchase');

		//Check for potions
		if(allow_potions_purchase) {
			let [hpslot, hppot] = utils.get_item(i => i.name == pclass.get_hp_potion());
			let [mpslot, mppot] = utils.get_item(i => i.name == pclass.get_mp_potion());

			var should_buy_hp = buy_hp && (!hppot || hppot.q < pots_minimum);
			var should_buy_mp = buy_mp && (!mppot || mppot.q < pots_minimum);

			if (should_buy_hp || should_buy_mp) {
				var pathfind_destination = 'potions';

				utils.set_var('attack_mode', false);
				game_log('Stopping Attacks', '#0000FF');

				smart_move({to:pathfind_destination},function(r){
					utils.set_var('attack_mode', true);
					game_log('Enable Attacks', '#0000FF');

					if(should_buy_hp) {
						parent.buy(pclass.get_hp_potion(), pots_to_buy);
					}
					if(should_buy_hp) {
						parent.buy(pclass.get_hp_potion(), pots_to_buy);
					}
					set_message("Buying HP pots, slot: "+hpslot);
				});

			}
			if (buy_mp && (!mppot || mppot.q < pots_minimum)) {
				parent.buy(pclass.get_mp_potion(), pots_to_buy);
				set_message("Buying MP pots, slot: "+mpslot);
			}
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
