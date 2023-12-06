// Enum para a definição de dias da semana:
const DaysOfWeek = {
    MONDAY: "Segunda-feira",
    TUESDAY: "Terça-feira",
    WEDNESDAY: "Quarta-feira",
    THURSDAY: "Quinta-feira",
    FRIDAY: "Sexta-feira",
    SATURDAY: "Sábado",
    SUNDAY: "Domingo",
};

// Enum para a criação de listas para cada dia da semana:
const tasksByDay = {
    [DaysOfWeek.MONDAY]: [],
    [DaysOfWeek.TUESDAY]: [],
    [DaysOfWeek.WEDNESDAY]: [],
    [DaysOfWeek.THURSDAY]: [],
    [DaysOfWeek.FRIDAY]: [],
    [DaysOfWeek.SATURDAY]: [],
    [DaysOfWeek.SUNDAY]: [],
};

// Classe task:
// define uma task simples sem prioridade.
class Task {
    // construtor:
    constructor(name) {
        this.name = name;
        this.checked = false;
        this.dueDate = null;
        this.description = '';
    }

    // atualiza a descrição:
    setDescription(description) {
        this.description = description;
    }

    // atualiza a data:
    setDueDate(dueDate) {
        this.dueDate = dueDate;
    }
}

// Classe PriorityTask:
// define uma task comprioridade sendo uma classe filha
// da classe Task (relação de herança).
class PriorityTask extends Task {
    // construtor
    constructor(name, priority) {
        super(name);
        this.priority = priority;
    }

    // o método retorna a prioridade escolhida:
    getPriorityLabel() {
        return this.priority;
    }
}

// Classe TaskList:
// define uma lista que inicializa um array de tasks vazio.
// essa classe armazenar e gerenciar as tasks.
class TaskList {
    // construtor:
    constructor() {
        this.tasks = [];
    }
}

// Classe ToDoList:
// define a classe principal.
// gerencia a interação com o HTML, a validação das entradas
// do usuário e a exibição das tarefas.
class ToDoList {
    // construtor:
    constructor() {
        // propriedade usada para definir a chave sob o qual os
        // dados da lista são armazenados. 'localStorageKey' define uma
        // string específica para organizar os dados armazenados.
        // Quando o código precisa armazenar ou recuperar os dados da
        // lista de tarefas, ele utiliza essa chave para interagir com o localStorage.
        this.localStorageKey = 'to-do-list-gn';
        this.taskList = new TaskList();
    }

    // inicializa a lista de tarefas e adiciona o evento de clique
    // ao botão de adicionar nova tarefa:
    initialize() {
        this.showValues();
        const newTaskButton = document.getElementById('btn-new-task');
        newTaskButton?.addEventListener('click', () => this.newTask());
    }
    
    // verifica se uma nova tarefas já existe na lista:
    validateIfExistsNewTask(inputValue) {
        const values = this.getStoredValues();
        return values.some(task => task.name === inputValue);
    }
  
    // resgata os valores armazenados no localStorage:
    getStoredValues() {
        return JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
    }
  
    // salva os valores no localStorage:
    saveValues(values) {
        localStorage.setItem(this.localStorageKey, JSON.stringify(values));
    }
  
