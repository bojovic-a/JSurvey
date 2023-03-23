class Question{
    constructor(title, answers, type){
        this.title = title
        this.answers = answers
        this.type = type
    }
}

console.log(localStorage.getItem("questions"))


window.addEventListener('load', init)

// questions = []
// localStorage.setItem("questions", JSON.stringify(questions))

function init(){    
    if (!localStorage.getItem("questions")) {
        localStorage.setItem("questions", JSON.stringify([]))
    }
    fill_current_questions()
    var question_type = document.getElementById("question-type")
    var add_question_button = document.getElementById("add-question-button")
    var save_survey_button = document.getElementById("save-survey")
    var delete_buttons = document.getElementsByClassName('delete-button')
    for (const button of delete_buttons) {
        button.addEventListener('click', delete_question)
    }
    save_survey_button.addEventListener("click", save_survey)
    add_question_button.addEventListener('click', add_question)
    question_type.addEventListener("change", render_question_type)    
}


function fill_current_questions(){
    var current_questions =  JSON.parse(localStorage.getItem("questions")) || []
    var current_question_area = document.getElementsByClassName("current-questions")[0]

    for(let i=0;i < current_questions.length;i++) {
        single_question = document.createElement("div")
        single_question.classList.add("current-questions-item")
        single_question.innerHTML = `<h3>Question: ` + current_questions[i].title + `</h3><p>Options: ` + current_questions[i].answers +  `</p><button class="delete-button" id="question_` + i + `">Delete</button>`
        current_question_area.appendChild(single_question)
    }
}

function render_question_type(event) {
    options_area = document.getElementsByClassName("option-area")[0]
    options_area.innerHTML = ""
    var dropdown = event.target
    question_type = dropdown.options[dropdown.selectedIndex].value

    if (question_type == 'checkbox'){
        generate_checboxes()
    }

    if (question_type == 'radio') {
        generate_checboxes()
    }


    
}

function generate_checboxes() {
    checkbox_area = document.getElementsByClassName("option-area")[0]
    checkbox = document.createElement("div")
    checkbox.innerHTML = 
    `
        <div class="checkbox_item">
            <p class="new-option-button">Add option</p>
            <input type="text" name="new-option">        
            <div class="option-div">
            
            </div>            
        </div>
    `
    checkbox_area.appendChild(checkbox)
    new_option = document.getElementsByClassName("new-option-button")[0]
    new_option.addEventListener('click', add_option)
}

function add_option(){
    new_option_area = document.querySelector(".option-div:nth-child(n-1)")
    option_value = document.getElementsByName("new-option")[0]
    new_option = document.createElement("input")
    new_option.classList.add("single-option")
    new_option.value = option_value.value    
    new_option_area.appendChild(new_option)
    
    option_value.value = ""
    option_value.focus()
}

function add_question() {
    dropdown = document.getElementById("question-type")
    question_type = question_type = dropdown.options[dropdown.selectedIndex].value
    question_text = document.getElementsByName("question-text-input")[0].value
    question_options_elements = document.getElementsByClassName("single-option")
    question_options = question_options_elements
    curr_questions = JSON.parse(localStorage.getItem("questions"))
    this_question_options = []
    for(const opt of question_options){this_question_options.push(opt.value)}
    
    question = new Question(question_text, this_question_options, question_type)
    curr_questions.push(question)
    localStorage.setItem("questions", JSON.stringify(curr_questions))
    console.log(this_question_options)  
    location.reload()   
}

function save_survey() {
    all_questions = JSON.parse(localStorage.getItem("questions"))
    console.log(all_questions)
    var xhr = new XMLHttpRequest();
    // xhr.open("POST", "http://localhost:3000/jsurvey/save-survey", true);
    // xhr.setRequestHeader('Content-Type', 'application/json');
    let userIdSession = document.getElementsByName('user-id')[0].value
    
    // xhr.send(JSON.stringify({
    //     all_questions: JSON.stringify(all_questions),
    //     userId: userIdSession
    // }));

    fetch('/jsurvey/save-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(all_questions),
        })
      .then(response => {
        // Redirect to another page
        window.location.href = 'http://localhost:3000/jsurvey/survey_saved';
      })
      .catch(error => {
        console.error('Error:', error);
      });
    localStorage.setItem("questions", JSON.stringify([]))
    // fetch('http://localhost:3000/jsurvey/survey_saved').then(res => console.log(res)).catch(e => console.log(e))

}

function delete_question(event) {
    console.log("NJNJn  ")
    delete_button = event.target;
    button_id = delete_button.id;
    id = button_id.split('_')[1];
    console.log(id)
    all_questions = JSON.parse(localStorage.getItem("questions"))
    all_questions.splice(id, 1)
    localStorage.setItem("questions", JSON.stringify(all_questions))
    location.reload() 
}   

// function generate_random_question() {
//     fetch('/jsurvey/generate-random', {
//         method: 'GET',        
//         })
//       .then(response => {
//         // Redirect to another page
//         console.log(response)
//         location.reload()
//       })
//       .catch(error => {
//         console.error('Error:', error);
//       });
//     localStorage.setItem("questions", JSON.stringify([]))
//     // fetch('http://localhost:3000/jsurvey/survey_saved').then(res => console.log(res)).catch(e => console.log(e))

// }