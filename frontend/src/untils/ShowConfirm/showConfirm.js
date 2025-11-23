import Swal from 'sweetalert2';
import i18n from '../ChangeLanguage/i18n';

function showConfirm(titleKey = 'please_confirm', confirmKey = 'confirm', onConfirm = () => {}, onCancel = () => {}) {
    Swal.fire({
        title: i18n.t(titleKey),
        showCancelButton: true,
        confirmButtonText: i18n.t(confirmKey),
        cancelButtonText: i18n.t('cancel'),
        reverseButtons: true,
    }).then((result) => {
        if (result.isConfirmed) {
            onConfirm();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            onCancel();
        }
    });
}

export default showConfirm;
