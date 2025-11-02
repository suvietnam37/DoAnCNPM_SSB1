import Swal from 'sweetalert2';

function showConfirm(
    title = 'Vui lòng xác nhận?',
    confirmButtonText = 'Xác nhận',
    onConfirm = () => {},
    onCancel = () => {},
) {
    Swal.fire({
        title,
        // icon: 'warning',
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText: 'Hủy',
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
