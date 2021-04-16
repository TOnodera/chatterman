import izitoast from 'izitoast';

class Toast {
  warning (title: string, message?: string) {
    izitoast.warning({
      title: title,
      message: message,
      timeout: 3000,
      position: 'center'
    });
  }
}

export default new Toast();
