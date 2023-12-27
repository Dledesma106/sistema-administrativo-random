import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

type UseLoginData = {
    email: string;
    password: string;
};

type UseLoginVariables = {
    email: string;
    password: string;
};

export const useLogin = () => {
    return useMutation<UseLoginData, Error, UseLoginVariables>((data) => {
        return axios.post('/api/auth/login', data);
    });
};

// const { startLoading, stopLoading } = useLoading();
// const [errors, setErrors] = useState({});
// const { loginUser } = useUser();
// const [form, setForm] = useState<UserLoginForm>({
//     email: '',
//     password: '',
// });

// /* The POST method adds a new entry in the mongodb database. */
// const postData = async (form: UserLoginForm): Promise<void> => {
//     try {
//         startLoading();
//         const json = await fetcher.post(form, api.authUrl);
//         loginUser(json.data.user);
//         await router.push('/');
//         stopLoading();
//     } catch (error) {
//
//         stopLoading();
//         alert('Email o contraseña incorrectos');
//     }
// };
