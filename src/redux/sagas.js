import _ from "lodash"
import axios from "axios"

import { all, call, put, takeEvery, takeLatest, take } from 'redux-saga/effects'
import { signin_error, languages, authenticated } from './actions'
import { NavigationActions } from 'react-navigation'

function login_api(username, password) {
    return axios.get(`http://itsmartone.com/bpk_connect/api/user/check_login?user_id=${username}&password=${password}`)
}

function fetch_language() {
    return axios.get('http://itsmartone.com/bpk_connect/api/user/language_list')
}

function create_new_account(id, password, display_name, mobile_no, language) {
    return axios.post('http://itsmartone.com/bpk_connect/api/user/register', {
        username: id,
        password,
        display_name,
        mobile_no,
        user_language_id: language
    })
}

function* signin() {
    while (true) {
        const { payload: { username, password } } = yield take('SIGNIN')
        console.log(NavigationActions)
        if(username && password) {
            const res_login_api = yield call(login_api, username, password)
            if(_.get(res_login_api.data, 'error')) {
                yield put(signin_error(res_login_api.data.error))
                continue
            }
            const { data: { token, setting, user } } = res_login_api
            yield put(authenticated(token, setting))

            yield put(NavigationActions.navigate({ routeName: 'App' }))
            continue
        }
        yield put(signin_error('กรุณาระบุ Username เเละ Password'))
    }
}

function* start_app() {
    while (true) {
        yield take('START_APP')
        const { data: { data }} = yield call(fetch_language)
        yield put(languages(data))
    }
}

function* signup() {
    while (true) {
        const { payload: { id, password, confirm_password, display_name, mobile_no, language_id } } = yield take('SIGNUP')
        console.log(id, password, confirm_password, display_name, mobile_no, language_id)
        if(id && password && confirm_password && display_name && mobile_no && language_id) {
            if(password != confirm_password) {
                console.log('Password and Confirm password is not match!')
                continue
            }
            const res_create_new_account = yield call(create_new_account, id, password, display_name, mobile_no, language_id)
            if(res_create_new_account.error) {
                console.log(res_create_new_account.error)
                continue
            }
            const { data: { token, setting } } = res_create_new_account
            yield put(authenticated(token, setting, {}))
            yield put(NavigationActions.navigate({ routeName: 'Login' }))
            continue
        }
        console.log('กรุณาระบุรายละเอียดให้ครบทุกช่อง')
    }
}

export default function* rootSaga() {
    yield all([
        signin(),
        start_app(),
        signup()
    ])
}
