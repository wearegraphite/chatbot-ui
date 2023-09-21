'use client'
import { useCallback, useEffect, useState } from 'react'
import { Session, createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Router from 'next/router';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

interface IAccountFrom {
    fullname: string;
    username: string;
    website?: string | null;
    avatarUrl?: string | null;
}

const AccountForm = ({ session }: { session: Session | null }) => {
    const { t } = useTranslation('user');
    const supabase = createClientComponentClient();
    const [loading, setLoading] = useState(true);
    const user = session?.user;

    const formSchema = yup.object().shape({
        fullname: yup.string().required(),
        username: yup.string().required(),
        website: yup.string().url().nullable(),
        avatarUrl: yup.string().url().nullable(),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<IAccountFrom>({ defaultValues: { fullname: '', username: '', website: '', avatarUrl: '' }, resolver: yupResolver(formSchema) });

    const getProfile = useCallback(async () => {
        try {
            setLoading(true);

            let { data, error, status } = await supabase
                .from('profiles')
                .select(`full_name, username, website, avatar_url`)
                .eq('auth_id', user?.id)
                .single();

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setValue('fullname', data.full_name);
                setValue('username', data.username);
                setValue('website', data.website);
                setValue('avatarUrl', data.avatar_url);
            }
        } catch (error) {
            console.log('Error load profile', error);
        } finally {
            setLoading(false);
        }
    }, [user, supabase]);

    useEffect(() => {
        if (user) {
            getProfile();
        }
    }, [user, getProfile]);

    const onSubmitHandler = handleSubmit(async (formData) => {
        try {
            setLoading(true);

            let { error } = await supabase.from('profiles').upsert({
                full_name: formData.fullname,
                username: formData.username,
                website: formData.website,
                updated_at: new Date().toISOString(),
                avatar_url: formData.avatarUrl,
                auth_id: user?.id,
            }, { onConflict: 'auth_id' })
            //.eq('auth_id', user?.id);

            if (error) {
                throw error;
            }

            toast.success(t('Profile updated!'));
            getProfile();
        } catch (error) {
            toast.error(t('Error updating the data!'));
            getProfile();
        } finally {
            setLoading(false);
        }
    });

    const Logout = async () => {
        await supabase.auth.signOut();
        Router.push('/');
    };

    return (
        <>
            <form className="form-widget" onSubmit={onSubmitHandler}>
                <div className="flex pb-2 items-center">
                    <label htmlFor="email" className="block text-sm font-medium leading-6 w-1/3">{t('Email')}</label>
                    <p className='w-full'>{session?.user.email}</p>
                </div>
                <div className="flex pb-2 items-center">
                    <label htmlFor="fullName" className="block text-sm font-medium leading-6 w-1/3">{t('Full Name')}</label>
                    <div className="w-full">
                        <input
                            {...register('fullname')}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        {errors.fullname && <span className="text-red-500">{errors.fullname?.message}</span>}
                    </div>
                </div>
                <div className="flex pb-2 items-center">
                    <label htmlFor="username" className="block text-sm font-medium leading-6 w-1/3">{t('Username')}</label>
                    <div className="w-full">
                        <input
                            {...register('username')}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        {errors.username && <span className="text-red-500">{errors.username?.message}</span>}
                    </div>
                </div>
                <div className="flex pb-2 items-center">
                    <label htmlFor="website" className="block text-sm font-medium leading-6 w-1/3">{t('Website')}</label>
                    <div className="w-full">
                        <input
                            {...register('website')}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        {errors.website && <span className="text-red-500">{errors.website?.message}</span>}
                    </div>
                </div>

                <div className="flex pb-2 items-center">
                    <label htmlFor="avatarUrl" className="block text-sm font-medium leading-6 w-1/3">{t('Avatar url')}</label>
                    <div className="w-full">
                        <input
                            {...register('avatarUrl')}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        {errors.avatarUrl && <span className="text-red-500">{errors.avatarUrl?.message}</span>}
                    </div>

                </div>

                <div className="flex items-center justify-center m-2 mt-0">
                    <button
                        type="submit"
                        className="btn"
                        disabled={loading}
                    >
                        {t('Update')} {loading && <span className="loading loading-infinity loading-md"></span>}
                    </button>
                </div>
            </form>
            <div className="mt-5">
                <button className="btn btn-outline btn-error" onClick={() => Logout()}>
                    {t('Sign out')}
                </button>
            </div>
        </>
    );
}

export default AccountForm;