import Swal from 'sweetalert2';
import styles from './showToast.module.scss';
import i18n from '../ChangeLanguage/i18n';

function showToast(messageKey, isSuccess = true, position = 'top-end') {
    Swal.fire({
        icon: isSuccess ? 'success' : 'error',
        title: i18n.t('notification'), // tự dịch Notification / Thông báo
        text: i18n.t(messageKey), // messageKey sẽ dịch theo languages
        toast: true,
        position: position,
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        background: isSuccess ? '#f0fff4' : '#fff0f0',
        color: isSuccess ? '#2d7d46' : '#d33',
        customClass: {
            popup: styles.customtoast,
        },
    });
}

export default showToast;
