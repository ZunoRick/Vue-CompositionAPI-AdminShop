import { isAxiosError } from 'axios';
import { tesloApi } from '@/api/tesloApi';
import type { AuthResponse, User } from '../interfaces';

interface LoginError {
  ok: false;
  msg: string;
}

interface LoginSuccess {
  ok: true;
  user: User;
  token: string;
}

export const loginAction = async (
  email: string,
  password: string,
): Promise<LoginError | LoginSuccess> => {
  try {
    const { data } = await tesloApi.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return {
      ok: true,
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    // Error controlado
    if (isAxiosError(error) && error.response?.status === 401) {
      return {
        ok: false,
        msg: 'Usuario o contraseña incorrectos',
      };
    }

    console.error(error);
    throw new Error('No se pudo realizar la petición');
  }
};
