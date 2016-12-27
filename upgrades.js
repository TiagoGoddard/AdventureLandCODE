define(["require", "scripts/utils"],function (require, utils) {

	var allow_upg_cmpd = utils.get_bool_var('allow_upg_cmpd');
	var max_upgrade_level = utils.get_int_var('max_upgrade_level');;
	var max_compound_level = utils.get_int_var('max_compound_level');;

	var swhitelist = utils.get_var('swhitelist');
	var ewhitelist = utils.get_var('ewhitelist');
	var uwhitelist = utils.get_var('uwhitelist');
	var cwhitelist = utils.get_var('cwhitelist');

	var turn = 0;

	var mainInterval = setInterval(function() {
		turn += 1;

		allow_upg_cmpd = utils.get_bool_var('allow_upg_cmpd');

		if (turn >= 20) {
			turn = 0;

			swhitelist = utils.get_var('swhitelist');
			ewhitelist = utils.get_var('ewhitelist');
			uwhitelist = utils.get_var('uwhitelist');
			cwhitelist = utils.get_var('cwhitelist');
		}

		if (allow_upg_cmpd) {
			seuc_merge(max_upgrade_level, max_compound_level);

			for (let i = 0; i < character.items.length; i++) {
				let c = character.items[i];
				if (c) {
					if (uwhitelist.includes(c.name) && c.level < max_upgrade_level) {
						//Upgrade
						let grades = utils.get_item_info(c).grades;
						let scrollname;

						if (c.level < grades[0])
							scrollname = 'scroll0';
						else if (c.level < grades[1])
							scrollname = 'scroll1';
						else
							scrollname = 'scroll2';

						let [scroll_slot, scroll] = utils.find_item_filter(i => i.name === scrollname);
						if (!scroll) {
							parent.buy(scrollname);
							return;
						}

						parent.socket.emit('upgrade', {
							item_num: i,
							scroll_num: scroll_slot,
							offering_num: null,
							clevel: c.level
						});
						return;
					} else if (cwhitelist.includes(c.name) && c.level < max_compound_level) {
						//Compound
						let [item2_slot, item2] = utils.find_item_filter((item) => c.name === item.name && c.level === item.level, i + 1);
						let [item3_slot, item3] = utils.find_item_filter((item) => c.name === item.name && c.level === item.level, item2_slot + 1);
						if (item2 && item3) {
							let cscrollname;
							if (c.level < 2)
								cscrollname = 'cscroll0';
							else
								cscrollname = 'cscroll1';

							let [cscroll_slot, cscroll] = utils.find_item_filter(i => i.name === cscrollname);
							if (!cscroll) {
								parent.buy(cscrollname);
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