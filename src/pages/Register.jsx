import {Link, useNavigate} from 'react-router-dom';
import {useState} from 'react';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import {registerRoute} from '../utils/APIRoutes';

export function Register() {
	const navigate = useNavigate();
	const [values, setValues] = useState({
		username: '',
		email: '',
		password: '',
		confirmPassword: ''
	});

	const toastOptions = {
		position: 'bottom-right',
		autoClose: 8000,
		pauseOnHover: true,
		draggable: true,
		theme: 'dark'
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if(handleValidation()){
			const {password, username, email} = values;
			try {
				await axios.post(registerRoute, JSON.stringify({
					username,
					email,
					password,
				}), {
					headers: {
						"Content-Type": "application/json",
					},
					withCredentials: true,
				});

				navigate('/login');

			} catch (error) {
				toast.error(error.response.data.message,toastOptions);
			}
		}
	};

	const handleValidation = () => {
		const {password, confirmPassword, username, email} = values;
		if (password !== confirmPassword) {
			toast.error('password and confirm password must be the same', toastOptions);
			return false;
		} else if (password.length < 1) {
			toast.error('password must be at least 1 characters',  toastOptions);
			return false;
		} else if (username.length < 1) {
			toast.error('username must be at least 1 characters', toastOptions);
			return false;
		}
		else if (email === "") {
			toast.error('email is required', toastOptions);
			return false;
		} else {
			return true;
		}
	};
	const handleChange = (event) => {
		setValues({...values, [event.target.name]: event.target.value});
	};
	return (
		<>
			<div className={" flex h-screen w-full items-center justify-center bg-gray-900 bg-cover"}>
				<form onSubmit={handleSubmit} className={"rounded-xl bg-gray-800 bg-opacity-50 px-16 py-10 shadow-lg backdrop-blur-md max-sm:px-8 text-white gap-5"}>
					<div className={"mt-8 flex justify-center text-lg text-white"}>
						<h1 className={"mb-2 text-2xl"}>Register</h1>
					</div>

					<span className={"text-gray-300 p-2"}>Enter Register Details</span>
					<div className={"mb-4 text-lg pt-5"}>
						<input
							className={"rounded-3xl border-none bg-teal-800 bg-opacity-50 px-6 py-2 text-center text-inherit placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"}
							type="text"
							placeholder="Name"
							name="username"
							onChange={(event) => handleChange(event)}
						/>
					</div>
					<div className={"mb-4 text-lg"}>
						<input
							className={"rounded-3xl border-none bg-teal-800 bg-opacity-50 px-6 py-2 text-center text-inherit placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"}
							type="email"
							placeholder="Email"
							name="email"
							onChange={(event) => handleChange(event)}
						/>
					</div>

					<div className={"mb-4 text-lg"}>
						<input
							className={"rounded-3xl border-none bg-teal-800 bg-opacity-50 px-6 py-2 text-center text-inherit placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"}
							type="password"
							placeholder="Password"
							name="password"
							onChange={(event) => handleChange(event)}
						/>
					</div>
					<div className={"mb-4 text-lg"}>
						<input
							className={"rounded-3xl border-none bg-teal-800 bg-opacity-50 px-6 py-2 text-center text-inherit placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"}
							type="password"
							placeholder="Confirm Password"
							name="confirmPassword"
							onChange={(event) => handleChange(event)}
						/>
					</div>
					<div className={"mt-8 flex justify-center text-lg text-black"}>
						<button type="submit" className={"rounded-3xl bg-teal-800 bg-opacity-50 px-10 py-2 text-white shadow-xl backdrop-blur-md transition-colors duration-300 hover:bg-yellow-600"}>Create User</button>
					</div>

					<span className={"mt-8 flex justify-center text-lg text-white"}>
					Already have an account?  <Link to={'/login'} className={"pl-2 text-teal-800"}>Login</Link>
				</span>
				</form>
			</div>
			<ToastContainer/>
		</>
	)
}