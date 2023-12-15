'use client';

import { useState, useMemo, useEffect, useContext } from 'react';
import { createContext } from 'react';

import useLoading from '@/hooks/useLoading';
import { type IUser } from 'backend/models/interfaces';

import { type ProviderProps } from '../interfaces';

interface UserContextData {
    user: IUser;
    loginUser: (user: IUser) => void;
    logoutUser: () => void;
    isLoggedIn: boolean;
}

const UserContext = createContext<UserContextData>({} as UserContextData);

const INITIAL_STATE = {
    email: '',
    firstName: '',
    lastName: '',
    fullname: '',
    _id: '',
    roles: [],
    publicKey: '',
};

const UserProvider = ({ children }: ProviderProps): JSX.Element => {
    const [user, setUser] = useState<IUser>(INITIAL_STATE);
    const { startLoading, stopLoading } = useLoading();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    function loginUser(user: IUser): void {
        if (user === undefined) return;
        startLoading();
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        setIsLoggedIn(true);
        stopLoading();
    }

    function logoutUser(): void {
        setUser(INITIAL_STATE);
        setIsLoggedIn(false);
        localStorage.setItem('user', JSON.stringify(INITIAL_STATE));
    }

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser !== null) {
            setUser(JSON.parse(storedUser));
            setIsLoggedIn(true);
        }
    }, []);

    const memoValue = useMemo(() => {
        return { user, loginUser, logoutUser, isLoggedIn };
    }, [user]);

    return <UserContext.Provider value={memoValue}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
    const context = useContext(UserContext);

    if (context === undefined) {
        throw new Error('useUserContext must be used within a UserProvider');
    }

    return context;
};

export default UserProvider;