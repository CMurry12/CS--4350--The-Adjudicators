const addEventBtn = document.getElementById("addEventBtn");
const eventForm = document.getElementById("eventForm");
const saveEventBtn = document.getElementById("saveEventBtn");
const cancelEventBtn = document.getElementById("cancelEventBtn");
if (addEventBtn) {
  addEventBtn.addEventListener("click", () => {
    eventForm.style.display = "block";
  });
}
if (cancelEventBtn) {
  cancelEventBtn.addEventListener("click", () => {
    eventForm.style.display = "none";
  });
}
if (saveEventBtn) {
  saveEventBtn.addEventListener("click", () => {
    const eventName = document.getElementById("eventName").value;
    const eventDesc = document.getElementById("eventDesc").value;
    alert("Event created: " + eventName + " - " + eventDesc);
    eventForm.style.display = "none";
  });
}

const addJudgeBtn = document.getElementById("addJudgeBtn");
const judgeForm = document.getElementById("judgeForm");
const saveJudgeBtn = document.getElementById("saveJudgeBtn");
const cancelJudgeBtn = document.getElementById("cancelJudgeBtn");
if (addJudgeBtn) {
  addJudgeBtn.addEventListener("click", () => {
    judgeForm.style.display = "block";
  });
}
if (cancelJudgeBtn) {
  cancelJudgeBtn.addEventListener("click", () => {
    judgeForm.style.display = "none";
  });
}
if (saveJudgeBtn) {
  saveJudgeBtn.addEventListener("click", () => {
    const judgeIdInput = document.getElementById("judgeId").value;
    alert("Judge created: " + judgeIdInput);
    judgeForm.style.display = "none";
  });
}

const addProjectBtn = document.getElementById("addProjectBtn");
const projectForm = document.getElementById("projectForm");
const saveProjectBtn = document.getElementById("saveProjectBtn");
const cancelProjectBtn = document.getElementById("cancelProjectBtn");
if (addProjectBtn) {
  addProjectBtn.addEventListener("click", () => {
    projectForm.style.display = "block";
  });
}
if (cancelProjectBtn) {
  cancelProjectBtn.addEventListener("click", () => {
    projectForm.style.display = "none";
  });
}
if (saveProjectBtn) {
  saveProjectBtn.addEventListener("click", () => {
    const projectName = document.getElementById("projectName").value;
    const eventId = document.getElementById("eventId").value;
    alert("Project created: " + projectName + ", Event ID: " + eventId);
    projectForm.style.display = "none";
  });
}
