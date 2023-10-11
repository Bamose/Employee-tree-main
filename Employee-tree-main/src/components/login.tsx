import React, {useState} from 'react'; 
import { Modal, TextInput, Button, Notification} from '@mantine/core';
import { useForm,isNotEmpty, isEmail } from '@mantine/form';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

interface LoginProps {
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose }) => {
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validationRules: {
      email: (value) => !value && 'Email is required',
      password: (value) => !value && 'Password is required',
    },
  });

  const [resetEmailSent, setResetEmailSent] = useState(false);
  
  const handleLogin = () => {
    if (form.errors.email || form.errors.password) return;

    const auth = getAuth();
    signInWithEmailAndPassword(auth, form.values.email, form.values.password)
      .then(() => {
        onClose();
      })
      .catch((error) => {
        form.setErrors({ email: error.message });
      });
  };

  const handleForgotPassword = () => {
    if (form.errors.email) return;

    const auth = getAuth();
    sendPasswordResetEmail(auth, form.values.email)
      .then(() => {
        setResetEmailSent(true);
      })
      .catch((error) => {
        form.setErrors({ email: error.message });
      });
  };

  return (
    <Modal opened onClose={onClose} className='w-1/3 h-auto pt-0 bg-white rounded-lg shadow-lg'>
      <div className="flex flex-col pt-0 p-8">
        <h2 className="flex justify-center items-center mb-6 text-2xl font-semibold">Login</h2>

        <TextInput
          className="ml-12 mb-3 w-4/5"
          label="Email"
          type="email"
          placeholder="Email"
          value={form.values.email}
          onChange={(value) => form.onChange('email', value)}
          error={form.errors.email}
        />

        <TextInput
          className="ml-12 mb-3 w-4/5"
          label="Password"
          type="password"
          placeholder="Password"
          value={form.values.password}
          onChange={(value) => form.onChange('password', value)}
          error={form.errors.password}
        />

        {resetEmailSent ? (
          <Notification className="ml-12" color="green">Reset email sent. Please check your email!</Notification>
        ) : (
          <Button className="text-blue-500 ml-12 mt-2 text-sm focus:outline-none underline" onClick={handleForgotPassword}>
            Forgot Password?
          </Button>
        )}

        <Button className="bg-amber-400 hover:bg-amber-500 text-black font-bold py-2 px-4 rounded ml-12 mt-3 w-4/5" onClick={handleLogin}>
          Login
        </Button>
      </div>
    </Modal>
  );
};

export default Login;
