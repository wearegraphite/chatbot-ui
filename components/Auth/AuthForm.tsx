'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Router from 'next/router';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

interface ILoginForm {
    email: string;
    password: string;
}

export default function AuthForm() {
    const { t } = useTranslation('user');
    const supabase = createClientComponentClient();
    const [loading, setLoading] = useState(false);

    const formSchema = yup.object().shape({
        email: yup.string().email().required(),
        password: yup.string().required().min(8, 'Password must contain 8 or more characters'),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ILoginForm>({ resolver: yupResolver(formSchema) });

    const onSubmitHandler = handleSubmit(async (formData) => {
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
        })

        if (error) {
            reset();
            toast.error(t('Login in error'))
            setLoading(false);
        } else {
            Router.push('/');
        }
    });

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={onSubmitHandler}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            {t('Email address')}
                        </label>
                        <div className="mt-2">
                            <input
                                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.email ? 'ring-red-500' : ''}`}
                                {...register('email', { value: '' })}
                            />
                            {errors.email && <span className="text-red-500">{errors.email?.message}</span>}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                {t('Password')}
                            </label>
                            <div className="text-sm">
                                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    {t('Forgot password?')}
                                </a>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input
                                type="password"
                                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.email ? 'ring-red-500' : ''}`}
                                {...register('password', { value: '' })}
                            />
                            {errors.password && <span className="text-red-500">{errors.password?.message}</span>}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex items-center w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            disabled={loading}
                        >
                            {t('Sign in')} {loading && <span className="loading loading-infinity loading-md"></span>}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}