function serialize(target) {
	let serialized = [];

	for (element of target.elements) {
		if (element.name === "") {
			continue;
		}

		switch (element.nodeName) {
			case "INPUT":
				switch (element.type) {
					case "text":
					case "hidden":
					case "password":
					case "button":
						serialized.push(element.name + "=" + encodeURIComponent(element.value));
						break;
				}
				break;
			case "BUTTON":
				switch (element.type) {
					case "submit":
					case "button":
						serialized.push(element.name + "=" + encodeURIComponent(element.value));
						break;
				}
				break;
		}
	}

	return serialized.join("&");
}

function ajax(query, show_loading = true) {
	if (show_loading) {
		loading(true);
	}

	if (!query.includes("username=") || !query.includes("password=")) {
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
						for ([key, value] of Object.entries(parsed.display)) {
							document.querySelector(key).style.display = value;
						}
					}
					if (typeof parsed.setItem !== "undefined") {
						for ([key, value] of Object.entries(parsed.setItem)) {
							localStorage.setItem(key, value);
						}
					}
					if (typeof parsed.innerHTML !== "undefined") {
						for ([key, value] of Object.entries(parsed.innerHTML)) {
							document.querySelector(key).innerHTML = value;
						}
					}
					if (typeof parsed.callFunction !== "undefined") {
						for ([key, value] of Object.entries(parsed.callFunction)) {
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
	for (j_btn of document.querySelectorAll(".j_btn")) {
		let j_btn_clone = j_btn.cloneNode(true);
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
					document.querySelector(".profile_container").style.display = "none";

					localStorage.removeItem("favorites");
					localStorage.removeItem("avatar");
					localStorage.removeItem("home");

					login();
					break;
				}
				case "exit": {
					document.querySelector(".profile_container").style.display = "none";

					localStorage.clear();

					login();
					break;
				}
				default:
					break;
			}
		};
		j_btn.parentNode.replaceChild(j_btn_clone, j_btn);
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


function loading(display = true) {
	let loading = document.querySelector(".loading");
	if (display) {
		loading.style.display = "flex";
	} else {
		loading.style.display = "none";
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

				for (avatar_name of document.querySelectorAll(".avatar_name")) {
					avatar_name.innerHTML = avatar.avatar_name;
				}

				document.querySelector(".avatar_container").style.backgroundColor = avatar.color;
			} else {
				document.querySelector("#Login").style.display = "none";
				document.querySelector("#Avatar").style.display = "flex";
				document.querySelector("#Player").style.display = "none";

				let avatar_element = "";
				let avatar_manager_element = "";

				let i = 0;
				for (avatar of userInfo.avatars) {
					if (avatar.id) {
						let color = `hsl(${(i++ % 18) * 20}, 100%, 50%)`;
						avatar_element += `
							<li>
								<a class="j_btn" _action="handleAvatar" _color="${color}" id="${avatar.id}" style="background-color: ${color};">
									<img src="assets/images/face-user.png">
								</a>
								<span>${avatar.avatar_name}</span>
							</li>
						`;
						avatar_manager_element += `
							<li>
								<a class="j_btn" _action="deleteAvatar" id="${avatar.id}" style="background-color: ${color};">
									<div class="bg_edit">
										<img src="assets/icons/icon-trash.svg">
									</div>
									<img src="assets/images/face-user.png">
								</a>
								<span>${avatar.avatar_name}</span>
							</li>
						`;
					}
				}

				avatar_element += `
					<li>
						<a onclick="document.querySelector('.users_modal_container').style.display = 'flex';">
							<img style="filter: invert(.8); width: 80px;" src="assets/icons/icon-plus-circle.svg">
						</a>
						<span>Adicionar perfil</span>
					</li>
				`;

				document.querySelector(".avatar_list").innerHTML = avatar_element;
				document.querySelector(".avatar_list_manager").innerHTML = avatar_manager_element;

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
	document.querySelectorAll("img.btn_right_scroll").forEach(function (element) {
		element.onclick = function () {
			let scrollAmount = 0;
			let ref = element.getAttribute("ref");
			let scroll_horizon = document.querySelector(`.scroll_horizon[id="${ref}"]`);
			let interval = setInterval(function () {
				scrollAmount += 40;
				scroll_horizon.scrollLeft += 40;
				if (scrollAmount >= 400) {
					window.clearInterval(interval);
				}
			}, 25);
		};
	});
	document.querySelectorAll("img.btn_left_scroll").forEach(function (element) {
		element.onclick = function () {
			let scrollAmount = 0;
			let ref = element.getAttribute("ref");
			let scroll_horizon = document.querySelector(`.scroll_horizon[id="${ref}"]`);
			let interval = setInterval(function () {
				scrollAmount += 40;
				scroll_horizon.scrollLeft -= 40;
				if (scrollAmount >= 400) {
					window.clearInterval(interval);
				}
			}, 25);
		};
	});
}

function handlePage(type) {
	document.querySelector(".search_container").style.visibility = "hidden";
	document.querySelector(".search_input_action").value = "";
	document.querySelector(".search_input_search").value = "";

	for (menu_content_a of document.querySelectorAll(".menu_content a")) {
		menu_content_a.classList.remove("active");
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
			handleVodCategories();
			break;
		case "series":
			pageSeries();
			handleSeriesCategories();
			break;
		case "favorites":
			pageFavorites();
			handleFavorites();
			break;
		case "home":
			pageHome();
			handleHome();
			break;
		default:
			break;
	}

	scroll();
}

function pageHome() {
	localStorage.removeItem("home");
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

function urlPoster(src) {
	if (src) {
		src = `url(${changeHttp(src)}), `;
	}
	return src + "url(assets/images/not-available.png)";
}

function imgPoster(src) {
	if (src) {
		return changeHttp(src);
	} else {
		return "assets/images/not-available.png";
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
		for (keepWatching of home.keepWatching) {
			let image = "";
			let title = "";
			let action = "";

			if (keepWatching.serie_id) {
				action = `openSeries(${keepWatching.serie_id}, ${keepWatching.stream_id}, '${keepWatching.target_container}', ${keepWatching.time});`;
				image = keepWatching.cover;
				title = keepWatching.title;
			} else {
				action = `openVod(${keepWatching.stream_id}, '${keepWatching.target_container}', ${keepWatching.time});`;
				image = keepWatching.movie_image;
				title = keepWatching.stream_display_name;
			}

			element += `
				<li>
					<a onclick="${action}">
						${poster(image)}
						<span class="name">${title}</span>
					</a>
				</li>
			`;
		}

		document.querySelector(".keep_watching_ul").innerHTML = element;
		element = "";

		for ([i, homeTop] of home.top.entries()) {
			if (homeTop.stream_id) {
				element += `
					<li>
						<a class="top_li" onclick="handleVodModalAndInfo(null, ${homeTop.stream_id});">
							${poster(homeTop.movie_image)}
							<span class="position_number">${(i + 1)}</span>
							<span class="name">${homeTop.stream_display_name}</span>
						</a>
					</li>
				`;
			} else {
				element += `
					<li>
						<a class="top_li" onclick="handleSerieModalAndInfo(null, ${homeTop.serie_id});">
							${poster(homeTop.cover)}
							<span class="position_number">${(i + 1)}</span>
							<span class="name">${homeTop.title}</span>
						</a>
					</li>
				`;
			}
		}

		document.querySelector(".top_ul").innerHTML = element;
		element = "";

		for (moviesAdded of home.moviesAdded) {
			element += `
				<li>
					<a onclick="handleVodModalAndInfo(null, ${moviesAdded.id});">
						${poster(moviesAdded.movie_image)}
						<span class="name">${moviesAdded.stream_display_name}</span>
					</a>
				</li>
			`;
		}

		document.querySelector(".movies_added_ul").innerHTML = element;
		element = "";

		for (seriesAdded of home.seriesAdded) {
			element += `
				<li>
					<a onclick="handleSerieModalAndInfo(null, ${seriesAdded.id});">
						${poster(seriesAdded.cover)}
						<span class="name">${seriesAdded.title}</span>
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
	localStorage.removeItem("live_categories");
	document.querySelector(".search_container").style.visibility = "visible";
	document.querySelector(".search_input_action").value = "get_live_streams";
	document.querySelector(".page_content").innerHTML = `
		<div class="channels_categories">
			<ul class="hide_scrollbar media_categories_ul">
			</ul>
		</div>
		<div class="channels_list">
			<ul class="hide_scrollbar channels_ul">
			</ul>
		</div>
		<div class="channels_view_container">
			<div class="channels_view_content">
			</div>
			<button style="margin: 10px 0px; float: right;" type="button" name="button" class="btn_favorite">
			</button>
			<ul class="epg_ul">
			</ul>
		</div>
	`;
}

function handleLivesCategories() {
	let live_categories = localStorage.getItem("live_categories");
	if (live_categories) {
		live_categories = JSON.parse(live_categories);

		let element = `
			<li>
				<a class="media_category_a" onclick="handleLives(null, 0)" id="0">TODOS OS CANAIS</a>
			</li>
		`;

		for (live_category of live_categories) {
			element += `
				<li>
					<a class="media_category_a" onclick="handleLives(null, ${live_category.category_id})" id="${live_category.category_id}">${live_category.category_name}</a>
				</li>
			`;
		}

		document.querySelector(".media_categories_ul").innerHTML = element;
		handleLives(null, live_categories[0].category_id);
	} else {
		ajax("action=get_live_categories");
	}
}

function handleLives(lives = null, category_id = null) {
	if (lives) {
		let element = "";

		if (lives.length) {
			for (live of lives) {
				element += `
					<li>
						<a onclick="openLive(${live.stream_id});" id="${live.stream_id}">
							${poster(live.stream_icon)}
							<span>${live.name}</span>
						</a>
					</li>
				`;
			}

			for (media_category_a of document.querySelectorAll(".media_category_a")) {
				if (media_category_a.getAttribute("id") == category_id_selected) {
					media_category_a.classList.add("active");
				} else {
					media_category_a.classList.remove("active");
				}
			}
		} else {
			element = `<li style="color: #fff;">Nenhum canal disponível nessa categoria</li>`;
		}

		document.querySelector(".channels_ul").innerHTML = element;
	} else {
		category_id_selected = category_id;
		ajax("action=get_live_streams&category_id=" + category_id);
	}
}

async function openLive(stream_id) {
	await handleLiveInfo(null, stream_id);
	watchLive(`${DNS}/live/${username}/${password}/${stream_id}.m3u8`);
}

async function handleAndOpenLive(live_id) {
	handlePage("lives");
	await openLive(live_id);
}

function handleLiveInfo(live_info = null, stream_id = null) {
	if (live_info) {
		let element = "";

		if (live_info.epg_listings.length) {
			for (epg_listing of live_info.epg_listings) {
				let start = new Date(parseInt(epg_listing.start_timestamp) * 1000);
				let end = new Date(parseInt(epg_listing.stop_timestamp) * 1000);

				element += `
					<li>
						<p class="title">
							<span class="time">
								${start.getHours()}:${start.getMinutes()} - ${end.getHours()}:${end.getMinutes()}
							</span> |  ${decodeURIComponent(escape(window.atob(epg_listing.title)))}
						</p>
						<p class="description">
							${decodeURIComponent(escape(window.atob(epg_listing.description)))}
						</p>
					</li>
				`;
			}

		}
		document.querySelector(".epg_ul").innerHTML = element;
	} else {
		for (channels_list_a of document.querySelectorAll(".channels_list a")) {
			if (channels_list_a.getAttribute("id") == stream_id) {
				channels_list_a.classList.add("active");
			} else {
				channels_list_a.classList.remove("active");
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
		userActions: {
			doubleClick: false
		},
		language: "pt-BR",
		persistTextTrackSettings: true,
		html5: {
			vhs: {
				overrideNative: true
			},
			nativeTextTracks: false,
			nativeAudioTracks: false,
			nativeVideoTracks: false
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
	localStorage.removeItem("vod_categories");
	document.querySelector(".search_container").style.visibility = "visible";
	document.querySelector(".search_input_action").value = "get_vod_streams";
	document.querySelector(".page_content").innerHTML = `
		<div class="channels_categories">
			<ul class="hide_scrollbar media_categories_ul">
			</ul>
		</div>
		<div class="media_content">
			<ul class="media_ul">
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
							<p class="time"></p>
							<p class="director"></p>
							<p class="cast"></p>
							<div class="media_resume">
								<p></p>
							</div>
							<button type="button" name="button" class="btn_watch">
								<span><img src="assets/icons/icon-google-play.svg">Assistir</span>
							</button>
							<button type="button" name="button" class="btn_favorite" style="margin-left: 15px;">
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

function handleVodCategories() {
	let vod_categories = localStorage.getItem("vod_categories");
	if (vod_categories) {
		vod_categories = JSON.parse(vod_categories);

		let element = `
			<li>
				<a class="media_category_a" onclick="handleVods(null, 0)" id="0">TODOS OS FILMES</a>
			</li>
		`;

		for (vod_category of vod_categories) {
			element += `
				<li>
					<a class="media_category_a" onclick="handleVods(null, ${vod_category.category_id})" id="${vod_category.category_id}">${vod_category.category_name}</a>
				</li>
			`;
		}

		document.querySelector(".media_categories_ul").innerHTML = element;
		handleVods(null, vod_categories[0].category_id);
	} else {
		ajax("action=get_vod_categories");
	}
}

function handleVods(vods = null, category_id = null) {
	if (vods) {
		let element = "";

		if (vods.length) {
			for (vod of vods) {
				element += `
					<li>
						<a onclick="handleVodModalAndInfo(null, ${vod.stream_id});">
							${poster(vod.stream_icon)}	
							<span class="name">${vod.name}</span>
						</a>
					</li>
				`;
			}

			for (media_category_a of document.querySelectorAll(".media_category_a")) {
				if (media_category_a.getAttribute("id") == category_id_selected) {
					media_category_a.classList.add("active");
				} else {
					media_category_a.classList.remove("active");
				}
			}
		} else {
			element = `<li style="color: #fff;">Nenhum filme disponível nessa categoria</li>`;
		}

		document.querySelector(".media_ul").innerHTML = element;
	} else {
		category_id_selected = category_id;
		ajax("action=get_vod_streams&category_id=" + category_id);
	}
}

async function openVod(stream_id, target_container, time) {
	await handleVodModalAndInfo(null, stream_id);
	watchVideo(`${DNS}/movie/${username}/${password}/${stream_id}.${target_container}`, stream_id, time);
}

async function handleVodModalAndInfo(movie = null, vod_id = null) {
	handleModalVod();
	await handleVodInfo(movie, vod_id);
}

async function handleVodInfo(movie = null, vod_id = null) {
	if (movie) {
		document.querySelector(".modal_media_container").style.opacity = "1";
		document.querySelector(".modal_media_container").style.display = "flex";
		document.querySelector(".modal_media_container").style.pointerEvents = null;

		document.querySelector(".media_cover img").src = imgPoster(movie.info.movie_image);
		document.querySelector(".modal_media_box").style.backgroundImage = urlPoster(movie.info.movie_image);
		document.querySelector(".media_cover .rate").innerHTML = "★ " + (movie.info.rating ? movie.info.rating : "N/A");

		document.querySelector(".media_description .title").innerHTML = movie.movie_data.name ? movie.movie_data.name : movie.info.name;
		document.querySelector(".media_description .genre").innerHTML = movie.info.genre ? movie.info.genre : "";
		document.querySelector(".media_description .time").innerHTML = "Duração: " + (movie.info.duration ? movie.info.duration : "");
		document.querySelector(".media_description .director").innerHTML = "Diretor: " + (movie.info.director ? movie.info.director : "");
		document.querySelector(".media_description .cast").innerHTML = "Elenco: " + (movie.info.cast ? movie.info.cast : "");

		if (movie.info.plot) {
			document.querySelector(".media_resume").style.display = "block";
			document.querySelector(".media_resume p").innerHTML = movie.info.plot;
		} else {
			document.querySelector(".media_resume").style.display = "none";
		}

		document.querySelector(".btn_watch").onclick = function () {
			watchVideo(`${DNS}/movie/${username}/${password}/${movie.movie_data.stream_id}.${movie.movie_data.container_extension}`, movie.movie_data.stream_id);
		};
	} else {
		await ajax("action=get_vod_info&vod_id=" + vod_id);
	}
}

function pageSeries() {
	localStorage.removeItem("series_categories");
	document.querySelector(".search_container").style.visibility = "visible";
	document.querySelector(".search_input_action").value = "get_series";
	document.querySelector(".page_content").innerHTML = `
		<div class="channels_categories">
			<ul class="hide_scrollbar media_categories_ul">
			</ul>
		</div>
		<div class="media_content">
			<ul class="media_ul">
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

function handleSeriesCategories() {
	let series_categories = localStorage.getItem("series_categories");
	if (series_categories) {
		series_categories = JSON.parse(series_categories);

		let element = `
			<li>
				<a class="media_category_a" onclick="handleSeries(null, 0)" id="0">TODAS AS SÉRIES</a>
			</li>
		`;

		for (series_category of series_categories) {
			element += `
				<li>
					<a class="media_category_a" onclick="handleSeries(null, ${series_category.category_id})" id="${series_category.category_id}">${series_category.category_name}</a>
				</li>
			`;
		}

		document.querySelector(".media_categories_ul").innerHTML = element;
		handleSeries(null, series_categories[0].category_id);
	} else {
		ajax("action=get_series_categories");
	}
}

function handleSeries(series = null, category_id = null) {
	if (series) {
		let element = "";

		if (series.length) {
			for (serie of series) {
				element += `
					<li>
						<a onclick="handleSerieModalAndInfo(null, ${serie.series_id});">
							${poster(serie.cover)}	
							<span class="name">${serie.name}</span>
						</a>
					</li>
				`;
			}

			for (media_category_a of document.querySelectorAll(".media_category_a")) {
				if (media_category_a.getAttribute("id") == category_id_selected) {
					media_category_a.classList.add("active");
				} else {
					media_category_a.classList.remove("active");
				}
			}
		} else {
			element = `<li style="color: #fff;">Nenhuma série disponível nessa categoria</li>`;
		}

		document.querySelector(".media_ul").innerHTML = element;
	} else {
		category_id_selected = category_id;
		ajax("action=get_series&category_id=" + category_id);
	}
}

async function openSeries(series_id, stream_id, target_container, time) {
	await handleSerieModalAndInfo(null, series_id);
	watchVideo(`${DNS}/series/${username}/${password}/${stream_id}.${target_container}`, stream_id, time);
}

async function handleSerieModalAndInfo(serie = null, series_id = null) {
	handleModalSerie();
	await handleSerieInfo(serie, series_id);
}

async function handleSerieInfo(serie = null, series_id = null) {
	if (serie) {
		document.querySelector(".modal_media_container").style.opacity = "1";
		document.querySelector(".modal_media_container").style.display = "flex";
		document.querySelector(".modal_media_container").style.pointerEvents = null;

		document.querySelector(".media_cover img").src = imgPoster(serie.info.cover);
		document.querySelector(".modal_media_box").style.backgroundImage = urlPoster(serie.info.cover);
		document.querySelector(".media_cover .rate").innerHTML = "★ " + (serie.info.rating ? serie.info.rating : "N/A");

		document.querySelector(".media_description .title").innerHTML = serie.info.name ? serie.info.name : "";
		document.querySelector(".media_description .genre").innerHTML = serie.info.genre ? serie.info.genre : "";
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

			for ([id, seasons] of Object.entries(serie.episodes)) {
				seasons_ul += `
					<li class="seasons_li">
						<p class="title">
							<a onclick="handleChangeSeason(${id})" id="${id}" class="li_season ${first ? "active" : ""}">Temporada ${id}</a>
						</p>
					</li>
				`;

				box_episodes += `<ul class="hide_scrollbar scroll_horizon episodes_ul" id="${id}" style="padding-left: 5px; display: ${first ? "flex" : "none"};">`;
				for (episode of Object.values(seasons)) {
					box_episodes += `
						<li>
							<a onclick="watchVideo('${DNS}/series/${username}/${password}/${episode.id}.${episode.container_extension}', ${episode.id});">
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
					episodes_ul.scrollLeft += 40;
					scroll_amount += 40;
					if (scroll_amount >= 400) {
						window.clearInterval(interval);
					}
				}, 25);
			};
			document.querySelector(".left_scroll").onclick = function () {
				let seasons_li = document.querySelector(`.seasons_li a[class="li_season active"]`).getAttribute("id");
				let episodes_ul = document.querySelector(`.episodes_ul[id="${seasons_li}"]`);
				let scroll_amount = 0;
				let interval = setInterval(function () {
					episodes_ul.scrollLeft -= 40;
					scroll_amount += 40;
					if (scroll_amount >= 400) {
						window.clearInterval(interval);
					}
				}, 25);
			};
		}
	} else {
		await ajax("action=get_series_info&series_id=" + series_id);
	}
}

function handleChangeSeason(id) {
	for (seasons_li_a of document.querySelectorAll(".seasons_li a")) {
		seasons_li_a.classList.remove("active");
	}
	document.querySelector(`.seasons_li a[id="${id}"]`).classList.add("active");

	for (episodes_ul of document.querySelectorAll(".episodes_ul")) {
		if (episodes_ul.getAttribute("id") == id) {
			episodes_ul.style.display = "flex";
		} else {
			episodes_ul.style.display = "none";
		}
	}
}

function pageFavorites() {
	localStorage.removeItem("favorites");
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
			for (movie of favorites.movies) {
				element += `
					<li>
						<a onclick="handleVodModalAndInfo(null, ${movie.id});">
							${poster(movie.movie_image)}
							<span class="name">${movie.stream_display_name}</span>
						</a>
					</li>
				`;
			}
			document.querySelector(".carousel_section_generic_container.movies").style.display = "block";
		}

		document.querySelector(".movies_ul").innerHTML = element;
		element = "";

		if (favorites.series.length) {
			for (serie of favorites.series) {
				element += `
					<li>
						<a onclick="handleSerieModalAndInfo(null, ${serie.id});">
							${poster(serie.cover)}
							<span class="name">${serie.title}</span>
						</a>
					</li>
				`;
			}
			document.querySelector(".carousel_section_generic_container.series").style.display = "block";
		}

		document.querySelector(".series_ul").innerHTML = element;
		element = "";

		if (favorites.lives.length) {
			for (live of favorites.lives) {
				element += `
					<li>
						<a onclick="handleAndOpenLive(${live.id});" class="live">
							${poster(live.stream_icon)}	
							<span class="name">${live.stream_display_name}</span>
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

async function deleteFavorite(id, type) {
	await ajax("action=delete_favorite&" + type + "=" + id);

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
function watchVideo(link, id, time = 0) {
	if (player) {
		player.dispose();
		player = null;
	}

	if (time == 0) {
		let home = JSON.parse(localStorage.getItem("home"));
		for (keepWatching of home.keepWatching) {
			if (keepWatching.stream_id == id) {
				time = keepWatching.time;
				break;
			}
		}
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
		userActions: {
			doubleClick: false
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

	player.controlBar.fullscreenToggle.handleClick = function (e) {
		document.fullscreenElement != null ? document.exitFullscreen() : document.documentElement.requestFullscreen();
	};

	player.src(link);

	player.reloadSourceOnError({
		getSource: function (reload) {
			reload(link);
		},
		errorInterval: 5,
	});

	player.ready(function () {
		player.currentTime(time);

		let volume = localStorage.getItem("Volume");
		if (volume) {
			player.volume(volume * 0.01);
		}

		player.autoplay(true);
		player.play();

		let lastSeconds = null;
		player.on("timeupdate", function () {
			let seconds = Math.floor(player.currentTime());
			if ((seconds % 10) == 0 && seconds != lastSeconds) {
				lastSeconds = seconds;
				sendKeepWatching(id, seconds);
			}
		});

		player.on("volumechange", function () {
			localStorage.setItem("Volume", Math.floor(player.volume() * 100));
		});

		timeHidePlayerButtons = 3;

		let player_video_prev = document.querySelector(".player_video_prev");
		let player_video_next = document.querySelector(".player_video_next");
		player_video_prev.style.display = "none";
		player_video_next.style.display = "none";

		if (link.includes("/movie/")) {
			let title = document.querySelector(".media_description .title").textContent;
			document.querySelector(".title_media").innerHTML = "<h2>" + title + "</h2>";
		} else {
			let episodes = document.querySelectorAll(".episodes_ul li a");
			for ([i, episode] of episodes.entries()) {
				if (episode.getAttribute("onclick").includes(link)) {
					episode.classList.add("active-border");
					episode.scrollIntoView(true);

					let title = episode.querySelector("span").textContent;
					document.querySelector(".title_media").innerHTML = "<h2>" + title + "</h2>";

					handleChangeSeason(episode.parentNode.parentNode.getAttribute("id"));

					let prev_episode = episodes[i - 1];
					let next_episode = episodes[i + 1];

					if (prev_episode) {
						player_video_prev.style.display = "block";
						player_video_prev.onclick = function () {
							if (player) {
								player.dispose();
								player = null;
							}
							prev_episode.click();
						};
					}
					if (next_episode) {
						player_video_next.style.display = "block";
						player_video_next.onclick = function () {
							if (player) {
								player.dispose();
								player = null;
							}
							next_episode.click();
						};
					}
				} else {
					episode.classList.remove("active-border");
				}
			}
		}
	});
}

function sendKeepWatching(id, time) {
	if (time > 30) {
		ajax(`action=keep_watching&id=${id}&time=${time}`, false);
	}
}

function playerButtons(opacity) {
	document.querySelector(".player_video_close").style.opacity = opacity;
	document.querySelector(".player_video_prev").style.opacity = opacity;
	document.querySelector(".player_video_next").style.opacity = opacity;
	document.querySelector(".title_media").style.opacity = opacity;
}

let timeHidePlayerButtons = 3;
setInterval(function () {
	if (player && !player.paused()) {
		timeHidePlayerButtons--;
	}
	if (timeHidePlayerButtons <= 0) {
		playerButtons("0");
	}
}, 1000);

document.querySelector(".player_video_container").onkeydown = function () {
	playerButtons("1");
	timeHidePlayerButtons = 3;
};

document.querySelector(".player_video_container").onmousemove = function () {
	playerButtons("1");
	timeHidePlayerButtons = 3;
};

document.querySelector(".player_video_container").onclick = function () {
	playerButtons("1");
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

let category_id_selected = 0;

const DNS = "https://lmtv.me";
const API_BASE = "http://player.limetv.me/player_api.php?";

function corsProxy(url) {
	return `https://host.autergame.me:2083/proxy/${url}`;
}

videojs.Vhs.xhr.beforeRequest = function (options) {
	if (!options.uri.includes("https")) {
		options.uri = corsProxy(options.uri);
	}
	return options;
};

var avatar = "";
var username = "";
var password = "";

for (form of document.querySelectorAll("form")) {
	form.onsubmit = function (e) {
		e.preventDefault();
		ajax(serialize(e.target));
	};
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
					for ([key, value] of Object.entries(parsed.setItem)) {
						localStorage.setItem(key, value);
					}
				}

				login();
				btn();
				scroll();
				handlePage("home");
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