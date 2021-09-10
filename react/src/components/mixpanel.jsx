import mixpanel from 'mixpanel-browser'

mixpanel.init(process.env.MIX_PANEL_KEY, {
  api_host: 'https://stagingback.zepto-ai.com/api/core/proxy'
})

const ENV_CHECK = process.env.NODE_ENV === 'production'

const actions = {
  identify: (id) => {
    if (ENV_CHECK) mixpanel.identify(id)
  },
  alias: (id) => {
    if (ENV_CHECK) mixpanel.alias(id)
  },
  track: (name, props) => {
    if (ENV_CHECK) mixpanel.track(name, props)
  },
  people: {
    set: (props) => {
      if (ENV_CHECK) mixpanel.people.set(props)
    }
  }
}

export const Mixpanel = actions
