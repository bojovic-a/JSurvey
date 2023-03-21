class Question{
    constructor(id, title, answers, type){
        this.id = id
        this.title = title
        this.answers = answers
        this.type = type
    }
}

window.addEventListener('load', init);

function init() {
    localStorage.setItem("questions", JSON.stringify([]))
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
        question_divs[i].setAttribute("id", i)
        let question_title = document.getElementsByClassName("question-title-edit")[i]
        question_title.addEventListener('click', make_it_editable)

        let question_type = document.getElementsByClassName("question-type-edit")[i]
        question_type.addEventListener('click', make_it_editable)
        
        query = "answer_"+ question_divs[i].getAttribute('name')

        let answersToThis = document.getElementsByClassName(query)      

        answersList = []

        if (answersToThis){         
            for (const ans of answersToThis) {
                answersList.push(ans.innerText)
                ans.setAttribute("contentEditable", "true")
            }
        }        

        let q = new Question(i, question_title.innerText, answersList, question_type.innerText)
        
        all_questions.push(q)
    }
    localStorage.setItem("questions", JSON.stringify(all_questions))
}

function make_it_editable(event) {
    if (document.querySelector(".save-button")) {
        document.querySelector(".save-button").remove()
    }
    element = event.target;
    element.setAttribute("contentEditable", "true");
    parentDiv = element.parentElement
    saveButton = document.createElement("button")
    saveButton.classList.add("save-button")
    saveButton.innerText = "Save"
    saveButton.setAttribute("id", element.closest('.question-box-edit').id)
    parentDiv.appendChild(saveButton)
    saveButton.addEventListener("click", save_one)
}

function save_one(event) {

    element = event.target
    questionId = event.target.closest('.question-box-edit').id
    let allQuestionsLS = JSON.parse(localStorage.getItem("questions"))
    
    questionTitle = element.parentNode.querySelector(".question-title-edit").innerText
    let questionAnswers = element.parentNode.querySelectorAll(".answer")
    answersListHtml = []

    for (let i = 0;i < questionAnswers.length;i++) {
        answerText = questionAnswers[i].innerText
        answersListHtml.push(answerText)
    }

    questionType = element.parentNode.nextSibling.querySelector(".question-type-edit").innerText


    for (let i = 0;i < allQuestionsLS.length;i++) {
        console.log(questionId)
        if (allQuestionsLS[i].id == questionId){
            let q = new Question(questionId, questionTitle, answersListHtml, questionType)
            allQuestionsLS[i] = q
            console.log(allQuestionsLS[0] + "\n" + allQuestionsLS)
        }
    }

    localStorage.setItem("questions", JSON.stringify(allQuestionsLS))
    element.remove()
}

function save_all() {
    // get all questions from local storage
    localStorage.setItem("questions", JSON.stringify([]))
    get_all_quesitons()
    let allQuestionsLS = JSON.parse(localStorage.getItem("questions"));
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

