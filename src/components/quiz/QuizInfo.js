import React from 'react';
import PropTypes from 'prop-types';

const QuizInfo = ({ title, description, url }) => {
	let videoId = url.split('?v=').pop();

	return (
		<div className='quiz-info'>
			<h2 className='title'>{title}</h2>
			<p className='quiz-description'>{description}</p>
			<div className='quiz-video'>
				<iframe
					width='560'
					height='315'
					src={`https://www.youtube.com/embed/${videoId}`}
					title='YouTube video player'
					frameBorder='0'
					allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
					allowFullScreen
				/>
			</div>
		</div>
	);
};

QuizInfo.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired,
};

export default QuizInfo;
