function serialize(target) {
	if (!target || target.nodeName !== "FORM") {
		return;
	}

	let serialized = [];

	for (let i = target.elements.length - 1; i >= 0; i--) {
		if (target.elements[i].name === "") {
			continue;
		}

		switch (target.elements[i].nodeName) {
			case "INPUT":
				switch (target.elements[i].type) {
					case "text":
					case "hidden":
					case "password":
					case "button":
					case "reset":
					case "submit":
						serialized.push(target.elements[i].name + "=" + encodeURIComponent(target.elements[i].value));
						break;
					case "checkbox":
					case "radio":
						if (target.elements[i].checked) {
							serialized.push(target.elements[i].name + "=" + encodeURIComponent(target.elements[i].value));
						}
						break;
					case "file":
						break;
				}
				break;
			case "TEXTAREA":
				serialized.push(target.elements[i].name + "=" + encodeURIComponent(target.elements[i].value));
				break;
			case "SELECT":
				switch (target.elements[i].type) {
					case "select-one":
						serialized.push(target.elements[i].name + "=" + encodeURIComponent(target.elements[i].value));
						break;
					case "select-multiple":
						for (let j = target.elements[i].options.length - 1; j >= 0; j--) {
							if (target.elements[i].options[j].selected) {
								serialized.push(target.elements[i].name + "=" + encodeURIComponent(target.elements[i].options[j].value));
							}
						}
						break;
				}
				break;
			case "BUTTON":
				switch (target.elements[i].type) {
					case "reset":
					case "submit":
					case "button":
						serialized.push(target.elements[i].name + "=" + encodeURIComponent(target.elements[i].value));
						break;
				}
				break;
		}
	}

	return serialized.join("&");
}

function loading(display = true) {
	let loading = document.querySelector(".loading");
	if (display) {
		loading.style.display = "flex";
	} else {
		loading.style.display = "none";
	}
}

function trigger(message, type = "success") {
	let trigger_container = document.querySelector(".trigger_container");
	trigger_container.style.display = "block";
	trigger_container.classList.add(type);

	document.querySelector(".trigger_message").innerHTML = message;

	setTimeout(function () {
		trigger_container.style.display = "none";
	}, 5000);
}

