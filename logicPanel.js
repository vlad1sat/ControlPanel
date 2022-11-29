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
        const fullName = parseInput(user_form.fullName);
        const faculty = parseInput(user_form.faculty);
        const yearStart = Number(user_form.yearEducation.value);
        const userDate = user_form.inputDate.valueAsDate;

        if (fullName.length !== 3 || userDate === null || userDate.getFullYear() < 1900
            || yearStart < 2000
            || yearStart > nowDate.getFullYear()) {
            confirm("Некорректно введены данные!")
            return;
        }

        createInformation(fullName.join(' '), row);
        createInformation(faculty.join(' '), row);
        createYearUser(nowDate, row);
        createEducationUser(yearStart, nowDate, row);
        createdTable.body_table.append(row);
    })

    createdTable.full_name.buttonFilter.addEventListener('click', () => sortTable(0, 'text'));
    createdTable.faculty.buttonFilter.addEventListener('click', () => sortTable(1, 'text'));
    createdTable.dateBorn.buttonFilter.addEventListener('click', () => sortTable(2, 'date'));
    createdTable.yearStartEducation.buttonFilter.addEventListener('click', () => sortTable(3, 'education'));

    function sortTable(indexSort, sort) {
        let rows, shouldSwitch;
        let switching = true;
        let index = 1;

        const sortText = (firstRow, secondRow) => firstRow.textContent.toLowerCase() > secondRow.textContent.toLowerCase();

        const sortYearEducation = (firstRow, secondRow) => Number(firstRow.textContent.split(' ')[0].split('-')[0])
            > Number(secondRow.textContent.split(' ')[0].split('-')[0]);

        const sortDateBorn = (firstRow, secondRow) => {
            const firstDate = new Date(firstRow.textContent.split(' ')[0]);
            const secondDate = new Date(secondRow.textContent.split(' ')[0]);
            return firstDate < secondDate;
        }

        while (switching) {
            switching = false;
            rows = document.querySelectorAll('tr');

            rangeRows: for (index = 1; index < rows.length - 1; index++) {
                shouldSwitch = false;
                const firstRow = rows[index].getElementsByTagName('td')[indexSort];
                const secondRow = rows[index + 1].getElementsByTagName('td')[indexSort];
                switch (sort) {
                    case 'text':
                        if (sortText(firstRow, secondRow)) {
                            shouldSwitch = true;
                            break rangeRows;
                        }
                        break;
                    case 'education':
                        if (sortYearEducation(firstRow, secondRow)) {
                            shouldSwitch = true;
                            break rangeRows;
                        }
                        break;
                    case 'date':
                        if (sortDateBorn(firstRow, secondRow)) {
                            shouldSwitch = true;
                            break rangeRows;
                        }
                        break;
                }
            }

            if (shouldSwitch) {
                rows[index].parentNode.insertBefore(rows[index + 1], rows[index]);
                switching = true;
            }
        }
    }

    function createYearUser(nowDate, row) {
        let age = nowDate.getFullYear() - user_form.inputDate.valueAsDate.getFullYear();
        let isBirthday = true;

        if (nowDate.getMonth() < user_form.inputDate.valueAsDate.getMonth()) {
            age--;
            isBirthday = false;
        }

        if (nowDate.getMonth() === user_form.inputDate.valueAsDate.getMonth() && isBirthday) {
            if (nowDate.getDate() < user_form.inputDate.valueAsDate.getDate())
                age--;
        }

        const dateAge = `${user_form.inputDate.value} (${age} лет)`;
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