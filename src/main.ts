import * as bootstrap from "bootstrap";

interface Developer {
  firstName: string;
  lastName: string;
  address: string;
  birthDate: string;
  position: string;
  typePosition: string;
  salary: number;
  isMarried: boolean;
}

const developers: Developer[] = JSON.parse(
  localStorage.getItem("developers") || "[]"
);
let editIndex: number | null = null;

// Handle form submission
document
  .getElementById("saveDeveloperBtn")!
  .addEventListener("click", function () {
    const form = document.getElementById("developerForm") as HTMLFormElement;
    if (!form.checkValidity()) {
      form.reportValidity(); // Show validation errors if any
      return;
    }

    const newDeveloper: Developer = {
      firstName: (document.getElementById("firstName") as HTMLInputElement)
        .value,
      lastName: (document.getElementById("lastName") as HTMLInputElement).value,
      address: (document.getElementById("address") as HTMLInputElement).value,
      birthDate: (document.getElementById("birthDate") as HTMLInputElement)
        .value,
      position: (document.getElementById("position") as HTMLSelectElement)
        .value,
      typePosition: (
        document.getElementById("typePosition") as HTMLSelectElement
      ).value,
      salary: parseFloat(
        (document.getElementById("salary") as HTMLInputElement).value
      ),
      isMarried:
        (
          document.querySelector(
            'input[name="isMarried"]:checked'
          ) as HTMLInputElement
        ).value === "true",
    };

    if (editIndex !== null) {
      developers[editIndex] = newDeveloper; // Update existing developer
      editIndex = null;
    } else {
      developers.push(newDeveloper); // Add new developer
    }

    localStorage.setItem("developers", JSON.stringify(developers));
    renderDevelopers();

    // Reset form
    form.reset();

    // Close the modal
    const modalElement = document.getElementById("developerModal");
    const modalInstance = bootstrap.Modal.getInstance(modalElement!);
    modalInstance?.hide();
  });

// Function to render the developers table
function renderDevelopers() {
  const tbody = document.getElementById("developerTableBody")!;
  tbody.innerHTML = "";

  const searchInput = (
    document.getElementById("searchInput") as HTMLInputElement
  ).value.toLowerCase();
  const filterPosition = (
    document.getElementById("filterPosition") as HTMLSelectElement
  ).value;
  const filterMarried = (
    document.getElementById("filterMarried") as HTMLSelectElement
  ).value;

  const filteredDevelopers = developers.filter((dev) => {
    return (
      (dev.firstName.toLowerCase().includes(searchInput) ||
        dev.lastName.toLowerCase().includes(searchInput)) &&
      (filterPosition === "" || dev.typePosition === filterPosition) &&
      (filterMarried === "" || dev.isMarried.toString() === filterMarried)
    );
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
  .getElementById("searchInput")!
  .addEventListener("input", renderDevelopers);
document
  .getElementById("filterPosition")!
  .addEventListener("change", renderDevelopers);
document
  .getElementById("filterMarried")!
  .addEventListener("change", renderDevelopers);

// Edit developer
function editDeveloper(index: number) {
  editIndex = index;

  const dev = developers[index];
  (document.getElementById("firstName") as HTMLInputElement).value =
    dev.firstName;
  (document.getElementById("lastName") as HTMLInputElement).value =
    dev.lastName;
  (document.getElementById("address") as HTMLInputElement).value = dev.address;
  (document.getElementById("birthDate") as HTMLInputElement).value =
    dev.birthDate;
  (document.getElementById("position") as HTMLSelectElement).value =
    dev.position;
  (document.getElementById("typePosition") as HTMLSelectElement).value =
    dev.typePosition;
  (document.getElementById("salary") as HTMLInputElement).value =
    dev.salary.toString();
  (
    document.querySelector(
      `input[name="isMarried"][value="${dev.isMarried}"]`
    ) as HTMLInputElement
  ).checked = true;

  const modalElement = document.getElementById("developerModal");
  const modalInstance = bootstrap.Modal.getInstance(modalElement!);
  modalInstance?.show();
}

// Delete developer
function deleteDeveloper(index: number) {
  if (confirm("Are you sure you want to delete this developer?")) {
    developers.splice(index, 1);
    localStorage.setItem("developers", JSON.stringify(developers));
    renderDevelopers();
  }
}

// Initial render
renderDevelopers();