function ajax(query, show_loading = true) {
	if (show_loading) {
		loading(true);
	}

	let user = JSON.parse('{"' + decodeURI(query).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
	if (typeof user.username == "undefined" || typeof user.password == "undefined") {
		query = `username=${username}&password=${password}&${query}`;
	}
	if (avatar) {
		query += `&avatar_id=${avatar.id}`;
	}

	return new Promise(function (resolve) {
		let xhr = new XMLHttpRequest();
		xhr.onload = function () {
			if (xhr.readyState === 4) {
				loading(false);
				try {
					let parsed = JSON.parse(xhr.response);
					if (typeof parsed.trigger !== "undefined") {
						trigger(parsed.trigger.msg, parsed.trigger.type);
					}
					if (typeof parsed.display !== "undefined") {
						for (let [key, value] of Object.entries(parsed.display)) {
							document.querySelector(key).style.display = value;
						}
					}
					if (typeof parsed.setItem !== "undefined") {
						for (let [key, value] of Object.entries(parsed.setItem)) {
							localStorage.setItem(key, value);
						}
					}
					if (typeof parsed.innerHTML !== "undefined") {
						for (let [key, value] of Object.entries(parsed.innerHTML)) {
							document.querySelector(key).innerHTML = value;
						}
					}
					if (typeof parsed.callFunction !== "undefined") {
						for (let [key, value] of Object.entries(parsed.callFunction)) {
							if (value && value.length) {
								eval(key + `(${value})`);
							} else {
								eval(key + "()");
							}
						}
					}
					login();
					btn();
					scroll();
				} catch (error) {
					console.log(error);
					loading(false);
				}
			}
			resolve();
		};
		xhr.onerror = function () {
			console.error(xhr.statusText);
			loading(false);
		};
		xhr.open("GET", corsProxy(API_BASE + query), true);
		xhr.send();
	});
}

function btn() {
	let j_btn = document.querySelectorAll(".j_btn");
	for (let i = 0; i < j_btn.length; i++) {
		let j_btn_copy = j_btn[i];
		let j_btn_clone = j_btn_copy.cloneNode(true);
		j_btn_clone.onclick = async function () {
			let action = j_btn_clone.getAttribute("_action");
			let id = j_btn_clone.getAttribute("id");
			switch (action) {
				case "handleAvatar": {
					let avatars = JSON.parse(localStorage.getItem("user_info")).avatars;
					let finded_avatar = avatars.filter((item) => item.id == id)[0];
					finded_avatar.color = j_btn_clone.getAttribute("_color");
					localStorage.setItem("avatar", JSON.stringify(finded_avatar));
					localStorage.removeItem("favorites");
					login();
					handlePage("home");
					break;
				}
				case "deleteAvatar": {
					let user_info = JSON.parse(localStorage.getItem("user_info"));
					let finded_avatar2 = user_info.avatars.filter((item) => item.id == id)[0];
					await ajax("action=delete_avatar&avatar_id=" + finded_avatar2.id);
					let user_info2 = JSON.parse(localStorage.getItem("user_info"));
					user_info2.avatars = Object.values(user_info2.avatars);
					localStorage.setItem("user_info", JSON.stringify(user_info2));
					login();
					break;
				}
				case "changeAvatar": {
					localStorage.removeItem("avatar");
					localStorage.removeItem("home");
					localStorage.removeItem("favorites");
					document.querySelector(".profile_container").style.display = "none";
					login();
					break;
				}
				case "exit": {
					localStorage.clear();
					document.querySelector(".profile_container").style.display = "none";
					login();
					break;
				}
				default:
					break;
			}
		};
		j_btn_copy.parentNode.replaceChild(j_btn_clone, j_btn_copy);
	}
}

function login() {
	let userInfo = localStorage.getItem("user_info");
	if (userInfo) {
		let userInfo = JSON.parse(localStorage.getItem("user_info"));
		if (userInfo.auth == 0) {
			document.querySelector("#Login").style.display = "flex";
			document.querySelector("#Avatar").style.display = "none";
			document.querySelector("#Player").style.display = "none";
			document.querySelector(".page_content").innerHTML = "";
			localStorage.clear();
		} else {
			username = userInfo.username;
			password = userInfo.password;
			if (localStorage.getItem("avatar")) {
				avatar = JSON.parse(localStorage.getItem("avatar"));
				document.querySelector("#Login").style.display = "none";
				document.querySelector("#Avatar").style.display = "none";
				document.querySelector("#Player").style.display = "flex";
				let avatar_name = document.querySelectorAll(".avatar_name");
				for (let i = 0; i < avatar_name.length; i++) {
					avatar_name[i].innerHTML = avatar.avatar_name;
				}
				document.querySelector(".avatar_container").style.backgroundColor = avatar.color;
			} else {
				document.querySelector("#Login").style.display = "none";
				document.querySelector("#Avatar").style.display = "flex";
				document.querySelector("#Player").style.display = "none";
				let avatar_element = "";
				let manage_users_element = "";
				let avatar_manager_element = "";
				for (let i = 0; i < userInfo.avatars.length; i++) {
					let color = `hsl(${(i % 18) * 20}, 100%, 50%)`;
					avatar_element += `
						<li>
							<a class="j_btn" _action="handleAvatar" _color="${color}" id="${userInfo.avatars[i].id}" href="javascript:void(0)" style="background-color: ${color};">
								<img src="assets/images/face-user.png">
							</a>
							<span>${userInfo.avatars[i].avatar_name}</span>
						</li>
					`;
					avatar_manager_element += `
						<li>
							<a class="j_btn" _action="deleteAvatar" id="${userInfo.avatars[i].id}" href="javascript:void(0)" style="background-color: ${color};">
								<div class="bg_edit">
									<img src="assets/icons/icon-trash.svg">
								</div>
								<img src="assets/images/face-user.png">
							</a>
							<span>${userInfo.avatars[i].avatar_name}</span>
						</li>
					`;
				}
				avatar_element += `
					<li>
						<a href="javascript:void(0)" onclick="document.querySelector('.users_modal_container').style.display = 'flex';">
							<img style="filter: invert(.8); width: 80px;" src="assets/icons/icon-plus-circle.svg">
						</a>
						<span>Adicionar perfil</span>
					</li>
				`;
				manage_users_element = `
					<a class="btn_manage_users" href="javascript:void(0)" onclick="document.querySelector('.manage_users_modal_container').style.display = 'flex';">
						<span>Gerenciar perfis</span>
					</a>
				`;
				document.querySelector(".avatar_list").innerHTML = avatar_element;
				document.querySelector(".avatar_list_manager").innerHTML = avatar_manager_element;
				document.querySelector(".manage_users").innerHTML = manage_users_element;
				btn();
			}
		}
	} else {
		document.querySelector("#Login").style.display = "flex";
		document.querySelector("#Avatar").style.display = "none";
		document.querySelector("#Player").style.display = "none";
		document.querySelector(".page_content").innerHTML = "";
	}
}

function btnScroll() {
	document.querySelectorAll(".btn_right_scroll").forEach(function (item) {
		item.onclick = function () {
			let scrollAmount = 0;
			let ref = item.getAttribute("ref");
			let scroll_horizon = document.querySelector(`.scroll_horizon[id="${ref}"]`);
			let interval = setInterval(function () {
				scrollAmount += 50;
				scroll_horizon.scrollLeft += 50;
				if (scrollAmount >= 500) {
					window.clearInterval(interval);
				}
			}, 35);
		};
	});
	document.querySelectorAll(".btn_left_scroll").forEach(function (item) {
		item.onclick = function () {
			let scrollAmount = 0;
			let ref = item.getAttribute("ref");
			let scroll_horizon = document.querySelector(`.scroll_horizon[id="${ref}"]`);
			let interval = setInterval(function () {
				scrollAmount += 50;
				scroll_horizon.scrollLeft -= 50;
				if (scrollAmount >= 500) {
					window.clearInterval(interval);
				}
			}, 35);
		};
	});
}

function handlePage(type) {
	document.querySelector(".search_container").style.visibility = "hidden";
	document.querySelector(".search_input_action").value = "";
	document.querySelector(".search_input_search").value = "";

	let menu_content_a = document.querySelectorAll(".menu_content a");
	for (let i = 0; i < menu_content_a.length; i++) {
		menu_content_a[i].classList.remove("active");
	}
	document.querySelector(".menu_content ." + type).classList.add("active");

	if (player_live) {
		player_live.dispose();
		player_live = null;
	}

	switch (type) {
		case "lives":
			pageLives();
			handleLivesCategories();
			break;
		case "movies":
			pageVod();
			handleModalVod();
			handleVodCategories();
			break;
		case "series":
			pageSeries();
			handleModalSerie();
			handleSeriesCategories();
			break;
		case "favorites":
			pageFavorites();
			handleFavorites();
			break;
		default:
			pageHome();
			handleHome();
			break;
	}

	scroll();
}

function pageHome() {
	document.querySelector(".page_content").innerHTML = `
		<div class="home_container">
			<div class="carousel_section_generic_container keep_watching_container">
				<div class="carousel_section_generic_content small">
					<div class="section_new_title carousel_section_generic_title">
						<p>Continue assistindo</p>
						<div class="container_arrows">
							<img src="assets/icons/icon-left.svg"  class="btn_left_scroll" ref="1"></img>
							<img src="assets/icons/icon-right.svg"  class="btn_right_scroll" ref="1"></img>
						</div>
					</div>
					<ul class="hide_scrollbar scroll_horizon keep_watching_ul" id="1">
					</ul>
				</div>
			</div>
			<div class="carousel_section_generic_container top_conainer">
				<div class="carousel_section_generic_content">
					<div class="section_top_title carousel_section_generic_title">
						<p>Top 10</p>
						<div class="container_arrows">
							<img src="assets/icons/icon-left.svg"  class="btn_left_scroll" ref="2"></img>
							<img src="assets/icons/icon-right.svg"  class="btn_right_scroll" ref="2"></img>
						</div>
					</div>
					<ul class="hide_scrollbar scroll_horizon top_ul" id="2">
					</ul>
				</div>
			</div>
			<div class="carousel_section_generic_container movies_added_container">
				<div class="carousel_section_generic_content small">
					<div class="section_new_title carousel_section_generic_title">
						<p>Filmes recém adicionados</p>
						<div class="container_arrows">
							<img src="assets/icons/icon-left.svg"  class="btn_left_scroll" ref="3"></img>
							<img src="assets/icons/icon-right.svg"  class="btn_right_scroll" ref="3"></img>
						</div>
					</div>
					<ul class="hide_scrollbar scroll_horizon movies_added_ul" id="3">
					</ul>
				</div>
			</div>
			<div class="carousel_section_generic_container series_added_container" style="margin-bottom: 10px;">
				<div class="carousel_section_generic_content small">
					<div class="section_new_title carousel_section_generic_title">
						<p>Séries recém adicionadas</p>
						<div class="container_arrows">
							<img src="assets/icons/icon-left.svg"  class="btn_left_scroll" ref="4"></img>
							<img src="assets/icons/icon-right.svg"  class="btn_right_scroll" ref="4"></img>
						</div>
					</div>
					<ul class="hide_scrollbar scroll_horizon series_added_ul" id="4">
					</ul>
				</div>
			</div>
		</div>
	`;
}

function changeHttp(link) {
	if (link.includes("https")) {
		return link;
	} else {
		return link.replace("http", "https");
	}
}

function poster(src) {
	if (src) {
		return `<img src="${changeHttp(src)}" loading="lazy" onerror="this.src='assets/images/not-available.png'"></img>`;
	} else {
		return `<img src="assets/images/not-available.png"></img>`;
	}
}

function handleHome() {
	document.querySelector(".top_conainer").style.display = "none";
	document.querySelector(".keep_watching_container").style.display = "none";
	document.querySelector(".movies_added_container").style.display = "none";
	document.querySelector(".series_added_container").style.display = "none";
	let home_json = localStorage.getItem("home");
	if (home_json) {
		let home = JSON.parse(home_json);
		if (home.keepWatching.length) {
			document.querySelector(".keep_watching_container").style.display = "flex";
		}
		if (home.top.length) {
			document.querySelector(".top_conainer").style.display = "flex";
		}
		if (home.moviesAdded.length) {
			document.querySelector(".movies_added_container").style.display = "flex";
		}
		if (home.seriesAdded.length) {
			document.querySelector(".series_added_container").style.display = "flex";
		}
		let element = "";
		for (let i = 0; i < home.keepWatching.length; i++) {
			let image = "";
			let title = "";
			let action = "";
			if (home.keepWatching[i].serie_id) {
				action = `
					(async function () { 
						handleModalSerie(); 
						await handleSerieInfo(null, ${home.keepWatching[i].serie_id}); 
						handleVideo('${DNS}/series/${username}/${password}/${home.keepWatching[i].stream_id}.${home.keepWatching[i].target_container}', 'video/mp4');
					})();
				`;
				image = home.keepWatching[i].cover;
				title = home.keepWatching[i].title;
			} else {
				action = `
					(async function () {
						handleModalVod(); 
						await handleVodInfo(null, ${home.keepWatching[i].stream_id}); 
						handleVideo('${DNS}/movie/${username}/${password}/${home.keepWatching[i].stream_id}.${home.keepWatching[i].target_container}', 'video/mp4');
					})();
				`;
				image = home.keepWatching[i].movie_image;
				title = home.keepWatching[i].stream_display_name;
			}
			element += `
				<li>
					<a onclick="${action}" href="javascript:void(0)">
						${poster(image)}
						<span class="name">${title}</span>
					</a>
				</li>
			`;
		}
		document.querySelector(".keep_watching_ul").innerHTML = element;
		element = "";
		for (let i = 0; i < home.top.length; i++) {
			if (home.top[i].stream_id) {
				element += `
					<li>
						<a class="top_li" onclick="(async function () { await handleModalVod(); handleVodInfo(null, ${home.top[i].stream_id}); })();" href="javascript:void(0)">
							${poster(home.top[i].movie_image)}
							<span class="position_number">${(i + 1)}</span>
							<span class="name">${home.top[i].stream_display_name}</span>
						</a>
					</li>
				`;
			} else {
				element += `
					<li>
						<a class="top_li" onclick="(async function () { await handleModalSerie(); handleSerieInfo(null, ${home.top[i].serie_id}); })();" href="javascript:void(0)">
							${poster(home.top[i].cover)}
							<span class="position_number">${(i + 1)}</span>
							<span class="name">${home.top[i].title}</span>
						</a>
					</li>
				`;
			}
		}
		document.querySelector(".top_ul").innerHTML = element;
		element = "";
		for (let i = 0; i < home.moviesAdded.length; i++) {
			element += `
				<li>
					<a onclick="(async function () { await handleModalVod(); handleVodInfo(null, ${home.moviesAdded[i].id}); })();" href="javascript:void(0)">
						${poster(home.moviesAdded[i].movie_image)}
						<span class="name">${home.moviesAdded[i].stream_display_name}</span>
					</a>
				</li>
			`;
		}
		document.querySelector(".movies_added_ul").innerHTML = element;
		element = "";
		for (let i = 0; i < home.seriesAdded.length; i++) {
			element += `
				<li>
					<a onclick="(async function () { await handleModalSerie(); handleSerieInfo(null, ${home.seriesAdded[i].id}); })();" href="javascript:void(0)">
						${poster(home.seriesAdded[i].cover)}
						<span class="name">${home.seriesAdded[i].title}</span>
					</a>
				</li>
			`;
		}
		document.querySelector(".series_added_ul").innerHTML = element;
		btnScroll();
	} else {
		ajax("action=home");
	}
}

function pageLives() {
	document.querySelector(".search_container").style.visibility = "visible";
	document.querySelector(".search_input_action").value = "get_live_streams";
	document.querySelector(".page_content").innerHTML = `
		<div class="channels_categories">
			<ul class="scroll_vertical hide_scrollbar media_categories_ul">
			</ul>
		</div>
		<div class="channels_list">
			<ul class="scroll_vertical hide_scrollbar channels_ul">
			</ul>
		</div>
		<div class="scroll_horizon channels_view_container">
			<div class="channels_view_content">
			</div>
			<button style="display: block; margin: 10px 0; text-align: right; width: 100%;" type="button" name="button" class="btn_favorite">
			</button>
			<ul class="epg_ul">
			</ul>
		</div>
	`;
}

var live_first_category_id = "";
function handleLivesCategories() {
	let live_categories = localStorage.getItem("live_categories");
	if (live_categories) {
		live_categories = JSON.parse(live_categories);
		let element = "";
		for (let i = 0; i < live_categories.length; i++) {
			element += `
				<li>
					<a class="media_category_a" onclick="handleLives(null, ${live_categories[i].category_id})" id="${live_categories[i].category_id}" href="javascript:void(0)">${live_categories[i].category_name}</a>
				</li>
			`;
		}
		document.querySelector(".media_categories_ul").innerHTML = element;
		live_first_category_id = live_categories[0].category_id;
		handleLives(null, live_first_category_id);
	} else {
		ajax("action=get_live_categories");
	}
}

function handleLives(lives = null, category_id = null) {
	if (lives) {
		let element = "";
		if (lives.length) {
			if (lives[0].category_id == live_first_category_id) {
				localStorage.setItem("lives_first_category", JSON.stringify(lives));
			}
			for (let i = 0; i < lives.length; i++) {
				element += `
					<li>
						<a onclick="(async function () { await handleLiveInfo(null, ${lives[i].stream_id}); watchLive('${DNS}/live/${username}/${password}/${lives[i].stream_id}.m3u8'); })();" id="${lives[i].stream_id}" href="javascript:void(0)">
							${poster(lives[i].stream_icon)}
							<span>${lives[i].name}</span>
						</a>
					</li>
				`;
			}
			let media_category_a = document.querySelectorAll(".media_category_a");
			for (let i = 0; i < media_category_a.length; i++) {
				if (media_category_a[i].getAttribute("id") == lives[0].category_id) {
					media_category_a[i].classList.add("active");
				} else {
					media_category_a[i].classList.remove("active");
				}
			}
		} else {
			element = `<li style="color: #fff;">Nenhum canal disponível nessa categoria</li>`;
		}
		document.querySelector(".channels_ul").innerHTML = element;
	} else {
		if (category_id == live_first_category_id) {
			let lives_first_category = localStorage.getItem("lives_first_category");
			if (lives_first_category) {
				lives_first_category = JSON.parse(lives_first_category);
				handleLives(lives_first_category);
				return;
			}
		}
		ajax("action=get_live_streams&category_id=" + category_id);
	}
}

function handleLiveInfo(live_info = null, stream_id = null) {
	if (live_info) {
		let element = "";
		if (live_info.epg_listings.length) {
			for (let i = 0; i < live_info.epg_listings.length; i++) {
				let start = new Date(parseInt(live_info.epg_listings[i].start_timestamp) * 1000);
				let end = new Date(parseInt(live_info.epg_listings[i].stop_timestamp) * 1000);
				element += `
					<li>
						<p class="title">
							<span class="time">
								${start.getHours()}:${start.getMinutes()} - ${end.getHours()}:${end.getMinutes()}
							</span> |  ${decodeURIComponent(escape(window.atob(live_info.epg_listings[i].title)))}
						</p>
						<p class="description">
							${decodeURIComponent(escape(window.atob(live_info.epg_listings[i].description)))}
						</p>
					</li>
				`;
			}
		}
		document.querySelector(".epg_ul").innerHTML = element;
	} else {
		let channels_list_a = document.querySelectorAll(".channels_list a");
		for (let i = 0; i < channels_list_a.length; i++) {
			if (channels_list_a[i].getAttribute("id") == stream_id) {
				channels_list_a[i].classList.add("active");
			} else {
				channels_list_a[i].classList.remove("active");
			}
		}
		ajax("action=get_short_epg&stream_id=" + stream_id + "&limit=10");
	}
}

var player_live = null;
function watchLive(link) {
	if (player_live) {
		player_live.dispose();
		player_live = null;
	}

	document.querySelector(".channels_view_content").innerHTML = `<video id="my-player-live" class="video-js vjs-default-skin vjs-big-play-centered" style="width:100%; height:100%; border:0px; outline:none; aspect-ratio:16/9;" controls loop src=""></video>`;

	player_live = videojs("my-player-live", {
		liveui: true,
		liveTracker: {
			liveTolerance: 5,
			trackingThreshold: 5
		},
		controlBar: {
			children: [
				"playToggle",
				"volumePanel",
				"progressControl",
				"seekToLive",
				"PictureInPictureToggle",
				"fullscreenToggle"
			],
			volumePanel: {
				inline: false
			}
		},
		language: "pt-BR",
		persistTextTrackSettings: true,
		html5: {
			nativeTextTracks: false,
			hls: {
				overrideNative: true
			}
		},
		plugins: {
			hotkeys: {
				volumeStep: 0.05,
				enableModifiersForNumbers: false
			}
		},
	});

	player_live.src(link);

	player_live.reloadSourceOnError({
		getSource: function (reload) {
			reload(link);
		},
		errorInterval: 5,
	});

	player_live.ready(function () {
		let volume = localStorage.getItem("Volume");
		if (volume) {
			player_live.volume(volume * 0.01);
		}

		player_live.autoplay(true);
		player_live.play();

		player_live.on("volumechange", function () {
			localStorage.setItem("Volume", Math.floor(player_live.volume() * 100));
		});
	});
}

function pageVod() {
	document.querySelector(".search_container").style.visibility = "visible";
	document.querySelector(".search_input_action").value = "get_vod_streams";
	document.querySelector(".page_content").innerHTML = `
		<div class="channels_categories">
			<ul class="scroll_vertical hide_scrollbar media_categories_ul">
			</ul>
		</div>
		<div class="media_content">
			<ul class="scroll_vertical media_ul">
			</ul>
		</div>
	`;
}

function handleModalVod() {
	let element = document.createElement("div");
	element.innerHTML = `
		<div class="modal_media_container">
			<div class="modal_media_box hide_scrollbar">
				<div class="modal_media_content">
					<div style="position: absolute; right: 50px; top: 10px;">
						<button type="button" name="button" class="modal_media_close" onclick="hideModalContainer();">
							<i class="bx bx-x"></i>
						</button>
					</div>
					<div class="media_info">
						<div class="media_cover">
							<img src="" loading="eager" onerror="this.src='assets/images/not-available.png'">
							<span class="rate"></span>
						</div>
						<div class="media_description">
							<p class="title"></p>
							<p class="genre"></p>
							<p class="director"></p>
							<p class="cast"></p>
							<div class="media_resume">
								<p></p>
							</div>
							<button type="button" name="button" class="btn_watch">
								<span><img src="assets/icons/icon-google-play.svg">Assistir</span>
							</button>
							<button type="button" name="button" class="btn_favorite" style="float: none; margin-left: 15px;">
								<i class="bx bx-heart"></i>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	`;
	document.querySelector(".page_content").append(element);
}

var vod_first_category_id = "";
function handleVodCategories() {
	let vod_categories = localStorage.getItem("vod_categories");
	if (vod_categories) {
		vod_categories = JSON.parse(vod_categories);
		let element = "";
		for (let i = 0; i < vod_categories.length; i++) {
			element += `
				<li>
					<a class="media_category_a" onclick="handleVods(null, ${vod_categories[i].category_id})" id="${vod_categories[i].category_id}" href="javascript:void(0)">${vod_categories[i].category_name}</a>
				</li>
			`;
		}
		document.querySelector(".media_categories_ul").innerHTML = element;
		vod_first_category_id = vod_categories[0].category_id;
		handleVods(null, vod_first_category_id);
	} else {
		ajax("action=get_vod_categories");
	}
}

function handleVods(vods = null, category_id = null) {
	if (vods) {
		let element = "";
		if (vods.length) {
			if (vods[0].category_id == vod_first_category_id) {
				localStorage.setItem("vods_first_category", JSON.stringify(vods));
			}
			for (let i = 0; i < vods.length; i++) {
				element += `
					<li>
						<a onclick="(async function () { await handleModalVod(); handleVodInfo(null, ${vods[i].stream_id}); })();" href="javascript:void(0)">
							${poster(vods[i].stream_icon)}	
							<span class="name">${vods[i].name}</span>
						</a>
					</li>
				`;
			}
			let media_category_a = document.querySelectorAll(".media_category_a");
			for (let i = 0; i < media_category_a.length; i++) {
				if (media_category_a[i].getAttribute("id") == vods[0].category_id) {
					media_category_a[i].classList.add("active");
				} else {
					media_category_a[i].classList.remove("active");
				}
			}
		} else {
			element = `<li style="color: #fff;">Nenhum filme disponível nessa categoria</li>`;
		}
		document.querySelector(".media_ul").innerHTML = element;
	} else {
		if (category_id == vod_first_category_id) {
			let vods_first_category = localStorage.getItem("vods_first_category");
			if (vods_first_category) {
				vods_first_category = JSON.parse(vods_first_category);
				handleVods(vods_first_category);
				return;
			}
		}
		ajax("action=get_vod_streams&category_id=" + category_id);
	}
}

async function handleVodInfo(movie = null, vod_id = null) {
	if (movie) {
		document.querySelector(".modal_media_container").style.opacity = "1";
		document.querySelector(".modal_media_container").style.display = "flex";
		document.querySelector(".modal_media_container").style.pointerEvents = null;
		document.querySelector(".modal_media_box").style.backgroundImage = (movie.info.movie_image ? `url(${changeHttp(movie.info.movie_image)}), ` : "") + "url(assets/images/not-available.png)";
		document.querySelector(".media_cover img").src = (movie.info.movie_image ? changeHttp(movie.info.movie_image) : "assets/images/not-available.png");
		document.querySelector(".media_cover .rate").innerHTML = "★ " + (movie.info.rating ? movie.info.rating : "N/A");
		document.querySelector(".media_description .title").innerHTML = movie.movie_data.name ? movie.movie_data.name : movie.info.name;
		document.querySelector(".media_description .genre").innerHTML = (movie.info.genre ? movie.info.genre : "") + " | " + (movie.info.duration ? movie.info.duration : "");
		document.querySelector(".media_description .director").innerHTML = "Diretor: " + (movie.info.director ? movie.info.director : "");
		document.querySelector(".media_description .cast").innerHTML = "Elenco: " + (movie.info.cast ? movie.info.cast : "");
		if (movie.info.plot) {
			document.querySelector(".media_resume").style.display = "block";
			document.querySelector(".media_resume p").innerHTML = movie.info.plot;
		} else {
			document.querySelector(".media_resume").style.display = "none";
		}
		document.querySelector(".btn_watch").onclick = function () {
			handleVideo(`${DNS}/movie/${username}/${password}/${movie.movie_data.stream_id}.${movie.movie_data.container_extension}`, "video/mp4");
		};
	} else {
		await ajax("action=get_vod_info&vod_id=" + vod_id);
	}
}

function pageSeries() {
	document.querySelector(".search_container").style.visibility = "visible";
	document.querySelector(".search_input_action").value = "get_series";
	document.querySelector(".page_content").innerHTML = `
		<div class="channels_categories">
			<ul class="scroll_vertical hide_scrollbar media_categories_ul">
			</ul>
		</div>
		<div class="media_content">
			<ul class="scroll_vertical media_ul">
			</ul>
		</div>
	`;
}

function handleModalSerie() {
	let element = document.createElement("div");
	element.innerHTML = `
		<div class="modal_media_container">
			<div class="modal_media_box hide_scrollbar">
				<div class="modal_media_content">
					<div style="position: absolute; right: 50px; top: 10px;">
						<button type="button" name="button" class="modal_media_close close_modal_serie" onclick="hideModalContainer();">
							<i class="bx bx-x"></i>
						</button>
					</div>
					<div class="media_info">
						<div class="media_cover">
							<img src="" loading="eager" onerror="this.src='assets/images/not-available.png'">
							<span class="rate"></span>
						</div>
						<div class="media_description">
							<p class="title"></p>
							<p class="genre"></p>
							<p class="director"></p>
							<p class="cast"></p>
							<div class="media_resume">
								<p></p>
							</div>
							<button type="button" name="button" class="btn_favorite">
								<i class="bx bx-heart" ></i>
							</button>
						</div>
					</div>
					<div class="seasons_container">
						<div class="seasons_content">
							<ul class="seasons_ul hide_scrollbar scroll_horizon">
							</ul>
							<div class="carousel_section_generic_container">
								<div class="carousel_section_generic_content small box_episodes">
								</div>
							</div>
						</div>
					</div>
					<div class="arrows">
						<i class="bx bx-chevron-left left_scroll" ref=""></i>
						<i class="bx bx-chevron-right right_scroll" ref=""></i>
					</div>
				</div>
			</div>
		</div>
	`;
	document.querySelector(".page_content").append(element);
}

var serie_first_category_id = "";
function handleSeriesCategories() {
	let series_categories = localStorage.getItem("series_categories");
	if (series_categories) {
		series_categories = JSON.parse(series_categories);
		let element = "";
		for (let i = 0; i < series_categories.length; i++) {
			element += `
				<li>
					<a class="media_category_a" onclick="handleSeries(null, ${series_categories[i].category_id})" id="${series_categories[i].category_id}" href="javascript:void(0)">${series_categories[i].category_name}</a>
				</li>
			`;
		}
		document.querySelector(".media_categories_ul").innerHTML = element;
		serie_first_category_id = series_categories[0].category_id;
		handleSeries(null, serie_first_category_id);
	} else {
		ajax("action=get_series_categories");
	}
}

function handleSeries(series = null, category_id = null) {
	if (series) {
		let element = "";
		if (series.length) {
			if (series[0].category_id == serie_first_category_id) {
				localStorage.setItem("series_first_category", JSON.stringify(series));
			}
			for (let i = 0; i < series.length; i++) {
				element += `
					<li>
						<a onclick="(async function () { await handleModalSerie(); handleSerieInfo(null, ${series[i].series_id}); })();" href="javascript:void(0)">
							${poster(series[i].cover)}	
							<span class="name">${series[i].name}</span>
						</a>
					</li>
				`;
			}
			let media_category_a = document.querySelectorAll(".media_category_a");
			for (let i = 0; i < media_category_a.length; i++) {
				if (media_category_a[i].getAttribute("id") == series[0].category_id) {
					media_category_a[i].classList.add("active");
				} else {
					media_category_a[i].classList.remove("active");
				}
			}
		} else {
			element = `<li style="color: #fff;">Nenhuma série disponível nessa categoria</li>`;
		}
		document.querySelector(".media_ul").innerHTML = element;
	} else {
		if (category_id == serie_first_category_id) {
			let series_first_category = localStorage.getItem("series_first_category");
			if (series_first_category) {
				series_first_category = JSON.parse(series_first_category);
				handleSeries(series_first_category);
				return;
			}
		}
		ajax("action=get_series&category_id=" + category_id);
	}
}

async function handleSerieInfo(serie = null, series_id = null) {
	if (serie) {
		document.querySelector(".modal_media_container").style.opacity = "1";
		document.querySelector(".modal_media_container").style.display = "flex";
		document.querySelector(".modal_media_container").style.pointerEvents = null;
		document.querySelector(".modal_media_box").style.backgroundImage = (serie.info.cover ? `url(${changeHttp(serie.info.cover)}), ` : "") + "url(assets/images/not-available.png)";
		document.querySelector(".media_cover img").src = (serie.info.cover ? changeHttp(serie.info.cover) : "assets/images/not-available.png");
		document.querySelector(".media_cover .rate").innerHTML = "★ " + (serie.info.rating ? serie.info.rating : "N/A");
		document.querySelector(".media_description .title").innerHTML = serie.info.name ? serie.info.name : "";
		document.querySelector(".media_description .genre").innerHTML = (serie.info.genre ? serie.info.genre : "") + " | " + (serie.info.duration ? serie.info.duration : "");
		document.querySelector(".media_description .director").innerHTML = "Diretor: " + (serie.info.director ? serie.info.director : "");
		document.querySelector(".media_description .cast").innerHTML = "Elenco: " + (serie.info.cast ? serie.info.cast : "");
		if (serie.info.plot) {
			document.querySelector(".media_resume").style.display = "block";
			document.querySelector(".media_resume p").innerHTML = serie.info.plot;
		} else {
			document.querySelector(".media_resume").style.display = "none";
		}
		if (serie.episodes) {
			let first = true;
			let seasons_ul = "";
			let box_episodes = "";
			for (let [id, seasons] of Object.entries(serie.episodes)) {
				seasons_ul += `
					<li class="seasons_li">
						<p class="title">
							<a href="javascript:void(0)" onclick="handleChangeSeason(${id})" id="${id}" class="li_season ${first ? "active" : ""}">Temporada ${id}</a>
						</p>
					</li>
				`;
				box_episodes += `
					<ul class="hide_scrollbar scroll_horizon episodes_ul" id="${id}" style="padding-left: 5px; display: ${first ? "flex" : "none"};">
				`;
				for (episode of Object.values(seasons)) {
					box_episodes += `
						<li>
							<a onclick="handleVideo('${DNS}/series/${username}/${password}/${episode.id}.${episode.container_extension}', 'video/mp4')" href="javascript:void(0)">
								${poster(episode.info.movie_image)}	
								<span class="name">${episode.title}</span>
							</a>
						</li>
					`;
				}
				box_episodes += "</ul>";
				first = false;
			}
			document.querySelector(".seasons_ul").innerHTML = seasons_ul;
			document.querySelector(".box_episodes").innerHTML = box_episodes;

			document.querySelector(".right_scroll").onclick = function () {
				let seasons_li = document.querySelector(`.seasons_li a[class="li_season active"]`).getAttribute("id");
				let episodes_ul = document.querySelector(`.episodes_ul[id="${seasons_li}"]`);
				let scroll_amount = 0;
				let interval = setInterval(function () {
					episodes_ul.scrollLeft += 50;
					scroll_amount += 50;
					if (scroll_amount >= 500) {
						window.clearInterval(interval);
					}
				}, 35);
			};
			document.querySelector(".left_scroll").onclick = function () {
				let seasons_li = document.querySelector(`.seasons_li a[class="li_season active"]`).getAttribute("id");
				let episodes_ul = document.querySelector(`.episodes_ul[id="${seasons_li}"]`);
				let scroll_amount = 0;
				let interval = setInterval(function () {
					episodes_ul.scrollLeft -= 50;
					scroll_amount += 50;
					if (scroll_amount >= 500) {
						window.clearInterval(interval);
					}
				}, 35);
			};
		}
	} else {
		await ajax("action=get_series_info&series_id=" + series_id);
	}
}

function handleChangeSeason(id) {
	let seasons_li_a = document.querySelectorAll(".seasons_li a");
	for (let i = 0; i < seasons_li_a.length; i++) {
		seasons_li_a[i].classList.remove("active");
	}
	document.querySelector(`.seasons_li a[id="${id}"]`).classList.add("active");
	let episodes_ul = document.querySelectorAll(".episodes_ul");
	for (let i = 0; i < episodes_ul.length; i++) {
		if (episodes_ul[i].getAttribute("id") == id) {
			episodes_ul[i].style.display = "flex";
		} else {
			episodes_ul[i].style.display = "none";
		}
	}
}

function pageFavorites() {
	document.querySelector(".page_content").innerHTML = `
		<div class="favorites_container">
			<div class="carousel_section_generic_container lives" style="display: none;">
				<div class="carousel_section_generic_content small">
					<div class="section_new_title carousel_section_generic_title">
						<p>Canais Favoritos</p>
						<div class="container_arrows">
							<img src="assets/icons/icon-left.svg"  class="btn_left_scroll" ref="1"></img>
							<img src="assets/icons/icon-right.svg"  class="btn_right_scroll" ref="1"></img>
						</div>
					</div>
					<ul class="hide_scrollbar scroll_horizon lives_ul" id="1">
					</ul>
				</div>
			</div>
			<div class="carousel_section_generic_container movies" style="display: none;">
				<div class="carousel_section_generic_content small">
					<div class="section_new_title carousel_section_generic_title">
						<p>Filmes Favoritos</p>
						<div class="container_arrows">
							<img src="assets/icons/icon-left.svg"  class="btn_left_scroll" ref="2"></img>
							<img src="assets/icons/icon-right.svg"  class="btn_right_scroll" ref="2"></img>
						</div>
					</div>
					<ul class="hide_scrollbar scroll_horizon movies_ul" id="2">
					</ul>
				</div>
			</div>
			<div class="carousel_section_generic_container series" style="display: none; margin-bottom: 10px;">
				<div class="carousel_section_generic_content small">
					<div class="section_new_title carousel_section_generic_title">
						<p>Séries Favoritas</p>
						<div class="container_arrows">
							<img src="assets/icons/icon-left.svg"  class="btn_left_scroll" ref="3"></img>
							<img src="assets/icons/icon-right.svg"  class="btn_right_scroll" ref="3"></img>
						</div>
					</div>
					<ul class="hide_scrollbar scroll_horizon series_ul" id="3">
					</ul>
				</div>
			</div>
		</div>
	`;
}

function handleFavorites() {
	document.querySelector(".carousel_section_generic_container.lives").style.display = "none";
	document.querySelector(".carousel_section_generic_container.movies").style.display = "none";
	document.querySelector(".carousel_section_generic_container.series").style.display = "none";
	let favorites = localStorage.getItem("favorites");
	if (favorites) {
		favorites = JSON.parse(favorites);
		let element = "";
		if (favorites.movies.length) {
			for (let i = 0; i < favorites.movies.length; i++) {
				element += `
					<li>
						<a onclick="(async function () { await handleModalVod(); handleVodInfo(null, ${favorites.movies[i].id}); })();" href="javascript:void(0)">
							${poster(favorites.movies[i].movie_image)}
							<span class="name">${favorites.movies[i].stream_display_name}</span>
						</a>
					</li>
				`;
			}
			document.querySelector(".carousel_section_generic_container.movies").style.display = "block";
		}
		document.querySelector(".movies_ul").innerHTML = element;
		element = "";
		if (favorites.series.length) {
			for (let i = 0; i < favorites.series.length; i++) {
				element += `
					<li>
						<a onclick="(async function () { await handleModalSerie(); handleSerieInfo(null, ${favorites.series[i].id}); })();" href="javascript:void(0)">
							${poster(favorites.series[i].cover)}
							<span class="name">${favorites.series[i].title}</span>
						</a>
					</li>
				`;
			}
			document.querySelector(".carousel_section_generic_container.series").style.display = "block";
		}
		document.querySelector(".series_ul").innerHTML = element;
		element = "";
		if (favorites.lives.length) {
			for (let i = 0; i < favorites.lives.length; i++) {
				element += `
					<li>
						<a onclick="(async function () { await handlePage('lives'); handleLiveInfo(null, ${favorites.lives[i].id}); watchLive('${DNS}/live/${username}/${password}/${favorites.lives[i].id}.m3u8'); })();" href="javascript:void(0)" class="live">
							${poster(favorites.lives[i].stream_icon)}	
							<span class="name">${favorites.lives[i].stream_display_name}</span>
						</a>
					</li>
				`;
			}
			document.querySelector(".carousel_section_generic_container.lives").style.display = "block";
		}
		document.querySelector(".lives_ul").innerHTML = element;
		btnScroll();
	} else {
		ajax("action=get_favorites");
	}
}

function storeFavorite(id, type) {
	ajax("action=store_favorite&" + type + "=" + id);
}

function deleteFavorite(id, type) {
	ajax("action=delete_favorite&" + type + "=" + id);
	if (document.querySelector(".favorites_container")) {
		let favorites = JSON.parse(localStorage.getItem("favorites"));
		switch (type) {
			case "vod_id":
				favorites.movies = favorites.movies.filter((item) => item.id != id);
				break;
			case "serie_id":
				favorites.series = favorites.series.filter((item) => item.id != id);
				break;
			default:
				break;
		}
		localStorage.setItem("favorites", JSON.stringify(favorites));
		handleFavorites();
	}
}

var player = null;
function handleVideo(link, type) {
	if (player) {
		player.dispose();
		player = null;
	}

	document.querySelector(".player_video_content").innerHTML = `<video id="my-player" class="video-js vjs-default-skin vjs-big-play-centered" style="width: 100%; height: 100%; border: 0px; outline: none; aspect-ratio: 16/9;" controls loop src=""></video>`;
	document.querySelector(".player_video_container").style.display = "flex";

	player = videojs("my-player", {
		controlBar: {
			children: [
				"playToggle",
				"volumePanel",
				"currentTimeDisplay",
				"progressControl",
				"durationDisplay",
				"subsCapsButton",
				"PictureInPictureToggle",
				"fullscreenToggle"
			],
			volumePanel: {
				inline: false
			}
		},
		language: "pt-BR",
		persistTextTrackSettings: true,
		html5: {
			nativeTextTracks: false
		},
		plugins: {
			hotkeys: {
				seekStep: 10,
				volumeStep: 0.05,
				enableModifiersForNumbers: false
			},
			seekButtons: {
				forward: 10,
				back: 10
			}
		},
	});

	player.src({
		type: type,
		src: link,
	});

	player.reloadSourceOnError({
		getSource: function (reload) {
			reload({
				type: type,
				src: link,
			});
		},
		errorInterval: 5,
	});

	let video_code = btoa(link.substring(Math.max(link.length - 16, 0), link.length));

	let timestamps = JSON.parse(localStorage.getItem("Timestamps"));
	if (timestamps == null) {
		timestamps = new Object();
	}

	player.ready(function () {
		let initValue = timestamps[video_code];
		if (initValue) {
			player.currentTime(initValue);
		}

		let volume = localStorage.getItem("Volume");
		if (volume) {
			player.volume(volume * 0.01);
		}

		player.autoplay(true);
		player.play();

		keep_watching(link, timestamps[video_code]);

		let lastSeconds = null;
		let lastSecondsTwo = null;
		player.on("timeupdate", function () {
			let seconds = Math.floor(player.currentTime());
			if ((seconds % 5) == 0 && seconds != lastSeconds) {
				lastSeconds = seconds;
				timestamps[video_code] = seconds;
				localStorage.setItem("Timestamps", JSON.stringify(timestamps));
			}
			if ((seconds % 30) == 0 && seconds != lastSecondsTwo) {
				lastSecondsTwo = seconds;
				keep_watching(link, seconds);
			}
		});

		player.on("volumechange", function () {
			localStorage.setItem("Volume", Math.floor(player.volume() * 100));
		});

		timeHidePlayerButtons = 3;

		try {
			if (link.includes("/movie/")) {
				let title = document.querySelector(".media_description .title").textContent;
				document.querySelector(".title_media").innerHTML = "<h2>" + title + "</h2>";
			} else if (link.includes("/series/")) {
				let episodes = document.querySelectorAll(".episodes_ul li a");

				for (let i = 0; i < episodes.length; i++) {
					if (episodes[i].getAttribute("onclick").includes(link)) {
						episodes[i].classList.add("active-border");
						episodes[i].scrollIntoView();

						let title = episodes[i].querySelector("span").textContent;
						document.querySelector(".title_media").innerHTML = "<h2>" + title + "</h2>";

						handleChangeSeason(episodes[i].parentNode.parentNode.getAttribute("id"));

						let prev_episode = episodes[i - 1];
						let next_episode = episodes[i + 1];

						if (prev_episode) {
							let player_video_prev = document.querySelector(".player_video_prev");
							player_video_prev.onclick = function () {
								if (player) {
									player.dispose();
									player = null;
								}
								prev_episode.click();
							};
						}
						if (next_episode) {
							let player_video_next = document.querySelector(".player_video_next");
							player_video_next.onclick = function () {
								if (player) {
									player.dispose();
									player = null;
								}
								timestamps[video_code] = 0;
								next_episode.click();
							};
						}
					} else {
						episodes[i].classList.remove("active-border");
					}
				}
			}
		} catch (error) {
			console.log(error);
		}
	});
}

function keep_watching(src, time) {
	try {
		if (time > 60) {
			let id = src.replace(/^.*[\\\/]/, "").split(".")[0];
			ajax("action=keep_watching&id=" + id + "&time=" + time, false);
		}
	} catch (error) {
		console.log(error);
	}
}

function playerButtons(visibility) {
	document.querySelector(".player_video_close").style.visibility = visibility;
	document.querySelector(".player_video_prev").style.visibility = visibility;
	document.querySelector(".player_video_next").style.visibility = visibility;
	document.querySelector(".title_media").style.visibility = visibility;
}

let timeHidePlayerButtons = 3;
setInterval(function () {
	if (player && !player.paused()) {
		timeHidePlayerButtons--;
	}
	if (timeHidePlayerButtons <= 0) {
		playerButtons("hidden");
	}
}, 1000);

document.querySelector(".player_video_container").onkeydown = function () {
	playerButtons("visible");
	timeHidePlayerButtons = 3;
};

document.querySelector(".player_video_container").onmousemove = function () {
	playerButtons("visible");
	timeHidePlayerButtons = 3;
};

document.querySelector(".player_video_container").onclick = function () {
	playerButtons("visible");
	timeHidePlayerButtons = 3;
};

document.querySelector(".player_video_close").onclick = function () {
	document.querySelector(".player_video_container").style.display = "none";
	document.querySelector(".player_video_content").innerHTML = "";
	if (player) {
		player.dispose();
		player = null;
	}
};

document.onclick = function (e) {
	if (e.target.classList.value == "modal_media_container") {
		hideModalContainer();
	}
};

function hideModalContainer() {
	let element = document.querySelector(".modal_media_container");
	element.style.opacity = "0";
	element.style.pointerEvents = "none";
	setTimeout(function () {
		element.style.display = "none";
		element.parentElement.remove();
	}, 500);
}

const DNS = "https://lmtv.me";
const API_BASE = "http://player.limetv.me/player_api.php?";

function corsProxy(url) {
	return "https://corsproxy.io/?url=" + encodeURIComponent(url);
}

localStorage.removeItem("home");
localStorage.removeItem("avatar");
localStorage.removeItem("favorites");
localStorage.removeItem("vod_categories");
localStorage.removeItem("live_categories");
localStorage.removeItem("series_categories");
localStorage.removeItem("vods_first_category");
localStorage.removeItem("lives_first_category");
localStorage.removeItem("series_first_category");

var avatar = "";
var username = "";
var password = "";

let forms = document.querySelectorAll("form");
if (forms.length) {
	for (let i = 0; i < forms.length; i++) {
		forms[i].onsubmit = function (e) {
			e.preventDefault();
			ajax(serialize(e.target));
		};
	}
}

btn();
login();

let user_info = JSON.parse(localStorage.getItem("user_info"));
if (user_info && user_info.username && user_info.password) {
	loading(true);
	let xhr = new XMLHttpRequest();
	xhr.onload = function () {
		if (xhr.readyState === 4) {
			loading(false);
			try {
				let parsed = JSON.parse(xhr.response);
				if (typeof parsed.setItem !== "undefined") {
					for (let [key, value] of Object.entries(parsed.setItem)) {
						localStorage.setItem(key, value);
					}
				}
				login();
				btn();
				scroll();
			} catch (error) {
				console.error(error);
				loading(false);
			}
		}
	};
	xhr.onerror = function () {
		console.error(xhr.statusText);
		loading(false);
	};
	let query = `username=${user_info.username}&password=${user_info.password}`;
	xhr.open("GET", corsProxy(API_BASE + query), true);
	xhr.send();
}