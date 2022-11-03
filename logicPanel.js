(() => {
    function createForm() {
        const form = document.createElement('form');
        const button = document.createElement('button');
        const input = document.createElement('input');
        const inputDate = document.createElement('input');
        const buttonWrapper = document.createElement('div');

        button.disabled = true;
        inputDate.type = "date";
        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        inputDate.classList.add('form-control');
        input.placeholder = "Введите данные студента (ФИО, Факультет, Год поступления)";
        button.classList.add('btn', 'btn-primary');
        button.textContent = "Добавить студента";
        buttonWrapper.classList.add('input-group-append');

        buttonWrapper.append(button);
        form.append(input, inputDate, buttonWrapper);

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
            form,
            input,
            inputDate,
            button
        };
    }

    function createTable() {
        const table = document.createElement('table');
        const head_table = document.createElement('thead');
        const body_table = document.createElement('tbody');
        const first_row = document.createElement('tr');
        let full_name = createInformationTable("ФИО");
        let faculty = createInformationTable("Факультет");
        let dateBorn = createInformationTable("Дата рождения и возраст");
        let yearStartEducation = createInformationTable("Годы обучения и номер курса");

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

    function createApp() {
        const user_form = createForm();
        const createdTable = createTable();
        document.body.append(user_form.form, createdTable.table);

        user_form.form.addEventListener('submit', e => {
            e.preventDefault();
            const row = document.createElement('tr');
            let nowDate = Date.now();
            nowDate = new Date(nowDate);
            const user_information = parseInput();
            const year_start = user_information[user_information.length - 1];
            const user_date = user_form.inputDate.valueAsDate;

            if (user_information.length !== 5 || user_date === null || user_date.getFullYear() < 1900
                || isNaN(Number(year_start))
                || Number(year_start) < 2000
                || Number(year_start) > nowDate.getFullYear()) {
                confirm("Некорректно введены данные!")
                return;
            }

            let fullName = "";
            for (let indexElement = 0; indexElement < 3; indexElement++)
                    fullName += user_information[indexElement] + ' ';

            createInformation(fullName, row);
            createInformation(user_information[3], row);
            createYearUser(nowDate, row);
            createEducationUser(user_information[4], nowDate, row);
            createdTable.body_table.append(row);
        })

        createdTable.full_name.buttonFilter.addEventListener('click', () => sortTable(0, 'text'));
        createdTable.faculty.buttonFilter.addEventListener('click', () => sortTable(1, 'text'));
        createdTable.yearStartEducation.buttonFilter.addEventListener('click', () => sortTable(3, 'education'));

        function sortTable(indexSort, sort) {
            let rows, shouldSwitch;
            let switching = true;
            let index = 1;

            while (switching) {
                switching = false;
                rows = document.querySelectorAll('tr');

                for (index = 1; index < rows.length - 1; index++) {
                    shouldSwitch = false;
                    let first_row = rows[index].getElementsByTagName('td')[indexSort];
                    let second_row = rows[index + 1].getElementsByTagName('td')[indexSort];
                    if (sort === "text") {
                        if (sortText(first_row, second_row)) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                    if (sort === "education") {
                        if (sortYearEducation(first_row, second_row)) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                }

                if (shouldSwitch) {
                    rows[index].parentNode.insertBefore(rows[index + 1], rows[index]);
                    switching = true;
                }
            }

            function sortText(first_row, second_row) {
                return first_row.textContent.toLowerCase() > second_row.textContent.toLowerCase();
            }

            function sortYearEducation(first_row, second_row) {
                return Number(first_row.textContent.split(' ')[0].split('-')[0])
                > Number(second_row.textContent.split(' ')[0].split('-')[0]);
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
            const start_year = Number(year);
            const end_year = Number(year) + 4;
            let education = String(start_year) + '-' + String(end_year) + ' ';

            if (nowDate.getFullYear() >= end_year)
                education += "(закончил)";
            else
                education += `(${nowDate.getFullYear() - start_year + 1} курс)`;

            createInformation(education, row);
        }

        function createInformation(text, row) {
            const element = document.createElement('td');
            element.textContent = text;
            row.append(element);
            return element;
        }

        function parseInput() {
            return user_form.input.value
                .replace(/\s+/g, ' ')
                .trim()
                .split(' ');
        }
    }

    document.addEventListener('DOMContentLoaded', createApp);

})();