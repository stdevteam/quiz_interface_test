import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QuizInfo from './QuizInfo';

const apiUrl = process.env.REACT_APP_BASE_API_URL;

const Quiz = () => {
	const [quiz, setQuiz] = useState(null);
	const [quizError, setQuizError] = useState('');
	const [quizLoading, setQuizLoading] = useState(true);
	const [isSubmitted, setIsSubmitted] = useState(false);

	useEffect(() => {
		// Get quiz data from json file
		axios
			.get(`${apiUrl}/quiz`)
			.then((response) => {
				setQuiz(response.data);
				setQuizLoading(false);
			})
			.catch((error) => {
				setQuizError('Something went wrong!');
				setQuizLoading(false);
			});
	}, []);

	const onInputChange = (e, id, isTrue) => {
		let value = e.target.value;
		let newQuiz = { ...quiz };

		// Set user answer_id and is_true_answer fields for current question
		newQuiz.questions_answers = newQuiz.questions_answers.map((item) => {
			return item.id === id ? { ...item, answer_id: +value, is_true_answer: isTrue } : item;
		});

		setQuiz(newQuiz);
	};

	const handleQuizSubmit = (e) => {
		e.preventDefault();

		let correctAnswers = 0;
		let newQuiz = { ...quiz };
		let questionsList = newQuiz.questions_answers;

		// Calculate correct answers number
		questionsList.forEach((question) => {
			let selectedAnswer = question.answers.filter((answer) => answer.id === question.answer_id);
			if (selectedAnswer[0] && selectedAnswer[0].is_true) {
				correctAnswers++;
			}
		});

		// Calculate score in percentages
		let calculatedScore = ((correctAnswers / questionsList.length) * 100).toFixed(0) + '%';
		newQuiz.score = calculatedScore;

		setQuiz(newQuiz);
		setIsSubmitted(true);
	};

	return quizError ? (
		<div className='container text-center mt-50'>
			<h2 className='title'>{quizError}</h2>
		</div>
	) : quizLoading ? (
		<div className='container text-center mt-50'>
			<h2 className='title'>Loading...</h2>
		</div>
	) : (
		quiz && (
			<div className='container mb-50'>
				<QuizInfo title={quiz.title} description={quiz.description} url={quiz.url} />

				<form className='quiz-questions' onSubmit={handleQuizSubmit}>
					<div className='quiz-questions-list'>
						{quiz.questions_answers.map((question) => (
							<div key={question.id}>
								<h5>{question.text}</h5>
								<ul>
									{question.answers.map((answer) => (
										<li key={answer.id}>
											<label className={isSubmitted ? 'disabled' : ''}>
												<input
													type='radio'
													disabled={isSubmitted}
													value={answer.id}
													name={question.id}
													checked={answer.id === question.answer_id}
													onChange={(e) => onInputChange(e, question.id, answer.is_true)}
												/>
												<span>{answer.text}</span>
											</label>
										</li>
									))}
								</ul>
								{isSubmitted && (
									<p className={`feedback ${question.is_true_answer ? 'success' : 'error'}`}>
										{question.is_true_answer ? question.feedback_true : question.feedback_false}
									</p>
								)}
							</div>
						))}
					</div>

					<button type='submit' className='submit-btn'>
						Submit
					</button>
				</form>

				{isSubmitted && <p className='quiz-results'>Score: {quiz.score}</p>}
			</div>
		)
	);
};

export default Quiz;
