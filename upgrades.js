define(["require", "scripts/utils"],function (require, utils) {

	var allow_item_purchase = utils.get_bool_var('allow_item_purchase');
	var stop_on_success = utils.get_bool_var('stop_on_success');
	var max_upgrade_level = utils.get_int_var('max_upgrade_level');
	var max_compound_level = utils.get_int_var('max_compound_level');

	var min_upg_gold = utils.get_int_var('min_upg_gold');

	var swhitelist = utils.get_var('swhitelist');
	var ewhitelist = utils.get_var('ewhitelist');
	var uwhitelist = utils.get_var('uwhitelist');
	var cwhitelist = utils.get_var('cwhitelist');

	var turn = 0;

	var mainInterval = setInterval(function() {
		turn += 1;

		allow_item_purchase = utils.get_bool_var('allow_item_purchase');
		stop_on_success = utils.get_bool_var('stop_on_success');

		if (turn >= 20) {
			turn = 0;

			min_upg_gold = utils.get_int_var('min_upg_gold');

			swhitelist = utils.get_var('swhitelist');
			ewhitelist = utils.get_var('ewhitelist');
			uwhitelist = utils.get_var('uwhitelist');
			cwhitelist = utils.get_var('cwhitelist');
		}

		if (character.gold > min_upg_gold) {
			for (let i = 0; i < character.items.length; i++) {
				let c = character.items[i];
				if (c) {
					if (uwhitelist.includes(c.name) && c.level < max_upgrade_level) {
						//Upgrade
						parent.upgradeit(c.name, c.level, { buy_item: allow_item_purchase, buy_scrolls: true, stop_on_success: stop_on_success }).
						return;
					} else if (cwhitelist.includes(c.name) && c.level < max_compound_level) {
						//Compound
						let [item2_slot, item2] = utils.get_item_slot((item) => c.name === item.name && c.level === item.level, i + 1);
						let [item3_slot, item3] = utils.get_item_slot((item) => c.name === item.name && c.level === item.level, item2_slot + 1);
						if (item2 && item3) {
							parent.compoundit(i.name, c.level);
						}
						return;
					} else if (c && ewhitelist.includes(c.name)) {
						//Exchange
						let [item_slot, item] = utils.get_item_slot(i => i.name == c.name);
						parent.exchangeit(item_slot);
						return;
					} else if (c && swhitelist.includes(c.name)) {
						//Sell
						sell(i);
						return;
					}
				}
			}
		}

	}, 1000);

	var quit = false;
	var global_runner = false;

	setInterval(function() {
		if(!quit) {
			global_runner = utils.get_bool_var('global_runner');
			if(global_runner === true) {
				quit = true;

				clearInterval(drawInterval);

				utils.set_var('quited_upgrade_runner', true);
			}
		}
	},1000);
});