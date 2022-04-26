import { toast } from 'react-toastify';

class ToastService {
  success(message: string) {
    toast.success(message);
  }

  error(error: any) {
    const message =
      typeof error.message !== 'string' ? error.message.message : error.message;
    toast.error(message);
  }
}

export default new ToastService();
