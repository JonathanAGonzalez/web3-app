import { toast } from 'react-toastify';

interface ShowToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  text: string;
}

export const showToast = ({ type, text }: ShowToastProps) => {
  switch (type) {
    case 'success':
      toast.success(text);
      break;

    case 'error':
      toast.error(text);
      break;

    case 'warning':
      toast.warn(text);
      break;

    case 'info':
      toast.info(text);
      break;

    default:
      toast(text);
      break;
  }
};
