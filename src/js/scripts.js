async function login(container, event) {
	event.preventDefault();

	let form = document.querySelector(container + " form");
	if (!form.checkValidity()) {
		return;
	}

	loading(true);

	let server = form.querySelector(".server").value;
	let username = form.querySelector(".username").value;
	let password = form.querySelector(".password").value;

	let data = {
		//type: "XtreamCodes",
		server: server,
		username: username,
		password: password
	};

	let init = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
		mode: "cors",
	};

	try {
		let request = await fetch(API + "login", init);
		if (!request.ok) {
			loading(false);
			trigger("login - " + request.status + ": " + request.statusText, "error");
			return;
		}

		let response = await request.text();

		loading(false);

		await createServer(form, response);
	} catch (error) {
		loading(false);
		trigger("Unable to connect to the server.", "error");
	}
}

async function request(query, valid, show_loading) {
	let servers = JSON.parse(localStorage.getItem("servers"));
	if (!servers) {
		return;
	}

	let server = localStorage.getItem("server");
	if (!server) {
		return;
	}

	server = servers[server];
	if (!server) {
		return;
	}

	if (show_loading) {
		loading(true);
	}

	let init = {
		method: "GET",
		headers: {
			Authorization: "Bearer " + server.auth_key,
		},
		mode: "cors",
	};

	try {
		let request = await fetch(API + query, init);
		if (!request.ok) {
			loading(false);
			trigger(query + " - " + request.status + ": " + request.statusText, "error");
			if (valid) {
				await valid_login();
			}
			return;
		}

		let response = await request.json();

		loading(false);
		return response;
	} catch (error) {
		loading(false);
		trigger("Unable to connect to the server.", "error");
	}
}

async function handleAvatar(id) {
	localStorage.setItem("avatar", id);

	await enterAvatar(id);
}

async function enterAvatar(id) {
	let avatars = JSON.parse(localStorage.getItem("avatars"));
	let avatar = avatars.findIndex((item) => item.id == id);

	document.querySelector("#Login").style.display = "none";
	document.querySelector("#Server").style.display = "none";
	document.querySelector("#Avatar").style.display = "none";
	document.querySelector("#Player").style.display = "flex";

	document.querySelector(".avatar_name").innerHTML = "Boas vindas, " + avatars[avatar].name;
	document.querySelector(".avatar_container").style.backgroundColor = `hsl(${(avatar % 18) * 20}, 100%, 50%)`;

	await handlePage("home");
}

async function createAvatar() {
	let name = document.querySelector("#Avatar form .name").value;

	await request("avatar/store/" + name, true, true);
	await valid_login();

	selectModalContainer("Avatar", false);
}

async function removeAvatar(id) {
	await request("avatar/remove/" + id, true, true);
	await valid_login();
}

async function changeAvatar() {
	localStorage.removeItem("avatar");

	await valid_login();
}

async function handleServer(id) {
	localStorage.setItem("server", id);

	await valid_login();
}

async function enterServer() {
	document.querySelector("#Login").style.display = "none";
	document.querySelector("#Server").style.display = "none";
	document.querySelector("#Avatar").style.display = "flex";
	document.querySelector("#Player").style.display = "none";
}

async function createServer(form, auth_key) {
	let server = form.querySelector(".server").value;
	let username = form.querySelector(".username").value;

	let data = {
		url: server,
		username: username,
		auth_key: auth_key,
	};

	let servers = localStorage.getItem("servers");
	if (!servers) {
		servers = [];
	} else {
		servers = JSON.parse(servers);
	}
	servers.push(data);

	localStorage.setItem("servers", JSON.stringify(servers));
	selectModalContainer('Server', false);

	await valid_login();
}

async function removeServer(id) {
	let servers = JSON.parse(localStorage.getItem("servers"));
	servers.splice(id, 1);

	if (servers.length == 0) {
		localStorage.removeItem("servers");
	} else {
		localStorage.setItem("servers", JSON.stringify(servers));
	}

	manageSelectModalContainer('Server', false);

	await valid_login();
}

async function changeServer() {
	localStorage.removeItem("server");

	await valid_login();
}

async function accountExit() {
	localStorage.removeItem("server");
	localStorage.removeItem("user_info");
	localStorage.removeItem("avatars");
	localStorage.removeItem("avatar");

	await valid_login();
}

function selectModalContainer(select, show) {
	let select_element = document.querySelector("#" + select);
	select_element.querySelector(".select_modal_container").style.display = show ? "flex" : "none";
}

function manageSelectModalContainer(select, show) {
	let select_element = document.querySelector("#" + select);
	select_element.querySelector(".manage_select_modal_container").style.display = show ? "flex" : "none";
}

function loading(display) {
	document.querySelector(".loading").style.display = display ? "flex" : "none";
}

function trigger(message, type) {
	let trigger_container = document.querySelector(".trigger_container");
	trigger_container.style.display = "flex";
	trigger_container.classList.add(type);

	document.querySelector(".trigger_message").innerHTML = message;

	setTimeout(function () {
		trigger_container.style.display = "none";
	}, 5000);
}

