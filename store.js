import { types, applySnapshot } from 'mobx-state-tree';
import fetch from 'isomorphic-unfetch'
import nextCookie from 'next-cookies'
import Router from 'next/router'

const Store = types
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

            const redirectOnError = () => {
                console.log('---> ---> redirectOnError isServer', typeof window !== 'undefined')
                return typeof window !== 'undefined'
                    ? Router.push('/login')
                    : ctx.res.writeHead(302, { Location: '/login' }).end()
            }
                
                    
            try {
                const response = await fetch(apiUrl, {
                    credentials: 'include',
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                })
                console.log('---> ---> store.getConfig: isClient', process.browser)

                if (response.ok) {
                    const config = await response.json()
                    console.log('config', !!config)
                    self.setUser(config.user)
                    return config
                } else {
                    // https://github.com/developit/unfetch#caveats
                    return await redirectOnError()
                }
            } catch (error) {
                console.log('---> ---> error', error)
                // Implementation or Network error
                return redirectOnError()
            }
        },
    }));

export default Store
    .create({
        user: {},
        token: '',
    });