    // adiciona uma nova tarefa à lista com base nos inputs do usuário:
    newTask() {
        // obter referências aos elementos do formulário:
        const input = document.getElementById('input-new-task');
        const date = document.getElementById('input-date').valueAsDate;
        const datenull = document.getElementById('input-date');
        const priority = document.getElementById('priority');
        input.style.border = ''; // redefine a borda do campo de entrada para evitar estilos de erro;

        try {
            // obter valores do formulário:
            const inputValue = input.value;
            const inputDate = date.getDay();
            const inputPriority = priority.value;

            // valida as entradas do usuário:
            if (!inputValue) { // verifica se à algo no campo para adição da task;
                throw new Error('Digite algo primeiro');
            }

            if (inputDate == null) { // verifica se uma data foi selecionada;
                throw new Error('Selecione uma data primeiro');
            }

            if (this.validateIfExistsNewTask(inputValue)) { // verifica se a tarefa já existe;
                throw new Error('Essa task já existe');
            }
            
            const values = this.getStoredValues(); // obtem valores armazenados anteriormente;
            // cria uma nova instância de tarefa com ou sem prioridade.
            // Caso haja prioridade cria a task com a classe 'priorityTask', caso não cria como uma task normal;
            const newTask = (inputPriority != '') 
                ? new PriorityTask(inputValue, inputPriority)
                : new Task(inputValue);
            newTask.setDescription(''); // configura a descrição e data de vencimento da nova tarefa;
            newTask.setDueDate(date);
            values.push({ // adiciona os detalhes da tarefa aos valores armazenados;
                name: inputValue,
                checked: false,
                day: inputDate,
                priority: inputPriority
            });

            this.saveValues(values); // salva os valores atualizados;
            this.showValues();  // atualiza a exibição das tarefas;

        } catch (error) {
            // em caso de erro, exibir mensagem de erro, destacar o campo e alertar o usuário:
            console.error(error.message);
            input.style.border = '1px solid red';
            alert(error.message);
        }

         // limpa os campos do formulário após o processamento:
        input.value = '';
        datenull.value = '';
        priority.value = '';
    }
    