async function valid_login() {
	let servers = JSON.parse(localStorage.getItem("servers"));
	if (!servers) {
		document.querySelector("#Login").style.display = "flex";
		document.querySelector("#Server").style.display = "none";
		document.querySelector("#Avatar").style.display = "none";
		document.querySelector("#Player").style.display = "none";
		localStorage.clear();
		return;
	}

	let server = localStorage.getItem("server");
	if (server) {
		await enterServer();
	} else {
		document.querySelector("#Login").style.display = "none";
		document.querySelector("#Server").style.display = "flex";
		document.querySelector("#Avatar").style.display = "none";
		document.querySelector("#Player").style.display = "none";

		let server_element = "";
		let server_manager_element = "";

		if (servers) {
			for (let i = 0; i < servers.length; i++) {
				let server = servers[i];
				let color = `hsl(${(i % 18) * 20}, 100%, 50%)`;

				server_element += `
					<li>
						<a onclick="handleServer(${i})" style="background-color: ${color};">
							<img src="assets/images/face-host.png">
						</a>
						<span>${server.url}</span>
						<span>${server.username}</span>
					</li>
				`;

				server_manager_element += `
					<li>
						<a onclick="removeServer(${i})" style="background-color: ${color};">
							<div class="bg_edit">
								<img src="assets/icons/icon-trash.svg">
							</div>
							<img src="assets/images/face-host.png">
						</a>
						<span>${server.url}</span>
						<span>${server.username}</span>
					</li>
				`;
			}
		}

		server_element += `
			<li>
				<a onclick="selectModalContainer('Server', true);">
					<img style="filter: invert(.8); width: 80px;" src="assets/icons/icon-plus-circle.svg">
				</a>
				<span>Adicionar perfil</span>
			</li>
		`;

		document.querySelector(".server_list").innerHTML = server_element;
		document.querySelector(".server_list_manager").innerHTML = server_manager_element;
		return;
	}

	let userInfo = await request("info", false, true);
	if (userInfo && userInfo.auth > 0) {
		localStorage.setItem("user_info", JSON.stringify(userInfo));
	} else {
		document.querySelector("#Login").style.display = "none";
		document.querySelector("#Server").style.display = "flex";
		document.querySelector("#Avatar").style.display = "none";
		document.querySelector("#Player").style.display = "none";
		localStorage.clear();
		return;
	}

	let avatars = await request("avatar/get", false, true);
	if (avatars) {
		localStorage.setItem("avatars", JSON.stringify(avatars));
	} else {
		document.querySelector("#Login").style.display = "none";
		document.querySelector("#Server").style.display = "flex";
		document.querySelector("#Avatar").style.display = "none";
		document.querySelector("#Player").style.display = "none";
		localStorage.clear();
		return;
	}

	let avatar = localStorage.getItem("avatar");
	if (avatar) {
		await enterAvatar(avatar);
	} else {
		document.querySelector("#Login").style.display = "none";
		document.querySelector("#Server").style.display = "none";
		document.querySelector("#Avatar").style.display = "flex";
		document.querySelector("#Player").style.display = "none";

		let avatar_element = "";
		let avatar_manager_element = "";

		let i = 0;
		for (avatar of Object.values(avatars)) {
			if (avatar.id) {
				let color = `hsl(${(i++ % 18) * 20}, 100%, 50%)`;

				avatar_element += `
					<li>
						<a onclick="handleAvatar(${avatar.id}, '${color}')" style="background-color: ${color};">
							<img src="assets/images/face-user.png">
						</a>
						<span>${avatar.name}</span>
					</li>
				`;

				avatar_manager_element += `
					<li>
						<a onclick="removeAvatar(${avatar.id})" style="background-color: ${color};">
							<div class="bg_edit">
								<img src="assets/icons/icon-trash.svg">
							</div>
							<img src="assets/images/face-user.png">
						</a>
						<span>${avatar.name}</span>
					</li>
				`;
			}
		}

		avatar_element += `
			<li>
				<a onclick="selectModalContainer('Avatar', true);">
					<img style="filter: invert(.8); width: 80px;" src="assets/icons/icon-plus-circle.svg">
				</a>
				<span>Adicionar perfil</span>
			</li>
		`;

		document.querySelector(".avatar_list").innerHTML = avatar_element;
		document.querySelector(".avatar_list_manager").innerHTML = avatar_manager_element;
	}
}

