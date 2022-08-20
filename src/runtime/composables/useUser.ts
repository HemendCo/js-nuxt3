import { useState, useNuxtApp } from '#imports'
import { UserParams } from '../../types'

export default function () {
    const { $hemend } = useNuxtApp()

    let params = $hemend.storage().get('user');

    const user = useState<UserParams|null>('user', () => (params || null))
    
    const getUser = () : UserParams|null => {
        return user.value
    }

    const setUser = (params: UserParams) => {
        $hemend.storage().set('user', params);
        user.value = params
    }

    const clearUserData = () => {
        $hemend.storage().remove('user');
        user.value = null
    }

    return {
        getUser,
        setUser,
        clearUserData
    }
}
