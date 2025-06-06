import { isAxiosError } from 'axios';
import { tesloApi } from '@/api/tesloApi';
import type { AuthResponse, User } from '../interfaces';

interface RegisterError {
  ok: false;
  msg: string;
}

interface RegisterSuccess {
  ok: true;
  user: User;
  token: string;
}

export const registerAction = async (
  fullName: string,
  email: string,
  password: string,
): Promise<RegisterError | RegisterSuccess> => {
  try {
    const { data } = await tesloApi.post<AuthResponse>('/auth/register', {
      fullName,
      email,
      password,
    });

    return {
      ok: true,
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      msg: 'No fue posible crear el usuario',
    };
  }
};
