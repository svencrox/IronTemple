import React, { useState } from "react";
import { Link } from "react-router-dom";

const GetStarted = () => {
	const [formData, setFormData] = useState({
		fitnessGoal: "",
		experienceLevel: "",
		workoutType: "",
		workoutFrequency: "",
		timeCommitment: "",
		dietaryPreference: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Handle form submission
		console.log("User's Fitness Goals:", formData);
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
							<option
								value=''
								disabled
							>
								Select your goal
							</option>
							<option value='Lose Weight'>Lose Weight</option>
							<option value='Build Muscle'>Build Muscle</option>
							<option value='Improve Endurance'>
								Improve Endurance
							</option>
							<option value='Increase Flexibility'>
								Increase Flexibility
							</option>
							<option value='Maintain General Fitness'>
								Maintain General Fitness
							</option>
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
							<option
								value=''
								disabled
							>
								Select your experience level
							</option>
							<option value='Beginner'>Beginner</option>
							<option value='Intermediate'>Intermediate</option>
							<option value='Advanced'>Advanced</option>
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
							<option
								value=''
								disabled
							>
								Select your workout type
							</option>
							<option value='Strength Training'>
								Strength Training
							</option>
							<option value='Cardio'>Cardio</option>
							<option value='Yoga/Pilates'>Yoga/Pilates</option>
							<option value='HIIT'>HIIT</option>
							<option value='Mixed'>Mixed</option>
						</select>
					</div>
					<div className='mb-4'>
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
							<option
								value=''
								disabled
							>
								Select frequency
							</option>
							<option value='1-2 days'>2 days</option>
							<option value='3-4 days'>3 days</option>
							<option value='5-6 days'>4 days</option>
							<option value='5-6 days'>5 days</option>
							<option value='5-6 days'>6 days</option>
							<option value='7 days'>7 days</option>
						</select>
					</div>
					<button
						type='submit'
						className='w-full bg-blue-600 text-white p-3 rounded-lg font-semibold shadow-lg'
					>
						Submit
					</button>
				</form>
			</div>
		</div>
	);
};

export default GetStarted;
