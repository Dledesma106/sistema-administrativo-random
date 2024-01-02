import { useState, useEffect, useContext, createContext, useCallback } from 'react';

import { LoginMutation } from '@/api/graphql';

import { type ProviderProps } from '../interfaces';

type LocalUser = NonNullable<LoginMutation['login']['user']>;

interface UserContextData {
    user: LocalUser;
    loginUser: (user: LocalUser) => void;
    logoutUser: () => void;
    isLoggedIn: boolean;
}

const UserContext = createContext<UserContextData>({} as UserContextData);

const UserProvider = ({ children }: ProviderProps): JSX.Element => {
    const [user, setUser] = useState<LocalUser>({} as unknown as LocalUser);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    function loginUser(user: LocalUser): void {
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        setIsLoggedIn(true);
    }

    const logoutUser = useCallback(() => {
        setUser({} as unknown as LocalUser);
        setIsLoggedIn(false);
        localStorage.removeItem('user');
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <UserContext.Provider
            value={{
                user,
                loginUser,
                logoutUser,
                isLoggedIn,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext);

    if (context === undefined) {
        throw new Error('useUserContext must be used within a UserProvider');
    }

    return context;
};

export default UserProvider;
