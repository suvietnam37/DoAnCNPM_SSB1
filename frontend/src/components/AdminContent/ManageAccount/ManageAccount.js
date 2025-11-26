import styles from './ManageAccount.module.scss';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
// import axios from 'axios';
import showToast from '../../../untils/ShowToast/showToast';
import axios from '../../../untils/CustomAxios/axios.customize';
import { useTranslation } from 'react-i18next';
import '../../../untils/ChangeLanguage/i18n';

const cx = classNames.bind(styles);

function ManageAccount() {
    const { t } = useTranslation();

    const [accounts, setAccounts] = useState([]);
    const [accountEdit, setAccountEdit] = useState({});
    const [drivers, setDrivers] = useState([]);
    const [parents, setParents] = useState([]);
    const [selectedRole, setSelectedRole] = useState(''); // '' | 'Parent' | 'Driver' | 'Admin'
    const [isOpenModalOpen, setIsOpenModalOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [selectedParentId, setSelectedParentId] = useState(null);
    const [selectedDriverId, setSelectedDriverId] = useState(null);
    const [selectedAccount, setSelectedAccount] = useState(null);

    const handleOpenModal = (type) => {
        setIsOpenModalOpen(type);
    };

    const handleCloseModal = () => {
        setIsOpenModalOpen('');
        setUsername('');
        setPassword('');
        setNewPassword('');
    };

    const fetchAccounts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/accounts');
            setAccounts(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchDrivers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/drivers');
            setDrivers(response.data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchParents = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/parents');
            setParents(response.data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        fetchParents();
    }, []);

    const handleAddAccount = async () => {
        try {
            let role_id;
            let relatedId = null;

            if (selectedRole === 'Driver') {
                role_id = 2;
                relatedId = selectedDriverId;
            } else if (selectedRole === 'Parent') {
                role_id = 3;
                relatedId = selectedParentId;
            } else {
                role_id = 1; // Admin
            }

            await axios.post('http://localhost:5000/api/accounts/create', {
                username,
                password,
                roleid: role_id,
                related_id: relatedId, // parent_id hoặc driver_id
            });
            showToast('add_account_success');
            fetchAccounts(); // reload danh sách
            fetchDrivers();
            fetchParents();
            handleCloseModal();

            // reset state
            setUsername('');
            setPassword('');
            setSelectedRole('');
            setSelectedParentId(null);
            setSelectedDriverId(null);
        } catch (error) {
            console.error(error);
            showToast('add_account_failed', false);
        }
    };

    const handleToggleStatus = async (account) => {
        try {
            const newStatus = account.status === 'Active' ? 'Locked' : 'Active';

            await axios.put(`http://localhost:5000/api/accounts/${account.account_id}/status`, {
                status: newStatus,
            });

            showToast(newStatus === 'Locked' ? t('update_status_locked') : t('update_status_unlocked'), true);

            fetchAccounts(); // Cập nhật lại danh sách
        } catch (error) {
            showToast('update_status_failed', false);
        } finally {
            handleCloseModal();
        }
    };

    const handleSoftDelete = async (account) => {
        try {
            await axios.delete(`http://localhost:5000/api/accounts/${account.account_id}`);

            showToast('delete_account_success');

            fetchAccounts();
        } catch (error) {
            showToast('update_status_failed', false);
        } finally {
            handleCloseModal();
        }
    };

    const handleUpdateAccount = async () => {
        try {
            if (!selectedAccount) return;

            let role_id;
            let relatedId = null;

            if (selectedRole === 'Driver') {
                role_id = 2;
                relatedId = selectedDriverId;
            } else if (selectedRole === 'Parent') {
                role_id = 3;
                relatedId = selectedParentId;
            } else {
                role_id = 1;
            }

            console.log({
                username: username || selectedAccount.username,
                oldPassword: password,
                newPassword: newPassword,
                roleid: role_id,
                related_id: relatedId,
            });

            await axios.put(`http://localhost:5000/api/accounts/${selectedAccount.account_id}`, {
                username: username || selectedAccount.username,
                oldPassword: password,
                newPassword: newPassword,
                roleid: role_id,
                related_id: relatedId,
            });

            showToast('update_account_success');
            fetchAccounts();
            handleCloseModal();

            setUsername('');
            setPassword('');
            setNewPassword('');
            setSelectedRole('');
            setSelectedParentId(null);
            setSelectedDriverId(null);
        } catch (error) {
            console.error(error);
            showToast('update_account_failed', false);
        }
    };

    const fetchDriverByAccId = async (account) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/drivers/by-account/${account.account_id}`);
            setAccountEdit(response.data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    const fetchParentByAccId = async (account) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/parents/by-account/${account.account_id}`);
            setAccountEdit(response.data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        if (isOpenModalOpen === 'edit' && selectedAccount && selectedRole === 'Driver') {
            const driver = drivers.find((d) => d.account_id === selectedAccount.account_id);
            if (driver) {
                setSelectedDriverId(driver.driver_id);
            }
        }
    }, [isOpenModalOpen, selectedAccount, selectedRole, drivers]);

    useEffect(() => {
        if (isOpenModalOpen === 'edit' && selectedAccount) {
            if (selectedAccount.role_name === 'Parent') {
                fetchParentByAccId(selectedAccount);
            } else if (selectedAccount.role_name === 'Driver') {
                fetchDriverByAccId(selectedAccount);
            }
        }
    }, [isOpenModalOpen, selectedAccount]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('title-container')}>
                <h2 className={cx('title')}>{t('account_management')}</h2>
                <button className={cx('btn', 'add')} onClick={() => handleOpenModal('add')}>
                    {t('add_account')}
                </button>
            </div>
            <div className={cx('table-wrapper')}>
                <table className={cx('table')}>
                    <thead>
                        <tr>
                            <th>{t('acc_id')}</th>
                            <th>{t('Username')}</th>
                            <th>{t('role')}</th>
                            <th>{t('status')}</th>
                            <th>{t('actions')}</th>
                            <th>{t('details')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map((acc) => {
                            return (
                                <tr key={acc.account_id}>
                                    <td>{acc.account_id}</td>
                                    <td>{acc.username}</td>
                                    <td>{acc.role_name}</td>
                                    <td>
                                        {acc.status === 'Active' ? (
                                            <div className={cx('status-container')}>
                                                <p>{t('active')}</p>
                                                <button
                                                    className={cx('btn', 'lock')}
                                                    onClick={() => {
                                                        setSelectedAccount(acc);
                                                        handleOpenModal('lock');
                                                    }}
                                                >
                                                    {t('lock')}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className={cx('status-container')}>
                                                <p>{t('locked')}</p>
                                                <button
                                                    className={cx('btn', 'unlock')}
                                                    onClick={() => {
                                                        setSelectedAccount(acc);
                                                        handleOpenModal('lock');
                                                    }}
                                                >
                                                    {t('unlock')}
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            className={cx('btn', 'change')}
                                            onClick={() => {
                                                setSelectedAccount(acc);
                                                setSelectedRole(acc.role_name);
                                                setUsername(acc.username);
                                                handleOpenModal('edit');
                                            }}
                                        >
                                            {t('edit')}
                                        </button>
                                        <button
                                            className={cx('btn', 'danger')}
                                            onClick={() => {
                                                setSelectedAccount(acc);
                                                handleOpenModal('delete');
                                            }}
                                        >
                                            {t('delete')}
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className={cx('btn', 'details')}
                                            onClick={() => {
                                                setSelectedAccount(acc);
                                                handleOpenModal('details');
                                            }}
                                        >
                                            ...
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {isOpenModalOpen === 'edit' && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-overlay-close')}>
                            <button
                                className={cx('btn', 'danger', 'radius')}
                                onClick={() => {
                                    handleCloseModal();
                                    setUsername('');
                                }}
                            >
                                {t('close')} {/* X */}
                            </button>
                        </div>
                        <h3>{t('edit_account')}</h3>
                        <div className={cx('form')}>
                            <div className={cx('flex-input')}>
                                <label>{t('Username')}: </label>
                                <input
                                    type="text"
                                    placeholder={t('Username')}
                                    className={cx('input')}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className={cx('flex-input')}>
                                <label>{t('old_password')}: </label>
                                <input
                                    type="text"
                                    placeholder={t('old_password')}
                                    className={cx('input')}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className={cx('flex-input')}>
                                <label>{t('new_password')}: </label>
                                <input
                                    type="text"
                                    placeholder={t('new_password')}
                                    className={cx('input')}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>

                            <div className={cx('roles')}>
                                <label className={cx('role-label')}>
                                    <input
                                        type="radio"
                                        name="role"
                                        className={cx('radio')}
                                        value="Parent"
                                        checked={selectedRole === 'Parent'}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                    />
                                    <span>{t('Parent')}</span>
                                </label>

                                <label className={cx('role-label')}>
                                    <input
                                        type="radio"
                                        name="role"
                                        className={cx('radio')}
                                        value="Driver"
                                        checked={selectedRole === 'Driver'}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                    />
                                    <span>{t('Driver')}</span>
                                </label>

                                <label className={cx('role-label')}>
                                    <input
                                        type="radio"
                                        name="role"
                                        className={cx('radio')}
                                        value="Admin"
                                        checked={selectedRole === 'Admin'}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                    />
                                    <span>{t('Admin')}</span>
                                </label>
                            </div>

                            <div className={cx('form-container')}>
                                <div className={cx('table-wrapper')}>
                                    <table className={cx('table')}>
                                        {selectedRole === 'Admin' ? (
                                            ''
                                        ) : (
                                            <thead>
                                                <tr>
                                                    <th>
                                                        {t('code')}{' '}
                                                        {selectedRole === 'Parent'
                                                            ? t('Parent')
                                                            : selectedRole === 'Driver'
                                                            ? t('Driver')
                                                            : ''}
                                                    </th>
                                                    <th>
                                                        {selectedRole === 'Parent'
                                                            ? t('Parent')
                                                            : selectedRole === 'Driver'
                                                            ? t('Driver')
                                                            : ''}
                                                    </th>
                                                    <th>{t('select')}</th>
                                                </tr>
                                            </thead>
                                        )}
                                        <tbody>
                                            {selectedRole === 'Parent' &&
                                                parents.map((parent) => {
                                                    if (
                                                        parent.account_id == selectedAccount.account_id ||
                                                        parent.account_id == null
                                                    )
                                                        return (
                                                            <tr key={parent.parent_id}>
                                                                <td>{parent.parent_id}</td>
                                                                <td>{parent.parent_name}</td>
                                                                <td>
                                                                    <input
                                                                        type="radio"
                                                                        name="parent"
                                                                        value={parent.parent_id}
                                                                        onChange={(e) =>
                                                                            setSelectedParentId(e.target.value)
                                                                        }
                                                                        checked={
                                                                            accountEdit.account_id ==
                                                                            selectedAccount.account_id
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                        );
                                                })}

                                            {selectedRole === 'Driver' &&
                                                drivers.map((driver) => {
                                                    if (
                                                        driver.account_id == selectedAccount.account_id ||
                                                        driver.account_id == null
                                                    )
                                                        return (
                                                            <tr key={driver.driver_id}>
                                                                <td>{driver.driver_id}</td>
                                                                <td>{driver.driver_name}</td>
                                                                <td>
                                                                    <input
                                                                        type="radio"
                                                                        name="driver"
                                                                        value={driver.driver_id}
                                                                        onChange={(e) => {
                                                                            setSelectedDriverId(e.target.value);
                                                                        }}
                                                                        checked={selectedDriverId == driver.driver_id}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        );
                                                })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className={cx('buttons')}>
                                <button className={cx('btn', 'add')} onClick={handleUpdateAccount}>
                                    {t('update')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {isOpenModalOpen === 'add' && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-overlay-close')}>
                            <button
                                className={cx('btn', 'danger', 'radius')}
                                onClick={() => {
                                    handleCloseModal();
                                    setUsername('');
                                }}
                            >
                                X
                            </button>
                        </div>
                        <h3>{t('add_account')}</h3>
                        <div className={cx('form')}>
                            <input
                                type="text"
                                placeholder={t('username')}
                                className={cx('input')}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />

                            <input
                                type="text"
                                placeholder={t('password')}
                                className={cx('input')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <div className={cx('roles')}>
                                <label className={cx('role-label')}>
                                    <input
                                        type="radio"
                                        name="role"
                                        className={cx('radio')}
                                        value="Parent"
                                        checked={selectedRole === 'Parent'}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                    />
                                    <span>{t('Parent')}</span>
                                </label>

                                <label className={cx('role-label')}>
                                    <input
                                        type="radio"
                                        name="role"
                                        className={cx('radio')}
                                        value="Driver"
                                        checked={selectedRole === 'Driver'}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                    />
                                    <span>{t('driver')}</span>
                                </label>

                                <label className={cx('role-label')}>
                                    <input
                                        type="radio"
                                        name="role"
                                        className={cx('radio')}
                                        value="Admin"
                                        checked={selectedRole === 'Admin'}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                    />
                                    <span>{t('Admin')}</span>
                                </label>
                            </div>

                            <div className={cx('form-container')}>
                                <div className={cx('table-wrapper')}>
                                    <table className={cx('table')}>
                                        {selectedRole === 'Admin' ? (
                                            ''
                                        ) : (
                                            <thead>
                                                <tr>
                                                    <th>
                                                        {t('code')}{' '}
                                                        {selectedRole === 'Parent'
                                                            ? t('Parent')
                                                            : selectedRole === 'Driver'
                                                            ? t('Driver')
                                                            : ''}
                                                    </th>
                                                    <th>
                                                        {selectedRole === 'Parent'
                                                            ? t('Parent')
                                                            : selectedRole === 'Driver'
                                                            ? t('Driver')
                                                            : ''}
                                                    </th>
                                                    <th>{t('select')}</th>
                                                </tr>
                                            </thead>
                                        )}
                                        <tbody>
                                            {selectedRole === 'Parent' &&
                                                parents.map((parent) => {
                                                    if (parent.account_id == null)
                                                        return (
                                                            <tr key={parent.parent_id}>
                                                                <td>{parent.parent_id}</td>
                                                                <td>{parent.parent_name}</td>
                                                                <td>
                                                                    <input
                                                                        type="radio"
                                                                        name="parent"
                                                                        value={parent.parent_id}
                                                                        onChange={(e) =>
                                                                            setSelectedParentId(e.target.value)
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                        );
                                                })}

                                            {selectedRole === 'Driver' &&
                                                drivers.map((driver) => {
                                                    if (driver.account_id == null)
                                                        return (
                                                            <tr key={driver.driver_id}>
                                                                <td>{driver.driver_id}</td>
                                                                <td>{driver.driver_name}</td>
                                                                <td>
                                                                    <input
                                                                        type="radio"
                                                                        name="driver"
                                                                        value={driver.driver_id}
                                                                        onChange={(e) =>
                                                                            setSelectedDriverId(e.target.value)
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                        );
                                                })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className={cx('buttons')}>
                                <button className={cx('btn', 'add')} onClick={handleAddAccount}>
                                    {t('add')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isOpenModalOpen === 'details' && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-overlay-close')}>
                            <button className={cx('btn', 'danger', 'radius')} onClick={() => handleCloseModal()}>
                                X
                            </button>
                        </div>
                        <h3>{t('details')}</h3>
                        <div className={cx('form')}>
                            <div className={cx('input-container')}>
                                <label>{t('acc_id')}: </label>
                                <input
                                    type="text"
                                    placeholder={t('code')}
                                    className={cx('input')}
                                    value={selectedAccount.account_id}
                                />
                            </div>
                            <div className={cx('input-container')}>
                                <label>{t('account_name')}: </label>
                                <input
                                    type="text"
                                    placeholder={t('account_name')}
                                    className={cx('input')}
                                    value={selectedAccount.username}
                                />
                            </div>

                            <div className={cx('input-container')}>
                                <label>{t('Password')}: </label>
                                <input
                                    type="text"
                                    placeholder={t('password')}
                                    className={cx('input')}
                                    value={selectedAccount.password}
                                />
                            </div>

                            <div className={cx('input-container')}>
                                <label>{t('role')}: </label>
                                <input
                                    type="text"
                                    placeholder={t('role')}
                                    className={cx('input')}
                                    value={selectedAccount.role_name}
                                />
                            </div>

                            <div className={cx('input-container')}>
                                <label>{t('status')}: </label>
                                <input
                                    type="text"
                                    placeholder={t('status')}
                                    className={cx('input')}
                                    value={selectedAccount.status}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isOpenModalOpen === 'delete' && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-overlay-close')}>
                            <button className={cx('btn', 'danger', 'radius')} onClick={() => handleCloseModal()}>
                                X
                            </button>
                        </div>
                        <h3>
                            {t('confirm_delete')} {t('account_name')}?
                        </h3>
                        <button className={cx('btn', 'add')} onClick={() => handleSoftDelete(selectedAccount)}>
                            {t('confirm_delete')}
                        </button>
                    </div>
                </div>
            )}

            {isOpenModalOpen === 'lock' && selectedAccount && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-overlay-close')}>
                            <button className={cx('btn', 'danger', 'radius')} onClick={() => handleCloseModal()}>
                                X
                            </button>
                        </div>
                        <h3>
                            {selectedAccount.status === 'Active'
                                ? t('confirm_lock_account')
                                : t('confirm_unlock_account')}
                        </h3>
                        <button className={cx('btn', 'add')} onClick={() => handleToggleStatus(selectedAccount)}>
                            {t('confirm_action')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageAccount;
