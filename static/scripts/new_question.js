class Question{
    constructor(title, answers, type){
        this.title = title
        this.answers = answers
        this.type = type
    }
}


// if (localStorage.getItem("questions") === "null") {
    // localStorage.setItem("questions", JSON.stringify([]))
// }


window.addEventListener('load', init)

// questions = []
// localStorage.setItem("questions", JSON.stringify(questions))

function init(){
    fill_current_questions()
    var question_type = document.getElementById("question-type")
    var add_question_button = document.getElementById("add-question-button")
    var save_survey_button = document.getElementById("save-survey")
    save_survey_button.addEventListener("click", save_survey)
    add_question_button.addEventListener('click', add_question)
    question_type.addEventListener("change", render_question_type)
}

function fill_current_questions(){
    var current_questions =  JSON.parse(localStorage.getItem("questions")) || []
    var current_question_area = document.getElementsByClassName("current-questions")[0]

    for(const question of current_questions) {
        single_question = document.createElement("div")
        single_question.classList.add("current-questions-item")
        single_question.innerHTML = `<h3>Question: ` + question.title + `</h3><p>Options: ` + question.answers +  `</p>`
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
    xhr.open("POST", "http://localhost:3000/jsurvey/save-survey", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    localStorage.setItem("questions", JSON.stringify([]))
    xhr.send(JSON.stringify({
        all_questions: all_questions 
    }));

    location.replace("http://localhost:3000/jsurvey/survey_saved")

}