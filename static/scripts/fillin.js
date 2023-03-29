class answered_question {
    constructor(survey_id, user_id, question_id,answers) {
        this.survey_id = survey_id
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
    survey_id = user_id = document.getElementsByName("survey_id")[0].value
    console.log(survey_id)
    all_answers = []

    for (const question of all_forms) {
        answers = []
        for(const answer of question) {
            if (answer.checked || answer.type == 'text'){
                answers.push(answer.value)
            }
        }
        q = new answered_question(survey_id, user_id, question.id, answers)
        all_answers.push(q)
        console.log(q)
    }
    console.log(all_answers)
    fetch('/jsurvey/save_form_data', {
        method: "POST",
        headers: {
            "Content-Type" : 'application/json'
        }, 
        body: JSON.stringify(all_answers)
    })
    // .then(response=>{
    //     window.location.href = "http://localhost:3000/jsurvey/thank_you_page"
    // })
    .catch(error => {
        alert("Doslo je do greske" + error)
    })
}  