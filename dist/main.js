"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const bootstrap = __importStar(require("bootstrap"));
const developers = JSON.parse(localStorage.getItem("developers") || "[]");
let editIndex = null;
// Handle form submission
document
    .getElementById("saveDeveloperBtn")
    .addEventListener("click", function () {
    const form = document.getElementById("developerForm");
    if (!form.checkValidity()) {
        form.reportValidity(); // Show validation errors if any
        return;
    }
    const newDeveloper = {
        firstName: document.getElementById("firstName")
            .value,
        lastName: document.getElementById("lastName").value,
        address: document.getElementById("address").value,
        birthDate: document.getElementById("birthDate")
            .value,
        position: document.getElementById("position")
            .value,
        typePosition: document.getElementById("typePosition").value,
        salary: parseFloat(document.getElementById("salary").value),
        isMarried: document.querySelector('input[name="isMarried"]:checked').value === "true",
    };
    if (editIndex !== null) {
        developers[editIndex] = newDeveloper; // Update existing developer
        editIndex = null;
    }
    else {
        developers.push(newDeveloper); // Add new developer
    }
    localStorage.setItem("developers", JSON.stringify(developers));
    renderDevelopers();
    // Reset form
    form.reset();
    // Close the modal
    const modalElement = document.getElementById("developerModal");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance === null || modalInstance === void 0 ? void 0 : modalInstance.hide();
});
// Function to render the developers table
function renderDevelopers() {
    const tbody = document.getElementById("developerTableBody");
    tbody.innerHTML = "";
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const filterPosition = document.getElementById("filterPosition").value;
    const filterMarried = document.getElementById("filterMarried").value;
    const filteredDevelopers = developers.filter((dev) => {
        return ((dev.firstName.toLowerCase().includes(searchInput) ||
            dev.lastName.toLowerCase().includes(searchInput)) &&
            (filterPosition === "" || dev.typePosition === filterPosition) &&
            (filterMarried === "" || dev.isMarried.toString() === filterMarried));
    });
    filteredDevelopers.forEach((dev, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${dev.firstName}</td>
      <td>${dev.lastName}</td>
      <td>${dev.address}</td>
      <td>${dev.birthDate}</td>
      <td>${dev.position}</td>
      <td>${dev.typePosition}</td>
      <td>${dev.salary}</td>
      <td>${dev.isMarried ? "Yes" : "No"}</td>
      <td>
        <button class="btn btn-warning btn-sm me-2" onclick="editDeveloper(${index})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteDeveloper(${index})">Delete</button>
      </td>
    `;
        tbody.appendChild(tr);
    });
}
// Handle search input change
document
    .getElementById("searchInput")
    .addEventListener("input", renderDevelopers);
document
    .getElementById("filterPosition")
    .addEventListener("change", renderDevelopers);
document
    .getElementById("filterMarried")
    .addEventListener("change", renderDevelopers);
// Edit developer
function editDeveloper(index) {
    editIndex = index;
    const dev = developers[index];
    document.getElementById("firstName").value =
        dev.firstName;
    document.getElementById("lastName").value =
        dev.lastName;
    document.getElementById("address").value = dev.address;
    document.getElementById("birthDate").value =
        dev.birthDate;
    document.getElementById("position").value =
        dev.position;
    document.getElementById("typePosition").value =
        dev.typePosition;
    document.getElementById("salary").value =
        dev.salary.toString();
    document.querySelector(`input[name="isMarried"][value="${dev.isMarried}"]`).checked = true;
    const modalElement = document.getElementById("developerModal");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance === null || modalInstance === void 0 ? void 0 : modalInstance.show();
}
// Delete developer
function deleteDeveloper(index) {
    if (confirm("Are you sure you want to delete this developer?")) {
        developers.splice(index, 1);
        localStorage.setItem("developers", JSON.stringify(developers));
        renderDevelopers();
    }
}
// Initial render
renderDevelopers();
