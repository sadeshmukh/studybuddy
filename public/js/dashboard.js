// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
// Required for side-effects
import "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
// import firebaseui

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDlQVhP9glOSLIUJHtCobTBrJQl6SxjT2o",
  authDomain: "studybuddy-51413.firebaseapp.com",
  projectId: "studybuddy-51413",
  storageBucket: "studybuddy-51413.appspot.com",
  messagingSenderId: "977365856821",
  appId: "1:977365856821:web:8ba6a3d1ca05e4ef64f77c",
  measurementId: "G-L2KLXRF1HF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const logout = document.getElementById("logout-button");

const auth = getAuth(app);

// check if logged in - if not, redirect to /
auth.onAuthStateChanged((user) => {
  if (!user) {
    // redirect to /
    window.location.href = "/";
  }
});

// if (!auth.currentUser) {
//   // redirect to /
//   window.location.href = "/";
// }

let turndownService = new TurndownService();

// set window body hidden remove
const mainthing = document.getElementById("main");
mainthing.hidden = false;

// firebase logout
// logout.addEventListener("click", () => {
//   auth.signOut().then(() => {
//     // Sign-out successful.
//     console.log("Sign-out successful.");
//     // redirect to /
//     window.location.href = "/";
//   });
// });

// get id container
const idContainer = document.getElementById("container");
// fill container with data from firestore

// get firestore
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
// import bootstrap
import "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js";

const db = getFirestore(app);

const spinnerText =
  '<div class="spinner-border text-primary m-5" role="status"><span class="visually-hidden"></span></div>';

// get all teacher IDs
const getTeachers = async () => {
  const teachers = {};
  // check if collection exists
  console.log("getting teacher IDs");

  const retval = await getDocs(collection(db, "teachers"));

  console.log("Teachers found!");
  retval.forEach((doc) => {
    // get teacher name from doc value

    teachers[doc.id] = doc.data();
  });
  console.log("returning teachers: ", teachers);
  return teachers;
};