    // exibe as tarefas na interface HTML, organizadas por dia e prioridade:
    showValues() {
        // limpa o array de tasks
        tasksByDay[DaysOfWeek.MONDAY] = [];
        tasksByDay[DaysOfWeek.TUESDAY] = [];
        tasksByDay[DaysOfWeek.WEDNESDAY] = [];
        tasksByDay[DaysOfWeek.THURSDAY] = [];
        tasksByDay[DaysOfWeek.FRIDAY] = [];
        tasksByDay[DaysOfWeek.SATURDAY] = [];
        tasksByDay[DaysOfWeek.SUNDAY] = [];

        // pega os elementos do HTML:
        const values = this.getStoredValues();
        const list_segunda = document.getElementById('Segunda-feira');
        const list_terca = document.getElementById('Terça-feira');
        const list_quarta = document.getElementById('Quarta-feira');
        const list_quinta = document.getElementById('Quinta-feira');
        const list_sexta = document.getElementById('Sexta-feira');
        const list_sabado = document.getElementById('Sábado');
        const list_domingo = document.getElementById('Domingo');
        
        // limpa o html das listas:
        list_segunda.innerHTML = '';
        list_terca.innerHTML = '';
        list_quarta.innerHTML = '';
        list_quinta.innerHTML = '';
        list_sexta.innerHTML = '';
        list_sabado.innerHTML = '';
        list_domingo.innerHTML = '';        

        // separa as tasks por dia verificando pelo índice:
        for (let i = 0; i < values.length; i++) {
            if (values[i].day == 0) {
                tasksByDay[DaysOfWeek.MONDAY].push(values[i]);
            } else if (values[i].day == 1) {
                tasksByDay[DaysOfWeek.TUESDAY].push(values[i]);
            } else if (values[i].day == 2) {
                tasksByDay[DaysOfWeek.WEDNESDAY].push(values[i]);
            } else if (values[i].day == 3) {
                tasksByDay[DaysOfWeek.THURSDAY].push(values[i]);
            } else if (values[i].day == 4) {
                tasksByDay[DaysOfWeek.FRIDAY].push(values[i]);
            } else if (values[i].day == 5) {
                tasksByDay[DaysOfWeek.SATURDAY].push(values[i]);
            } else {
                tasksByDay[DaysOfWeek.SUNDAY].push(values[i]);
            }
        }

        // ordena as tasks por prioridade
        tasksByDay[DaysOfWeek.MONDAY].sort((a, b) => {
            // cria instâncias de PriorityTask para comparar prioridades, se as prioridades não forem vazias:
            const priorityA = a.priority != '' ? new PriorityTask(a.name, a.priority) : '';
            const priorityB = b.priority != '' ? new PriorityTask(b.name, b.priority) : '';            

            // verifica se ambas as tarefas têm prioridades definidas como instâncias de 'priorityTask':
            if (priorityA instanceof PriorityTask && priorityB instanceof PriorityTask) {
                // compara as prioridades com base nos rótulos de prioridade convertidos em números:
                return Number(priorityA.getPriorityLabel()) > Number(priorityB.getPriorityLabel()) ? 1 : -1;
            }
            // se uma das tarefas não tiver prioridade ou não for uma instância de PriorityTask, não fazer nada (não há alteração na ordem);
        });

        tasksByDay[DaysOfWeek.TUESDAY].sort((a, b) => { 
            const priorityA = a.priority != '' ? new PriorityTask(a.name, a.priority) : '';
            const priorityB = b.priority != '' ? new PriorityTask(b.name, b.priority) : '';            

            if (priorityA instanceof PriorityTask && priorityB instanceof PriorityTask) {
                return Number(priorityA.getPriorityLabel()) > Number(priorityB.getPriorityLabel()) ? 1 : -1;
            }
        });

        tasksByDay[DaysOfWeek.WEDNESDAY].sort((a, b) => { 
            const priorityA = a.priority != '' ? new PriorityTask(a.name, a.priority) : '';
            const priorityB = b.priority != '' ? new PriorityTask(b.name, b.priority) : '';            

            if (priorityA instanceof PriorityTask && priorityB instanceof PriorityTask) {
                return Number(priorityA.getPriorityLabel()) > Number(priorityB.getPriorityLabel()) ? 1 : -1;
            }
        });

        tasksByDay[DaysOfWeek.THURSDAY].sort((a, b) => { 
            const priorityA = a.priority != '' ? new PriorityTask(a.name, a.priority) : '';
            const priorityB = b.priority != '' ? new PriorityTask(b.name, b.priority) : '';            

            if (priorityA instanceof PriorityTask && priorityB instanceof PriorityTask) {
                return Number(priorityA.getPriorityLabel()) > Number(priorityB.getPriorityLabel()) ? 1 : -1;
            }
        });

        tasksByDay[DaysOfWeek.FRIDAY].sort((a, b) => { 
            const priorityA = a.priority != '' ? new PriorityTask(a.name, a.priority) : '';
            const priorityB = b.priority != '' ? new PriorityTask(b.name, b.priority) : '';            

            if (priorityA instanceof PriorityTask && priorityB instanceof PriorityTask) {
                return Number(priorityA.getPriorityLabel()) > Number(priorityB.getPriorityLabel()) ? 1 : -1;
            }
        });

        tasksByDay[DaysOfWeek.SATURDAY].sort((a, b) => { 
            const priorityA = a.priority != '' ? new PriorityTask(a.name, a.priority) : '';
            const priorityB = b.priority != '' ? new PriorityTask(b.name, b.priority) : '';            

            if (priorityA instanceof PriorityTask && priorityB instanceof PriorityTask) {
                return Number(priorityA.getPriorityLabel()) > Number(priorityB.getPriorityLabel()) ? 1 : -1;
            }
        });

        tasksByDay[DaysOfWeek.SUNDAY].sort((a, b) => { 
            const priorityA = a.priority != '' ? new PriorityTask(a.name, a.priority) : '';
            const priorityB = b.priority != '' ? new PriorityTask(b.name, b.priority) : '';            

            if (priorityA instanceof PriorityTask && priorityB instanceof PriorityTask) {
                return Number(priorityA.getPriorityLabel()) > Number(priorityB.getPriorityLabel()) ? 1 : -1;
            }
        });

        // cria as tasks no HTML
        tasksByDay[DaysOfWeek.MONDAY].forEach((task, i) => {
            list_segunda.innerHTML += this.createTaskHTML(i, task);
        })

        tasksByDay[DaysOfWeek.TUESDAY].forEach((task, i) => {
            list_terca.innerHTML += this.createTaskHTML(i, task);
        })

        tasksByDay[DaysOfWeek.WEDNESDAY].forEach((task, i) => {
            list_quarta.innerHTML += this.createTaskHTML(i, task);
        })

        tasksByDay[DaysOfWeek.THURSDAY].forEach((task, i) => {
            list_quinta.innerHTML += this.createTaskHTML(i, task);
        })

        tasksByDay[DaysOfWeek.FRIDAY].forEach((task, i) => {
            list_sexta.innerHTML += this.createTaskHTML(i, task);
        })

        tasksByDay[DaysOfWeek.SATURDAY].forEach((task, i) => {
            list_sabado.innerHTML += this.createTaskHTML(i, task);
        })

        tasksByDay[DaysOfWeek.SUNDAY].forEach((task, i) => {
            list_domingo.innerHTML += this.createTaskHTML(i, task);
        })
    }
  
