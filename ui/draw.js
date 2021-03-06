define(function () {
	var colours = [0x00FFFF, 0x00CCFF, 0x0099FF, 0x0066FF, 0x0033FF, 0x0000FF];
	var drawer = {};

	drawer.get_color = function(value) {
			//value from 0 to 1
			let hue = (value * 120).toString(10);
			return ["hsl(", hue, ",100%,50%)"].join("");
	};
	drawer.apply_PIXI = function(sprite_array) {
		for (let sprite of sprite_array) {
			parent.drawings.push(sprite);
			parent.map.addChild(sprite);
		}
	};
	drawer.in_range = function(entity) {
		if (parent.distance(character, entity) <= character.range) return true;
		return false;
	};
	drawer.filter_in_range = function() {
		var e = [];
		for (id in parent.entities) {
			var current = parent.entities[id];
			if (drawer.in_range(current)) e.push(current);
		}
		return e;
	};
	drawer.draw_rectangle = function(x, y, width, height, size, color, fill, opacity) {
		if (!color) color = 0x00F33E;
		if (!size) size = 1;
		let rectangle = new PIXI.Graphics();

		if (opacity) {
			rectangle.alpha = opacity;
		}
		if (fill) {
			rectangle.beginFill(color);
		}
		rectangle.lineStyle(size, color);
		rectangle.drawRect(x, y, width, height);
		if (fill) {
			rectangle.endFill();
		}
		return rectangle;
	};
	drawer.draw_circle = function(x, y, radius, size, color) {
		if (!color) {
			color = 0x00F33E;
		}
		if (!size) {
			size = 1;
		}

		let sprite = new PIXI.Graphics();
		sprite.lineStyle(size, color);
		sprite.drawCircle(x, y, radius);
		return sprite;
	};
	drawer.draw_line = function(x, y, x2, y2, size, color) {
		if (!color) {
			color = 0xF38D00;
		}
		if (!size) {
			size = 1;
		}

		let sprite = new PIXI.Graphics();
		sprite.lineStyle(size, color);
		sprite.moveTo(x, y);
		sprite.lineTo(x2, y2);
		sprite.endFill();
		return sprite;
	};
	drawer.draw_text = function(x, y, text, size = 20, color = 0x000000, font = 'pixel', quality = 2) {
		let sprite = new PIXI.Text(text, {
			fontFamily: font,
			fontSize: size * quality,
			fontWeight: 'bold',
			fill: color,
			align: 'center'
		});

		sprite.anchor.set(0.5, 0.5);
		sprite.scale = new PIXI.Point(1 / quality, 1 / quality);
		sprite.position.x = x;
		sprite.position.y = y;
		sprite.displayGroup = parent.text_layer;
		return sprite;
	};
	drawer.clear_drawings = function() {
		drawings.forEach(sprite => {
			try {
				sprite.destroy();
			} catch (ex) {}
		});
		drawings = parent.drawings = [];
	};
	drawer.draw_party_data = function() {
		let party_members = parent.party_list;
		if (party_members.length < 1) {
			return [];
		}
		let sprite_array = [];
		for (let i = 0; i < party_members.length; i++) {
			let entity = get_player(party_members[i]);
			if (!entity) continue;
			sprite_array.push(drawer.draw_rectangle(entity.real_x - (entity.awidth / 2), entity.real_y - character.aheight, entity.awidth, entity.aheight, null, colours[i]));
			//uncomment below to add a circle to show range of your character [remove the two //]
			//sprite_array.push(drawer.draw_circle(entity.real_x, entity.real_y, entity.range + 40, null, colours[i]));
			let target = get_target_of(entity);
			if (!target) continue;
			// Drawing Party Member's Target
			sprite_array.push(drawer.draw_line(entity.real_x, entity.real_y, target.real_x, target.real_y, null, colours[i]));
			if (target.mtype) {
				sprite_array.push(drawer.draw_rectangle(target.real_x - (target.width / 2), target.real_y - target.height, target.width, target.height, null, colours[i]));
			} else {
				sprite_array.push(drawer.draw_rectangle(target.real_x - (target.awidth / 2) - 1, target.real_y - target.aheight - 1, target.awidth + 2, target.aheight + 2, null, colours[i]));
			}
		}
		return sprite_array;
	};
	drawer.draw_unit_hp = function(entity) {
		const base_offset = 4;
		const line_offset = 7;
		const x_offset = 0.75;
		const border = 1;
		let sprite_array = [];
		let name_sprite = null;
		let hp_sprite = null;

		// Get Name
		if (entity.mtype) {
			name_sprite = drawer.draw_text(entity.real_x, entity.real_y + base_offset, entity.mtype, 10);
		} else {
			name_sprite = drawer.draw_text(entity.real_x, entity.real_y + base_offset, entity.name, 10);
		}

		// Get HP
		hp_sprite = drawer.draw_text(entity.real_x, entity.real_y + base_offset + line_offset, entity.hp + "/" + entity.max_hp, 10, drawer.get_color(entity.hp / entity.max_hp));

		let max_width = name_sprite.width > hp_sprite.width ? name_sprite.width : hp_sprite.width;
		let max_height = name_sprite.height + hp_sprite.height;

		let name_plate = drawer.draw_rectangle(entity.real_x - (max_width / 2) - x_offset - border, entity.real_y - border, max_width + (border * 2), max_height + (border * 2), null, 0x333333, true, 0.5);

		sprite_array.push(name_plate, name_sprite, hp_sprite);

		return sprite_array;
	};
	drawer.draw_hp_in_range = function() {
		let entities = drawer.filter_in_range();
		let sprite_array = [];
		sprite_array = sprite_array.concat(drawer.draw_unit_hp(character));
		entities.forEach(entity => sprite_array = sprite_array.concat(drawer.draw_unit_hp(entity)));
		return sprite_array;
	};
	drawer.draw = function() {
		drawer.clear_drawings();
		let sprite_array = [];
		sprite_array = sprite_array.concat(drawer.draw_hp_in_range());
		sprite_array = sprite_array.concat(drawer.draw_party_data());
		drawer.apply_PIXI(sprite_array);
	};

	return drawer;
});