async function viewTeacher(id) {
  // replace current content with teacher data
  // get teacher data from firestore
  const getTeacherData = (id) => {
    return new Promise((resolve, reject) => {
      const docRef = collection(db, "teachers");
      getDocs(docRef)
        .then((docSnap) => {
          console.log("docSnap: ", docSnap);
          docSnap.forEach((doc) => {
            console.log("doc: ", doc);
            console.log("doc id: ", doc.id);
            console.log("doc data: ", doc.data());
            if (doc.id === id) {
              console.log("found teacher data: ", doc.data());
              resolve(doc.data());
            }
          });
          resolve(null);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const teacherData = await getTeacherData(id);
  console.log("Teacher data: ", teacherData);
  console.log("viewing teacher with id: ", id);
  idContainer.innerHTML = spinnerText;
  const div = document.createElement("div");
  div.classList.add("col-md-4");
  // contains every assignment for this teacher - header is teacher name
  let to_set = `
    <h1 class="mx-3">${teacherData["name"]}</h1>
    <div class="btn-group float-right">
        <button type="button" class="btn btn-sm btn-outline-danger mx-3" onclick="showTeacherIDs()">Back</button>
    </div>
    <p class="card-text mx-4 my-2">Email: ${teacherData["email"]}</p>        
    `;
  // remove current content
  teacherData["assignments"].forEach((assignment) => {
    console.log("assignment: ", assignment);
    to_set += `
    <div class="card mb-4 shadow-sm m-2 p-2">
        <div class="card-body">
            <p class="card-text h4">${assignment["name"]}</p>
            <p class="card-text">${assignment["description"]}</p>
            <p class="card-text">Due: ${assignment["due"]
              .toDate()
              .toString()}</p>
            <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-outline-secondary" onclick="viewAssignment('${
                      assignment["id"]
                    }', '${id}')">View</button>
                </div>
            </div>
        </div>
    </div>
    `;
  });
  idContainer.innerHTML = to_set;
  idContainer.appendChild(div);
}

window.viewTeacher = viewTeacher;

const getAssignmentData = (tid, aid) => {
  return new Promise((resolve, reject) => {
    const docRef = collection(db, "teachers");
    getDocs(docRef)
      .then((docSnap) => {
        console.log("attempting to get assignment data");
        docSnap.forEach((doc) => {
          const docData = doc.data();
          console.log("doc: ", docData, docData.id === tid);
          if (docData.id === tid) {
            console.log("HERE");
            docData["assignments"].forEach((assignment) => {
              console.log("assignment: ", assignment);
              if (assignment["id"] === aid) {
                console.log("found assignment data: ", assignment);
                resolve(assignment);
              }
            });
          }
        });
        resolve(null);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
async function viewAssignment(aid, tid) {
  // pop open a modal with the assignment details using bootstrap
  // get assignment data from firestore

  const assignmentData = await getAssignmentData(tid, aid);
  console.log("Assignment data: ", assignmentData);
  const solutions = assignmentData["solutions"];
  let solutionText = "";
  // call openSolution for each solution
  solutions.forEach((solution) => {
    solutionText += `
        <button type="button" class="btn btn-sm btn-outline-secondary" onclick="openSolution('${solution["id"]}')">View ${solution["by"]}'s Solution</button>
        `;
  });

  console.log("Assignment data: ", assignmentData);
  console.log("viewing assignment with id: ", aid);
  // create modal
  const existingAssignmentModal = document.getElementById("assignmentModal");
  if (existingAssignmentModal) {
    existingAssignmentModal.remove();
  }

  const modal = document.createElement("div");
  modal.classList.add("modal", "fade");
  modal.setAttribute("id", "assignmentModal");
  modal.setAttribute("tabindex", "-1");
  modal.setAttribute("aria-labelledby", "assignmentModalLabel");
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="modal-dialog">
        <div class="modal-content p-3">
            <div class="modal-header">
                <h5 class="modal-title" id="assignmentModalLabel">${
                  assignmentData["name"]
                }</h5>
                
            </div>
            <div class="modal-body">
                <p>${assignmentData["description"]}</p>
                <p>Due: ${assignmentData["due"].toDate().toString()}</p>
                <h3>Solutions</h3>
                <button class="btn btn-primary btn-small btn-sm fs-2 float-right" onclick="addSolution('${tid}', '${aid}')">Add Solution</button>
                <p>${solutionText}</p>
                
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary m-3" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
    `;

  // use bootstrap to remove modal from DOM when closed
  // check if any assignmentModals are open

  const modalInstance = new bootstrap.Modal(modal);
  modalInstance.show();
  try {
    const modalElement = document.getElementById("assignmentModal");
    modalElement.addEventListener("hidden.bs.modal", () => {
      modal.remove();
    });
  } catch (error) {
    console.log(error);
  }
}

window.viewAssignment = viewAssignment;

async function openSolution(sid) {
  // get solution data from firestore
  const getSolutionData = (sid) => {
    return new Promise((resolve, reject) => {
      const docRef = collection(db, "solutions");
      getDocs(docRef)
        .then((docSnap) => {
          console.log("attempting to get solution data");
          docSnap.forEach((doc) => {
            const docData = doc.data();
            console.log("doc: ", docData, docData.id === sid, sid);
            if (docData.id === sid) {
              console.log("found solution data: ", docData);
              resolve(docData);
            }
          });
          resolve(null);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const solutionData = await getSolutionData(sid);
  console.log("Solution data: ", solutionData);

  // close any open modals
  const openModal = document.querySelector(".modal");

  if (openModal) {
    const modalInstance = bootstrap.Modal.getInstance(openModal);
    modalInstance.hide();
  }

  // create modal
  const modal = document.createElement("div");
  modal.classList.add("modal", "fade");
  modal.setAttribute("id", "solutionModal");
  modal.setAttribute("tabindex", "-1");
  modal.setAttribute("aria-labelledby", "solutionModalLabel");
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="modal-dialog modal-xl" id="solutionsModal">
        <div class="modal-content p-3">
            <div class="modal-header">
                <h5 class="modal-title" id="solutionModalLabel">${solutionData["by"]}</h5>
                
            </div>
            <div class="modal-body">
                <md-block >${solutionData["content"]}</md-block>
                
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary m-3" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
    `;
  idContainer.appendChild(modal);
  const modalInstance = new bootstrap.Modal(modal);
  modalInstance.show();
  const modalElement = document.getElementById("solutionModal");
  modalElement.addEventListener("hidden.bs.modal", () => {
    modal.remove();
  });
}

window.openSolution = openSolution;

async function addSolution(tid, aid) {
  // create a modal to add a solution

  // close any open solution modals
  const openModal = document.querySelector(".modal");
  if (openModal) {
    const modalInstance = bootstrap.Modal.getInstance(openModal);
    modalInstance.hide();
  }

  const modal = document.createElement("div");
  modal.classList.add("modal", "fade");
  modal.setAttribute("id", "addSolutionModal");
  modal.setAttribute("tabindex", "-1");
  modal.setAttribute("aria-labelledby", "addSolutionModalLabel");
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content p-3">
                <div class="modal-header">
                    <h5 class="modal-title" id="addSolutionModalLabel">Add Solution</h5>
                    
                </div>
                <div class="modal-body">
                    <form id="solutionForm">
                        <div class="form-group">
                            <label for="solution">Solution</label>
                            <div id="solution"></div>
                        </div>
                        <button type="submit" class="btn btn-primary btn-block">Submit</button>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary m-3" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
        `;

  idContainer.appendChild(modal);
  const solutionForm = document.getElementById("solutionForm");

  const options = {
    debug: "info",
    modules: {
      toolbar: true,
    },
    placeholder: "Compose an epic...",
    theme: "snow",
    // modules: {
    //   //   toolbar: [["image"]],
    // },
  };
  const quill = new Quill("#solution", options);
  const toolbar = quill.getModule("toolbar");
  //   toolbar.addHandler("image", showImageUI);
  solutionForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("solution submitted");
    const solution = turndownService.turndown(quill.root.innerHTML);
    console.log("solution: ", solution);
    // add solution to firestore - don't get current data, just blindly add
    const solutionThing = async () => {
      const collectionRef = collection(db, "solutions");

      // get new doc reference

      // add solution to assignment

      // set assignment data
      const ref = doc(collection(db, "teachers"), tid);
      let alldata = (await getDoc(ref)).data();

      const assignments = alldata["assignments"];
      // check if display name is in assignments
      let found = false;
      assignments.forEach((assignment) => {
        if (assignment.id === aid) {
          assignment.solutions.forEach((solution) => {
            if (solution.by === auth.currentUser.displayName) {
              found = true;
            }
          });
        }
      });

      // add solution to assignment
      // get assignment data
      const assignmentData = await getAssignmentData(tid, aid);
      console.log("assignmentData: ", assignmentData);

      if (found) {
        // instead edit the solution
        assignmentData["solutions"].forEach((solution) => {
          if (solution.by === auth.currentUser.displayName) {
            solution.content = solution;
          }
        });
      } else {
        const docRef = doc(collectionRef);

        const doc_been_set = await setDoc(docRef, {
          id: docRef.id,
          by: auth.currentUser.displayName,
          content: solution,
        });

        console.log(auth.currentUser);
        console.log("Document written with ID: ", docRef.id);

        assignmentData["solutions"].push({
          id: docRef.id,
          by: auth.currentUser.displayName,
        });
      }
      // set assignment data
      const assignmentRef = doc(collection(db, "teachers"), tid);
      // extend off of the current data
      const data = (await getDoc(assignmentRef)).data();
      data["assignments"].forEach((assignment) => {
        if (assignment.id === aid) {
          assignment.solutions = assignmentData["solutions"];
        }
      });
      // set the data
      await setDoc(assignmentRef, data);
    };
    await solutionThing();
    // close modal
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    alert("Solution added!");
  });

  const modalInstance = new bootstrap.Modal(modal);
  modalInstance.show();
  const modalElement = document.getElementById("addSolutionModal");
  modalElement.addEventListener("hidden.bs.modal", () => {
    modal.remove();
  });
}

window.addSolution = addSolution;

// show 1 box for each teacher
const showTeacherIDs = async () => {
  idContainer.innerHTML = spinnerText;
  const teachers = await getTeachers();
  console.log(teachers);
  Object.values(teachers).forEach((teacher) => {
    const div = document.createElement("div");
    div.classList.add("col-md-4");
    div.innerHTML = `
    <div class="card mb-4 shadow-sm">
    <div class="card-body">
    <!--get teacher name from firestore-->
        <p class="card-text">${teacher["name"]}</p>
        <div class="d-flex justify-content-between align-items-center">
        <div class="btn-group">
            <button type="button" class="btn btn-sm btn-outline-secondary" onclick="viewTeacher('${teacher["id"]}')">View</button>
        </div>
        </div>
    </div>
    </div>
    `;
    // remove current content
    idContainer.innerHTML = "";
    idContainer.appendChild(div);
  });
};

showTeacherIDs();
window.showTeacherIDs = showTeacherIDs;
