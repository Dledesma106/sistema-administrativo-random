import { createContext} from 'react';
import { IUser } from 'backend/models/interfaces';


interface UserContextProps{
    user: IUser;
    loginUser: () => Promise<void>;
    logoutUser: () => void;
   isLoggedIn: boolean;
}

const UserContext = createContext<UserContextProps>({} as UserContextProps)

export default UserContext
