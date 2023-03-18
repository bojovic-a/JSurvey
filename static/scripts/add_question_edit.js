class Question{
    constructor(title, answers, type){
        this.title = title
        this.answers = answers
        this.type = type
    }
}

window.addEventListener('load', init);

function init() {
    get_all_quesitons()
    saveAllButton = document.querySelector("#save-survey")
    saveAllButton.addEventListener("click", save_all)
}

function get_all_quesitons(){
    question_divs = document.getElementsByClassName("question-box-edit")
    surveyId = document.getElementsByClassName("survey-title")[0].getAttribute('name')
    localStorage.setItem("survey-id", JSON.stringify(surveyId))
    all_questions = JSON.parse(localStorage.getItem("questions")) || [] 
    
    for(let i = 0;i < question_divs.length;i++) {
    
        let question_title = document.getElementsByClassName("question-title-edit")[i]
        question_title.addEventListener('click', make_it_editable)

        let question_type = document.getElementsByClassName("question-type-edit")[i]
        question_type.addEventListener('click', make_it_editable)
        
        query = "answer_"+ question_divs[i].getAttribute('name')

        let answersToThis = document.getElementsByClassName(query)
        
        console.log(answersToThis)        

        answersList = []

        if (answersToThis){         
            for (const ans of answersToThis) {
                answersList.push(ans.innerText)
                ans.setAttribute("contentEditable", "true")
            }
        }        
        console.log(answersList)
        let q = new Question(question_title.innerText, answersList, question_type)
        all_questions.push(q)
    }
    localStorage.setItem("questions", JSON.stringify(all_questions))
}

function make_it_editable(event) {
    element = event.target;
    element.setAttribute("contentEditable", "true");
}

function save_all() {
    // get all questions from local storage
    allQuestionsLS = JSON.parse(localStorage.getItem("questions"));
    surveyData = {
        "surveyId": localStorage.getItem("survey-id"),
        "survey": allQuestionsLS
    }

    fetch('/jsurvey/edit-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(surveyData)
        })
      .then(response => {
        // Redirect to another page
        window.location.href = 'http://localhost:3000/jsurvey/survey_saved';
      })
      .catch(error => {
        console.error('Error:', error);
      });
    localStorage.setItem("questions", JSON.stringify([]));
}