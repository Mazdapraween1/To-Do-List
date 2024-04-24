//console.log

//const state = {
//    taskList: [
//      {
//           image: "",
//            tittle: "",
//            type: "",
//            description: ""
//       },
//        {
//            image: "",
//            tittle: "",
//            type: "",
//            description: ""
//        },
//        {
//            image: "",
//            tittle: "",
//            type: "",
//            description: ""
//        },
//        {
//            image: "",
//            tittle: "",
//            type: "",
//            description: ""
//        },
//    ]
// }

const state ={
    taskList: [],
};

// DOM
const taskcontents = document.querySelector(".task__content");
const taskModal = document.querySelector(".task__modal__body");

//console.log(taskcontents);
//console.log(taskmodal);


const htmlTaskcontent =  ({ url, title, type, description, id}) => 
`
<div class="col-md-6 col-lg-4 mt-3" id = ${id} key= ${id} >     
<div class="card shadow-sm task__card">
    <div class="card-header d-flex justify-content-end task__card__header">
        <button type="button" class="btn btn-outline-primary mr-2" name= ${id}  onclick= "editTask.apply(this, arguments)" >

        <i class="fa-solid fa-pencil" name= ${id} ></i>
        </button>
        <button type="button" class="btn btn-outline-danger mr-2" name= ${id} onclick= "deleteTask.apply(this, arguments)" >

        <i class="fas fa-trash-alt" name= ${id} ></i>
    </button>

    </div>
 
    
    <div class="card-body">
        ${ 
            url ?
            `<img width="100%" src=${url} alt="card image top" class="card-img-top md-3 rounded-lg"/>`:
            `<img width="100%" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/310px-Placeholder_view_vector.svg.png" alt="card image top" class="card-img-top md-3 rounded-lg"/>`

        }
        <h4 class="card-title task__card__title">${title}</h4>
        <p class="description card-text trim-3-lines text-muted">${description}</p>
        <div class="tags text-white d-flex flex-wrap">
            <span class="badge bg-primary m-1">${type}</span>
        </div>
    </div>
    <div class="card-footer">
        <button class="btn btn-outline-primary float-right" data-bs-toggle="modal" data-bs-target="#showTask" id==${id} onclick="openTask.apply(this, arguments)">Open Task</button>
    </div>
  </div>
</div>`


const htmlModalContent = ({id, title, url, description}) => {
    const date = new Date(parseInt(id));
    return`
        <div id=${id}>
         ${ 
            url ?
            `<img width="100%" src=${url} alt="card image top" class="img-fluid place__holder__image md-3 rounded-lg"/>`:
            `<img width="100%" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/310px-Placeholder_view_vector.svg.png" alt="card image top" class="card-img-top md-3 rounded-lg"/>`
        }
        <strong>Created on ${date.toDateString()}</strong>
        <h2 class="my-3">${title}</h2>
        <p class="lead">${description}</p>
        </div>`
    
}

const updateLocalStorage = () => {
    localStorage.setItem("task", JSON.stringify({
        tasks: state.taskList,
    }))
}

const loadInititalData = () => {
    const localStorageCopy = JSON.parse(localStorage.task)

    if(localStorageCopy) state.taskList = localStorageCopy.tasks;

    state.taskList.map((cardDate)=>{
        taskcontents.insertAdjacentHTML("beforeend", htmlTaskcontent(cardDate))
    })
}


const handleSubmit = (event) => {
    const id = '${Date.now()}';
    const input = {
        url: document.getElementById('imageUrl').value,
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        type: document.getElementById('tags').value,
    };
    
    if(input.title ==="" || input.description === "" || input.type === ""){
        return alert("please fill all required fields:-( ");
    }

    taskcontents.insertAdjacentHTML("beforeend", htmlTaskcontent({
        ...input,
        id
    }))

    state.taskList.push({...input, id});
    updateLocalStorage();
}

const openTask = (e) => {
    if(!e) e = window.event;
    
    const getTask = state.taskList.find(({id})=> id === e.target.id);
    taskModal.innerHTML = htmlModalContent(getTask);

}
   
const deleteTask = (e) => {
    if(!e) e = window.event;
    
    const targetId = e.target.getAttribute("name");
    const type = e.target.tagname;
    //console.log(type);

    const removeTask = state.taskList.filter(({id})=> id!== targetId);
    console.log(removeTask);

    state.taskList = removeTask;
    updateLocalStorage();

    if(type === "BUTTON"){
        console.log(e.target.parentNode.parentnode.parentNode)
        return e.target.parentNode.parentnode.parentNode.parentNode.removeChild(
            e.target.parentNode.parentnode.parentNode
        )
    }
   
}

const editTask = (e) => {
    if(!e) e = window.event;

    const targetId = e.target.Id;
    const type = e.target.tagName;

    let parentNode;
    let taskTitle;
    let taskDescription;
    let tags;
    let submitButton;

    if(type === "BUTTON"){
        parentNode = e.target.parentNode.parentNode;
    }else{
        parentNode = e.target.parentNode.parentNode.parentNode;
    }

    taskTitle = parentNode.childNodes[3].childNode[3];
    //console.log(taskTitle)
    taskDescription = parentNode.childNodes[3].childNode[5];
    tags = parentNode.childNodes[3].childNode[7].childNode[1]
    submitButton = parentNode.childNode[5].childNode[1];
    //console.log(taskTitle, taskDescription. tags, submitButton);

    taskTitle.setAttribute("contenteditable", "true");
    taskDescription.setAttribute("contenteditable", "true");
    tags.setAttribute("contenteditable", "true");

   // submitButton.setAttribute('onclick', "saveEdit.apply(this, arguments")
   
   submitButton.removeAttribute("data-bs-toggle");
   submitButton.removeAttribute("data-bs-target");
   submitButton.innerHTML = "save changes"
}

const saveEdit =  (e) => {
    if(!e) e = window.event;

    const targetId = e.target.Id;
    const parentNode = e.target.parentNode.parentNode;
    //console.log(parentNode.childnode);

    const taskTitle = parentNode.childNode[3].childNode[3];
    const taskDescription = parentNode.childNodes[3].childNode[5];
    const tags = parentNode.childNodes[3].childNode[7].childNode[1];
    const submitButton = parentNode.childNode[5].childNode[1];

    const updateData = {
        taskTitle: taskTitle.innerHTML,
        taskDescription: taskDescription.innerHTML,
        tags: tags.innerHTML,

    }

    let stateCopy = state.taskList;

    stateCopy = stateCopy.map((task)=>
    task.Id === targetId ?
    {
        id:task.Id,
        title: updateData.taskTitle,
        description: updateData.taskDescription,
        tags: updateData.tags,
        url: task.url,
    }
    :
    task
);

state.taskList = stateCopy;
updateLocalStorage();

taskTitle.setAttribute("contenteditable", "false");
    taskDescription.setAttribute("contenteditable", "false");
    tags.setAttribute("contenteditable", "false");
    submitButton.setAttribute("onclick","openTask.apply(this,arguments)")


    submitButton.removeAttribute("data-bs-toggle", "modal");
   submitButton.removeAttribute("data-bs-target", "#showTask");
   submitButton.innerHTML = "open Task"



}


const searchTask = (e) =>{
    if(!e) e = window.event;

    while(taskcontents.firstChild){
        taskcontents.removeChild(taskcontents.firstChild);
    }

    const resultData = state.taskList.filter(({title})=>
        title.includes(e.target.value)
    );
    //console.log(resultData)

    resultData.map((cardData)=>{
        taskcontents.insertAdjacentHTML("beforeend", htmlTaskcontents(cardData));
        
    })
}
   

