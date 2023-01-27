$(function() {

	var init = function() {
		$(".z-player-init").each(function(index, el) {
			var $player = $('<div class="z-player"><iframe id="pl_1" class="z-player__iframe" scrolling="no" frameborder="no" src=""></iframe><div class="z-player__button z-player__button_play"></div><div class="z-player__box"><div class="z-player__title"></div><div class="z-player__duration"><div class="z-player__duration__progress"></div></div></div><div class="z-player__volume-wrapper"><div class="z-player__volume z-player__volume_1"><span></span></div><div class="z-player__volume z-player__volume_2"><span></span></div><div class="z-player__volume z-player__volume_3"><span></span></div><div class="z-player__volume z-player__volume_4"><span></span></div><div class="z-player__volume z-player__volume_5"><span></span></div><div class="z-player__volume z-player__volume_6"><span></span></div></div></div>');
			var url = "https://w.soundcloud.com/player/?url=" + $(this).data("url");
			$player.find(".z-player__iframe").attr("src", url);
			$(this).html($player);
			$(".z-player").unwrap();
		});
	};
	init();
	$(".z-player").each(function() {
		var el, widget, widgetIframe;
		el = $(this);
		widgetIframe = el.children("iframe").attr("id");
		widget = SC.Widget(widgetIframe);
		widget.bind(SC.Widget.Events.READY, function() {

			/* добавление подписей */
			var i, time_line, time_update, vol;
			time_update = function(obj_time, now, full, duration, flag) {
				var curent, finish;
				if (!flag) {
					now = obj_time.width();
					full = obj_time.parents(".z-player__duration").width();
				}
				if (now === full) {
					now = 1;
					obj_time.css("width", 1);
				}
				curent = now * duration / (full - 1);
				finish = duration - curent;
				if (flag) {
					widget.seekTo(curent);
				}
				obj_time.stop().animate({
					"width": full
				}, finish);
			};
			widget.getSounds(function(value) {
				el.find(".z-player__title").text(value[0]["title"]);
				console.log(value);
			});

			/*навешивание кнопки плей + запуск тайм линии */
			el.children(".z-player__button_play").click(function() {
				var progess;
				progess = el.find(".z-player__duration__progress");
				$(".z-player__duration__progress").stop();
				if (el.hasClass("active")) {
					widget.pause();
					el.removeClass("active");
				} else {
					el.removeClass("active");
					el.addClass("active");
					widget.play();
					widget.getSounds(function(value) {
						time_update(progess, 0, 0, value[0]["duration"], false);
					});
				}
			});

			/*установка звука + контроль звука */
			vol = el.find(".z-player__volume");
			i = 0;
			while (i < 6) {
				vol.eq(i).addClass("active");
				i++;
			}
			vol.click(function() {
				var vol_act;
				vol_act = $(this);
				widget.setVolume((vol_act.index() + 1) * 16 / 100);
				i = 0;
				while (i < 6) {
					if (i < vol_act.index()) {
						vol.eq(i + 1).addClass("active");
					} else {
						vol.eq(i + 1).removeClass("active");
					}
					i++;
				}
			});

			/*работа с тайм линией */
			time_line = el.find(".z-player__duration");
			time_line.click(function(e) {
				var tm_full, tm_now, tm_obj, x;
				x = e.offsetX === void 0 ? e.layerX : e.offsetX;
				if ($(this).parents(".z-player").hasClass("active")) {
					$(this).children(".z-player__duration__progress").stop().css("width", x);
				} else {
					widget.play();
					$(this).parents(".z-player").addClass("active");
				}
				tm_obj = $(this).children(".z-player__duration__progress");
				tm_now = $(this).children(".z-player__duration__progress").width();
				tm_full = $(this).width();
				widget.getSounds(function(value) {
					time_update(tm_obj, tm_now, tm_full, value[0]["duration"], true);
				});
			});
		});

		/*SC.Widget.Events.READY */
	});

	/*bind */
});
