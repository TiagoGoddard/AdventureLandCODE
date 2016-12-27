define(["require", "scripts/utils"],function (require, utils) {

	var allow_upg_cmpd = utils.get_bool_var('allow_upg_cmpd');
	var allow_item_purchase = utils.get_bool_var('allow_item_purchase');
	var allow_continue_on_success = utils.get_bool_var('allow_continue_on_success');
	var max_upgrade_level = utils.get_int_var('max_upgrade_level');
	var max_compound_level = utils.get_int_var('max_compound_level');

	var swhitelist = utils.get_var('swhitelist');
	var ewhitelist = utils.get_var('ewhitelist');
	var uwhitelist = utils.get_var('uwhitelist');
	var cwhitelist = utils.get_var('cwhitelist');

	var turn = 0;

	var mainInterval = setInterval(function() {
		turn += 1;

		allow_upg_cmpd = utils.get_bool_var('allow_upg_cmpd');
		allow_item_purchase = utils.get_bool_var('allow_item_purchase');
		allow_continue_on_success = utils.get_bool_var('allow_continue_on_success');

		if (turn >= 20) {
			turn = 0;

			swhitelist = utils.get_var('swhitelist');
			ewhitelist = utils.get_var('ewhitelist');
			uwhitelist = utils.get_var('uwhitelist');
			cwhitelist = utils.get_var('cwhitelist');
		}

		if (allow_upg_cmpd) {
			if (allow_item_purchase) {
				for (var id in uwhitelist) {
					var item_name = uwhitelist[id];
					if(parent.G.items[item_name]) {
						let [item_slot, item] = utils.get_item_slot(i => i.name == item_name && i.level < max_level);
						let [exists_slot, item_exists] = utils.get_item_slot(i => i.name == item_name && i.level == max_level);
						if (exists_slot != -1 && !allow_continue_on_success) continue;
						if (item_slot == -1) {
							try {
								parent.buy(item_name, 1);
							} catch(err) {
								console.error(err);
								game_log('Can\' buy '+item_name, '#FF0000');
							}
							return;
						}
					}
				}
			}

			for (let i = 0; i < character.items.length; i++) {
				let c = character.items[i];
				if (c) {
					if (uwhitelist.includes(c.name) && c.level < max_upgrade_level) {
						//Buy needed scrolls
						let grades = utils.get_item_info(c).grades;
						let scrollname;

						if (c.level < grades[0])
							scrollname = 'scroll0';
						else if (c.level < grades[1])
							scrollname = 'scroll1';
						else
							scrollname = 'scroll2';

						let [scroll_slot, scroll] = utils.get_item_slot(i => i.name === scrollname);
						if (!scroll) {
							parent.buy(scrollname, 1);
							return;
						}

						//Upgrade
						parent.socket.emit('upgrade', {
							item_num: i,
							scroll_num: scroll_slot,
							offering_num: null,
							clevel: c.level
						});
						return;
					} else if (cwhitelist.includes(c.name) && c.level < max_compound_level) {
						//Compound
						let [item2_slot, item2] = utils.get_item_slot((item) => c.name === item.name && c.level === item.level, i + 1);
						let [item3_slot, item3] = utils.get_item_slot((item) => c.name === item.name && c.level === item.level, item2_slot + 1);
						if (item2 && item3) {
							let cscrollname;
							if (c.level < 2)
								cscrollname = 'cscroll0';
							else
								cscrollname = 'cscroll1';

							let [cscroll_slot, cscroll] = utils.get_item_slot(i => i.name === cscrollname);
							if (!cscroll) {
								parent.buy(cscrollname, 1);
								return;
							}

							parent.socket.emit('compound', {
								items: [i, item2_slot, item3_slot],
								scroll_num: cscroll_slot,
								offering_num: null,
								clevel: c.level
							});
							return;
						}
					} else if (c && ewhitelist.includes(c.name)) {
						//Exchange
						exchange(i)
						parent.e_item = i;
					} else if (c && swhitelist.includes(c.name)) {
						//Sell
						sell(i);
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