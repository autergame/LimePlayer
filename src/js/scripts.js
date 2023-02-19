function serialize(_0xdb48dd) {
	if (!_0xdb48dd || _0xdb48dd.nodeName !== 'FORM') {
		return;
	}

	let _0x331295 = [];

	for (let i = _0xdb48dd.elements.length - 1; i >= 0; i--) {
		if (_0xdb48dd.elements[i].name === '') {
			continue;
		}

		switch (_0xdb48dd.elements[i].nodeName) {
			case 'INPUT':
				switch (_0xdb48dd.elements[i].type) {
					case 'text':
					case 'hidden':
					case 'password':
					case 'button':
					case 'reset':
					case 'submit':
						_0x331295.push(_0xdb48dd.elements[i].name + '=' + encodeURIComponent(_0xdb48dd.elements[i].value));
						break;
					case 'checkbox':
					case 'radio':
						if (_0xdb48dd.elements[i].checked) {
							_0x331295.push(_0xdb48dd.elements[i].name + '=' + encodeURIComponent(_0xdb48dd.elements[i].value));
						}
						break;
					case 'file':
						break;
				}
				break
			case 'TEXTAREA':
				_0x331295.push(_0xdb48dd.elements[i].name + '=' + encodeURIComponent(_0xdb48dd.elements[i].value));
				break;
			case 'SELECT':
				switch (_0xdb48dd.elements[i].type) {
					case 'select-one':
						_0x331295.push(_0xdb48dd.elements[i].name + '=' + encodeURIComponent(_0xdb48dd.elements[i].value));
						break;
					case 'select-multiple':
						for (var j = _0xdb48dd.elements[i].options.length - 1; j >= 0; j--) {
							if (_0xdb48dd.elements[i].options[j].selected) {
								_0x331295.push(_0xdb48dd.elements[i].name + '=' + encodeURIComponent(_0xdb48dd.elements[i].options[j].value));
							}
						}
						break;
				}
				break
			case 'BUTTON':
				switch (_0xdb48dd.elements[i].type) {
					case 'reset':
					case 'submit':
					case 'button':
						_0x331295.push(_0xdb48dd.elements[i].name + '=' + encodeURIComponent(_0xdb48dd.elements[i].value));
						break;
				}
				break;
		}
	}

	return _0x331295.join('&')
}

function loading(display = true) {
	var loading = document.querySelector('.loading');
	if (display) {
		loading.style.display = 'flex';
	} else {
		loading.style.display = 'none';
	}
}

function trigger(message, type = 'success') {
	var triggerContainer = document.querySelector('.trigger_container');
	triggerContainer.style.display = 'block';
	triggerContainer.classList.add(type);

	document.querySelector('.trigger_message').innerHTML = message;

	setTimeout(function () {
		triggerContainer.style.display = 'none';
	}, 5000);
}