async function handlePage(type) {
	for (menu_content_a of document.querySelectorAll(".menu_content a")) {
		menu_content_a.classList.remove("active");
	}
	document.querySelector(".menu_content ." + type).classList.add("active");

	if (player_live) {
		player_live.dispose();
		player_live = null;
	}

	document.querySelector(".home_container").style.display = "none";
	document.querySelector(".live_container").style.display = "none";
	document.querySelector(".favorites_container").style.display = "none";

	let movie_container = document.querySelector(".movie_container");
	movie_container.querySelector(".channels_categories").style.display = "none";
	movie_container.querySelector(".media_content").style.display = "none";

	let series_container = document.querySelector(".series_container");
	series_container.querySelector(".channels_categories").style.display = "none";
	series_container.querySelector(".media_content").style.display = "none";

	switch (type) {
		case "home":
			await handleHome();
			break;
		case "lives":
			await handleLivesCategories();
			break;
		case "movies":
			await handleMovieCategories();
			break;
		case "series":
			await handleSerieCategories();
			break;
		case "favorites":
			await handleFavorites();
			break;
		default:
			break;
	}
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

function splideMount(id, perPage, arrows) {
	let splider = new Splide(id, {
		snap: true,
		drag: 'free',
		rewind: true,
		arrows: arrows,
		pagination: false,
		breakpoints: {
			854: {
				perPage: perPage[0],
			},
			1280: {
				perPage: perPage[1],
			},
			1440: {
				perPage: perPage[2],
			},
			1920: {
				perPage: perPage[3],
			},
			2560: {
				perPage: perPage[4],
			},
		}
	});
	splider.mount();
	return splider;
}

function mediaCateroryUpdate(category_id_selected) {
	for (media_category_a of document.querySelectorAll(".media_category_a")) {
		if (media_category_a.getAttribute("id") == category_id_selected) {
			media_category_a.classList.add("active");
		} else {
			media_category_a.classList.remove("active");
		}
	}
}

async function handleHome() {
	document.querySelector(".search_container").style.display = "none";

	let home_container = document.querySelector(".home_container");
	home_container.style.display = "flex";

	let home = await request("home", true, true);

	if (home.top.length) {
		home_container.querySelector(".top_conainer").style.display = "flex";
	} else {
		home_container.querySelector(".top_conainer").style.display = "none";
	}

	if (home.movies.length) {
		home_container.querySelector(".movies_added_container").style.display = "flex";
	} else {
		home_container.querySelector(".movies_added_container").style.display = "none";
	}

	if (home.series.length) {
		home_container.querySelector(".series_added_container").style.display = "flex";
	} else {
		home_container.querySelector(".series_added_container").style.display = "none";
	}

	let avatar = localStorage.getItem("avatar");

	let watchings = await request("watching/get/" + avatar, true, true);

	if (watchings.length) {
		home_container.querySelector(".keep_watching_container").style.display = "flex";
	} else {
		home_container.querySelector(".keep_watching_container").style.display = "none";
	}

	let element = "";

	for (watching of watchings) {
		let action = "";

		if (watching.kind == "movie") {
			action = `openMovie(${watching.value_id}, '${watching.container_extension}');`;
		} else {
			action = `openSerie(${watching.value_id}, ${watching.episode_id}, '${watching.container_extension}');`;
		}

		element += `
			<li class="splide__slide">
				<a onclick="${action}">
					${poster(watching.icon)}
					<span class="name">${watching.name}</span>
				</a>
			</li>
		`;
	}

	home_container.querySelector("#keep_watching_carousel .splide__list").innerHTML = element;
	element = "";

	splideMount("#keep_watching_carousel", [4, 6, 7, 10, 13], true);

	for ([i, home_top] of home.top.entries()) {
		if (home_top.kind == "movie") {
			element += `
				<li class="splide__slide">
					<a class="top_li" onclick="handleMovieInfo(${home_top.value_id});">
						${poster(home_top.icon)}
						<span class="position_number">${(i + 1)}</span>
						<span class="name">${home_top.name}</span>
					</a>
				</li>
			`;
		} else {
			element += `
				<li class="splide__slide">
					<a class="top_li" onclick="handleSerieInfo(${home_top.value_id});">
						${poster(home_top.icon)}
						<span class="position_number">${(i + 1)}</span>
						<span class="name">${home_top.name}</span>
					</a>
				</li>
			`;
		}
	}

	home_container.querySelector("#top10_carousel .splide__list").innerHTML = element;
	element = "";

	splideMount("#top10_carousel", [3, 5, 6, 8, 10], true);

	for (movie of home.movies) {
		element += `
			<li class="splide__slide">
				<a onclick="handleMovieInfo(${movie.value_id});">
					${poster(movie.icon)}
					<span class="name">${movie.name}</span>
				</a>
			</li>
		`;
	}

	home_container.querySelector("#movies_carousel .splide__list").innerHTML = element;
	element = "";

	splideMount("#movies_carousel", [4, 6, 7, 10, 13], true);

	for (serie of home.series) {
		element += `
			<li class="splide__slide">
				<a onclick="handleSerieInfo(${serie.value_id});">
					${poster(serie.icon)}
					<span class="name">${serie.name}</span>
				</a>
			</li>
		`;
	}

	home_container.querySelector("#series_carousel .splide__list").innerHTML = element;

	splideMount("#series_carousel", [4, 6, 7, 10, 13], true);
}

async function handleLivesCategories() {
	document.querySelector(".search_input_search").value = "";
	document.querySelector(".search_container").style.display = "flex";

	let live_container = document.querySelector(".live_container");
	live_container.style.display = "flex";

	let categories = await request("get/categories/live", true, true);

	let element = `
		<li>
			<a class="media_category_a" onclick="handleLives()">TODOS OS CANAIS</a>
		</li>
	`;

	for (category of categories) {
		let category_name = category.name.replace("CANAIS | ", "").replace("Canais | ", "");
		element += `
			<li>
				<a class="media_category_a" onclick="handleLives(null, ${category.id})" id="${category.id}">${category_name}</a>
			</li>
		`;
	}

	live_container.querySelector(".channels_categories").innerHTML = element;
	live_container.querySelector(".channels_view_container").style.display = "none";

	await handleLives(null, categories[0].id);
}

async function handleLives(lives, category_id) {
	if (!lives) {
		if (category_id) {
			lives = await request("get/category/live/" + category_id, true, true);
		} else {
			lives = await request("get/all/live", true, true);
		}
	}

	let element = "";
	if (lives.length) {
		for (live of lives) {
			element += `
				<li>
					<a onclick="openLive(${live.id});" id="${live.id}">
						${poster(live.icon)}
						<span>${live.name}</span>
					</a>
				</li>
			`;
		}
	} else {
		element = `<li class="not_found">Nenhum canal disponível nessa categoria.</li>`;
	}

	document.querySelector(".live_container .channels_list").innerHTML = element;

	mediaCateroryUpdate(category_id);

	handleSearch("live", handleLives);
}

async function openLive(value_id) {
	await handleLiveInfo(value_id);
	await watchLive(value_id);
}

async function handleAndOpenLive(live_id) {
	await handlePage("lives");
	await openLive(live_id);
}

async function handleLiveInfo(value_id) {
	let infos = await request("get/info/live/" + value_id, true, true);

	for (channels_list_a of document.querySelectorAll(".live_container .channels_list a")) {
		if (channels_list_a.getAttribute("id") == value_id) {
			channels_list_a.classList.add("active");
		} else {
			channels_list_a.classList.remove("active");
		}
	}

	let element = "";

	for (info of infos) {
		let start = new Date(parseInt(info.start_timestamp) * 1000);
		let end = new Date(parseInt(info.stop_timestamp) * 1000);

		let start_hours = start.getHours();
		let start_minutes = start.getMinutes();
		start_hours = start_hours < 10 ? "0" + start_hours : start_hours;
		start_minutes = start_minutes < 10 ? "0" + start_minutes : start_minutes;

		let end_hours = end.getHours();
		let end_minutes = end.getMinutes();
		end_hours = end_hours < 10 ? "0" + end_hours : end_hours;
		end_minutes = end_minutes < 10 ? "0" + end_minutes : end_minutes;

		element += `
			<li>
				<p class="title">
					<span class="time">
						${start_hours}:${start_minutes} - ${end_hours}:${end_minutes}
					</span> |  ${decodeURIComponent(escape(atob(info.title)))}
				</p>
				<p class="description">
					${decodeURIComponent(escape(atob(info.description)))}
				</p>
			</li>
		`;
	}

	let live_container = document.querySelector(".live_container");
	live_container.querySelector(".channels_view_container").style.display = "flex";
	live_container.querySelector(".epg_ul").innerHTML = element;
}

var player_live = null;
async function watchLive(value_id) {
	if (player_live) {
		player_live.dispose();
		player_live = null;
	}

	let avatar = localStorage.getItem("avatar");

	let link = await request("link/live/" + value_id + "/m3u8", true, true);
	let favorites = await request("favorite/get/" + avatar, true, true);

	let live_container = document.querySelector(".live_container");

	let favorite = live_container.querySelector(".btn_favorite .bx");
	let favorited = favorites.lives.filter((item) => item.value_id == value_id).length;
	handleFavorite(favorite, favorited, avatar, value_id, "live");

	live_container.querySelector(".channels_view_content").innerHTML = `<video id="my-player-live" class="video-js vjs-default-skin vjs-big-play-centered vjs-custom" controls loop src=""></video>`;

	player_live = videojs("my-player-live", {
		liveui: true,
		liveTracker: {
			liveTolerance: 10,
			trackingThreshold: 0
		},
		controlBar: {
			children: [
				"playToggle",
				"skipBackward",
				"skipForward",
				"volumePanel",
				"progressControl",
				"seekToLive",
				"PictureInPictureToggle",
				"fullscreenToggle"
			],
			volumePanel: {
				inline: false
			},
			skipButtons: {
				forward: 10,
				backward: 10
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
				seekStep: 10,
				volumeStep: 0.05,
				enableModifiersForNumbers: false
			}
		},
	});

	var errorDisplay = player_live.getChild('errorDisplay');
	errorDisplay.off(player_live, 'error', errorDisplay.open);
	errorDisplay.on(player_live, 'error', function (e) {
		var error = player_live.error();
		if (error && error.code !== 4) {
			errorDisplay.open();
		}
	});

	let url = await getRedirectXHR(PROXY + link);
	let urlBase = new URL(url.replace(PROXY, "")).origin;

	proxyBeforeRequest(player_live, urlBase);

	player_live.src(PROXY + link);

	player_live.reloadSourceOnError({
		getSource: async function (reload) {
			url = await getRedirectXHR(PROXY + link);
			urlBase = new URL(url.replace(PROXY, "")).origin;

			proxyBeforeRequest(player_live, urlBase);

			reload(PROXY + link);

			player_live.ready(function () {
				playerVolumeChange(player_live);
			});
		},
		errorInterval: 5,
	});

	player_live.ready(function () {
		let volume = localStorage.getItem("volume");
		if (volume) {
			player_live.volume(volume * 0.01);
		}

		playerVolumeChange(player_live);

		player_live.autoplay(true);
		player_live.play();
	});
}

function proxyBeforeRequest(player, urlBase) {
	player.on('xhr-hooks-ready', function () {
		function playerXhrRequestHook(options) {
			if (!options.uri.includes(PROXY)) {
				let noProxy = options.uri.replace(PROXY.replace("/proxy/", ""), "");
				options.uri = PROXY + urlBase + noProxy;
			}
			return options;
		};
		player.tech().vhs.xhr.onRequest(playerXhrRequestHook);
	});
}

async function getRedirectXHR(link) {
	return new Promise(function (resolve) {
		let xhr = new XMLHttpRequest();
		xhr.onload = function () {
			if (xhr.readyState === 4) {
				resolve(xhr.responseURL);
			}
			resolve();
		};
		xhr.onerror = function () {
			console.error(xhr.statusText);
		};
		xhr.open("GET", link, true);
		xhr.send();
	});
}

function playerVolumeChange(player) {
	player.on("volumechange", function () {
		localStorage.setItem("volume", Math.floor(player.volume() * 100));
	});
}

async function handleMovieCategories() {
	document.querySelector(".search_input_search").value = "";
	document.querySelector(".search_container").style.display = "flex";

	let movie_container = document.querySelector(".movie_container");
	movie_container.querySelector(".channels_categories").style.display = "flex";
	movie_container.querySelector(".media_content").style.display = "flex";
	movie_container.style.display = "flex";

	let categories = await request("get/categories/movie", true, true);

	let element = `
		<li>
			<a class="media_category_a" onclick="handleMovies()">TODOS OS FILMES</a>
		</li>
	`;

	for (category of categories) {
		let category_name = category.name.replace("FILMES | ", "").replace("Filmes | ", "");
		element += `
			<li>
				<a class="media_category_a" onclick="handleMovies(null, ${category.id})" id="${category.id}">${category_name}</a>
			</li>
		`;
	}

	movie_container.querySelector(".channels_categories").innerHTML = element;

	await handleMovies(null, categories[0].id);
}

async function handleMovies(movies, category_id) {
	if (!movies) {
		if (category_id) {
			movies = await request("get/category/movie/" + category_id, true, true);
		} else {
			movies = await request("get/all/movie", true, true);
		}
	}

	let element = "";
	if (movies.length) {
		for (movie of movies) {
			element += `
					<li>
						<a onclick="handleMovieInfo(${movie.id});">
							${poster(movie.icon)}	
							<span class="name">${movie.name}</span>
						</a>
					</li>
				`;
		}
	} else {
		element = `<li class="not_found">Nenhum filme disponível nessa categoria.</li>`;
	}

	document.querySelector(".movie_container .media_content").innerHTML = element;

	mediaCateroryUpdate(category_id);

	handleSearch("movie", handleMovies);
}

async function openMovie(value_id, container_extension) {
	await handleMovieInfo(value_id);
	await watchVideo(value_id, null, container_extension);
}

async function handleMovieInfo(value_id) {
	let avatar = localStorage.getItem("avatar");

	let movie = await request("get/info/movie/" + value_id, true, true);
	let favorites = await request("favorite/get/" + avatar, true, true);

	let movie_container = document.querySelector(".movie_container");

	let favorite = movie_container.querySelector(".btn_favorite .bx");
	let favorited = favorites.movies.filter((item) => item.value_id == value_id).length;
	handleFavorite(favorite, favorited, avatar, value_id, "movie");

	movie_container.querySelector(".modal_media_container").style.opacity = "1";
	movie_container.querySelector(".modal_media_container").style.display = "flex";
	movie_container.querySelector(".modal_media_container").style.pointerEvents = null;

	movie_container.querySelector(".media_cover img").src = imgPoster(movie.info.cover);
	movie_container.querySelector(".modal_media_box").style.backgroundImage = urlPoster(movie.info.cover);
	movie_container.querySelector(".media_cover .rate").innerHTML = "★ " + (movie.info.rating ? movie.info.rating : "N/A");

	movie_container.querySelector(".media_description .title").innerHTML = movie.data.name ? movie.data.name : movie.info.name;
	movie_container.querySelector(".media_description .genre").innerHTML = movie.info.genre ? movie.info.genre : "";
	movie_container.querySelector(".media_description .time").innerHTML = "Duração: " + (movie.info.duration ? movie.info.duration : "");
	movie_container.querySelector(".media_description .director").innerHTML = "Diretor: " + (movie.info.director ? movie.info.director : "");
	movie_container.querySelector(".media_description .cast").innerHTML = "Elenco: " + (movie.info.cast ? movie.info.cast : "");

	if (movie.info.plot) {
		movie_container.querySelector(".media_resume").style.display = "flex";
		movie_container.querySelector(".media_resume p").innerHTML = movie.info.plot;
	} else {
		movie_container.querySelector(".media_resume").style.display = "none";
	}

	if (movie.info.youtube_trailer) {
		movie_container.querySelector(".media_trailer").style.display = "flex";
		movie_container.querySelector(".media_trailer").href = "https://www.youtube.com/watch?v=" + movie.info.youtube_trailer;
	} else {
		movie_container.querySelector(".media_trailer").style.display = "none";
	}

	movie_container.querySelector(".btn_watch").onclick = function () {
		watchVideo(movie.data.id, null, movie.data.container_extension);
	};
}

async function handleSerieCategories() {
	document.querySelector(".search_input_search").value = "";
	document.querySelector(".search_container").style.display = "flex";

	let series_container = document.querySelector(".series_container");
	series_container.querySelector(".channels_categories").style.display = "flex";
	series_container.querySelector(".media_content").style.display = "flex";
	series_container.style.display = "flex";

	let categories = await request("get/categories/serie", true, true);

	let element = `
		<li>
			<a class="media_category_a" onclick="handleSeries()">TODAS AS SÉRIES</a>
		</li>
	`;

	for (category of categories) {
		let category_name = category.name.replace("SÉRIES | ", "").replace("SERIES | ", "").replace("Séries | ", "").replace("Series | ", "");
		element += `
			<li>
				<a class="media_category_a" onclick="handleSeries(null, ${category.id})" id="${category.id}">${category_name}</a>
			</li>
		`;
	}

	series_container.querySelector(".channels_categories").innerHTML = element;

	await handleSeries(null, categories[0].id);
}

async function handleSeries(series, category_id) {
	if (!series) {
		if (category_id) {
			series = await request("get/category/serie/" + category_id, true, true);
		} else {
			series = await request("get/all/serie", true, true);
		}
	}

	let element = "";
	if (series.length) {
		for (serie of series) {
			element += `
				<li>
					<a onclick="handleSerieInfo(${serie.id});">
						${poster(serie.icon)}	
						<span class="name">${serie.name}</span>
					</a>
				</li>
			`;
		}
	} else {
		element = `<li class="not_found">Nenhuma série disponível nessa categoria.</li>`;
	}

	document.querySelector(".series_container .media_content").innerHTML = element;

	mediaCateroryUpdate(category_id);

	handleSearch("serie", handleSeries);
}

async function openSerie(value_id, episode_id, container_extension) {
	await handleSerieInfo(value_id);
	await watchVideo(value_id, episode_id, container_extension);
}

async function handleSerieInfo(value_id) {
	let avatar = localStorage.getItem("avatar");

	let serie = await request("get/info/serie/" + value_id, true, true);
	let favorites = await request("favorite/get/" + avatar, true, true);

	let series_container = document.querySelector(".series_container");

	let favorite = series_container.querySelector(".btn_favorite .bx");
	let favorited = favorites.series.filter((item) => item.value_id == value_id).length;
	handleFavorite(favorite, favorited, avatar, value_id, "serie");

	series_container.querySelector(".modal_media_container").style.opacity = "1";
	series_container.querySelector(".modal_media_container").style.display = "flex";
	series_container.querySelector(".modal_media_container").style.pointerEvents = null;

	series_container.querySelector(".media_cover img").src = imgPoster(serie.info.cover);
	series_container.querySelector(".modal_media_box").style.backgroundImage = urlPoster(serie.info.cover);
	series_container.querySelector(".media_cover .rate").innerHTML = "★ " + (serie.info.rating ? serie.info.rating : "N/A");

	series_container.querySelector(".media_description .title").innerHTML = serie.info.name ? serie.info.name : "";
	series_container.querySelector(".media_description .genre").innerHTML = serie.info.genre ? serie.info.genre : "";
	series_container.querySelector(".media_description .director").innerHTML = "Diretor: " + (serie.info.director ? serie.info.director : "");
	series_container.querySelector(".media_description .cast").innerHTML = "Elenco: " + (serie.info.cast ? serie.info.cast : "");

	if (serie.info.plot) {
		series_container.querySelector(".media_resume").style.display = "flex";
		series_container.querySelector(".media_resume p").innerHTML = serie.info.plot;
	} else {
		series_container.querySelector(".media_resume").style.display = "none";
	}

	if (serie.info.youtube_trailer) {
		series_container.querySelector(".media_trailer").style.display = "flex";
		series_container.querySelector(".media_trailer").href = "https://www.youtube.com/watch?v=" + serie.info.youtube_trailer;
	} else {
		series_container.querySelector(".media_trailer").style.display = "none";
	}

	if (serie.episodes) {
		let first = true;
		let box_episodes = "";
		let seasons_content_ul = "";

		for ([id, seasons] of Object.entries(serie.episodes)) {
			seasons_content_ul += `
				<li class="splide__slide seasons_li">
					<p class="title">
						<a onclick="handleChangeSeason(${id})" id="${id}" class="li_season ${first ? "active" : ""}">Temporada ${id}</a>
					</p>
				</li>
			`;

			box_episodes += `
				<div class="splide" id="episodes_${id}_carousel" season="${id}" style="display: ${first ? "flex" : "none"};">
					<div class="splide__track">
						<ul class="splide__list">
			`;
			for (episode of Object.values(seasons)) {
				box_episodes += `
					<li class="splide__slide">
						<a onclick="watchVideo(${value_id}, ${episode.id}, '${episode.container_extension}')" id="${episode.id}">
							${poster(episode.info.image)}	
							<span class="name">${episode.title}</span>
						</a>
					</li>
				`;
			}
			box_episodes += `
						</ul>
					</div>
				</div>
			`;

			first = false;
		}

		series_container.querySelector(".box_episodes").innerHTML = box_episodes;
		series_container.querySelector(".seasons_content ul").innerHTML = seasons_content_ul;

		splideMount("#seasons_carousel", [4, 6, 7, 10, 13], false);

		let spliders = [];
		for ([id, _] of Object.entries(serie.episodes)) {
			spliders.push(splideMount(`#episodes_${id}_carousel`, [3, 5, 5, 7, 10], false));
		}

		series_container.querySelector(`.arrows .prev_arrow`).onclick = function () {
			for (splider of spliders) {
				splider.go('-1');
			}
		};
		series_container.querySelector(`.arrows .next_arrow`).onclick = function () {
			for (splider of spliders) {
				splider.go('+1');
			}
		};
	}
}

function handleChangeSeason(id) {
	let series_container = document.querySelector(".series_container");

	for (seasons_li_a of series_container.querySelectorAll(".seasons_li a")) {
		seasons_li_a.classList.remove("active");
	}

	series_container.querySelector(`.seasons_li a[id="${id}"]`).classList.add("active");

	for (episodes_ul of series_container.querySelectorAll(".box_episodes > div")) {
		if (episodes_ul.getAttribute("id") == `episodes_${id}_carousel`) {
			episodes_ul.style.display = "flex";
		} else {
			episodes_ul.style.display = "none";
		}
	}
}

async function handleFavorites() {
	let avatar = localStorage.getItem("avatar");

	document.querySelector(".search_container").style.display = "none";

	let favorites_container = document.querySelector(".favorites_container");
	favorites_container.style.display = "flex";

	let favorites = await request("favorite/get/" + avatar, true, true);

	let element = "";
	if (favorites.lives.length) {
		for (live of favorites.lives) {
			element += `
				<li class="splide__slide">
					<a onclick="handleAndOpenLive(${live.value_id});" class="live">
						${poster(live.icon)}	
						<span class="name">${live.name}</span>
					</a>
				</li>
			`;
		}
	} else {
		element = `<li style="color: #fff;">Nenhum canal favorito.</li>`;
	}

	favorites_container.querySelector("#favorites_lives_carousel .splide__list").innerHTML = element;
	element = "";

	splideMount("#favorites_lives_carousel", [4, 6, 7, 10, 13], true);

	if (favorites.movies.length) {
		for (movie of favorites.movies) {
			element += `
				<li class="splide__slide">
					<a onclick="handleMovieInfo(${movie.value_id});">
						${poster(movie.icon)}
						<span class="name">${movie.name}</span>
					</a>
				</li>
			`;
		}
	} else {
		element = `<li style="color: #fff;">Nenhum filme favorito.</li>`;
	}

	favorites_container.querySelector("#favorites_movies_carousel .splide__list").innerHTML = element;
	element = "";

	splideMount("#favorites_movies_carousel", [4, 6, 7, 10, 13], true);

	if (favorites.series.length) {
		for (serie of favorites.series) {
			element += `
				<li class="splide__slide">
					<a onclick="handleSerieInfo(${serie.value_id});">
						${poster(serie.icon)}
						<span class="name">${serie.name}</span>
					</a>
				</li>
			`;
		}
	} else {
		element = `<li style="color: #fff;">Nenhuma série favorita.</li>`;
	}

	favorites_container.querySelector("#favorites_series_carousel .splide__list").innerHTML = element;

	splideMount("#favorites_series_carousel", [4, 6, 7, 10, 13], true);
}

async function handleFavorite(favorite, favorited, avatar, value_id, type) {
	if (favorited) {
		favorite.classList.replace("bx-heart", "bxs-heart");
		favorite.onclick = async function () {
			await removeFavorite(avatar, type, value_id);
			handleFavorite(favorite, false, avatar, value_id, type);
		};
	} else {
		favorite.classList.replace("bxs-heart", "bx-heart");
		favorite.onclick = async function () {
			await storeFavorite(avatar, type, value_id);
			handleFavorite(favorite, true, avatar, value_id, type);
		};
	}
}

async function storeFavorite(avatar, type, value_id) {
	await request("favorite/store/" + avatar + "/" + type + "/" + value_id, true, true);
}

async function removeFavorite(avatar, type, value_id) {
	await request("favorite/remove/" + avatar + "/" + type + "/" + value_id, true, true);

	if (document.querySelector(".favorites_container").style.display == "flex") {
		handleFavorites();
	}
}

var player = null;
async function watchVideo(value_id, episode_id, container_extension) {
	if (player) {
		player.dispose();
		player = null;
	}

	let avatar = localStorage.getItem("avatar");

	let link;
	if (episode_id) {
		link = await request("link/serie/" + episode_id + "/" + container_extension, true, true);
	} else {
		link = await request("link/movie/" + value_id + "/" + container_extension, true, true);
	}

	let watchings = await request("watching/get/" + avatar, true, true);

	let time = 0;
	let watching = watchings.filter(watching => watching.value_id == value_id);
	if (watching.length) {
		time = watching[0].time;
	}

	document.querySelector(".player_video_content").innerHTML = `<video id="my-player" class="video-js vjs-default-skin vjs-big-play-centered vjs-custom" controls loop src=""></video>`;
	document.querySelector(".player_video_container").style.display = "flex";

	player = videojs("my-player", {
		controlBar: {
			children: [
				"playToggle",
				"skipBackward",
				"skipForward",
				"volumePanel",
				"currentTimeDisplay",
				"progressControl",
				"durationDisplay",
				"playbackRateMenuButton",
				"subsCapsButton",
				"PictureInPictureToggle",
				"fullscreenToggle"
			],
			volumePanel: {
				inline: false
			},
			skipButtons: {
				forward: 10,
				backward: 10
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
				seekStep: 10,
				volumeStep: 0.05,
				enableModifiersForNumbers: false
			}
		},
		playbackRates: [2, 1.75, 1.5, 1.25, 1, 0.75, 0.5, 0.25],
	});

	var errorDisplay = player.getChild('errorDisplay');
	errorDisplay.off(player, 'error', errorDisplay.open);
	errorDisplay.on(player, 'error', function (e) {
		var error = player.error();
		if (error && error.code !== 4) {
			errorDisplay.open();
		}
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

		let volume = localStorage.getItem("volume");
		if (volume) {
			player.volume(volume * 0.01);
		}

		player.autoplay(true);
		player.play();

		playerVolumeChange(player);

		let lastSeconds = null;
		player.on("timeupdate", function () {
			let seconds = Math.floor(player.currentTime());
			if ((seconds % 30) == 0 && seconds != lastSeconds) {
				lastSeconds = seconds;
				if (seconds > 30) {
					sendWatching(seconds, value_id, episode_id);
				}
			}
		});

		timeHidePlayerButtons = 3;

		let player_video_prev = document.querySelector(".player_video_prev");
		let player_video_next = document.querySelector(".player_video_next");
		player_video_prev.style.display = "none";
		player_video_next.style.display = "none";

		if (!episode_id) {
			let title = document.querySelector(".movie_container .media_description .title").textContent;
			document.querySelector(".title_media").innerHTML = "<h2>" + title + "</h2>";
		} else {
			let episodes = document.querySelectorAll(".series_container .splide__list li a");

			for ([i, episode] of episodes.entries()) {
				if (episode.getAttribute("onclick").includes(episode_id)) {
					episode.classList.add("active-border");
					episode.scrollIntoView(true);

					let title = episode.querySelector("span").textContent;
					document.querySelector(".title_media").innerHTML = "<h2>" + title + "</h2>";

					handleChangeSeason(episode.parentNode.parentNode.parentElement.parentElement.getAttribute("season"));

					let prev_episode = episodes[i - 1];
					let next_episode = episodes[i + 1];

					if (prev_episode) {
						player_video_prev.style.display = "flex";
						player_video_prev.onclick = function () {
							if (player) {
								player.dispose();
								player = null;
							}
							sendWatching(0, value_id, prev_episode.getAttribute("id"), 0);
							prev_episode.click();
						};
					}
					if (next_episode) {
						player_video_next.style.display = "flex";
						player_video_next.onclick = function () {
							if (player) {
								player.dispose();
								player = null;
							}
							sendWatching(0, value_id, next_episode.getAttribute("id"));
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

async function sendWatching(time, value_id, episode_id) {
	let avatar = localStorage.getItem("avatar");

	if (episode_id) {
		await request("watching/store/" + avatar + "/serie/" + time + "/" + value_id + "/" + episode_id, true, false);
	} else {
		await request("watching/store/" + avatar + "/movie/" + time + "/" + value_id, true, false);
	}
}

async function handleSearch(type, handleFunction) {
	let search_container = document.querySelector(".search_container");
	search_container.onsubmit = async function (event) {
		event.preventDefault();

		let search_input_search = search_container.querySelector(".search_input_search");
		let text = encodeURIComponent(search_input_search.value);

		let search = await request("search/" + type + "/" + text, true, true);

		handleFunction(search);
	};
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
	let elements = document.querySelectorAll(".modal_media_container");

	for (element of elements) {
		element.style.opacity = "0";
		element.style.pointerEvents = "none";

		setTimeout(function () {
			element.style.display = "none";
		}, 500);
	}
}

valid_login();

const API = "https://playerapi.autergame.me/";
const PROXY = "https://host.autergame.me:2083/proxy/";