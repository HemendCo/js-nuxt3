import { useState, useNuxtApp } from '#imports'
import type { TokenParams } from '../../types'

export default function () {
  const { $hemend } = useNuxtApp()

  let params = $hemend.storage().get('auth');

  if(params) {
    let current_time = Date.now();
    let expires_time = Date.parse(params.expires_in);

    if(current_time > expires_time) {
      params = null;
      useUser().clearUserData();
      $hemend.storage().remove('auth');
    }
  }

  const auth = useState<TokenParams|null>('auth', () => (params || null))
  
  const isLoggedIn = () => {
    return !!auth.value?.access_token
  }
  
  const getToken = () : TokenParams|null => {
    return auth.value
  }

  const setToken = (params: TokenParams) => {
    $hemend.storage().set('auth', params);
    auth.value = params
  }

  const clearAuth = () => {
    useUser().clearUserData()
    $hemend.storage().remove('auth');
    auth.value = null
  }

  return {
    isLoggedIn,
    getToken,
    setToken,
    clearAuth
  }
}
