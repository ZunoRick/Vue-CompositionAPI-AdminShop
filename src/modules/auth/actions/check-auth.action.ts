import { isAxiosError } from 'axios';
import { tesloApi } from '@/api/tesloApi';
import type { AuthResponse, User } from '../interfaces';

interface CheckError {
  ok: false;
}

interface CheckSuccess {
  ok: true;
  user: User;
  token: string;
}

export const checkAuthAction = async (): Promise<CheckError | CheckSuccess> => {
  try {
    const localToken = localStorage.getItem('token');

    if (localToken && localToken.length < 10) {
      return { ok: false };
    }

    const resp = await tesloApi.get<AuthResponse>('/auth/check-status');

    return { ok: true, user: resp.data.user, token: resp.data.token };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      return {
        ok: false,
      };
    }

    throw new Error('No se pudo verificar la sesión.');
  }
};