function ajax(_0xb20ed3, _0x23ef6a = true) {
	if (_0x23ef6a) {
		loading(true);
	}

	var _0x3df5ef = JSON.parse('{"' + decodeURI(_0xb20ed3).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
	if (typeof _0x3df5ef.username == 'undefined' || typeof _0x3df5ef.password == 'undefined') {
		_0xb20ed3 = `username=${username}&password=${password}&${_0xb20ed3}`;
	}
	if (avatar) {
		_0xb20ed3 += `&avatar_id=${avatar.id}`;
	}

	return new Promise(function (resolve, reject) {
		var _0x5d5001 = new XMLHttpRequest();
		_0x5d5001.onload = function (_0x328237) {
			if (_0x5d5001.readyState === 4) {
				loading(false)
				try {
					const _0x16a179 = JSON.parse(_0x5d5001.response)
					if (typeof _0x16a179.trigger !== 'undefined') {
						trigger(_0x16a179.trigger.msg, _0x16a179.trigger.type);
					}
					if (typeof _0x16a179.display !== 'undefined') {
						for (const [_0x2e1458, _0x3ca81f] of Object.entries(_0x16a179.display)) {
							document.querySelector(_0x2e1458).style.display = _0x3ca81f;
						}
					}
					if (typeof _0x16a179.setItem !== 'undefined') {
						for (const [_0x1a8ebf, _0x3c332c] of Object.entries(_0x16a179.setItem)) {
							localStorage.setItem(_0x1a8ebf, _0x3c332c);
						}
					}
					if (typeof _0x16a179.innerHTML !== 'undefined') {
						for (const [_0x410d7b, _0x521428] of Object.entries(_0x16a179.innerHTML)) {
							document.querySelector(_0x410d7b).innerHTML = _0x521428;
						}
					}
					if (typeof _0x16a179.callFunction !== 'undefined') {
						for (const [_0x3f14b1, _0x293632] of Object.entries(_0x16a179.callFunction)) {
							if (_0x293632 && _0x293632.length) {
								eval(_0x3f14b1 + `(${_0x293632})`);
							} else {
								eval(_0x3f14b1 + '()');
							}
						}
					}
					login();
					btn();
					scroll();
				} catch (_0x50696b) { }
			}
			resolve();
		}
		_0x5d5001.onerror = function (_0x29a241) {
			console.error(_0x5d5001.statusText);
			loading(false);
		}
		_0x5d5001.open('GET', corsProxy(API_BASE + _0xb20ed3), true);
		_0x5d5001.send();
	});
}

async function btn() {
	var jBtn = document.querySelectorAll('.j_btn')
	for (var i = 0; i < jBtn.length; i++) {
		var _0x447269 = jBtn[i];
		var _0x2312ed = _0x447269.cloneNode(true);
		_0x2312ed.addEventListener('click', async function (_0x2b6c06) {
			var _0x3df9f4 = this.getAttribute('_action');
			var _0x7675c = this.getAttribute('id');
			switch (_0x3df9f4) {
				case 'handleAvatar':
					var _0x21f77c = JSON.parse(localStorage.getItem('user_info')).avatars
					const _0x5ee19f = _0x21f77c.filter((_0x38f099) => _0x38f099.id == _0x7675c)[0]
					localStorage.setItem('avatar', JSON.stringify(_0x5ee19f));
					localStorage.removeItem('favorites');
					login();
					handlePage('home');
					break
				case 'avatar':
					var _0x21f77c = JSON.parse(localStorage.getItem('user_info')).avatars
					const _0x511bfb = _0x21f77c.filter((_0x3b5089) => _0x3b5089.id == _0x7675c)[0]
					ajax('action=delete_avatar&avatar_id=' + _0x511bfb.id)
					login()
					break
				case 'exit':
					localStorage.clear();
					document.querySelector('.profile_container').style.display = 'none';
					login()
					break
				case 'changeAvatar':
					localStorage.removeItem('avatar')
					localStorage.removeItem('home')
					localStorage.removeItem('favorites')
					document.querySelector('.profile_container').style.display = 'none'
					login()
					break
				default:
			}
		})
		_0x447269.parentNode.replaceChild(_0x2312ed, _0x447269)
	}
}

function login() {
	var userInfo = localStorage.getItem('user_info');
	if (userInfo) {
		var userInfo = JSON.parse(localStorage.getItem('user_info'));
		if (userInfo.auth == 0) {
			document.querySelector('#Login').style.display = 'flex';
			document.querySelector('#Avatar').style.display = 'none';
			document.querySelector('#Player').style.display = 'none';
			document.querySelector('.page_content').innerHTML = '';
			localStorage.clear();
		} else {
			username = userInfo.username;
			password = userInfo.password;
			if (localStorage.getItem('avatar')) {
				avatar = JSON.parse(localStorage.getItem('avatar'));
				document.querySelector('#Login').style.display = 'none';
				document.querySelector('#Avatar').style.display = 'none';
				document.querySelector('#Player').style.display = 'flex';
				var avatarName = document.querySelectorAll('.avatar_name');
				for (var i = 0; i < avatarName.length; i++) {
					avatarName[i].innerHTML = avatar.avatar_name;
				}
			} else {
				document.querySelector('#Login').style.display = 'none';
				document.querySelector('#Avatar').style.display = 'flex';
				document.querySelector('#Player').style.display = 'none';
				var _0x268eaf = '';
				var _0x48b6b8 = '';
				var _0x4313b0 = '';
				for (var i = 0; i < userInfo.avatars.length; i++) {
					let color = i % 2 != 0 ? '#e6b308' : '#7669fe';
					_0x268eaf += `
						<li>
							<a class="j_btn focusable" _action="handleAvatar" id="${userInfo.avatars[i].id}" href="javascript:void(0)" style="background-color: ${color};">
								<img src="assets/images/face-user.png" alt="${userInfo.avatars[i].avatar_name}">
							</a>
							<span>${userInfo.avatars[i].avatar_name}</span>
						</li>
					`
					_0x4313b0 += `
						<li>
							<a class="j_btn focusable" _action="avatar" id="${userInfo.avatars[i].id}" href="javascript:void(0)" style="background-color: ${color};">
								<div class="bg-edit">
									<img src="assets/icons/icon-trash.svg">
								</div>
								<img src="assets/images/face-user.png" alt="${userInfo.avatars[i].avatar_name}">
							</a>
							<span>${userInfo.avatars[i].avatar_name}</span>
						</li>
					`
				}
				_0x268eaf += `
					<li>
						<a class="focusable add_profile" href="javascript:void(0)" onclick="document.querySelector('.users_modal_container').style.display = 'flex';">
							<img style="filter: invert(.8); width: 80px;" src="assets/icons/icon-plus-circle.svg" alt="Adicionar perfil">
						</a>
						<span>Adicionar perfil</span>
					</li>
				`
				_0x48b6b8 = `
					<a class="btn_manage_users focusable" href="javascript:void(0)" onclick="document.querySelector('.manage_users_modal_container').style.display = 'flex';">
						<span>Gerenciar perfis</span>
					</a>
				`
				document.querySelector('.avatar_list').innerHTML = _0x268eaf;
				document.querySelector('.avatar_list_manager').innerHTML = _0x4313b0;
				btn()
				document.querySelector('.manage_users').innerHTML = _0x48b6b8;
			}
		}
	} else {
		document.querySelector('#Login').style.display = 'flex';
		document.querySelector('#Avatar').style.display = 'none';
		document.querySelector('#Player').style.display = 'none';
		document.querySelector('.page_content').innerHTML = '';
	}
}

function handlePage(type) {
	if (document.getElementById('player_container')) {
		jwplayer('player_container').remove();
	}

	document.querySelector('.search_container').style.visibility = 'hidden';
	document.querySelector('.search_input_action').value = '';
	document.querySelector('.search_input_search').value = '';

	var menuContentA = document.querySelectorAll('.menu_content a');
	for (var i = 0; i < menuContentA.length; i++) {
		menuContentA[i].classList.remove('active');
	}

	document.querySelector('.menu_content .' + type).classList.add('active');

	switch (type) {
		case 'movies':
			pageVod();
			handleModalVod();
			handleVodCategories();
			break;
		case 'lives':
			pageLives();
			handleLivesCategories();
			break;
		case 'series':
			pageSeries();
			handleModalSerie();
			handleSeriesCategories();
			break;
		case 'favorites':
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
	document.querySelector('.page_content').innerHTML = `
		<div class="favorites_container">
			<div class="section_new_container carousel_section_generic_container keep_watching_container">
				<div class="section_new_content carousel_section_generic_content small">
					<div class="section_new_title carousel_section_generic_title">
						<p>Continue assistindo</p>
						<div class="container-arrows">
							<img src="assets/icons/icon-left.svg" alt="Seta" class="btn-left-scroll" ref="2"></img>
							<img src="assets/icons/icon-right.svg" alt="Seta" class="btn-right-scroll" ref="2"></img>
						</div>
					</div>
					<ul class="hide_scrollbar scroll-horizon keep_watching_ul" id="2">
					</ul>
				</div>
			</div>
			<div class="section_top_container carousel_section_generic_container top_conainer">
				<div class="section_top_content carousel_section_generic_content">
					<div class="section_top_title carousel_section_generic_title">
						<p>Top 10</p>
						<div class="container-arrows">
							<img src="assets/icons/icon-left.svg" alt="Seta" class="btn-left-scroll focusable" ref="1"></img>
							<img src="assets/icons/icon-right.svg" alt="Seta" class="btn-right-scroll focusable" ref="1"></img>
						</div>
					</div>
					<ul class="hide_scrollbar scroll-horizon top_ul" id="1">
					</ul>
				</div>
			</div>
			<div class="section_new_container carousel_section_generic_container movies_added_container">
				<div id="section_added" class="section_new_content carousel_section_generic_content small">
					<div class="section_new_title carousel_section_generic_title">
						<p>Filmes recém adicionados</p>
						<div class="container-arrows">
							<img src="assets/icons/icon-left.svg" alt="Seta" class="btn-left-scroll" ref="3"></img>
							<img src="assets/icons/icon-right.svg" alt="Seta" class="btn-right-scroll" ref="3"></img>
						</div>
					</div>
					<ul class="hide_scrollbar scroll-horizon movies_added_ul" id="3">
					</ul>
				</div>
			</div>
			<div class="section_new_container carousel_section_generic_container series_added_container">
				<div class="section_new_content carousel_section_generic_content small">
					<div class="section_new_title carousel_section_generic_title">
						<p>Séries recém adicionadas</p>
						<div class="container-arrows">
							<img src="assets/icons/icon-left.svg" alt="Seta" class="btn-left-scroll" ref="4"></img>
							<img src="assets/icons/icon-right.svg" alt="Seta" class="btn-right-scroll" ref="4"></img>
						</div>
					</div>
					<ul class="hide_scrollbar scroll-horizon series_added_ul" id="4">
					</ul>
				</div>
			</div>
		</div>
	`
}

function handleHome() {
	document.querySelector('.keep_watching_container').style.display = 'none';
	document.querySelector('.top_conainer').style.display = 'none';
	document.querySelector('.movies_added_container').style.display = 'none';
	document.querySelector('.series_added_container').style.display = 'none';
	var home = localStorage.getItem('home');
	if (home) {
		var home = JSON.parse(home);
		if (home.keepWatching.length) {
			document.querySelector('.keep_watching_container').style.display = 'flex';
		}
		if (home.top.length) {
			document.querySelector('.top_conainer').style.display = 'flex';
		}
		if (home.moviesAdded.length) {
			document.querySelector('.movies_added_container').style.display = 'flex';
		}
		if (home.seriesAdded.length) {
			document.querySelector('.series_added_container').style.display = 'flex';
		}
		var _0x15c0b7 = ''
		for (var i = 0; i < home.keepWatching.length; i++) {
			var _0x521755 = '';
			var _0x3dce9b = '';
			var _0xeebe6e = '';
			if (home.keepWatching[i].serie_id) {
				_0x521755 = `
					(async function () { 
						handleModalSerie(); 
						await handleSerieInfo(null, ${home.keepWatching[i].serie_id}); 
						handleVideo('${DNS}/series/${username}/${password}/${home.keepWatching[i].stream_id}.${home.keepWatching[i].target_container}', 'video/mp4');
					})();
				`
				_0x3dce9b = home.keepWatching[i].cover
				_0xeebe6e = home.keepWatching[i].title
			} else {
				_0x521755 = `
					(async function () {
						handleModalVod(); 
						await handleVodInfo(null, ${home.keepWatching[i].stream_id}); 
						handleVideo('${DNS}/movie/${username}/${password}/${home.keepWatching[i].stream_id}.${home.keepWatching[i].target_container}', 'video/mp4');
					})();
				`
				_0x3dce9b = home.keepWatching[i].movie_image
				_0xeebe6e = home.keepWatching[i].stream_display_name
			}
			let backgroundImage = _0x3dce9b ? `style="background-image: url(${_0x3dce9b});"` : '';
			_0x15c0b7 += `
				<li>
					<a class="focusable" onclick="${_0x521755}" ${backgroundImage} href="javascript:void(0)">
						<span class="name">${_0xeebe6e}</span>
					</a>
				</li>
			`
		}
		document.querySelector('.keep_watching_ul').innerHTML = _0x15c0b7
		_0x15c0b7 = ''
		for (var i = 0; i < home.top.length; i++) {
			if (home.top[i].stream_id) {
				let backgroundImage = home.top[i].movie_image ? `style="background-image: url(${home.top[i].movie_image});"` : '';
				_0x15c0b7 += `
					<li>
						<a class="focusable top_li" onclick="handleModalVod(); handleVodInfo(null, ${home.top[i].stream_id})" ${backgroundImage} href="javascript:void(0)">
							<span class="position_number">${(i + 1)}</span>
							<span class="name">${home.top[i].stream_display_name}</span>
						</a>
					</li>
				`
			} else {
				let backgroundImage = home.top[i].cover ? `style="background-image: url(${home.top[i].cover});"` : '';
				_0x15c0b7 += `
					<li>
						<a class="focusable top_li" onclick="handleModalSerie(); handleSerieInfo(null, ${home.top[i].serie_id})" ${backgroundImage} href="javascript:void(0)">
							<span class="position_number">${(i + 1)}</span>
							<span class="name">${home.top[i].title}</span>
						</a>
					</li>
				`
			}
		}
		document.querySelector('.top_ul').innerHTML = _0x15c0b7
		_0x15c0b7 = ''
		for (var i = 0; i < home.moviesAdded.length; i++) {
			let backgroundImage = home.moviesAdded[i].movie_image ? `style="background-image: url(${home.moviesAdded[i].movie_image});"` : '';
			_0x15c0b7 += `
				<li>
					<a class="focusable" onclick="handleModalVod(); handleVodInfo(null, ${home.moviesAdded[i].id})" ${backgroundImage} href="javascript:void(0)">
						<span class="name">${home.moviesAdded[i].stream_display_name}</span>
					</a>
				</li>
			`
		}
		document.querySelector('.movies_added_ul').innerHTML = _0x15c0b7
		_0x15c0b7 = ''
		for (var i = 0; i < home.seriesAdded.length; i++) {
			let backgroundImage = home.seriesAdded[i].cover ? `style="background-image: url(${home.seriesAdded[i].cover});"` : '';
			_0x15c0b7 += `
				<li>
					<a onclick="handleModalSerie(); handleSerieInfo(null, ${home.seriesAdded[i].id})" ${backgroundImage} href="javascript:void(0)">
						<span class="name">${home.seriesAdded[i].title}</span>
					</a>
				</li>
			`
		}
		document.querySelector('.series_added_ul').innerHTML = _0x15c0b7
	} else {
		ajax('action=home')
	}
	document.querySelectorAll('.btn-right-scroll').forEach(function (_0x5214fd) {
		_0x5214fd.addEventListener('click', function (_0x1492cc) {
			const _0x33d2db = _0x5214fd.getAttribute('ref')
			_0x4b425e = document.querySelector('.scroll-horizon[id="' + _0x33d2db + '"]')
			scrollAmount = 0
			var _0x5bd7f0 = setInterval(function () {
				_0x4b425e.scrollLeft += 50
				scrollAmount += 50
				if (scrollAmount >= 500) {
					window.clearInterval(_0x5bd7f0)
				}
			}, 35)
		})
	}
	);
	document.querySelectorAll('.btn-left-scroll').forEach(function (_0x22e747) {
		_0x22e747.addEventListener('click', function (_0x43296f) {
			const _0x37e94b = _0x22e747.getAttribute('ref')
			_0x169bc4 = document.querySelector('.scroll-horizon[id="' + _0x37e94b + '"]')
			scrollAmount = 0
			var _0x293f59 = setInterval(function () {
				_0x169bc4.scrollLeft -= 50
				scrollAmount += 50
				if (scrollAmount >= 500) {
					window.clearInterval(_0x293f59)
				}
			}, 35)
		})
	}
	);
}

var vod_first_category_id = ''
function pageVod() {
	document.querySelector('.search_container').style.visibility = 'visible'
	document.querySelector('.search_input_action').value = 'get_vod_streams'
	document.querySelector('.page_content').innerHTML = `
		<div class="channels_categories">
			<ul class="scroll-vertical hide_scrollbar vod_categories_ul">
			</ul>
		</div>
		<div class="movies_content">
			<ul class="scroll-vertical vod_ul">
			</ul>
		</div>
	`
}

function handleModalVod() {
	if (document.querySelector('.modal_vod_container')) {
		document.querySelector('.modal_vod_container').remove()
	}
	var _0x26ecb5 = document.createElement('div')
	_0x26ecb5.innerHTML = `
		<div class="modal_vod_container" style="display: none;">
			<div class="modal_vod_box hide_scrollbar">
				<div id="modal_vod" class="modal_vod_content">
					<div style="position: absolute; right: 50px; top: 10px;">
						<button type="button" name="button" class="modal_vod_close focusable" onclick="document.querySelector('.modal_vod_container').style.display = 'none';">
							<i class='bx bx-x'></i>
						</button>
					</div>
					<div class="vod_cover">
						<img src="" alt="">
						<span class="rate"></span>
					</div>
					<div class="vod_description">
						<p class="title"></p>
						<p class="genre"></p>
						<p class="director"></p>
						<p class="cast"></p>
						<button type="button" name="button" class="btn_watch focusable">
							<span><img src="assets/icons/icon-google-play.svg" alt="Assistir">Assistir</span>
						</button>
						<button type="button" name="button" class="btn_favorite focusable">
							<i class='bx bx-heart'></i>
						</button>
					</div>
					<div class="vod_resume">
						<p></p>
					</div>
					<div class="clear">
					</div>
				</div>
			</div>
		</div>
	`
	document.querySelector('.page_content').append(_0x26ecb5)
}

function handleVodCategories() {
	var _0x2e0281 = localStorage.getItem('vod_categories')
	if (_0x2e0281) {
		_0x2e0281 = JSON.parse(_0x2e0281)
		var _0x2a3f5f = ''
		for (var i = 0; i < _0x2e0281.length; i++) {
			if (_0x2e0281[i].category_id != localStorage.getItem('MOVIE_CATEGORY_CENSORED')) {
				_0x2a3f5f += `
					<li>
						<a class="vod_category_a focusable" onclick="handleVods(null, ${_0x2e0281[i].category_id})" id="${_0x2e0281[i].category_id}" href="javascript:void(0)">${_0x2e0281[i].category_name}</a>
					</li>
				`
			}
		}
		document.querySelector('.vod_categories_ul').innerHTML = _0x2a3f5f
		vod_first_category_id = _0x2e0281[0].category_id
		handleVods(null, vod_first_category_id)
	} else {
		ajax('action=get_vod_categories')
	}
}

function handleVods(_0x22c5e2 = null, _0xa6da62 = null) {
	if (_0x22c5e2) {
		var _0x1d770d = ''
		if (_0x22c5e2.length) {
			if (_0x22c5e2[0].category_id == vod_first_category_id) {
				localStorage.setItem('vods_first_category', JSON.stringify(_0x22c5e2))
			}
			for (var i = 0; i < _0x22c5e2.length; i++) {
				let backgroundImage = _0x22c5e2[i].stream_icon ? `style="background-image: url(${_0x22c5e2[i].stream_icon});"` : '';
				_0x1d770d += `
					<li>
						<a class="focusable vods" onclick="handleVodInfo(null, ${_0x22c5e2[i].stream_id})" ${backgroundImage} href="javascript:void(0)">
							<span class="name">${_0x22c5e2[i].name}</span>
						</a>
					</li>
				`
			}
		} else {
			_0x1d770d = `
				<li style="color: #fff;">Nenhum filme disponível nessa categoria</li>
			`
		}
		let vodCategoryA = document.querySelectorAll('.vod_category_a');
		for (var i = 0; i < vodCategoryA.length; i++) {
			if (vodCategoryA[i].getAttribute('id') == _0x22c5e2[0].category_id) {
				vodCategoryA[i].classList.add('active')
			} else {
				vodCategoryA[i].classList.remove('active')
			}
		}
		document.querySelector('.vod_ul').innerHTML = _0x1d770d
	} else {
		if (_0xa6da62 == vod_first_category_id) {
			var _0x556c92 = localStorage.getItem('vods_first_category')
			if (_0x556c92) {
				_0x556c92 = JSON.parse(_0x556c92)
				handleVods(_0x556c92)
				return
			}
		}
		ajax('action=get_vod_streams&category_id=' + _0xa6da62)
	}
}

async function handleVodInfo(movie = null, vod_id = null) {
	if (movie) {
		document.querySelector('.modal_vod_container').style.display = 'flex'
		document.querySelector('.modal_vod_box').style.backgroundImage = movie.info.movie_image ? 'url(' + movie.info.movie_image + ')' : ''
		document.querySelector('.vod_cover img').setAttribute('src', movie.info.movie_image)
		document.querySelector('.vod_cover .rate').innerHTML = movie.info.rating ? '★ ' + movie.info.rating : ''
		document.querySelector('.vod_description .title').innerHTML = movie.movie_data.name ? movie.movie_data.name : movie.info.name
		document.querySelector('.vod_description .genre').innerHTML = (movie.info.genre ? movie.info.genre : '') + ' | ' + (movie.info.duration ? movie.info.duration : '')
		document.querySelector('.vod_description .director').innerHTML = 'Diretor: ' + (movie.info.director ? movie.info.director : '')
		document.querySelector('.vod_description .cast').innerHTML = 'Elenco: ' + (movie.info.cast ? movie.info.cast : '')
		document.querySelector('.vod_resume p').innerHTML = movie.info.plot ? movie.info.plot : ''
		document.querySelector('.btn_watch').setAttribute('onclick', `handleVideo('${DNS}/movie/${username}/${password}/${movie.movie_data.stream_id}.${movie.movie_data.container_extension}', 'video/mp4')`)
	} else {
		await ajax('action=get_vod_info&vod_id=' + vod_id)
	}
}

var serie_first_category_id = ''
function pageSeries() {
	document.querySelector('.search_container').style.visibility = 'visible'
	document.querySelector('.search_input_action').value = 'get_series'
	document.querySelector('.page_content').innerHTML = `
		<div class="channels_categories">
			<ul id='menu-series' class="scroll-vertical hide_scrollbar vod_categories_ul">
			</ul>
		</div>
		<div class="movies_content">
			<ul class="scroll-vertical vod_ul">
			</ul>
		</div>
	`
}

function handleModalSerie() {
	if (document.querySelector('.modal_vod_container')) {
		document.querySelector('.modal_vod_container').remove()
	}
	var _0x32604e = document.createElement('div')
	_0x32604e.innerHTML = `
		<div class="modal_vod_container" style="display: none;">
			<div class="modal_vod_box hide_scrollbar">
				<div id="modal_movie" class="modal_vod_content">
					<div style="position: absolute; right: 50px; top: 10px;">
						<button type="button" name="button" class="modal_vod_close focusable close_modal_serie" onclick="document.querySelector('.modal_vod_container').style.display = 'none';">
							<i class='bx bx-x'></i>
						</button>
					</div>
					<div class="vod_cover">
						<img src="" alt="">
						<span class="rate"></span>
					</div>
					<div class="vod_description">
						<p class="title"></p>
						<p class="genre"></p>
						<p class="director"></p>
						<p class="cast"></p>
						<div class="vod_resume">
							<p></p>
						</div>
						<button type="button" name="button" class="btn_favorite focusable">
							<i class='bx bx-heart' ></i>
						</button>
					</div>
					<div class="seasons_container">
						<div class="seasons_content">
							<ul class="seasons_ul hide_scrollbar scroll-horizon">
							</ul>
							<div class="section_new_container carousel_section_generic_container">
								<div class="section_new_content carousel_section_generic_content small box_episodes">
								</div>
							</div>
						</div>
					</div>
					<div class="arrows">
						<i class="bx bx-chevron-left left-scroll focusable" ref=""></i>
						<i class="bx bx-chevron-right right-scroll focusable" ref=""></i>
					</div>
					<div class="clear"></div>
				</div>
			</div>
		</div>
	`
	document.querySelector('.page_content').append(_0x32604e)
}

function handleSeriesCategories() {
	var _0x2e58ec = localStorage.getItem('series_categories')
	if (_0x2e58ec) {
		_0x2e58ec = JSON.parse(_0x2e58ec)
		var _0x102d97 = ''
		for (var i = 0; i < _0x2e58ec.length; i++) {
			if (_0x2e58ec[i].category_id != localStorage.getItem('SERIE_CATEGORY_CENSORED')) {
				_0x102d97 += `
					<li>
						<a class="vod_category_a focusable" onclick="handleSeries(null, ${_0x2e58ec[i].category_id})" id="${_0x2e58ec[i].category_id}" href="javascript:void(0)">${_0x2e58ec[i].category_name}</a>
					</li>
				`
			}
		}
		document.querySelector('.vod_categories_ul').innerHTML = _0x102d97
		serie_first_category_id = _0x2e58ec[0].category_id
		handleSeries(null, serie_first_category_id)
	} else {
		ajax('action=get_series_categories')
	}
}

function handleSeries(_0x3f516d = null, _0x39c2db = null) {
	if (_0x3f516d) {
		var _0xc11cca = ''
		if (_0x3f516d.length) {
			if (_0x3f516d[0].category_id == serie_first_category_id) {
				localStorage.setItem('series_first_category', JSON.stringify(_0x3f516d))
			}
			for (var i = 0; i < _0x3f516d.length; i++) {
				let backgroundImage = _0x3f516d[i].cover ? `style="background-image: url(${_0x3f516d[i].cover});"` : '';
				_0xc11cca += `
					<li>
						<a class="focusable" onclick="handleSerieInfo(null, ${_0x3f516d[i].series_id})" ${backgroundImage} href="javascript:void(0)">
							<span class="name">${_0x3f516d[i].name}</span>
						</a>
					</li>
				`
			}
		} else {
			_0xc11cca = `
				<li style="color: #fff;">Nenhuma série disponível nessa categoria</li>
			`
		}
		let vodCategoryA = document.querySelectorAll('.vod_category_a');
		for (var i = 0; i < vodCategoryA.length; i++) {
			if (vodCategoryA[i].getAttribute('id') == _0x3f516d[0].category_id) {
				vodCategoryA[i].classList.add('active')
			} else {
				vodCategoryA[i].classList.remove('active')
			}
		}
		document.querySelector('.vod_ul').innerHTML = _0xc11cca
	} else {
		if (_0x39c2db == serie_first_category_id) {
			var _0x1900dc = localStorage.getItem('series_first_category')
			if (_0x1900dc) {
				_0x1900dc = JSON.parse(_0x1900dc)
				handleSeries(_0x1900dc)
				return
			}
		}
		ajax('action=get_series&category_id=' + _0x39c2db)
	}
}

async function handleSerieInfo(serie = null, series_id = null) {
	if (serie) {
		document.querySelector('.modal_vod_container').style.display = 'flex'
		document.querySelector('.modal_vod_box').style.backgroundImage = serie.info.cover ? 'url(' + serie.info.cover + ')' : ''
		document.querySelector('.vod_cover img').setAttribute('src', serie.info.cover)
		document.querySelector('.vod_cover .rate').innerHTML = serie.info.rating ? '★ ' + serie.info.rating : ''
		document.querySelector('.vod_description .title').innerHTML = serie.info.name ? serie.info.name : ''
		document.querySelector('.vod_description .genre').innerHTML = (serie.info.genre ? serie.info.genre : '') + ' | ' + (serie.info.duration ? serie.info.duration : '')
		document.querySelector('.vod_description .director').innerHTML = 'Diretor: ' + (serie.info.director ? serie.info.director : '')
		document.querySelector('.vod_description .cast').innerHTML = 'Elenco: ' + (serie.info.cast ? serie.info.cast : '')
		document.querySelector('.vod_resume p').innerHTML = serie.info.plot ? serie.info.plot : ''
		if (serie.episodes) {
			var first = true;
			var seasons_ul = ''
			var box_episodes = ''
			for (const [id, seasons] of Object.entries(serie.episodes)) {
				seasons_ul += `
					<li class="seasons_li">
						<p class="title">
							<a href="javascript:void(0)" onclick="handleChangeSeason(${id})" id="${id}" class="focusable li_season ${first ? "active" : ""}">Temporada ${id}</a>
						</p>
					</li>
				`
				box_episodes += `
					<ul class="hide_scrollbar scroll-horizon episodes_ul" id="${id}" style="padding-left: 5px; display: ${first ? "flex" : "none"};">
				`
				for (const [_0x5ed346, episode] of Object.entries(seasons)) {
					let backgroundImage = episode.info.movie_image ? `style="background-image: url(${episode.info.movie_image});"` : '';
					box_episodes += `
						<li>
							<a class="focusable" ${backgroundImage} onclick="handleVideo('${DNS}/series/${username}/${password}/${episode.id}.${episode.container_extension}', 'video/mp4')" href="javascript:void(0)">
								<span class="name">${episode.title}</span>
							</a>
						</li>
					`
				}
				box_episodes += '</ul>'
				first = false;
			}
			document.querySelector('.seasons_ul').innerHTML = seasons_ul
			document.querySelector('.box_episodes').innerHTML = box_episodes
		}
	} else {
		await ajax('action=get_series_info&series_id=' + series_id)
	}
	document.querySelectorAll('.right-scroll').forEach(function (_0xeca053) {
		_0xeca053.addEventListener('click', function (_0x379bc0) {
			const _0x13ae23 = document.querySelector(".seasons_li a[class='focusable li_season active']").getAttribute('id')
			_0x3fb80f = document.querySelector('.episodes_ul[id="' + _0x13ae23 + '"]')
			scrollAmount = 0
			var _0x562b64 = setInterval(function () {
				_0x3fb80f.scrollLeft += 50
				scrollAmount += 50
				if (scrollAmount >= 500) {
					window.clearInterval(_0x562b64)
				}
			}, 35)
		})
		_0xeca053.addEventListener('keydown', function (_0x1e7dbe) {
			if (_0x1e7dbe.code == 'Enter') {
				const _0x55f699 = document.querySelector(".seasons_li a[class='focusable li_season active']").getAttribute('id')
				_0xeba016 = document.querySelector('.episodes_ul[id="' + _0x55f699 + '"]')
				scrollAmount = 0
				var _0x3241a2 = setInterval(function () {
					_0xeba016.scrollLeft += 50
					scrollAmount += 50
					if (scrollAmount >= 500) {
						window.clearInterval(_0x3241a2)
					}
				}, 35)
			}
		})
	}
	);
	document.querySelectorAll('.left-scroll').forEach(function (_0x24e237) {
		_0x24e237.addEventListener('click', function (_0x5385c2) {
			const _0x36cdf3 = document.querySelector(".seasons_li a[class='focusable li_season active']").getAttribute('id')
			_0x204b8f = document.querySelector('.episodes_ul[id="' + _0x36cdf3 + '"]')
			scrollAmount = 0
			var _0x542209 = setInterval(function () {
				_0x204b8f.scrollLeft -= 50
				scrollAmount += 50
				if (scrollAmount >= 500) {
					window.clearInterval(_0x542209)
				}
			}, 35)
		})
		_0x24e237.addEventListener('keydown', function (_0x2c6981) {
			if (_0x2c6981.code == 'Enter') {
				const _0x4c7a6f = document.querySelector(".seasons_li a[class='focusable li_season active']").getAttribute('id')
				_0x4a6dda = document.querySelector('.episodes_ul[id="' + _0x4c7a6f + '"]')
				scrollAmount = 0
				var _0x4fd5d5 = setInterval(function () {
					_0x4a6dda.scrollLeft -= 50
					scrollAmount += 50
					if (scrollAmount >= 500) {
						window.clearInterval(_0x4fd5d5)
					}
				}, 35)
			}
		})
	}
	)
}

function handleChangeSeason(id) {
	var seasons_li_a = document.querySelectorAll('.seasons_li a')
	for (var i = 0; i < seasons_li_a.length; i++) {
		seasons_li_a[i].classList.remove('active')
	}
	document.querySelector(".seasons_li a[id='" + id + "']").classList.add('active')
	var episodes_ul = document.querySelectorAll('.episodes_ul')
	for (var i = 0; i < episodes_ul.length; i++) {
		if (episodes_ul[i].getAttribute('id') == id) {
			episodes_ul[i].style.display = 'flex'
		} else {
			episodes_ul[i].style.display = 'none'
		}
	}
}

var live_first_category_id = ''
function pageLives() {
	document.querySelector('.search_container').style.visibility = 'visible'
	document.querySelector('.search_input_action').value = 'get_live_streams'
	document.querySelector('.page_content').innerHTML = `
		<div class="favorites_container">
			<div class="channels_categories">
				<ul id="channels_categories" class="scroll-vertical hide_scrollbar vod_categories_ul">
				</ul>
			</div>
			<div class="channels_list">
				<ul class="scroll-vertical hide_scrollbar channels_ul">
				</ul>
			</div>
			<div id="channels_view_container" class="channels_view_container">
				<div id="player_container" class="channels_view_content">
				</div>
				<button style="display: block; margin: 15px 0; text-align: right; width: 100%;" type="button" name="button" class="btn_favorite focusable">
				</button>
				<ul class="epg_ul">
				</ul>
			</div>
		</div>
	`
}

function handleLivesCategories() {
	var _0x5ad5fd = localStorage.getItem('live_categories')
	if (_0x5ad5fd) {
		_0x5ad5fd = JSON.parse(_0x5ad5fd)
		var _0x59ecbe = ''
		for (var i = 0; i < _0x5ad5fd.length; i++) {
			if (_0x5ad5fd[i].category_id != localStorage.getItem('CHANNEL_CATEGORY_CENSORED')) {
				_0x59ecbe += `
					<li>
						<a class="vod_category_a focusable" onclick="handleLives(null, ${_0x5ad5fd[i].category_id})" id="${_0x5ad5fd[i].category_id}" href="javascript:void(0)">${_0x5ad5fd[i].category_name}</a>
					</li>
				`
			}
		}
		document.querySelector('.vod_categories_ul').innerHTML = _0x59ecbe
		live_first_category_id = _0x5ad5fd[0].category_id
		handleLives(null, live_first_category_id)
	} else {
		ajax('action=get_live_categories')
	}
}

function handleLives(_0x22bf98 = null, _0x356089 = null) {
	if (_0x22bf98) {
		var _0x580c45 = ''
		if (_0x22bf98.length) {
			if (_0x22bf98[0].category_id == live_first_category_id) {
				localStorage.setItem('lives_first_category', JSON.stringify(_0x22bf98))
			}
			for (var i = 0; i < _0x22bf98.length; i++) {
				_0x580c45 += `
					<li>
						<a class="live_a focusable" onclick="handleLiveInfo(null, ${_0x22bf98[i].stream_id}); watchLive('${DNS}/live/${username}/${password}/${_0x22bf98[i].stream_id}.m3u8')" id="${_0x22bf98[i].stream_id}" href="javascript:void(0)">
							<img src="${_0x22bf98[i].stream_icon}" alt="${_0x22bf98[i].name}">
							<span>${_0x22bf98[i].name}</span>
						</a>
					</li>
				`
			}
		} else {
			_0x580c45 = `<li style="color: #fff;">Nenhum canal disponível nessa categoria</li>`
		}
		let vodCategoryA = document.querySelectorAll('.vod_category_a');
		for (var i = 0; i < vodCategoryA.length; i++) {
			if (vodCategoryA[i].getAttribute('id') == _0x22bf98[0].category_id) {
				vodCategoryA[i].classList.add('active')
			} else {
				vodCategoryA[i].classList.remove('active')
			}
		}
		document.querySelector('.channels_ul').innerHTML = _0x580c45
	} else {
		if (_0x356089 == live_first_category_id) {
			var _0x8ad191 = localStorage.getItem('lives_first_category')
			if (_0x8ad191) {
				_0x8ad191 = JSON.parse(_0x8ad191)
				handleLives(_0x8ad191)
				return
			}
		}
		ajax('action=get_live_streams&category_id=' + _0x356089)
	}
}

function handleLiveInfo(_0x1db56f = null, _0x5dacbe = null) {
	if (_0x1db56f) {
		var _0x456096 = ''
		if (_0x1db56f.epg_listings.length) {
			for (var i = 0; i < _0x1db56f.epg_listings.length; i++) {
				var _0x54efe4 = new Date(parseInt(_0x1db56f.epg_listings[i].start_timestamp) * 1000)
				_0x3036e9 = new Date(parseInt(_0x1db56f.epg_listings[i].stop_timestamp) * 1000)
				_0x456096 += `
					<li class="li_epg focusable">
						<p class="title">
							<span class="time">
								${_0x54efe4.getHours()}:${_0x54efe4.getMinutes()} - ${_0x3036e9.getHours()}:${_0x3036e9.getMinutes()}
							</span> | ${decodeURIComponent(escape(window.atob(_0x1db56f.epg_listings[i].title)))}
						</p>
						<p class="description">
							${decodeURIComponent(escape(window.atob(_0x1db56f.epg_listings[i].description)))}
						</p>
					</li>
				`
			}
		}
		document.querySelector('.epg_ul').innerHTML = _0x456096
	} else {
		var _0x5eaf4f = document.querySelectorAll('.channels_list a')
		for (var i = 0; i < _0x5eaf4f.length; i++) {
			if (_0x5eaf4f[i].getAttribute('id') == _0x5dacbe) {
				_0x5eaf4f[i].classList.add('active')
			} else {
				_0x5eaf4f[i].classList.remove('active')
			}
		}
		ajax('action=get_short_epg&stream_id=' + _0x5dacbe + '&limit=10', true)
	}
}

var count = 0
function watchLive(_0x1d81e2) {
	jwplayer('player_container').setup({
		file: _0x1d81e2,
		width: '100%',
		aspectratio: '16:9',
	}).on('error', function (_0x1ad0bd) {
		if (count <= 10) {
			trigger('Erro ao carregar, tentativa ' + count + '/10', 'warning')
			setTimeout(function () {
				watchLive(_0x1d81e2)
			}, 3000)
		}
		count++
	})
}

function pageFavorites() {
	document.querySelector('.page_content').innerHTML = `
		<div class="favorites_container">
			<div class="section_new_container carousel_section_generic_container lives" style="display: none;">
				<div class="section_new_content carousel_section_generic_content small">
					<div class="section_new_title carousel_section_generic_title">
						<p>Canais Favoritos</p>
					</div>
					<ul class="hide_scrollbar scroll-horizon lives_ul">
					</ul>
				</div>
			</div>
			<div class="section_new_container carousel_section_generic_container movies" style="display: none;">
				<div class="section_new_content carousel_section_generic_content small">
					<div class="section_new_title carousel_section_generic_title">
						<p>Filmes Favoritos</p>
					</div>
					<ul id="favorites-movies" class="hide_scrollbar scroll-horizon movies_ul">
					</ul>
				</div>
			</div>
			<div class="section_new_container carousel_section_generic_container series" style="display: none;">
				<div class="section_new_content carousel_section_generic_content small">
					<div class="section_new_title carousel_section_generic_title">
						<p>Séries Favoritas</p>
					</div>
					<ul class="hide_scrollbar scroll-horizon series_ul">
					</ul>
				</div>
			</div>
		</div>
	`
}

async function handleFavorites() {
	document.querySelector('.section_new_container.movies').style.display = 'none'
	document.querySelector('.section_new_container.lives').style.display = 'none'
	document.querySelector('.section_new_container.series').style.display = 'none'
	var _0x326abb = localStorage.getItem('favorites')
	if (_0x326abb) {
		_0x326abb = JSON.parse(_0x326abb)
		var _0x4c4ea9 = ''
		if (_0x326abb.movies.length) {
			for (var i = 0; i < _0x326abb.movies.length; i++) {
				let backgroundImage = _0x326abb.movies[i].movie_image ? `style="background-image: url(${_0x326abb.movies[i].movie_image});"` : '';
				_0x4c4ea9 += `
					<li>
						<a class="focusable" onclick="handleModalVod(); handleVodInfo(null, ${_0x326abb.movies[i].id})" ${backgroundImage} href="javascript:void(0)">
							<span class="name">${_0x326abb.movies[i].stream_display_name}</span>
						</a>
					</li>
				`
			}
			document.querySelector('.section_new_container.movies').style.display = 'block'
		}
		document.querySelector('.movies_ul').innerHTML = _0x4c4ea9
		_0x4c4ea9 = ''
		if (_0x326abb.series.length) {
			for (var i = 0; i < _0x326abb.series.length; i++) {
				let backgroundImage = _0x326abb.series[i].cover ? `style="background-image: url(${_0x326abb.series[i].cover});"` : '';
				_0x4c4ea9 += `
					<li>
						<a class="focusable" onclick="handleModalSerie(); handleSerieInfo(null, ${_0x326abb.series[i].id})" ${backgroundImage} href="javascript:void(0)">
							<span class="name">${_0x326abb.series[i].title}</span>
						</a>
					</li>
				`
			}
			document.querySelector('.section_new_container.series').style.display = 'block'
		}
		document.querySelector('.series_ul').innerHTML = _0x4c4ea9
		_0x4c4ea9 = ''
		if (_0x326abb.lives.length) {
			for (var i = 0; i < _0x326abb.lives.length; i++) {
				let backgroundImage = _0x326abb.lives[i].stream_icon ? `style="background-image: url(${_0x326abb.lives[i].stream_icon});"` : '';
				_0x4c4ea9 += `
					<li>
						<a class="focusable" onclick="handlePage('lives'); watchLive('${DNS}/live/${username}/${password}/${_0x326abb.lives[i].id}.m3u8'); handleLiveInfo(null, ${_0x326abb.lives[i].id});" ${backgroundImage} href="javascript:void(0)" class="live">
							<span class="name">${_0x326abb.lives[i].stream_display_name}</span>
						</a>
					</li>
				`
			}
			document.querySelector('.section_new_container.lives').style.display = 'block'
		}
		document.querySelector('.lives_ul').innerHTML = _0x4c4ea9
	} else {
		ajax('action=get_favorites')
	}
}

function storeFavorite(_0x4ab0c6, _0x3cb215) {
	ajax('action=store_favorite&' + _0x3cb215 + '=' + _0x4ab0c6)
}

function deleteFavorite(_0x4f509c, _0x4d5427) {
	ajax('action=delete_favorite&' + _0x4d5427 + '=' + _0x4f509c)
}

var timeHideBackButton = 0
setInterval(function () {
	timeHideBackButton--
	if (timeHideBackButton <= 0) {
		document.querySelector('.player_video_close').style.visibility = 'hidden'
		document.querySelector('.player_video_prev').style.visibility = 'hidden'
		document.querySelector('.player_video_next').style.visibility = 'hidden'
		document.querySelector('.title_vod').style.visibility = 'hidden'
		if (document.querySelector('.control-player')) {
			document.querySelector('.control-player').style.display = 'none'
		}
	}
}, 1000)

document.querySelector('.player_video_container').addEventListener('mousemove', function (_0x5d2551) {
	timeHideBackButton = 3
	document.querySelector('.player_video_close').style.visibility = 'visible'
	document.querySelector('.player_video_prev').style.visibility = 'visible'
	document.querySelector('.player_video_next').style.visibility = 'visible'
	document.querySelector('.title_vod').style.visibility = 'visible'
	document.querySelector('.control-player').style.display = 'flex'
})

document.querySelector('.player_video_close').onclick = function () {
	document.querySelector('.player_video_container').style.display = 'none'
	document.querySelector('.player_video_close').style.visibility = 'hidden'
	document.querySelector('.player_video_prev').style.visibility = 'hidden'
	document.querySelector('.player_video_next').style.visibility = 'hidden'
	document.querySelector('.title_vod').style.visibility = 'hidden'
	document.querySelector('.control-player').style.display = 'none'
	document.querySelector('.player_video_content').innerHTML = ''
}

document.addEventListener('keydown', function (_0x3be016) {
	if (document.querySelector('.player_video_container').style.display == 'flex') {
		timeHideBackButton = 3
		document.querySelector('.player_video_close').style.visibility = 'visible'
		document.querySelector('.player_video_prev').style.visibility = 'visible'
		document.querySelector('.player_video_next').style.visibility = 'visible'
		document.querySelector('.title_vod').style.visibility = 'visible'
		document.querySelector('.control-player').style.display = 'flex'
	}
})

document.addEventListener('click', function (e) {
	if (e.target.classList.value == 'modal_vod_container') {
		document.querySelector('.modal_vod_container').style.display = 'none';
	}
});

function handleVideo(link, type) {
	let player_video_container = document.querySelector('.player_video_container');
	let player_video_content = player_video_container.querySelector('.player_video_content');

	player_video_content.innerHTML = '<video id="my-player" class="video-js vjs-default-skin vjs-big-play-centered" style="width:100%; height:100%; border:0px; outline:none; aspect-ratio:16/9;" controls loop src=""></video><div class="control-player" style="z-index:-1;"></div>';
	player_video_container.style.display = 'flex';

	let player = videojs("my-player", {
		controlBar: {
			children: ["playToggle", "volumePanel", "currentTimeDisplay", "progressControl", "durationDisplay", "subsCapsButton", "PictureInPictureToggle", "fullscreenToggle",],
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

	let videoCode = btoa(link.substring(Math.max(link.length - 16, 0), link.length));

	let timestamps = JSON.parse(localStorage.getItem("Timestamps"));
	if (timestamps == null) {
		timestamps = new Object();
	}

	player.ready(function () {
		let initValue = timestamps[videoCode];
		if (initValue != null) {
			player.currentTime(initValue);
		}

		let volume = localStorage.getItem("Volume");
		if (volume != null) {
			player.volume(volume * 0.01);
		}

		let fullscreen = localStorage.getItem("Fullscreen");
		if (fullscreen != null) {
			player.requestFullscreen();
			localStorage.removeItem("Fullscreen");
		}

		player.autoplay(true);
		player.play();

		keep_watching(link, timestamps[videoCode]);

		let lastSeconds = null;
		let lastSecondsTwo = null;
		player.on("timeupdate", function () {
			let seconds = Math.floor(player.currentTime());
			if ((seconds % 5) == 0 && seconds != lastSeconds) {
				lastSeconds = seconds;
				timestamps[videoCode] = seconds;
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

		let player_video_prev = document.querySelector('.player_video_prev');
		let player_video_next = document.querySelector('.player_video_next');

		player_video_prev.style.display = 'none';
		player_video_next.style.display = 'none';
		player_video_next.onclick = null;

		let title_vod = document.querySelector('.title_vod');
		title_vod.style.cssText = "padding:10px 80px;color:white;";

		let player_video_close = document.querySelector('.player_video_close');
		player_video_close.style.cssText = "padding:8px 10px;width:50px;height:48px;";
		player_video_close.onclick = function () {
			player_video_container.style.display = 'none';
			player_video_close.style.visibility = 'hidden';
			player_video_prev.style.visibility = 'hidden';
			player_video_next.style.visibility = 'hidden';
			title_vod.style.visibility = 'hidden';
			player.dispose();
			player = null;
			player_video_content.innerHTML = '';
		}

		if (link.includes('/movie/')) {
			let vod_description_title = document.querySelector('.vod_description .title');
			title_vod.innerHTML = '<h2>' + vod_description_title.textContent + '</h2>';
		} else if (link.includes('/series/')) {
			let episodes = document.querySelectorAll('.episodes_ul li a');

			for (let i = 0; i < episodes.length; i++) {
				if (episodes[i].getAttribute('onclick').includes(link)) {
					episodes[i].classList.add('active-border');
					episodes[i].scrollIntoView();

					title_vod.innerHTML = '<h2>' + episodes[i].querySelector("span").textContent + '</h2>';

					handleChangeSeason(episodes[i].parentNode.parentNode.getAttribute('id'));

					let prev_episode = episodes[i - 1];
					let next_episode = episodes[i + 1];

					if (prev_episode != null) {
						player_video_prev.style.display = 'block';
						player_video_prev.addEventListener('click', function () {
							if (player != null) {
								player.dispose();
								player = null;
							}
							prev_episode.click();
						});
					}
					if (next_episode != null) {
						player_video_next.style.display = 'block';
						player_video_next.addEventListener('click', function () {
							if (player != null) {
								player.dispose();
								player = null;
							}
							timestamps[videoCode] = 0;
							next_episode.click();
						});
					}
				} else {
					episodes[i].classList.remove('active-border');
				}
			}
		}
	});
}

function keep_watching(src, time) {
	try {
		if (time > 60) {
			var id = src.replace(/^.*[\\\/]/, '').split('.')[0];
			ajax('action=keep_watching&id=' + id + '&time=' + time, false);
		}
	} catch (error) {
		console.log(error);
	}
}

const DNS = 'http://lmtv.me';
const API_BASE = 'http://player.limetv.me/player_api.php?';

function corsProxy(url) {
	return "https://corsproxy.io/?url=" + encodeURIComponent(url);
}

localStorage.removeItem('avatar');
localStorage.removeItem('home');
localStorage.removeItem('favorites');
localStorage.removeItem('vod_categories');
localStorage.removeItem('series_categories');
localStorage.removeItem('live_categories');
localStorage.removeItem('vods_first_category');
localStorage.removeItem('series_first_category');
localStorage.removeItem('lives_first_category');

var avatar = '';
var username = '';
var password = '';

const forms = document.querySelectorAll('form')
if (forms.length) {
	for (var i = 0; i < forms.length; i++) {
		forms[i].addEventListener('submit', function (_0x570556) {
			_0x570556.preventDefault();
			ajax(serialize(_0x570556.target));
		});
	}
}


btn()
login()

var user = JSON.parse(localStorage.getItem('user_info'))
if (user && user.username && user.password) {
	loading(true)
	var xhr = new XMLHttpRequest()
	xhr.onload = function (_0x13656e) {
		if (xhr.readyState === 4) {
			loading(false)
			try {
				const _0x53997f = JSON.parse(xhr.response)
				if (typeof _0x53997f.setItem !== 'undefined') {
					for (const [_0x252660, _0x44b14a] of Object.entries(_0x53997f.setItem)) {
						localStorage.setItem(_0x252660, _0x44b14a)
					}
				}
				login()
				btn()
				scroll()
			} catch (_0x413d3b) { }
		}
	}
	xhr.onerror = function (_0x3fe347) {
		console.error(xhr.statusText)
		loading(false)
	}
	xhr.open('GET', corsProxy(API_BASE + `username=${user.username}&password=${user.password}`), false)
	xhr.send()
}