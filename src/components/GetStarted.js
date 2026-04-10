import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { continueAsGuest } from "../service/authService";

const PREFERENCES_KEY = "irontemple_preferences";

const GetStarted = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		fitnessGoal: "",
		experienceLevel: "",
		workoutType: "",
		workoutFrequency: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		localStorage.setItem(PREFERENCES_KEY, JSON.stringify(formData));
		toast.success("Preferences saved! Create an account or continue as guest.");
		navigate("/signup");
	};

	const handleContinueAsGuest = () => {
		localStorage.setItem(PREFERENCES_KEY, JSON.stringify(formData));
		continueAsGuest();
		navigate("/dashboard");
	};

	return (
		<div className='min-h-screen bg-gray-100 flex items-center justify-center'>
			<div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-lg'>
				<div className='flex justify-between mb-6'>
					<h2 className='text-3xl font-bold text-gray-900'>
						Let's Get Started!
					</h2>
					<Link
						to='/'
						className='border-solid rounded border px-2 content-evenly'
					>
						Back
					</Link>
				</div>
				<form onSubmit={handleSubmit}>
					<div className='mb-4'>
						<label className='block text-gray-700 mb-2'>
							What is your primary fitness goal?
						</label>
						<select
							name='fitnessGoal'
							value={formData.fitnessGoal}
							onChange={handleChange}
							className='w-full p-3 border border-gray-300 rounded'
							required
						>
							<option value='' disabled>Select your goal</option>
							<option value='lose-weight'>Lose Weight</option>
							<option value='build-muscle'>Build Muscle</option>
							<option value='improve-endurance'>Improve Endurance</option>
							<option value='increase-flexibility'>Increase Flexibility</option>
							<option value='general-fitness'>Maintain General Fitness</option>
						</select>
					</div>
					<div className='mb-4'>
						<label className='block text-gray-700 mb-2'>
							What is your current fitness level?
						</label>
						<select
							name='experienceLevel'
							value={formData.experienceLevel}
							onChange={handleChange}
							className='w-full p-3 border border-gray-300 rounded'
							required
						>
							<option value='' disabled>Select your experience level</option>
							<option value='beginner'>Beginner</option>
							<option value='intermediate'>Intermediate</option>
							<option value='advanced'>Advanced</option>
						</select>
					</div>
					<div className='mb-4'>
						<label className='block text-gray-700 mb-2'>
							What type of workouts do you prefer?
						</label>
						<select
							name='workoutType'
							value={formData.workoutType}
							onChange={handleChange}
							className='w-full p-3 border border-gray-300 rounded'
							required
						>
							<option value='' disabled>Select your workout type</option>
							<option value='strength'>Strength Training</option>
							<option value='cardio'>Cardio</option>
							<option value='yoga-pilates'>Yoga/Pilates</option>
							<option value='hiit'>HIIT</option>
							<option value='mixed'>Mixed</option>
						</select>
					</div>
					<div className='mb-6'>
						<label className='block text-gray-700 mb-2'>
							How many days per week do you plan to work out?
						</label>
						<select
							name='workoutFrequency'
							value={formData.workoutFrequency}
							onChange={handleChange}
							className='w-full p-3 border border-gray-300 rounded'
							required
						>
							<option value='' disabled>Select frequency</option>
							<option value='2'>2 days</option>
							<option value='3'>3 days</option>
							<option value='4'>4 days</option>
							<option value='5'>5 days</option>
							<option value='6'>6 days</option>
							<option value='7'>7 days</option>
						</select>
					</div>
					<button
						type='submit'
						className='w-full bg-blue-600 text-white p-3 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition mb-3'
					>
						Create an Account
					</button>
					<button
						type='button'
						onClick={handleContinueAsGuest}
						className='w-full border-2 border-blue-600 text-blue-600 p-3 rounded-lg font-semibold hover:bg-blue-50 transition'
					>
						Continue as Guest
					</button>
				</form>
			</div>
		</div>
	);
};

export default GetStarted;
