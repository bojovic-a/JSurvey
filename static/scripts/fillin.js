class answered_question {
    constructor(user_id, question_id,answers) {
        this.user_id = user_id
        this.question_id = question_id
        this.answers = answers
    }
}

window.addEventListener('load', init)

function init(){
    var submit_button = document.getElementById("submit-form")
    submit_button.addEventListener("click", get_form_data)    
}

function get_form_data(event) {
    var all_forms = document.getElementsByName("question-answer-form")
    user_id = document.getElementsByName("user_id")[0].value
    all_answers = []
    console.log(user_id)
    for (const question of all_forms) {
        answers = []
        for(const answer of question) {
            if (answer.checked || answer.type == 'text'){
                answers.push(answer.value)
            }
        }
        q = new answered_question(user_id, question.id, answers)
        all_answers.push(q)
    }
    console.log(all_answers)
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/jsurvey/save_form_data")
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify({
        all_forms: all_answers
    }))
    
}   