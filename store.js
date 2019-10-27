import { types } from 'mobx-state-tree';
import fetch from 'isomorphic-unfetch'
import nextCookie from 'next-cookies'

const RootModel = types
    .model({
        user: types.frozen(),
        // NOTE: so far it's useless
        // token: '',
    })
    .actions(self => ({
        setUser(user) {
            self.user = user;
        },
        // NOTE: so far it's useless
        // setToken(token) {
        //     self.token = token;
        // },
        getConfig: async (ctx) => {
            const { token } = nextCookie(ctx)
            const apiUrl = 'https://api-dev.fex.net/api/v1/config'

            const redirectOnError = () =>
                typeof window !== 'undefined'
                    ? Router.push('/login')
                    : ctx.res.writeHead(302, { Location: '/login' }).end()
                    
            console.log('---> ---> store.getConfig: isClient', process.browser)
            try {
                const response = await fetch(apiUrl, {
                    credentials: 'include',
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                })

                if (response.ok) {
                    const config = await response.json()
                    console.log('config', config)
                    store.setUser(config.user)
                    return config
                } else {
                    // https://github.com/developit/unfetch#caveats
                    return await redirectOnError()
                }
            } catch (error) {
                // Implementation or Network error
                return redirectOnError()
            }
        },
    }));

const store = RootModel.create({
    user: {},
    token: '',
});

export default store;