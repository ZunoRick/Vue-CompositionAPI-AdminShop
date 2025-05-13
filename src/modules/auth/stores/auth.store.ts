import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import { AuthStatus, type User } from '../interfaces';
import { loginAction, registerAction } from '../actions';

export const useAuthStore = defineStore('auth', () => {
  const authStatus = ref<AuthStatus>(AuthStatus.Checking);
  const user = ref<User | undefined>();
  const token = ref(useLocalStorage('token', ''));

  const login = async (email: string, password: string) => {
    try {
      const loginResp = await loginAction(email, password);
      if (!loginResp.ok) {
        logout();
        return false;
      }

      user.value = loginResp.user;
      token.value = loginResp.token;
      authStatus.value = AuthStatus.Authenticated;

      return true;
    } catch (error) {
      return logout();
    }
  };

  const register = async (fullName: string, email: string, password: string) => {
    try {
      const registerResp = await registerAction(fullName, email, password);

      if (!registerResp.ok) {
        logout();
        return { ok: false, msg: registerResp.msg };
      }

      user.value = registerResp.user;
      token.value = registerResp.token;
      authStatus.value = AuthStatus.Authenticated;

      return { ok: true, msg: '' };
    } catch (error) {
      return { ok: false, msg: 'Error al registrar al usuario.' };
    }
  };

  const logout = () => {
    authStatus.value = AuthStatus.Unauthenticated;
    user.value = undefined;
    token.value = '';
    return false;
  };

  return {
    user,
    token,
    authStatus,

    // Getters
    isChecking: computed(() => authStatus.value === AuthStatus.Checking),
    isAuthenticated: computed(() => authStatus.value === AuthStatus.Authenticated),

    // Todo: getter para saber si es un admin o no

    username: computed(() => user.value?.fullName),

    // Actions
    login,
    logout,
    register,
  };
});