    // cria o HTML para exibir uma tarefa na lista:
    createTaskHTML(index, task) {
        const checkedClass = task.checked ? 'checked' : '';
        let iconPriority = null;

        const priorityLabel = task.priority;
        if (priorityLabel == 3) {
            iconPriority = `
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-cell-signal-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M20 20h-15.269a.731 .731 0 0 1 -.517 -1.249l14.537 -14.537a.731 .731 0 0 1 1.249 .517v15.269z" /><path d="M8 20v-5" />
            </svg>`
        } else if (task.priority == 2) {
            iconPriority = `
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-cell-signal-3" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M20 20h-15.269a.731 .731 0 0 1 -.517 -1.249l14.537 -14.537a.731 .731 0 0 1 1.249 .517v15.269z" /><path d="M12 20v-9" />
            </svg>`
        } else if (task.priority == 1) {
            iconPriority = `
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-cell-signal-5" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M20 20h-15.269a.731 .731 0 0 1 -.517 -1.249l14.537 -14.537a.731 .731 0 0 1 1.249 .517v15.269z" /><path d="M16 7v13" /><path d="M12 20v-9" /><path d="M8 20v-5" />
            </svg>`
        }

        return `
            <li class="content--body ${checkedClass}">
            <div>
                <button id='btn-ok' onclick='toDoList.checkItem("${task.name}")' title='Marcar como concluída'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle">
                        <circle cx="12" cy="12" r="10"/>
                    </svg>
                </button>
            </div>
            <div id='name'>
                <span>
                    ${task.name}
                </span>
            </div>
            <div class="botons">
                ${iconPriority != null ? `
                    <div class="iconPriority">
                        ${iconPriority}
                    </div>`: ""}
                <button id='btn-edit' onclick='toDoList.editItem("${task.name}")' title='Editar task'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                        <path d="m15 5 4 4"/>
                    </svg>
                </button>
                <button id='btn-remove' onclick='toDoList.removeItem("${task.name}")' title='Remover task'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x">
                        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                    </svg>
                </button>
            </div>
            </li>`;
    }
  
    // remove uma tarefa da lista:
    removeItem(taskName) {
        const values = this.getStoredValues(); // obtem os valores armazenados;
        const index = values.findIndex(task => task.name === taskName); // encontra o índice da tarefa com o nome específico no array;
        // verifica se a tarefa foi encontrada:
        if (index !== -1) {
            values.splice(index, 1);  // remove a tarefa do array usando splice;
            this.saveValues(values); // salva os valores atualizados após a remoção da tarefa;
            this.showValues(); // atualiza a exibição das tarefas após a remoção;
        }
    }
  
    // permite a edição do nome de uma tarefa:
    editItem(taskName) {
        const values = this.getStoredValues(); // obtem os valores armazenados;
        const task = values.find(task => task.name === taskName); // encontra a tarefa com o nome específico no array;
        // verifica se a tarefa foi encontrada:
        if (task) {
            const newValue = prompt('Editar a tarefa:', task.name); // solicita ao usuário um novo valor para o nome da tarefa;
            if (newValue !== null) {
                task.name = newValue; // atualiza o nome da tarefa com o novo valor;
                this.saveValues(values); // salva os valores atualizados após a edição;
                this.showValues(); // atualiza a exibição das tarefas após a edição;
            }
        }
    }
  
    // marca/desmarca uma tarefa como concluída:
    checkItem(taskName) {
        const values = this.getStoredValues(); // obtem os valores armazenados;
        const task = values.find(task => task.name === taskName); // encontra a tarefa com o nome específico no array;
        // verifica se a tarefa foi encontrada:
        if (task) {
            task.checked = !task.checked; // alterna o estado de conclusão da tarefa;
            this.saveValues(values); // salva os valores atualizados após a alteração de conclusão da tarefa;
            this.showValues(); // atualiza a exibição das tarefas após a alteração;
        }
    }
}

// Age como uma main instanciando a classe "ToDoList"
// e inicializa a aplicação.
const toDoList = new ToDoList();
toDoList.initialize();