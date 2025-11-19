import Swal from 'sweetalert2';
import styles from './showToast.module.scss';
function showToast(message, isSuccess = true, position = 'top-end') {
    Swal.fire({
        icon: isSuccess ? 'success' : 'error',
        title: 'Thông báo',
        // title: isSuccess ? 'Thành công!' : 'Lỗi!',
        text: message,
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
