const providerSelect = document.getElementById("providerSelect");
const dateSelect = document.getElementById("dateSelect");
const timeSelect = document.getElementById("timeSelect");

async function updateSlots() {
  const providerId = providerSelect.value;
  const date = dateSelect.value;

  if (!providerId || !date) return;

  timeSelect.innerHTML = "<option disabled selected>Loading...</option>";

  try {
    const response = await fetch(
      `/providers/${providerId}/availableSlots?date=${date}`,
    );
    const data = await response.json();

    timeSelect.innerHTML = "";

    if (!data.availableSlots || data.availableSlots.length === 0) {
      timeSelect.innerHTML =
        "<option disabled selected>No slots available</option>";
      return;
    }

    data.availableSlots.forEach((slot) => {
      const opt = document.createElement("option");
      opt.value = slot;
      opt.textContent = slot;
      timeSelect.appendChild(opt);
    });
  } catch (err) {
    timeSelect.innerHTML =
      "<option disabled selected>Error loading slots</option>";
  }
}

providerSelect.addEventListener("change", updateSlots);
dateSelect.addEventListener("change", updateSlots);
