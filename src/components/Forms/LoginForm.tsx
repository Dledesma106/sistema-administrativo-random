import { useRouter } from 'next/navigation';

import { Button, TextInput } from 'flowbite-react';
import { useState, type ChangeEvent, type FormEvent } from 'react';

import { useUserContext } from '@/context/userContext/UserProvider';
import useLoading from '@/hooks/useLoading';
import * as api from '@/lib/apiEndpoints';
import fetcher from '@/lib/fetcher';

interface UserLoginForm {
    email: string;
    password: string;
}

const LoginForm = () => {
    const router = useRouter();
    const { startLoading, stopLoading } = useLoading();
    const [errors, setErrors] = useState({});
    const { loginUser } = useUserContext();
    const [form, setForm] = useState<UserLoginForm>({
        email: '',
        password: '',
    });

    const postData = async (form: UserLoginForm): Promise<void> => {
        try {
            startLoading();
            const json = await fetcher.post(form, api.authUrl);
            loginUser(json.data.user);
            await router.push('/');
            stopLoading();
        } catch (error) {
            stopLoading();
            alert('Email o contraseña incorrectos');
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value,
        });
    };

    /* Makes sure pet info is filled for pet name, owner name, species, and image url */
    const formValidate = (): UserLoginForm => {
        const err: UserLoginForm = {
            email: '',
            password: '',
        };
        if (form.email === '') {
            err.email = 'email is required';
        }
        if (form.password === '') {
            err.password = 'password is required';
        }

        return err;
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const errs = formValidate();
        if (errs.email === '' && errs.email === '') {
            void postData(form);
        } else {
            setErrors({
                errs,
            });
        }
    };

    return (
        <>
            <form
                className="m-auto mt-6 flex w-1/4 flex-col gap-4"
                onSubmit={handleSubmit}
            >
                <label htmlFor="email">Email</label>
                <TextInput
                    type="email"
                    maxLength={60}
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required={true}
                />
                <label htmlFor="password">Password</label>
                <TextInput
                    type="password"
                    maxLength={20}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required={true}
                />

                <Button type="submit">Iniciar Sesion</Button>
            </form>
            <div>
                {Object.keys(errors).map((err, index) => (
                    <li key={index}>{err}</li>
                ))}
            </div>
        </>
    );
};

export default LoginForm;
