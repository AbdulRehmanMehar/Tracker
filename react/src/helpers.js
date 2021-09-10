import Cookies from 'js-cookie'
import { Base64 } from 'js-base64'
import API from './api'

export const PaymentHelper = {
  async getSubscription() {
    return API.get('payment/subscription/', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  },
  isSubscribed() {
    if (
      localStorage.getItem('subscription_status') !== 'inactive' &&
      localStorage.getItem('subscription_status') !== undefined &&
      localStorage.getItem('subscription_status') !== ''
    ) {
      return true
    }
    return false
  }
}

export const Auth = {
  signin(username, password) {
    const tok1 = process.env.API_CLIENT_TOKEN
    const tok2 = process.env.API_SECRET_TOKEN
    const formData = new FormData()
    formData.append('grant_type', 'password')
    formData.append('username', username.toLowerCase())
    formData.append('password', password)
    formData.append('client_id', 'QWGyvnVnh6oqk4nD6WpCjc5phlSUCudkYHjEkyiW')
    return API.post('user/login/', formData)
  },
  isAuthenticated() {
    if (localStorage.getItem('token')) {
        return true
    }
    return false
  },
  signout() {
    Cookies.remove('token')
    Cookies.remove('refreshToken')
    Cookies.remove('subscription_status')
    if (localStorage.getItem('token') !== undefined) {
      return false
    }
    return true
  }
}

export function getTimeInHours(value) {
  const d = Number(value)
  if (d < 60) {
    return `${d} sec`
  }
  let h = Math.floor(d / 3600)
  let m = Math.floor((d % 3600) / 60)
  const s = Math.floor((d % 3600) % 60)
  if (s > 0) {
    m += 1
    if (m === 60) {
      h += 1
      m = 0
    }
  }
  if (h <= 0) return `${m} min`

  return `${h} hrs ${m} min`
}

export function getDateFormat(val) {
  if (val === 'YMD') return 'Y/M/D'
  if (val === 'DMY') return 'D/M/Y'
  if (val === 'MDY') return 'M/D/Y'

  return ''
}
export function getDatePlaceHolder(val) {
  if (val === 'YMD') return 'yyyy/mm/dd'
  if (val === 'DMY') return 'dd/mm/yyyy'
  if (val === 'MDY') return 'mm/dd/yyyy'

  return ''
}

export function getReportName(timePeriod, clientName) {
  let desc = ''
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  const d = new Date()

  if (timePeriod === 'lastWeek' || timePeriod === 'week') desc = '_weekOf_'
  else if (timePeriod === 'month') desc = `_${monthNames[d.getMonth()]}_`
  else if (timePeriod === 'lastMonth') {
    const month = d.getMonth() - 1 === -1 ? 12 : d.getMonth() - 1
    desc = `_${monthNames[month]}_`
  } else if (timePeriod === 'yesterday') desc = '_yesterday_'

  const d1 = `${desc + `0${d.getDate()}`.slice(-2)}${`0${d.getMonth() + 1}`.slice(
    -2
  )}${d.getFullYear()}`

  const reportName = `${clientName}_${d1}`

  return reportName
}

export function isItemChecked(arr) {
  let bool = false
  arr.forEach(function(element) {
    if (element.checked && bool !== true) {
      bool = true
    }
  })

  return bool
}
