import {useState, useCallback, useEffect} from 'react'

const storageName = 'userData'

export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [payload, setPayload] = useState(null)

    const login = useCallback((jwt, info) => {
        setToken(jwt)
        setPayload(info)
        localStorage.setItem(storageName, JSON.stringify({
            token: jwt, payload: info
        }))
    }, [])
    const logout = useCallback(() => {
        setToken(null)
        setPayload(null)
        localStorage.removeItem(storageName)
    }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName))

        if (data && data.token) {
            login(data.token, data.payload)
        }
    }, [login])
    return {login, logout, token, payload}
}