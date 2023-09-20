'use client'
import { useCallback, useEffect, useState } from 'react'
import { Session, createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Router from 'next/router';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const AccountForm = ({ session }: { session: Session | null }) => {
    const { t } = useTranslation('user');
    const supabase = createClientComponentClient();
    const [loading, setLoading] = useState(true);
    const [fullname, setFullname] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [website, setWebsite] = useState<string | null>(null);
    const [avatar_url, setAvatarUrl] = useState<string | null>(null);
    const user = session?.user;

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
                setFullname(data.full_name);
                setUsername(data.username);
                setWebsite(data.website);
                setAvatarUrl(data.avatar_url);
            }
        } catch (error) {
            toast.error(t('Error loading user data!'));
        } finally {
            setLoading(false);
        }
    }, [user, supabase]);

    useEffect(() => {
        if (user) {
            getProfile();
        }
    }, [user, getProfile]);

    async function updateProfile({
        username,
        website,
        avatar_url,
    }: {
        username: string | null
        fullname: string | null
        website: string | null
        avatar_url: string | null
    }) {
        try {
            setLoading(true);

            let { error } = await supabase.from('profiles').update({
                full_name: fullname,
                username,
                website,
                avatar_url,
                updated_at: new Date().toISOString(),
            })
                .eq('auth_id', user?.id);

            if (error) {
                throw error;
            }

            toast.success(t('Profile updated!'));
        } catch (error) {
            toast.error(t('Error updating the data!'));
            getProfile();
        } finally {
            setLoading(false);
        }
    };

    const Logout = async () => {
        await supabase.auth.signOut();
        Router.push('/');
    };

    return (
        <div className="form-widget">
            <div className="flex pb-2 items-center">
                <label htmlFor="email" className="block text-sm font-medium leading-6 w-1/3">{t('Email')}</label>
                <input
                    id="email"
                    type="text"
                    value={session?.user.email}
                    disabled
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
            </div>
            <div className="flex pb-2 items-center">
                <label htmlFor="fullName" className="block text-sm font-medium leading-6 w-1/3">{t('Full Name')}</label>
                <input
                    id="fullName"
                    type="text"
                    value={fullname || ''}
                    onChange={(e) => setFullname(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
            </div>
            <div className="flex pb-2 items-center">
                <label htmlFor="username" className="block text-sm font-medium leading-6 w-1/3">{t('Username')}</label>
                <input
                    id="username"
                    type="text"
                    value={username || ''}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
            </div>
            <div className="flex pb-2 items-center">
                <label htmlFor="website" className="block text-sm font-medium leading-6 w-1/3">{t('Website')}</label>
                <input
                    id="website"
                    type="url"
                    value={website || ''}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
            </div>

            <div className="flex items-center justify-center m-2">
                <button
                    className="btn btn-active"
                    onClick={() => updateProfile({ fullname, username, website, avatar_url })}
                    disabled={loading}
                >
                    {loading ? t('Loading ...') : t('Update')}
                </button>
            </div>

            <div className="mt-5">
                <button className="btn btn-outline btn-error" onClick={() => Logout()}>
                    {t('Sign out')}
                </button>
            </div>
        </div>
    );
}

export default AccountForm;