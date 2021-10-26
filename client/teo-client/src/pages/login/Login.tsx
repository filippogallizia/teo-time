import React, { useState } from 'react';
import GeneralButton from '../../component/GeneralButton';
import { signup } from './service/LoginService';

const Login = () => {
  const [email, setEmail] = useState('');
  const handleClick = async () => {
    // try {
    //   const handleSuccess = () => {};
    //   await signup(handleSuccess, email);
    // } catch (e) {
    //   console.log(e);
    // }
  };
  return (
    <div className="flex flex-col justify-center items-center">
      <div>
        <div className="m-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Email
          </label>
          <input
            className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            //   {...register('email', { required: true })}
          />
          {/* {errors.email?.type === 'required' && 'Email is required'} */}
        </div>
      </div>
      <div>
        <GeneralButton
          // disabled={!isValid}
          buttonText="LOG IN"
          onClick={handleClick}
        />
      </div>
    </div>
  );
};

export default Login;
