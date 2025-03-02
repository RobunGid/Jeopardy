const russianTeamNames = [
	'Изотопики',
	'Электрончики',
	'Фенольчики',
	'Радикалы',
	'Во все тяжкие',
	'Алхимики',
	'Молекулярные мастера',
	'Фан клуб Кюри',
	'ХимБро',
	'Лабораторные крысы',
	'Лига Берцелиуса',
	'Бензолы',
	'Ковалентная мафия',
	'Магистры химических экспериментов',
	'Демоны цепной реакции',
];

const englishTeamNames = [
	'Isotopics',
	'Electrons',
	'Phenolics',
	'Radicals',
	'Breaking Bad',
	'Alchemists',
	'Molecular Masters',
	'Curie Fan Club',
	'ChemBros',
	'Lab Rats',
	'Berzelius League',
	'Benzoles',
	'Covalent Mafia',
	'Masters of Chemical Experiments',
	'Demons of Chain Reaction',
];

const gameBoard = document.getElementById('game-board');
const questionModal = document.getElementById('question-modal');
const questionText = document.getElementById('question-text');
const answerText = document.getElementById('answer-text');
const showAnswerButton = document.getElementById('show-answer');
const closeModalButton = document.getElementById('close-modal');
const teamsContainer = document.getElementById('teams-container');
const modalTeams = document.getElementById('modal-teams');
const modalScoresCount = document.getElementById('modal-scores-count');
const hideGameEditorButton = document.getElementById('hide-editor');
const gameEditorContainer = document.getElementById('game-editor-container');
const gameEditorArea = document.getElementById('game-editor-area');
const convertEditorButton = document.getElementById('convert-editor');
const teamColorInput = document.getElementById('team-color');
const addScoresButton = document.getElementById('add-scores-button');

const buttonChangelangEnglish = document.getElementById('button-changelang-english');
const buttonChangelangRussian = document.getElementById('button-changelang-russian');

const gameNameElement = document.getElementById('game-name');
const teamsTitleElement = document.getElementById('teams-title');
const teamNameTitleElement = document.getElementById('team-name-title');
const scoresTitleElement = document.getElementById('scores-title');
const scoresControlTitleElement = document.getElementById('scores-control-title');
const deleteTeamTitleElement = document.getElementById('delete-team-title');

const addTeamButton = document.getElementById('add-team-button');
const teamNameInput = document.getElementById('team-name');

if (localStorage.getItem('game-data')) {
	gameEditorArea.value = localStorage.getItem('game-data');
}

if (localStorage.getItem('language')) {
	changeLanguage(localStorage.getItem('language'));
}

function createBoard(questionsData) {
	gameBoard.innerHTML = '';
	Object.keys(questionsData).forEach((category) => {
		const categoryDiv = document.createElement('div');
		categoryDiv.classList.add('cell');
		categoryDiv.classList.add('category');
		const categorySpan = document.createElement('span');
		categorySpan.textContent = category;
		categoryDiv.style.background = '#222';
		categoryDiv.append(categorySpan);
		gameBoard.appendChild(categoryDiv);
		Object.keys(questionsData[category]).forEach((points) => {
			const cell = document.createElement('div');
			cell.classList.add('cell');
			cell.textContent = points;
			cell.onclick = (event) => {
				openQuestion(category, points, questionsData);
				event.target.classList.add('showed');
			};
			gameBoard.appendChild(cell);
		});
	});
	document.addEventListener('click', (event) => {
		if (event.target === questionModal) questionModal.classList.remove('active');
	});

	document.addEventListener('keyup', (event) => {
		if (event.key === 'Escape') {
			questionModal.classList.remove('active');
		}
	});
}

function openQuestion(category, points, questionsData) {
	const questionData = questionsData[category][points];
	questionText.textContent = questionData.question;
	answerText.textContent = questionData.answer;
	answerText.classList.add('hidden');
	questionModal.classList.add('active');
	document.getElementById('modal-scores-count').textContent = points;

	showAnswerButton.onclick = (event) => {
		answerText.classList.toggle('hidden');
		event.target.textContent =
			event.target.textContent === 'Показать ответ'
				? 'Скрыть ответ'
				: 'Показать ответ';
	};
	closeModalButton.onclick = () => {
		questionModal.classList.remove('active');
	};
}

createBoard(parseQuestions(gameEditorArea.value));

function randomTeam() {
	const language = localStorage.getItem('language');
	if (language) {
		switch (language) {
			case 'EN':
				return englishTeamNames[
					Math.floor(Math.random() * englishTeamNames.length)
				];
			case 'RU':
				return russianTeamNames[
					Math.floor(Math.random() * russianTeamNames.length)
				];
		}
	}
}

function addTeam() {
	const teamName = teamNameInput.value.trim() || randomTeam();

	const teamDiv = document.createElement('div');
	teamDiv.classList.add('team');

	const nameSpan = document.createElement('span');
	const nameSpanContainer = document.createElement('div');
	nameSpan.textContent = teamName;
	nameSpan.style.color = teamColorInput.value;
	nameSpanContainer.append(nameSpan);

	const scoreSpan = document.createElement('span');
	const scoreSpanContainer = document.createElement('div');
	scoreSpan.textContent = '0';
	scoreSpan.dataset.score = 0;
	scoreSpanContainer.append(scoreSpan);

	const scoreInput = document.createElement('input');
	scoreInput.classList.add('score-input');
	const scoreInputContainer = document.createElement('div');
	scoreInput.type = 'number';
	scoreInput.placeholder = 'Очки';
	scoreInput.value = 100;
	scoreInputContainer.append(scoreInput);

	const addButton = document.createElement('button');
	const addButtonContainer = document.createElement('div');
	addButton.classList.add('team-button');
	addButton.textContent = '+';
	addButton.onclick = () => updateScore(scoreSpan, scoreInput.value, true);
	addButtonContainer.append(addButton);

	const subtractButton = document.createElement('button');
	const subtractButtonContainer = document.createElement('div');
	subtractButton.classList.add('team-button');
	subtractButton.textContent = '-';
	subtractButton.onclick = () => updateScore(scoreSpan, scoreInput.value, false);
	subtractButtonContainer.append(subtractButton);

	const deleteButton = document.createElement('button');
	const deleteButtonContainer = document.createElement('div');

	const teamContainers = [
		nameSpanContainer,
		scoreSpanContainer,
		addButtonContainer,
		scoreInputContainer,
		subtractButtonContainer,
		deleteButtonContainer,
	];

	deleteButton.classList.add('team-button');
	deleteButton.classList.add('team-button__delete');
	deleteButton.textContent =
		localStorage.getItem('language') == 'RU' ? 'Удалить' : 'Delete';
	deleteButton.onclick = () => {
		teamContainers.forEach((cont) => cont.remove());
		teamModalButton.remove();
	};
	deleteButtonContainer.append(deleteButton);

	teamContainers.forEach((cont) => {
		teamsContainer.appendChild(cont);
		cont.classList.add('teams-container-cell');
	});

	const teamModalButton = document.createElement('button');
	teamModalButton.textContent = teamName;
	teamModalButton.style.backgroundColor = teamColorInput.value;
	teamModalButton.classList.add('team-modal-button');

	teamModalButton.addEventListener('click', () => {
		updateScore(
			scoreSpan,
			parseInt(document.getElementById('modal-scores-count').textContent),
			true
		);
		questionModal.classList.remove('active');
	});

	modalTeams.append(teamModalButton);

	teamNameInput.value = '';
}

function updateScore(scoreSpan, points, isAdding) {
	let currentScore = parseInt(scoreSpan.dataset.score);
	let change = parseInt(points) || 0;

	if (!isAdding) {
		change = -change;
	}

	currentScore += change;
	scoreSpan.dataset.score = currentScore;
	scoreSpan.textContent = currentScore;
}

function parseQuestions(text) {
	const rawCategories = text.split('\n\n').filter((line) => line.trim());

	const categories = {};

	rawCategories.forEach((category) => {
		const lines = category.split('\n');

		const categoryName = lines[0];

		const linesWithoutCategory = lines.filter((_, index) => index !== 0);

		const categoryObject = {};

		linesWithoutCategory
			.filter((_, index) => index % 3 === 0)
			.forEach((score, index) => {
				categoryObject[score] = {
					question: linesWithoutCategory[index * 3 + 1],
					answer: linesWithoutCategory[index * 3 + 2],
				};
			});

		categories[categoryName] = categoryObject;
	});

	return categories;
}

hideGameEditorButton.addEventListener('click', (event) => {
	gameEditorContainer.classList.toggle('hidden-game-editor-container');
	const language = localStorage.getItem('language');
	if (language) {
		switch (language) {
			case 'RU':
				event.target.textContent =
					event.target.textContent === 'Открыть редактор игры'
						? 'Закрыть редактор игры'
						: 'Открыть редактор игры';
				break;
			case 'EN':
				event.target.textContent =
					event.target.textContent === 'Open game editor'
						? 'Close game editor'
						: 'Open game editor';
		}
	}
});

convertEditorButton.addEventListener('click', () => {
	createBoard(parseQuestions(gameEditorArea.value));
});

gameEditorArea.addEventListener('change', (event) => {
	localStorage.setItem('game-data', event.target.value);
});

function changeLanguage(language = 'EN') {
	localStorage.setItem('language', language);
	switch (language) {
		case 'EN':
			gameNameElement.textContent = 'Jeopardy';
			hideGameEditorButton.textContent = 'Open game editor';
			teamsTitleElement.textContent = 'Teams';
			teamNameTitleElement.textContent = 'Name';
			scoresTitleElement.textContent = 'Scores';
			scoresControlTitleElement.textContent = 'Scores Control';
			deleteTeamTitleElement.textContent = 'Delete team';
			addTeamButton.textContent = 'Add team';
			teamNameInput.placeholder = 'Team name';
			convertEditorButton.textContent = 'Convert';
			addScoresButton.innerHTML = `Add <span id="modal-scores-count">${modalScoresCount.textContent}</span> scores to team: `;
			document.title = 'Jeopardy';
			break;
		case 'RU':
			gameNameElement.textContent = 'Своя Игра';
			hideGameEditorButton.textContent = 'Открыть редактор игры';
			teamsTitleElement.textContent = 'Команды';
			teamNameTitleElement.textContent = 'Название';
			scoresTitleElement.textContent = 'Очки';
			scoresControlTitleElement.textContent = 'Управление очками';
			deleteTeamTitleElement.textContent = 'Удалить команду';
			addTeamButton.textContent = 'Добавить команду';
			teamNameInput.placeholder = 'Название команды';
			convertEditorButton.textContent = 'Конвертировать';
			addScoresButton.innerHTML = `Добавить <span id="modal-scores-count">${modalScoresCount.textContent}</span> очков команде: `;
			document.title = 'Своя Игра';
			break;
	}
}

buttonChangelangEnglish.addEventListener('click', () => changeLanguage('EN'));
buttonChangelangRussian.addEventListener('click', () => changeLanguage('RU'));
