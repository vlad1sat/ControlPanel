let studentData = [];

function createForm() {
    const form = document.createElement('form');
    const button = document.createElement('button');
    const inputFullName = createBaseElementForm('ФИО', 'Введите ФИО');
    const inputFaculty = createBaseElementForm('Факультет', 'Введите ваш факультет');
    const inputYearEducation = createBaseElementForm('Год обучения', 'Введите начало вашего обучения');
    const inputDate = document.createElement('input');
    const divInputDate = document.createElement('div');
    const dataBorn = document.createElement('label');
    const buttonWrapper = document.createElement('div');

    createStyleApp();
    buttonWrapper.append(button);
    form.append(inputFullName.divInput, inputFaculty.divInput,
        inputYearEducation.divInput, divInputDate, buttonWrapper);

    function createBaseElementForm(textTitle, prompt) {
        const input = document.createElement('input');
        const divInput = document.createElement('div');
        const textName = document.createElement('label');

        textName.textContent = textTitle;
        input.placeholder = prompt;
        divInput.classList.add('block-form');
        textName.classList.add('text-form');
        input.classList.add('form-control');
        divInput.append(textName, input);

        input.addEventListener('input', function(e) {
            e.preventDefault();
            let isCorrectSymbol = false;

            for (const symbol of input.value)
                if (symbol !== ' ') {
                    isCorrectSymbol = true;
                    break;
                }

            button.disabled = input.value.length === 0 || !isCorrectSymbol;
        })

        return {
            divInput,
            input
        };
    }

    function createStyleApp() {
        button.disabled = true;
        inputDate.type = "date";
        inputYearEducation.input.type = "number";
        dataBorn.textContent = "Дата рождения";
        dataBorn.classList.add('text-form');
        divInputDate.classList.add('block-form');
        divInputDate.append(dataBorn, inputDate);
        form.classList.add('mb-3', 'form-style');
        inputDate.classList.add('form-control');
        button.classList.add('button-form', 'btn', 'btn-primary');
        button.textContent = "Добавить студента";
        buttonWrapper.classList.add('input-group-append');
    }

    return {
        form,
        fullName: inputFullName.input,
        faculty: inputFaculty.input,
        yearEducation: inputYearEducation.input,
        inputDate,
        button
    };
}

 function createTable() {
    const table = document.createElement('table');
    const head_table = document.createElement('thead');
    const body_table = document.createElement('tbody');
    const first_row = document.createElement('tr');
    body_table.id = 'table-body';
    const full_name = createInformationTable("ФИО");
    const faculty = createInformationTable("Факультет");
    const dateBorn = createInformationTable("Дата рождения и возраст");
    const yearStartEducation = createInformationTable("Годы обучения и номер курса");

    function createInformationTable(title) {
        const element = document.createElement('th');
        const buttonFilter = document.createElement('button');
        buttonFilter.textContent = title;
        buttonFilter.classList.add('btn');
        element.append(buttonFilter);
        first_row.append(element);

        return {
            element,
            buttonFilter
        };
    }

    table.classList.add('table');
    head_table.append(first_row);
    table.append(head_table, body_table);

    return {
        table,
        body_table,
        full_name,
        faculty,
        dateBorn,
        yearStartEducation
    };
}

function createTitle() {
    const nameSite = document.createElement('h1');
    nameSite.textContent = 'Информация о студентаx';
    nameSite.classList.add('main-text');
    return nameSite;
}

function createApp() {
    const nameSite = createTitle();
    const user_form = createForm();
    const createdTable = createTable();
    document.body.append(nameSite, user_form.form, createdTable.table);

    user_form.form.addEventListener('submit', e => {
        e.preventDefault();
        const row = document.createElement('tr');
        let nowDate = Date.now();
        nowDate = new Date(nowDate);
        let fullName = parseInput(user_form.fullName);
        const faculty = parseInput(user_form.faculty).join(' ');
        const yearStart = Number(user_form.yearEducation.value);
        const userDate = user_form.inputDate.valueAsDate;

        if (fullName.length !== 3 || userDate === null || userDate.getFullYear() < 1900
            || yearStart < 2000
            || yearStart > nowDate.getFullYear()) {
            confirm("Некорректно введены данные!")
            return;
        }
        fullName = fullName.join(' ');
        studentData.push({fullName, faculty, yearStart, userDate});

        createInformation(fullName, row);
        createInformation(faculty, row);
        createYearUser(userDate, nowDate, row);
        createEducationUser(yearStart, nowDate, row);
        createdTable.body_table.appendChild(row);
    })

    createdTable.full_name.buttonFilter.addEventListener('click', () => sortTable('fullName'));
    createdTable.faculty.buttonFilter.addEventListener('click', () => sortTable('faculty'));
    createdTable.dateBorn.buttonFilter.addEventListener('click', () => sortTable('userDate'));
    createdTable.yearStartEducation.buttonFilter.addEventListener('click', () => sortTable('yearStart'));

    function sortTable(sort) {
        const bodyTable = document.querySelector('#table-body');
        const elementsTable = Array.from(bodyTable.children);
        elementsTable.forEach(elementTable => {
            elementTable.remove();
        });
        studentData.sort((first_student, second_student) => first_student[sort] > second_student[sort] ? 1: -1);
        studentData.forEach(student => {
            const row = document.createElement('tr');
            let nowDate = Date.now();
            nowDate = new Date(nowDate);
            createInformation(student.fullName, row);
            createInformation(student.faculty, row);
            createYearUser(student.userDate, nowDate, row);
            createEducationUser(student.yearStart, nowDate, row);
            bodyTable.appendChild(row);
        });
    }

    function createYearUser(userData, nowDate, row) {
        let age = nowDate.getFullYear() - userData.getFullYear();
        let isBirthday = true;

        if (nowDate.getMonth() < userData.getMonth()) {
            age--;
            isBirthday = false;
        }

        if (nowDate.getMonth() === userData.getMonth() && isBirthday) {
            if (nowDate.getDate() < userData.getDate()) age--;
        }

        const dateAge = `${userData.getDate()}-${userData.getMonth()}-${userData.getFullYear()} (${age} лет)`;
        createInformation(dateAge, row);
    }

    function createEducationUser(year, nowDate, row) {
        const end_year = Number(year) + 4;
        let education = String(year) + '-' + String(end_year) + ' ';

        if (nowDate.getFullYear() >= end_year)
            education += "(закончил)";
        else
            education += `(${nowDate.getFullYear() - year + 1} курс)`;

        createInformation(education, row);
    }

    function createInformation(text, row) {
        const element = document.createElement('td');
        element.textContent = text;
        row.append(element);
        return element;
    }

    function parseInput(inputInformation) {
        return inputInformation.value
            .replace(/\s+/g, ' ')
            .trim()
            .split(' ');
    }
}

document.addEventListener('DOMContentLoaded', createApp);