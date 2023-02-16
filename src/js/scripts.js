const API_BASE = document
	.querySelector('link[rel="API_BASE"]')
	.getAttribute('href'),
	DNS = document.querySelector('link[rel="DNS"]').getAttribute('href')
var allowedCount = 0,
	allowed = false,
	reset = 0
document.addEventListener('keydown', function (_0x47a106) {
	if (_0x47a106.keyCode == 68) {
		allowedCount++
		if (allowedCount >= 10) {
			alert('Download Habilitado')
			allowed = true
			allowedCount = 0
			reset = 0
		}
	}
	if (_0x47a106.keyCode == 82) {
		reset++
		if (reset >= 10) {
			alert('Download Desabilitado')
			allowed = false
			allowedCount = 0
			reset = 0
		}
	}
})
myStorage = window.localStorage
myStorage.removeItem('avatar')
myStorage.removeItem('home')
myStorage.removeItem('favorites')
myStorage.removeItem('vod_categories')
myStorage.removeItem('series_categories')
myStorage.removeItem('live_categories')
myStorage.removeItem('vods_first_category')
myStorage.removeItem('series_first_category')
myStorage.removeItem('lives_first_category')
var username = '',
	password = '',
	avatar = myStorage.getItem('avatar')
function serialize(_0xdb48dd) {
	if (!_0xdb48dd || _0xdb48dd.nodeName !== 'FORM') {
		return
	}
	var _0x25f6a4,
		_0xfcdf4d,
		_0x331295 = []
	for (
		_0x25f6a4 = _0xdb48dd.elements.length - 1;
		_0x25f6a4 >= 0;
		_0x25f6a4 = _0x25f6a4 - 1
	) {
		if (_0xdb48dd.elements[_0x25f6a4].name === '') {
			continue
		}
		switch (_0xdb48dd.elements[_0x25f6a4].nodeName) {
			case 'INPUT':
				switch (_0xdb48dd.elements[_0x25f6a4].type) {
					case 'text':
					case 'hidden':
					case 'password':
					case 'button':
					case 'reset':
					case 'submit':
						_0x331295.push(
							_0xdb48dd.elements[_0x25f6a4].name +
							'=' +
							encodeURIComponent(_0xdb48dd.elements[_0x25f6a4].value)
						)
						break
					case 'checkbox':
					case 'radio':
						_0xdb48dd.elements[_0x25f6a4].checked &&
							_0x331295.push(
								_0xdb48dd.elements[_0x25f6a4].name +
								'=' +
								encodeURIComponent(_0xdb48dd.elements[_0x25f6a4].value)
							)
						break
					case 'file':
						break
				}
				break
			case 'TEXTAREA':
				_0x331295.push(
					_0xdb48dd.elements[_0x25f6a4].name +
					'=' +
					encodeURIComponent(_0xdb48dd.elements[_0x25f6a4].value)
				)
				break
			case 'SELECT':
				switch (_0xdb48dd.elements[_0x25f6a4].type) {
					case 'select-one':
						_0x331295.push(
							_0xdb48dd.elements[_0x25f6a4].name +
							'=' +
							encodeURIComponent(_0xdb48dd.elements[_0x25f6a4].value)
						)
						break
					case 'select-multiple':
						for (
							_0xfcdf4d = _0xdb48dd.elements[_0x25f6a4].options.length - 1;
							_0xfcdf4d >= 0;
							_0xfcdf4d = _0xfcdf4d - 1
						) {
							_0xdb48dd.elements[_0x25f6a4].options[_0xfcdf4d].selected &&
								_0x331295.push(
									_0xdb48dd.elements[_0x25f6a4].name +
									'=' +
									encodeURIComponent(
										_0xdb48dd.elements[_0x25f6a4].options[_0xfcdf4d].value
									)
								)
						}
						break
				}
				break
			case 'BUTTON':
				switch (_0xdb48dd.elements[_0x25f6a4].type) {
					case 'reset':
					case 'submit':
					case 'button':
						_0x331295.push(
							_0xdb48dd.elements[_0x25f6a4].name +
							'=' +
							encodeURIComponent(_0xdb48dd.elements[_0x25f6a4].value)
						)
						break
				}
				break
		}
	}
	return _0x331295.join('&')
}
function paramsToObject(_0xc10e3f) {
	const _0x1df60a = { _0x39efdc: _0x4ebc3e }
	for (const [_0x39efdc, _0x4ebc3e] of _0xc10e3f) {
	}
	return _0x1df60a
}
function loading(_0x598873 = true) {
	var _0x4ed7d4 = document.querySelector('.loading')
	_0x598873
		? (_0x4ed7d4.style.display = 'flex')
		: (_0x4ed7d4.style.display = 'none')
}
function loadingVideo(_0x4a3c08 = true) {
	var _0x54b6af = document.querySelector('.loading-video')
	_0x4a3c08
		? (_0x54b6af.style.display = 'flex')
		: (_0x54b6af.style.display = 'none')
}
function trigger(_0x205c3d, _0x2bc8ad = 'success') {
	var _0x3e9670 = document.querySelector('.trigger_container')
	_0x3e9670.style.display = 'block'
	_0x3e9670.classList.add(_0x2bc8ad)
	document.querySelector('.trigger_message').innerHTML = _0x205c3d
	setTimeout(function () {
		_0x3e9670.style.display = 'none'
	}, 5000)
}
function ajax(_0xb20ed3, _0x23ef6a = true) {
	_0x23ef6a && loading(true)
	var _0x3df5ef = JSON.parse(
		'{"' +
		decodeURI(_0xb20ed3)
			.replace(/"/g, '\\"')
			.replace(/&/g, '","')
			.replace(/=/g, '":"') +
		'"}'
	)
		; (typeof _0x3df5ef.username == 'undefined' ||
			typeof _0x3df5ef.password == 'undefined') &&
			(_0xb20ed3 =
				'username=' + username + '&password=' + password + '&' + _0xb20ed3)
	avatar && (_0xb20ed3 += '&avatar_id=' + avatar.id)
	var _0x5d5001 = new XMLHttpRequest()
	_0x5d5001.open('GET', API_BASE + '/player_api.php?' + _0xb20ed3, true)
	_0x5d5001.onload = function (_0x328237) {
		if (_0x5d5001.readyState === 4) {
			loading(false)
			try {
				const _0x16a179 = JSON.parse(_0x5d5001.response)
				typeof _0x16a179.trigger !== 'undefined' &&
					trigger(_0x16a179.trigger.msg, _0x16a179.trigger.type)
				if (typeof _0x16a179.display !== 'undefined') {
					for (const [_0x2e1458, _0x3ca81f] of Object.entries(
						_0x16a179.display
					)) {
						document.querySelector(_0x2e1458).style.display = _0x3ca81f
					}
				}
				if (typeof _0x16a179.setItem !== 'undefined') {
					for (const [_0x1a8ebf, _0x3c332c] of Object.entries(
						_0x16a179.setItem
					)) {
						myStorage.setItem(_0x1a8ebf, _0x3c332c)
					}
				}
				if (typeof _0x16a179.innerHTML !== 'undefined') {
					for (const [_0x410d7b, _0x521428] of Object.entries(
						_0x16a179.innerHTML
					)) {
						document.querySelector(_0x410d7b).innerHTML = _0x521428
					}
				}
				if (typeof _0x16a179.callFunction !== 'undefined') {
					for (const [_0x3f14b1, _0x293632] of Object.entries(
						_0x16a179.callFunction
					)) {
						eval(
							_0x3f14b1 +
							'(' +
							(_0x293632 && _0x293632.length ? _0x293632 : '') +
							')'
						)
					}
				}
				login()
				btn()
				scroll()
			} catch (_0x50696b) { }
		}
	}
	_0x5d5001.onerror = function (_0x29a241) {
		console.error(_0x5d5001.statusText)
		loading(false)
	}
	_0x5d5001.send(null)
}
const forms = document.querySelectorAll('form')
if (forms.length) {
	for (var i = 0; i < forms.length; i++) {
		forms[i].addEventListener('submit', (_0x570556) => {
			_0x570556.preventDefault()
			var _0x2419f0 = serialize(_0x570556.target)
			ajax(_0x2419f0)
		})
	}
}
function btn() {
	var _0x45b224 = document.querySelectorAll('.j_btn')
	for (var _0x58ec26 = 0; _0x58ec26 < _0x45b224.length; _0x58ec26++) {
		var _0x447269 = _0x45b224[_0x58ec26],
			_0x2312ed = _0x447269.cloneNode(true)
		_0x2312ed.addEventListener('click', function (_0x2b6c06) {
			var _0x3df9f4 = this.getAttribute('_action'),
				_0x7675c = this.getAttribute('id'),
				_0x1545f5 = this.getAttribute('_data')
			switch (_0x3df9f4) {
				case 'handleAvatar':
					var _0x21f77c = JSON.parse(myStorage.getItem('user_info')).avatars
					const _0x5ee19f = _0x21f77c.filter(
						(_0x38f099) => _0x38f099.id == _0x7675c
					)[0]
					myStorage.setItem('avatar', JSON.stringify(_0x5ee19f)),
						myStorage.removeItem('favorites'),
						login(),
						handlePage('home')
					break
				case 'avatar':
					var _0x21f77c = JSON.parse(myStorage.getItem('user_info')).avatars
					const _0x511bfb = _0x21f77c.filter(
						(_0x3b5089) => _0x3b5089.id == _0x7675c
					)[0]
					ajax('action=delete_avatar&avatar_id=' + _0x511bfb.id), login()
					break
				case 'exit':
					myStorage.clear(),
						(document.querySelector('.profile_container').style.display =
							'none'),
						login()
					break
				case 'changeAvatar':
					myStorage.removeItem('avatar'),
						myStorage.removeItem('home'),
						myStorage.removeItem('favorites'),
						(document.querySelector('.profile_container').style.display =
							'none'),
						login()
					break
				default:
			}
		})
		_0x447269.parentNode.replaceChild(_0x2312ed, _0x447269)
	}
}
function login() {
	var _0xa03869 = myStorage.getItem('user_info')
	if (_0xa03869) {
		var _0xa03869 = JSON.parse(myStorage.getItem('user_info'))
		if (_0xa03869.auth == 0) {
			document.querySelector('#Login').style.display = 'flex'
			document.querySelector('#Avatar').style.display = 'none'
			document.querySelector('#Player').style.display = 'none'
			document.querySelector('.page_content').innerHTML = ''
			myStorage.clear()
		} else {
			username = _0xa03869.username
			password = _0xa03869.password
			if (myStorage.getItem('avatar')) {
				avatar = JSON.parse(myStorage.getItem('avatar'))
				document.querySelector('#Login').style.display = 'none'
				document.querySelector('#Avatar').style.display = 'none'
				document.querySelector('#Player').style.display = 'flex'
				for (
					var _0x1b2bad = 0;
					_0x1b2bad < document.querySelectorAll('.avatar_name').length;
					_0x1b2bad++
				) {
					document.querySelectorAll('.avatar_name')[_0x1b2bad].innerHTML =
						avatar.avatar_name
				}
			} else {
				var _0x8f3394 = _0xa03869.avatars
				document.querySelector('#Login').style.display = 'none'
				document.querySelector('#Avatar').style.display = 'flex'
				document.querySelector('#Player').style.display = 'none'
				var _0x268eaf = '',
					_0x48b6b8 = '',
					_0x4313b0 = ''
				for (var _0x1b2bad = 0; _0x1b2bad < _0x8f3394.length; _0x1b2bad++) {
					_0x268eaf +=
						'<li>\n            <a class="j_btn focusable" _action="handleAvatar" id="' +
						_0x8f3394[_0x1b2bad].id +
						'" href="javascript:void(0)" style="background-color: ' +
						(_0x1b2bad % 2 != 0 ? '#e6b308' : '#7669fe') +
						(';">\n              <img src="assets/images/face-user.png" alt="' +
							_0x8f3394[_0x1b2bad].avatar_name +
							'">\n            </a>\n            <span>' +
							_0x8f3394[_0x1b2bad].avatar_name +
							'</span>\n          </li>')
					_0x4313b0 +=
						'<li>\n            <a class="j_btn focusable" _action="avatar" id="' +
						_0x8f3394[_0x1b2bad].id +
						'" href="javascript:void(0)" style="background-color: ' +
						(_0x1b2bad % 2 != 0 ? '#e6b308' : '#7669fe') +
						(';">\n              <div class="bg-edit">\n                <img src="assets/icons/icon-trash.svg">\n              </div>\n              <img src="assets/images/face-user.png" alt="' +
							_0x8f3394[_0x1b2bad].avatar_name +
							'">\n            </a>\n            <span>' +
							_0x8f3394[_0x1b2bad].avatar_name +
							'</span>\n          </li>')
				}
				_0x268eaf +=
					'<li>\n          <a class="focusable add_profile" href="javascript:void(0)" onclick="document.querySelector(\'.users_modal_container\').style.display = \'flex\';">\n            <img style="filter: invert(.8); width: 80px;" src="assets/icons/icon-plus-circle.svg" alt="Adicionar perfil">\n          </a>\n          <span>Adicionar perfil</span>\n        </li>'
				_0x48b6b8 =
					'<a class="btn_manage_users focusable" href="javascript:void(0)" onclick="document.querySelector(\'.manage_users_modal_container\').style.display = \'flex\';">\n          <span>Gerenciar perfis</span>\n        </a>'
				document.querySelector('.avatar_list').innerHTML = _0x268eaf
				document.querySelector('.avatar_list_manager').innerHTML = _0x4313b0
				btn()
				document.querySelector('.manage_users').innerHTML = _0x48b6b8
			}
		}
	} else {
		document.querySelector('#Login').style.display = 'flex'
		document.querySelector('#Avatar').style.display = 'none'
		document.querySelector('#Player').style.display = 'none'
		document.querySelector('.page_content').innerHTML = ''
	}
}
function handlePage(_0x56e2b8, _0x2e3fd1 = true) {
	document.getElementById('player_container') &&
		jwplayer('player_container').remove()
	document.querySelector('.search_container').style.visibility = 'hidden'
	document.querySelector('.search_input_action').value = ''
	document.querySelector('.search_input_search').value = ''
	var _0xad5c06 = document.querySelectorAll('.menu_content a')
	for (var _0x1e2b94 = 0; _0x1e2b94 < _0xad5c06.length; _0x1e2b94++) {
		_0xad5c06[_0x1e2b94].classList.remove('active')
	}
	document.querySelector('.menu_content .' + _0x56e2b8).classList.add('active')
	if (_0x56e2b8 == 'movies') {
		pageVod()
		handleModalVod()
		handleVodCategories()
	} else {
		if (_0x56e2b8 == 'lives') {
			pageLives()
			handleLivesCategories()
		} else {
			if (_0x56e2b8 == 'series') {
				pageSeries()
				handleModalSerie()
				handleSeriesCategories()
			} else {
				_0x56e2b8 == 'favorites'
					? (pageFavorites(), handleFavorites())
					: (pageHome(), handleHome())
			}
		}
	}
	scroll()
}
function pageHome() {
	document.querySelector('.page_content').innerHTML =
		'<div class="favorites_container">\n    <div class="section_top_container carousel_section_generic_container top_conainer">\n      <div class="section_top_content carousel_section_generic_content">\n        <div class="section_top_title carousel_section_generic_title">\n          <p>Top 10</p>\n\n          <div class="container-arrows">\n            <img src="assets/icons/icon-left.svg" alt="Seta" class="btn-left-scroll focusable" ref="1"></img>\n            <img src="assets/icons/icon-right.svg" alt="Seta" class="btn-right-scroll focusable" ref="1"></img>\n          </div>\n        </div>\n\n        <ul class="hide_scrollbar scroll-horizon top_ul" id="1">\n\n        </ul>\n      </div>\n    </div>\n\n    <div class="section_new_container carousel_section_generic_container keep_watching_container">\n      <div class="section_new_content carousel_section_generic_content small">\n        <div class="section_new_title carousel_section_generic_title">\n          <p>Continue assistindo</p>\n\n          <div class="container-arrows">\n            <img src="assets/icons/icon-left.svg" alt="Seta" class="btn-left-scroll" ref="2"></img>\n            <img src="assets/icons/icon-right.svg" alt="Seta" class="btn-right-scroll" ref="2"></img>\n          </div>\n        </div>\n\n        <ul class="hide_scrollbar scroll-horizon keep_watching_ul" id="2">\n\n        </ul>\n      </div>\n    </div>\n\n    <div class="section_new_container carousel_section_generic_container movies_added_container">\n      <div id="section_added" class="section_new_content carousel_section_generic_content small">\n        <div class="section_new_title carousel_section_generic_title">\n          <p>Filmes recém adicionados</p>\n\n          <div class="container-arrows">\n            <img src="assets/icons/icon-left.svg" alt="Seta" class="btn-left-scroll" ref="3"></img>\n            <img src="assets/icons/icon-right.svg" alt="Seta" class="btn-right-scroll" ref="3"></img>\n          </div>\n        </div>\n\n        <ul class="hide_scrollbar scroll-horizon movies_added_ul" id="3">\n\n        </ul>\n      </div>\n    </div>\n\n    <div class="section_new_container carousel_section_generic_container series_added_container">\n      <div class="section_new_content carousel_section_generic_content small">\n        <div class="section_new_title carousel_section_generic_title">\n          <p>Séries recém adicionadas</p>\n\n          <div class="container-arrows">\n            <img src="assets/icons/icon-left.svg" alt="Seta" class="btn-left-scroll" ref="4"></img>\n            <img src="assets/icons/icon-right.svg" alt="Seta" class="btn-right-scroll" ref="4"></img>\n          </div>\n        </div>\n\n        <ul class="hide_scrollbar scroll-horizon series_added_ul" id="4">\n\n        </ul>\n      </div>\n    </div>\n  </div>'
}
function handleHome() {
	document.querySelector('.keep_watching_container').style.display = 'none'
	document.querySelector('.top_conainer').style.display = 'none'
	document.querySelector('.movies_added_container').style.display = 'none'
	document.querySelector('.series_added_container').style.display = 'none'
	var _0xcae287 = myStorage.getItem('home')
	if (_0xcae287) {
		_0xcae287 = JSON.parse(_0xcae287)
		_0xcae287.keepWatching.length &&
			(document.querySelector('.keep_watching_container').style.display =
				'flex')
		_0xcae287.top.length &&
			(document.querySelector('.top_conainer').style.display = 'flex')
		_0xcae287.moviesAdded.length &&
			(document.querySelector('.movies_added_container').style.display = 'flex')
		_0xcae287.seriesAdded.length &&
			(document.querySelector('.series_added_container').style.display = 'flex')
		var _0x15c0b7 = ''
		for (var _0x2c564c = 0; _0x2c564c < _0xcae287.top.length; _0x2c564c++) {
			_0x15c0b7 +=
				'<li>\n        <a class="focusable top_li" onclick="' +
				(_0xcae287.top[_0x2c564c].stream_id
					? 'handleModalVod(); handleVodInfo(null, ' +
					_0xcae287.top[_0x2c564c].stream_id +
					')'
					: 'handleModalSerie(); handleSerieInfo(null, ' +
					_0xcae287.top[_0x2c564c].serie_id +
					')') +
				'" style="background-image: url(' +
				(_0xcae287.top[_0x2c564c].stream_id
					? _0xcae287.top[_0x2c564c].movie_image
					: _0xcae287.top[_0x2c564c].cover) +
				');" href="javascript:void(0)">\n          <span class="position_number">' +
				(_0x2c564c + 1) +
				'</span>\n          <span class="name">' +
				(_0xcae287.top[_0x2c564c].stream_id
					? _0xcae287.top[_0x2c564c].stream_display_name
					: _0xcae287.top[_0x2c564c].title) +
				'</span>\n        </a>\n      </li>'
		}
		document.querySelector('.top_ul').innerHTML = _0x15c0b7
		_0x15c0b7 = ''
		for (
			var _0x2c564c = 0;
			_0x2c564c < _0xcae287.keepWatching.length;
			_0x2c564c++
		) {
			var _0x521755 = '',
				_0x3dce9b = '',
				_0xeebe6e = ''
			_0xcae287.keepWatching[_0x2c564c].serie_id
				? ((_0x521755 =
					'handleModalSerie(); handleSerieInfo(null, ' +
					_0xcae287.keepWatching[_0x2c564c].serie_id +
					');'),
					(_0x521755 +=
						"handleVideo('" +
						DNS +
						'/series/' +
						username +
						'/' +
						password +
						'/' +
						_0xcae287.keepWatching[_0x2c564c].stream_id +
						'.' +
						_0xcae287.keepWatching[_0x2c564c].target_container +
						"', 'video/mp4', " +
						_0xcae287.keepWatching[_0x2c564c].time +
						');'),
					(_0x3dce9b = _0xcae287.keepWatching[_0x2c564c].cover),
					(_0xeebe6e = _0xcae287.keepWatching[_0x2c564c].title))
				: ((_0x521755 =
					'handleModalVod(); handleVodInfo(null, ' +
					_0xcae287.keepWatching[_0x2c564c].stream_id +
					');'),
					(_0x521755 +=
						"handleVideo('" +
						DNS +
						'/movie/' +
						username +
						'/' +
						password +
						'/' +
						_0xcae287.keepWatching[_0x2c564c].stream_id +
						'.' +
						_0xcae287.keepWatching[_0x2c564c].target_container +
						"', 'video/mp4', " +
						_0xcae287.keepWatching[_0x2c564c].time +
						');'),
					(_0x3dce9b = _0xcae287.keepWatching[_0x2c564c].movie_image),
					(_0xeebe6e = _0xcae287.keepWatching[_0x2c564c].stream_display_name))
			_0x15c0b7 +=
				'<li>\n        <a class="focusable" onclick="' +
				_0x521755 +
				'" style="background-image: url(' +
				_0x3dce9b +
				');" href="javascript:void(0)">\n          <span class="name">' +
				_0xeebe6e +
				'</span>\n        </a>\n      </li>'
		}
		document.querySelector('.keep_watching_ul').innerHTML = _0x15c0b7
		_0x15c0b7 = ''
		for (
			var _0x2c564c = 0;
			_0x2c564c < _0xcae287.moviesAdded.length;
			_0x2c564c++
		) {
			_0x15c0b7 +=
				'<li>\n        <a class="focusable" onclick="handleModalVod(); handleVodInfo(null, ' +
				_0xcae287.moviesAdded[_0x2c564c].id +
				')" style="background-image: url(' +
				_0xcae287.moviesAdded[_0x2c564c].movie_image +
				');" href="javascript:void(0)">\n          <span class="name">' +
				_0xcae287.moviesAdded[_0x2c564c].stream_display_name +
				'</span>\n        </a>\n      </li>'
		}
		document.querySelector('.movies_added_ul').innerHTML = _0x15c0b7
		_0x15c0b7 = ''
		for (
			var _0x2c564c = 0;
			_0x2c564c < _0xcae287.seriesAdded.length;
			_0x2c564c++
		) {
			_0x15c0b7 +=
				'<li>\n        <a onclick="handleModalSerie(); handleSerieInfo(null, ' +
				_0xcae287.seriesAdded[_0x2c564c].id +
				')" style="background-image: url(' +
				_0xcae287.seriesAdded[_0x2c564c].cover +
				');" href="javascript:void(0)">\n          <span class="name">' +
				_0xcae287.seriesAdded[_0x2c564c].title +
				'</span>\n        </a>\n      </li>'
		}
		document.querySelector('.series_added_ul').innerHTML = _0x15c0b7
	} else {
		ajax('action=home')
	}
	const _0x3f280a = document
		.querySelectorAll('.btn-right-scroll')
		.forEach((_0x5214fd) => {
			_0x5214fd.addEventListener('click', function (_0x1492cc) {
				const _0x33d2db = _0x5214fd.getAttribute('ref'),
					_0x4b425e = document.querySelector(
						'.scroll-horizon[id="' + _0x33d2db + '"]'
					)
				scrollAmount = 0
				var _0x5bd7f0 = setInterval(function () {
					_0x4b425e.scrollLeft += 50
					scrollAmount += 50
					scrollAmount >= 500 && window.clearInterval(_0x5bd7f0)
				}, 35)
			})
		}),
		_0x1d6514 = document
			.querySelectorAll('.btn-left-scroll')
			.forEach((_0x22e747) => {
				_0x22e747.addEventListener('click', function (_0x43296f) {
					const _0x37e94b = _0x22e747.getAttribute('ref'),
						_0x169bc4 = document.querySelector(
							'.scroll-horizon[id="' + _0x37e94b + '"]'
						)
					scrollAmount = 0
					var _0x293f59 = setInterval(function () {
						_0x169bc4.scrollLeft -= 50
						scrollAmount += 50
						scrollAmount >= 500 && window.clearInterval(_0x293f59)
					}, 35)
				})
			})
}
var vod_first_category_id = ''
function pageVod() {
	document.querySelector('.search_container').style.visibility = 'visible'
	document.querySelector('.search_input_action').value = 'get_vod_streams'
	document.querySelector('.page_content').innerHTML =
		'<div class="channels_categories">\n    <ul class="scroll-vertical hide_scrollbar vod_categories_ul">\n\n    </ul>\n  </div>\n\n  <div class="movies_content">\n    <ul class="scroll-vertical vod_ul">\n\n    </ul>\n  </div>'
}
function handleModalVod() {
	document.querySelector('.modal_vod_container') &&
		document.querySelector('.modal_vod_container').remove()
	var _0x26ecb5 = document.createElement('div')
	_0x26ecb5.innerHTML =
		'<div class="modal_vod_container" style="display: none;">\n    <div class="modal_vod_box hide_scrollbar" style="background-image: url(assets/images/luca.png);">\n      <div id="modal_vod" class="modal_vod_content">\n        <button type="button" name="button" class="modal_vod_close focusable" onclick="document.querySelector(\'.modal_vod_container\').style.display = \'none\';">\n          <i class=\'bx bx-x\'></i>\n        </button>\n\n        <div class="vod_cover">\n          <img src="assets/images/luca.png" alt="Luca">\n          <span class="rate">9.1</span>\n        </div>\n\n        <div class="vod_description">\n          <p class="title">Luca</p>\n          <p class="genre">Aventura, Disney | 01:32</p>\n          <p class="director">Diretor: Sam Mendes, Jayne-Ann Tenggren, Susie Jones, Sharon Mansfield, Tufan Şimşekcan</p>\n          <p class="cast">Elenco: Daniel Craig, Judi Dench, Javier Bardem, Ralph Fiennes, Naomie Harris</p>\n\n          <button type="button" name="button" class="btn_favorite focusable">\n            <i class=\'bx bx-heart\'></i>\n          </button>\n\n          <button type="button" name="button" class="btn_watch focusable">\n            <span><img src="assets/icons/icon-google-play.svg" alt="' +
		(allowed ? 'Download' : 'Assistir') +
		'"> ' +
		(allowed ? 'Download' : 'Assistir') +
		'</span>\n          </button>\n        </div>\n\n        <div class="vod_resume">\n          <p>Após uma missão mal sucedida de James Bond, a identidade de agentes secretos é revelada e o M16, atacado. Ajudado por um agente de campo, Bond deverá seguir a trilha de Silva, um homem que habita o passado de M e que tem contas a acertar.</p>\n        </div>\n\n        <div class="clear"></div>\n      </div>\n    </div>\n  </div>'
	document.querySelector('.page_content').append(_0x26ecb5)
}
function handleVodCategories() {
	var _0x2e0281 = myStorage.getItem('vod_categories')
	if (_0x2e0281) {
		_0x2e0281 = JSON.parse(_0x2e0281)
		var _0x2a3f5f = ''
		for (var _0x116b73 = 0; _0x116b73 < _0x2e0281.length; _0x116b73++) {
			if (_0x2e0281[_0x116b73].category_id != myStorage.getItem('MOVIE_CATEGORY_CENSORED')) {
				_0x2a3f5f +=
					'<li><a class="vod_category_a focusable" onclick="handleVods(null, ' +
					_0x2e0281[_0x116b73].category_id +
					')" id="' +
					_0x2e0281[_0x116b73].category_id +
					'" href="javascript:void(0)">' +
					_0x2e0281[_0x116b73].category_name +
					'</a></li>'
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
			_0x22c5e2[0].category_id == vod_first_category_id &&
				myStorage.setItem('vods_first_category', JSON.stringify(_0x22c5e2))
			for (var _0x2bd098 = 0; _0x2bd098 < _0x22c5e2.length; _0x2bd098++) {
				_0x1d770d +=
					'<li>\n            <a class="focusable vods" onclick="handleVodInfo(null, ' +
					_0x22c5e2[_0x2bd098].stream_id +
					')" style="background-image: url(' +
					_0x22c5e2[_0x2bd098].stream_icon +
					');" href="javascript:void(0)">\n              <span class="name">' +
					_0x22c5e2[_0x2bd098].name +
					'</span>\n            </a>\n          </li>'
			}
		} else {
			_0x1d770d =
				'<li style="color: #fff;">Nenhum filme disponível nessa categoria</li>'
		}
		for (
			var _0x2bd098 = 0;
			_0x2bd098 < document.querySelectorAll('.vod_category_a').length;
			_0x2bd098++
		) {
			document
				.querySelectorAll('.vod_category_a')
			[_0x2bd098].getAttribute('id') == _0x22c5e2[0].category_id
				? document
					.querySelectorAll('.vod_category_a')
				[_0x2bd098].classList.add('active')
				: document
					.querySelectorAll('.vod_category_a')
				[_0x2bd098].classList.remove('active')
		}
		document.querySelector('.vod_ul').innerHTML = _0x1d770d
	} else {
		if (_0xa6da62 == vod_first_category_id) {
			var _0x556c92 = myStorage.getItem('vods_first_category')
			if (_0x556c92) {
				_0x556c92 = JSON.parse(_0x556c92)
				handleVods(_0x556c92)
				return
			}
		}
		ajax('action=get_vod_streams&category_id=' + _0xa6da62)
	}
}
function handleVodInfo(_0x51d5ef = null, _0x47857c = null) {
	if (_0x51d5ef) {
		document.querySelector('.modal_vod_container').style.display = 'flex'
		document.querySelector('.modal_vod_box').style.backgroundImage =
			'url(' + _0x51d5ef.info.movie_image + ')'
		document
			.querySelector('.vod_cover img')
			.setAttribute('src', _0x51d5ef.info.movie_image)
		document.querySelector('.vod_cover .rate').innerHTML = _0x51d5ef.info.rating
			? _0x51d5ef.info.rating
			: ''
		document.querySelector('.vod_description .title').innerHTML = _0x51d5ef
			.movie_data.name
			? _0x51d5ef.movie_data.name
			: _0x51d5ef.info.name
		document.querySelector('.vod_description .genre').innerHTML =
			(_0x51d5ef.info.genre ? _0x51d5ef.info.genre : '') +
			' | ' +
			(_0x51d5ef.info.duration ? _0x51d5ef.info.duration : '')
		document.querySelector('.vod_description .director').innerHTML =
			'Diretor: ' + (_0x51d5ef.info.director ? _0x51d5ef.info.director : '')
		document.querySelector('.vod_description .cast').innerHTML =
			'Elenco: ' + (_0x51d5ef.info.cast ? _0x51d5ef.info.cast : '')
		document.querySelector('.vod_resume p').innerHTML = _0x51d5ef.info.plot
			? _0x51d5ef.info.plot
			: ''
		document
			.querySelector('.btn_watch')
			.setAttribute(
				'onclick',
				'handleVideo("' +
				DNS +
				'/movie/' +
				username +
				'/' +
				password +
				'/' +
				_0x51d5ef.movie_data.stream_id +
				'.' +
				_0x51d5ef.movie_data.container_extension +
				'", "video/mp4")'
			)
	} else {
		ajax('action=get_vod_info&vod_id=' + _0x47857c)
	}
}
var serie_first_category_id = ''
function pageSeries() {
	document.querySelector('.search_container').style.visibility = 'visible'
	document.querySelector('.search_input_action').value = 'get_series'
	document.querySelector('.page_content').innerHTML =
		'<div class="channels_categories">\n    <ul id=\'menu-series\' class="scroll-vertical hide_scrollbar vod_categories_ul">\n    </ul>\n  </div>\n\n  <div class="movies_content">\n    <ul class="scroll-vertical vod_ul">\n    </ul>\n  </div>'
}
function handleModalSerie() {
	document.querySelector('.modal_vod_container') &&
		document.querySelector('.modal_vod_container').remove()
	var _0x32604e = document.createElement('div')
	_0x32604e.innerHTML =
		'<div class="modal_vod_container" style="display: none;">\n    <div class="modal_vod_box big hide_scrollbar" style="background-image: url(assets/images/luca.png);">\n      <div id="modal_movie" class="modal_vod_content">\n        <button type="button" name="button" class="modal_vod_close focusable close_modal_serie" onclick="document.querySelector(\'.modal_vod_container\').style.display = \'none\';">\n          <i class=\'bx bx-x\'></i>\n        </button>\n\n        <div class="vod_cover">\n          <img src="assets/images/luca.png" alt="Luca">\n          <span class="rate">9.1</span>\n        </div>\n\n        <div class="vod_description">\n          <p class="title">Luca</p>\n          <p class="genre">Aventura, Disney | 01:32</p>\n          <p class="director">Diretor: Sam Mendes, Jayne-Ann Tenggren, Susie Jones, Sharon Mansfield, Tufan Şimşekcan</p>\n          <p class="cast">Elenco: Daniel Craig, Judi Dench, Javier Bardem, Ralph Fiennes, Naomie Harris</p>\n\n          <button type="button" name="button" class="btn_favorite focusable">\n            <i class=\'bx bx-heart\' ></i>\n          </button>\n\n          <div class="vod_resume">\n            <p>Após uma missão mal sucedida de James Bond, a identidade de agentes secretos é revelada e o M16, atacado. Ajudado por um agente de campo, Bond deverá seguir a trilha de Silva, um homem que habita o passado de M e que tem contas a acertar.</p>\n          </div>\n        </div>\n\n        <div class="seasons_container">\n          <div class="seasons_content">\n            <ul class="seasons_ul hide_scrollbar scroll-horizon">\n              <li class="seasons_li">\n                <p class="title">\n                  <a href="javascript:void(0)" class="active">Temporada 1</a>\n                </p>\n              </li>\n            </ul>\n\n            <div class="section_new_container carousel_section_generic_container">\n              <div class="section_new_content carousel_section_generic_content small box_episodes">\n                <ul class="hide_scrollbar scroll-horizon episodes_ul" style="padding-left: 0;">\n                  <li>\n                    <a style="background-image: url(assets/images/luca.png);" href="javascript:void(0)"></a>\n                    <span class="name">Episódio 1</span>\n                  </li>\n                </ul>\n\n              </div>\n            </div>\n          </div>\n        </div>\n\n        <div class="arrows">\n          <i class="bx bx-chevron-left left-scroll focusable" ref=""></i>\n          <i class="bx bx-chevron-right right-scroll focusable" ref=""></i>\n        </div>\n\n        <div class="clear"></div>\n      </div>\n    </div>\n  </div>'
	document.querySelector('.page_content').append(_0x32604e)
}
function handleSeriesCategories() {
	var _0x2e58ec = myStorage.getItem('series_categories')
	if (_0x2e58ec) {
		_0x2e58ec = JSON.parse(_0x2e58ec)
		var _0x102d97 = ''
		for (var _0x40227a = 0; _0x40227a < _0x2e58ec.length; _0x40227a++) {
			if (_0x2e58ec[_0x40227a].category_id != myStorage.getItem('SERIE_CATEGORY_CENSORED')) {
				_0x102d97 +=
					'<li><a class="vod_category_a focusable" onclick="handleSeries(null, ' +
					_0x2e58ec[_0x40227a].category_id +
					')" id="' +
					_0x2e58ec[_0x40227a].category_id +
					'" href="javascript:void(0)">' +
					_0x2e58ec[_0x40227a].category_name +
					'</a></li>'
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
			_0x3f516d[0].category_id == serie_first_category_id &&
				myStorage.setItem('series_first_category', JSON.stringify(_0x3f516d))
			for (var _0x19f78e = 0; _0x19f78e < _0x3f516d.length; _0x19f78e++) {
				_0xc11cca +=
					'<li>\n            <a class="focusable" onclick="handleSerieInfo(null, ' +
					_0x3f516d[_0x19f78e].series_id +
					')" style="background-image: url(' +
					_0x3f516d[_0x19f78e].cover +
					');" href="javascript:void(0)">\n              <span class="name">' +
					_0x3f516d[_0x19f78e].name +
					'</span>\n            </a>\n          </li>'
			}
		} else {
			_0xc11cca =
				'<li style="color: #fff;">Nenhuma série disponível nessa categoria</li>'
		}
		for (
			var _0x19f78e = 0;
			_0x19f78e < document.querySelectorAll('.vod_category_a').length;
			_0x19f78e++
		) {
			document
				.querySelectorAll('.vod_category_a')
			[_0x19f78e].getAttribute('id') == _0x3f516d[0].category_id
				? document
					.querySelectorAll('.vod_category_a')
				[_0x19f78e].classList.add('active')
				: document
					.querySelectorAll('.vod_category_a')
				[_0x19f78e].classList.remove('active')
		}
		document.querySelector('.vod_ul').innerHTML = _0xc11cca
	} else {
		if (_0x39c2db == serie_first_category_id) {
			var _0x1900dc = myStorage.getItem('series_first_category')
			if (_0x1900dc) {
				_0x1900dc = JSON.parse(_0x1900dc)
				handleSeries(_0x1900dc)
				return
			}
		}
		ajax('action=get_series&category_id=' + _0x39c2db)
	}
}
function handleSerieInfo(_0x3c33cf = null, _0xe1c03c = null) {
	if (_0x3c33cf) {
		document.querySelector('.modal_vod_container').style.display = 'flex'
		document.querySelector('.modal_vod_box').style.backgroundImage =
			'url(' + _0x3c33cf.info.cover + ')'
		document
			.querySelector('.vod_cover img')
			.setAttribute('src', _0x3c33cf.info.cover)
		document.querySelector('.vod_cover .rate').innerHTML = _0x3c33cf.info.rating
			? _0x3c33cf.info.rating
			: ''
		document.querySelector('.vod_description .title').innerHTML = _0x3c33cf.info
			.name
			? _0x3c33cf.info.name
			: ''
		document.querySelector('.vod_description .genre').innerHTML =
			(_0x3c33cf.info.genre ? _0x3c33cf.info.genre : '') +
			' | ' +
			(_0x3c33cf.info.duration ? _0x3c33cf.info.duration : '')
		document.querySelector('.vod_description .director').innerHTML =
			'Diretor: ' + (_0x3c33cf.info.director ? _0x3c33cf.info.director : '')
		document.querySelector('.vod_description .cast').innerHTML =
			'Elenco: ' + (_0x3c33cf.info.cast ? _0x3c33cf.info.cast : '')
		document.querySelector('.vod_resume p').innerHTML = _0x3c33cf.info.plot
			? _0x3c33cf.info.plot
			: ''
		var _0x1ff276 = '',
			_0x5d27a0 = null
		if (_0x3c33cf.episodes) {
			_0x5d27a0 = ''
			for (const [_0x42683a, _0xdef568] of Object.entries(_0x3c33cf.episodes)) {
				!_0x5d27a0 && (_0x5d27a0 = _0x42683a)
				_0x1ff276 +=
					'<li class="seasons_li">\n          <p class="title">\n            <a href="javascript:void(0)" onclick="handleChangeSeason(' +
					_0x42683a +
					')" id="' +
					_0x42683a +
					'" class="focusable li_season ' +
					(_0x5d27a0 == _0x42683a ? 'active' : '') +
					('">Temporada ' + _0x42683a + '</a>\n          </p>\n        </li>')
			}
		}
		document.querySelector('.seasons_ul').innerHTML = _0x1ff276
		_0x1ff276 = ''
		if (_0x3c33cf.episodes) {
			for (const [_0x3a83f3, _0xa7a5b7] of Object.entries(_0x3c33cf.episodes)) {
				_0x1ff276 +=
					'<ul class="hide_scrollbar scroll-horizon episodes_ul" id="' +
					_0x3a83f3 +
					'" style="padding-left: 0; ' +
					(_0x3a83f3 == _0x5d27a0 ? 'display: flex;' : '') +
					'">'
				for (const [_0x5ed346, _0x5f650b] of Object.entries(_0xa7a5b7)) {
					_0x1ff276 +=
						'<li>\n            <a class="focusable" style="background-image: url(' +
						_0x5f650b.info.movie_image +
						');" onclick=\'handleVideo("' +
						DNS +
						'/series/' +
						username +
						'/' +
						password +
						'/' +
						_0x5f650b.id +
						'.' +
						_0x5f650b.container_extension +
						'", "video/mp4")\' href="javascript:void(0)">\n              <span class="name">' +
						_0x5f650b.title +
						'</span>\n            </a>\n          </li>'
				}
				_0x1ff276 += '</ul>'
			}
		}
		document.querySelector('.box_episodes').innerHTML = _0x1ff276
	} else {
		ajax('action=get_series_info&series_id=' + _0xe1c03c)
	}
	const _0x17313a = document
		.querySelectorAll('.right-scroll')
		.forEach((_0xeca053) => {
			_0xeca053.addEventListener('click', function (_0x379bc0) {
				const _0x13ae23 = document
					.querySelector(
						".seasons_li a[class='focusable li_season active']"
					)
					.getAttribute('id'),
					_0x3fb80f = document.querySelector(
						'.episodes_ul[id="' + _0x13ae23 + '"]'
					)
				scrollAmount = 0
				var _0x562b64 = setInterval(function () {
					_0x3fb80f.scrollLeft += 50
					scrollAmount += 50
					scrollAmount >= 500 && window.clearInterval(_0x562b64)
				}, 35)
			})
			_0xeca053.addEventListener('keydown', function (_0x1e7dbe) {
				if (_0x1e7dbe.code == 'Enter') {
					const _0x55f699 = document
						.querySelector(
							".seasons_li a[class='focusable li_season active']"
						)
						.getAttribute('id'),
						_0xeba016 = document.querySelector(
							'.episodes_ul[id="' + _0x55f699 + '"]'
						)
					scrollAmount = 0
					var _0x3241a2 = setInterval(function () {
						_0xeba016.scrollLeft += 50
						scrollAmount += 50
						scrollAmount >= 500 && window.clearInterval(_0x3241a2)
					}, 35)
				}
			})
		}),
		_0x12de27 = document
			.querySelectorAll('.left-scroll')
			.forEach((_0x24e237) => {
				_0x24e237.addEventListener('click', function (_0x5385c2) {
					const _0x36cdf3 = document
						.querySelector(
							".seasons_li a[class='focusable li_season active']"
						)
						.getAttribute('id'),
						_0x204b8f = document.querySelector(
							'.episodes_ul[id="' + _0x36cdf3 + '"]'
						)
					scrollAmount = 0
					var _0x542209 = setInterval(function () {
						_0x204b8f.scrollLeft -= 50
						scrollAmount += 50
						scrollAmount >= 500 && window.clearInterval(_0x542209)
					}, 35)
				})
				_0x24e237.addEventListener('keydown', function (_0x2c6981) {
					if (_0x2c6981.code == 'Enter') {
						const _0x4c7a6f = document
							.querySelector(
								".seasons_li a[class='focusable li_season active']"
							)
							.getAttribute('id'),
							_0x4a6dda = document.querySelector(
								'.episodes_ul[id="' + _0x4c7a6f + '"]'
							)
						scrollAmount = 0
						var _0x4fd5d5 = setInterval(function () {
							_0x4a6dda.scrollLeft -= 50
							scrollAmount += 50
							scrollAmount >= 500 && window.clearInterval(_0x4fd5d5)
						}, 35)
					}
				})
			})
}
function handleChangeSeason(_0x20d98b) {
	var _0x567f7e = document.querySelectorAll('.seasons_li a'),
		_0x1bf2a6 = document.querySelectorAll('.arrows-series')
	for (var _0x1a992f = 0; _0x1a992f < _0x567f7e.length; _0x1a992f++) {
		_0x567f7e[_0x1a992f].classList.remove('active')
	}
	for (var _0x1a992f = 0; _0x1a992f < _0x1bf2a6.length; _0x1a992f++) {
		_0x1bf2a6[_0x1a992f].classList.remove('active')
	}
	document
		.querySelector(".seasons_li a[id='" + _0x20d98b + "']")
		.classList.add('active')
	var _0x339f02 = document.querySelectorAll('.episodes_ul')
	for (var _0x1a992f = 0; _0x1a992f < _0x339f02.length; _0x1a992f++) {
		_0x339f02[_0x1a992f].getAttribute('id') == _0x20d98b
			? (_0x339f02[_0x1a992f].style.display = 'flex')
			: (_0x339f02[_0x1a992f].style.display = 'none')
	}
}
var live_first_category_id = ''
function pageLives() {
	document.querySelector('.search_container').style.visibility = 'visible'
	document.querySelector('.search_input_action').value = 'get_live_streams'
	document.querySelector('.page_content').innerHTML =
		'<div class="favorites_container">\n    <div class="channels_categories">\n      <ul id="channels_categories" class="scroll-vertical hide_scrollbar vod_categories_ul">\n\n      </ul>\n    </div>\n\n    <div class="channels_list">\n      <ul class="scroll-vertical hide_scrollbar channels_ul">\n\n      </ul>\n    </div>\n\n    <div id="channels_view_container" class="channels_view_container">\n      <div id="player_container" class="channels_view_content">\n\n      </div>\n\n      <button style="display: block; margin: 15px 0; text-align: right; width: 100%;" type="button" name="button" class="btn_favorite focusable">\n\n      </button>\n\n      <ul class="epg_ul">\n\n      </ul>\n    </div>\n  </div>'
}
function handleLivesCategories() {
	var _0x5ad5fd = myStorage.getItem('live_categories')
	if (_0x5ad5fd) {
		_0x5ad5fd = JSON.parse(_0x5ad5fd)
		var _0x59ecbe = ''
		for (var _0x48698f = 0; _0x48698f < _0x5ad5fd.length; _0x48698f++) {
			if (_0x5ad5fd[_0x48698f].category_id != myStorage.getItem('CHANNEL_CATEGORY_CENSORED')) {
				_0x59ecbe +=
					'<li><a class="vod_category_a focusable" onclick="handleLives(null, ' +
					_0x5ad5fd[_0x48698f].category_id +
					')" id="' +
					_0x5ad5fd[_0x48698f].category_id +
					'" href="javascript:void(0)">' +
					_0x5ad5fd[_0x48698f].category_name +
					'</a></li>'
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
			_0x22bf98[0].category_id == live_first_category_id &&
				myStorage.setItem('lives_first_category', JSON.stringify(_0x22bf98))
			for (var _0x561b25 = 0; _0x561b25 < _0x22bf98.length; _0x561b25++) {
				_0x580c45 +=
					'<li>\n            <a class="live_a focusable" onclick="handleLiveInfo(null, ' +
					_0x22bf98[_0x561b25].stream_id +
					"); watchLive('" +
					DNS +
					'/live/' +
					username +
					'/' +
					password +
					'/' +
					_0x22bf98[_0x561b25].stream_id +
					'.m3u8\')" id="' +
					_0x22bf98[_0x561b25].stream_id +
					'" href="javascript:void(0)">\n              <img src="' +
					_0x22bf98[_0x561b25].stream_icon +
					'" alt="' +
					_0x22bf98[_0x561b25].name +
					'">\n              <span>' +
					_0x22bf98[_0x561b25].name +
					'</span>\n            </a>\n          </li>'
			}
		} else {
			_0x580c45 =
				'<li style="color: #fff;">Nenhum canal disponível nessa categoria</li>'
		}
		for (
			var _0x561b25 = 0;
			_0x561b25 < document.querySelectorAll('.vod_category_a').length;
			_0x561b25++
		) {
			document
				.querySelectorAll('.vod_category_a')
			[_0x561b25].getAttribute('id') == _0x22bf98[0].category_id
				? document
					.querySelectorAll('.vod_category_a')
				[_0x561b25].classList.add('active')
				: document
					.querySelectorAll('.vod_category_a')
				[_0x561b25].classList.remove('active')
		}
		document.querySelector('.channels_ul').innerHTML = _0x580c45
	} else {
		if (_0x356089 == live_first_category_id) {
			var _0x8ad191 = myStorage.getItem('lives_first_category')
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
			for (
				var _0x38015a = 0;
				_0x38015a < _0x1db56f.epg_listings.length;
				_0x38015a++
			) {
				var _0x54efe4 = new Date(
					parseInt(_0x1db56f.epg_listings[_0x38015a].start_timestamp) * 1000
				),
					_0x3036e9 = new Date(
						parseInt(_0x1db56f.epg_listings[_0x38015a].stop_timestamp) * 1000
					)
				_0x456096 +=
					'<li class="li_epg focusable">\n          <p class="title"><span class="time">' +
					_0x54efe4.getHours() +
					':' +
					_0x54efe4.getMinutes() +
					' - ' +
					_0x3036e9.getHours() +
					':' +
					_0x3036e9.getMinutes() +
					'</span> | ' +
					decodeURIComponent(
						escape(window.atob(_0x1db56f.epg_listings[_0x38015a].title))
					) +
					'</p>\n          <p class="description">' +
					decodeURIComponent(
						escape(window.atob(_0x1db56f.epg_listings[_0x38015a].description))
					) +
					'</p>\n        </li>'
			}
		}
		document.querySelector('.epg_ul').innerHTML = _0x456096
	} else {
		var _0x5eaf4f = document.querySelectorAll('.channels_list a')
		for (var _0x38015a = 0; _0x38015a < _0x5eaf4f.length; _0x38015a++) {
			_0x5eaf4f[_0x38015a].getAttribute('id') == _0x5dacbe
				? _0x5eaf4f[_0x38015a].classList.add('active')
				: _0x5eaf4f[_0x38015a].classList.remove('active')
		}
		ajax('action=get_short_epg&stream_id=' + _0x5dacbe + '&limit=10', true)
	}
}
var count = 0
function watchLive(_0x1d81e2) {
	jwplayer('player_container')
		.setup({
			file: _0x1d81e2,
			width: '100%',
			aspectratio: '16:9',
		})
		.on('error', function (_0x1ad0bd) {
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
	document.querySelector('.page_content').innerHTML =
		'<div class="favorites_container">\n    <div class="section_new_container carousel_section_generic_container lives" style="display: none;">\n      <div class="section_new_content carousel_section_generic_content small">\n        <div class="section_new_title carousel_section_generic_title">\n          <p>Canais Favoritos</p>\n        </div>\n\n        <ul class="hide_scrollbar scroll-horizon lives_ul">\n\n        </ul>\n      </div>\n    </div>\n\n    <div class="section_new_container carousel_section_generic_container movies" style="display: none;">\n      <div class="section_new_content carousel_section_generic_content small">\n        <div class="section_new_title carousel_section_generic_title">\n          <p>Filmes Favoritos</p>\n        </div>\n\n        <ul id="favorites-movies" class="hide_scrollbar scroll-horizon movies_ul">\n\n        </ul>\n      </div>\n    </div>\n\n    <div class="section_new_container carousel_section_generic_container series" style="display: none;">\n      <div class="section_new_content carousel_section_generic_content small">\n        <div class="section_new_title carousel_section_generic_title">\n          <p>Séries Favoritas</p>\n        </div>\n\n        <ul class="hide_scrollbar scroll-horizon series_ul">\n\n        </ul>\n      </div>\n    </div>\n  </div>'
}
function handleFavorites() {
	document.querySelector('.section_new_container.movies').style.display = 'none'
	document.querySelector('.section_new_container.lives').style.display = 'none'
	document.querySelector('.section_new_container.series').style.display = 'none'
	var _0x326abb = myStorage.getItem('favorites')
	if (_0x326abb) {
		_0x326abb = JSON.parse(_0x326abb)
		var _0x4c4ea9 = ''
		if (_0x326abb.movies.length) {
			for (
				var _0x4a097c = 0;
				_0x4a097c < _0x326abb.movies.length;
				_0x4a097c++
			) {
				_0x4c4ea9 +=
					'<li>\n          <a class="focusable" onclick="handleModalVod(); handleVodInfo(null, ' +
					_0x326abb.movies[_0x4a097c].id +
					')" style="background-image: url(' +
					_0x326abb.movies[_0x4a097c].movie_image +
					');" href="javascript:void(0)">\n            <span class="name">' +
					_0x326abb.movies[_0x4a097c].stream_display_name +
					'</span>\n          </a>\n        </li>'
			}
			document.querySelector('.section_new_container.movies').style.display =
				'block'
		}
		document.querySelector('.movies_ul').innerHTML = _0x4c4ea9
		_0x4c4ea9 = ''
		if (_0x326abb.series.length) {
			for (
				var _0x4a097c = 0;
				_0x4a097c < _0x326abb.series.length;
				_0x4a097c++
			) {
				_0x4c4ea9 +=
					'<li>\n          <a class="focusable" onclick="handleModalSerie(); handleSerieInfo(null, ' +
					_0x326abb.series[_0x4a097c].id +
					')" style="background-image: url(' +
					_0x326abb.series[_0x4a097c].cover +
					');" href="javascript:void(0)">\n            <span class="name">' +
					_0x326abb.series[_0x4a097c].title +
					'</span>\n          </a>\n        </li>'
			}
			document.querySelector('.section_new_container.series').style.display =
				'block'
		}
		document.querySelector('.series_ul').innerHTML = _0x4c4ea9
		_0x4c4ea9 = ''
		if (_0x326abb.lives.length) {
			for (var _0x4a097c = 0; _0x4a097c < _0x326abb.lives.length; _0x4a097c++) {
				_0x4c4ea9 +=
					'<li>\n          <a class="focusable" onclick="handlePage(\'lives\'); watchLive(\'' +
					DNS +
					'/live/' +
					username +
					'/' +
					password +
					'/' +
					_0x326abb.lives[_0x4a097c].id +
					".m3u8'); handleLiveInfo(null, " +
					_0x326abb.lives[_0x4a097c].id +
					');" style="background-image: url(' +
					_0x326abb.lives[_0x4a097c].stream_icon +
					');" href="javascript:void(0)" class="live">\n            <span class="name">' +
					_0x326abb.lives[_0x4a097c].stream_display_name +
					'</span>\n          </a>\n        </li>'
			}
			document.querySelector('.section_new_container.lives').style.display =
				'block'
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
		document.querySelector('.control-player') &&
			(document.querySelector('.control-player').style.display = 'none')
	}
}, 1000)
document
	.querySelector('.player_video_container')
	.addEventListener('mousemove', (_0x5d2551) => {
		timeHideBackButton = 3
		document.querySelector('.player_video_close').style.visibility = 'visible'
		document.querySelector('.player_video_prev').style.visibility = 'visible'
		document.querySelector('.player_video_next').style.visibility = 'visible'
		document.querySelector('.title_vod').style.visibility = 'visible'
		document.querySelector('.control-player').style.display = 'flex'
	})
addEventListener('keydown', (_0x3be016) => {
	if (
		document.querySelector('.player_video_container').style.display == 'flex'
	) {
		timeHideBackButton = 3
		document.querySelector('.player_video_close').style.visibility = 'visible'
		document.querySelector('.player_video_prev').style.visibility = 'visible'
		document.querySelector('.player_video_next').style.visibility = 'visible'
		document.querySelector('.title_vod').style.visibility = 'visible'
		document.querySelector('.control-player').style.display = 'flex'
	}
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
function handleVideo(link, type, time = 0) {
	let player_video_container = document.querySelector('.player_video_container');
	let player_video_content = player_video_container.querySelector('.player_video_content');

	player_video_content.innerHTML = '<video id="my-player" class="video-js vjs-default-skin vjs-big-play-centered" style="width:100%; height:100%; border:0px; outline:none; aspect-ratio:16/9;" controls loop src=""></video><div class="control-player" style="z-index:-1;"></div>';
	player_video_container.style.display = 'flex';

	let player = videojs("my-player", {
		controlBar: {
			children: [
				"playToggle",
				"volumePanel",
				"currentTimeDisplay",
				"progressControl",
				"durationDisplay",
				"subsCapsButton",
				"PictureInPictureToggle",
				"fullscreenToggle",
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

	let videoCode = btoa(link.substring(Math.max(link - 16, 0), link.length));

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

		player.on("volumechange", () => {
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
			let title = document.querySelector('.vod_description .title');
			title_vod.innerHTML = '<h2>' + title.textContent + '</h2>';
		} else if (link.includes('/series/')) {
			let episodes = document.querySelectorAll('.episodes_ul li a');

			for (let i = 0; i < episodes.length; i++) {
				if (episodes[i].getAttribute('onclick').includes(link)) {
					episodes[i].classList.add('active-border');

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
btn()
login()
myStorage = window.localStorage
var user = JSON.parse(myStorage.getItem('user_info'))
if (user.username && user.password) {
	loading(true)
	var xhr = new XMLHttpRequest()
	xhr.open(
		'GET',
		API_BASE +
		'/player_api.php?username=' +
		user.username +
		'&password=' +
		user.password,
		false
	)
	xhr.onload = function (_0x13656e) {
		if (xhr.readyState === 4) {
			loading(false)
			try {
				const _0x53997f = JSON.parse(xhr.response)
				if (typeof _0x53997f.setItem !== 'undefined') {
					for (const [_0x252660, _0x44b14a] of Object.entries(
						_0x53997f.setItem
					)) {
						myStorage.setItem(_0x252660, _0x44b14a)
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
	xhr.send(null)
}
