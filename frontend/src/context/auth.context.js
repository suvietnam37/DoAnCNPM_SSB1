// import { createContext, useState, useEffect } from 'react';
// import axios from '../untils/CustomAxios/axios.customize';

// const AuthContext = createContext();

// function AuthProvider({ children }) {
//     const [auth, setAuth] = useState({
//         isAuthenticated: false,
//         user: {
//             username: '',
//             account_id: '',
//             role: '',
//         },
//     });

//     useEffect(() => {
//         const initAuth = async () => {
//             const token = localStorage.getItem('access_token');
//             if (token) {
//                 try {
//                     // Gọi BE để xác thực token và lấy thông tin user
//                     const res = await axios.get('/accounts/account');
//                     setAuth({
//                         isAuthenticated: true,
//                         user: {
//                             username: res.data.username,
//                             account_id: res.data.account_id,
//                             role: res.data.role,
//                         },
//                     });
//                 } catch (error) {
//                     console.error('Token invalid or expired:', error);
//                     localStorage.removeItem('access_token');
//                 }
//             }
//         };

//         initAuth();
//     }, []);
//     return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
// }

// export { AuthContext, AuthProvider };

import { createContext, useState, useEffect } from 'react';
import axios from '../untils/CustomAxios/axios.customize';

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        user: {
            username: '',
            account_id: '',
            role: '',
        },
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('access_token');

            if (token) {
                try {
                    const res = await axios.get('/accounts/account');
                    setAuth({
                        isAuthenticated: true,
                        user: {
                            username: res.data.username,
                            account_id: res.data.account_id,
                            role: res.data.role,
                        },
                    });
                } catch (error) {
                    console.error('Token invalid or expired:', error);
                    localStorage.removeItem('access_token');
                    setAuth({
                        isAuthenticated: false,
                        user: { username: '', account_id: '', role: '' },
                    });
                }
            } else {
                setAuth({
                    isAuthenticated: false,
                    user: { username: '', account_id: '', role: '' },
                });
            }

            setLoading(false);
        };

        initAuth();
    }, []);

    return <AuthContext.Provider value={{ auth, setAuth, loading }}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider };
