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
        let name = createInformationTable("ФИО");
        let faculty = createInformationTable("Факультет");
        let dateBorn = createInformationTable("Дата рождения и возраст");
        let yearStartEducation = createInformationTable("Годы обучения и номер курса");

        function createInformationTable(title) {
            const element = document.createElement('th');
            element.textContent = title;
            first_row.append(element);
            return element;
        }

        table.classList.add('table');
        head_table.append(first_row);
        table.append(head_table, body_table);

        return {
            table,
            body_table
        };
    }

    function createApp() {
        const user_form = createForm();
        const table = createTable();
        document.body.append(user_form.form, table.table);

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
            for (let indexElement = 0; indexElement < user_information.length; indexElement++) {
                if (indexElement <= 2) {
                    if (indexElement !== 2) {
                        fullName += user_information[indexElement] + ' ';
                        continue
                    }
                    else {
                        fullName += user_information[indexElement];
                        createInformation(fullName, row);
                        continue
                    }
                }
                if (indexElement === 4) {
                    createYearUser(nowDate, row);
                    createEducationUser(user_information[indexElement], nowDate, row);
                    break
                }
                createInformation(user_information[indexElement], row);
            }

            table.body_table.append(row);
        })

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

    createApp();
})();