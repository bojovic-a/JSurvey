class Question{
    constructor(title, questions, type){
        this.title = title
        this.questions = questions
        this.type = type
    }
}

window.addEventListener('load', init)

questions = []
localStorage.setItem("questions", JSON.stringify(questions))

function init(){
    fill_current_questions()
    var question_type = document.getElementById("question-type")
    question_type.addEventListener("change", render_question_type)
}

function fill_current_questions(){
    var current_questions =  JSON.parse(localStorage.getItem("questions"))
    var current_question_area = document.getElementsByClassName("current-questions")[0]

    for(const question of current_questions) {
        single_question = document.createElement("div")
        single_question.innerHtml = `<h3>` + question.title + `</h3>`
    }
}

function render_question_type(event) {
    var dropdown = event.target
    question_type = dropdown.options[dropdown.selectedIndex].value

    if (question_type == 'text'){
        
    }
    
}