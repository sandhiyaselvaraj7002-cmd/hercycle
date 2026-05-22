function predictPeriod() {

  const lastPeriod =
    document.getElementById("lastPeriod").value;

  const cycleLength =
    parseInt(
      document.getElementById("cycleLength").value
    );

  if(!lastPeriod || !cycleLength) {

    alert("Please fill all fields");

    return;
  }

  const lastDate = new Date(lastPeriod);

  const nextDate = new Date(lastDate);

  nextDate.setDate(
    nextDate.getDate() + cycleLength
  );

  document.getElementById(
    "predictionResult"
  ).innerHTML = `

    🌸 Next Period Date:
    <br><br>

    ${nextDate.toDateString()}

    <br><br>

    Reminder enabled ✨

  `;

  scheduleReminder(nextDate);
}

function scheduleReminder(date) {

  if(Notification.permission !== "granted") {

    Notification.requestPermission();
  }

  const today = new Date();

  const timeDiff =
    date.getTime() - today.getTime();

  if(timeDiff > 0) {

    setTimeout(() => {

      new Notification(
        "🌸 HerCycle Reminder",
        {
          body:
          "Your predicted period date is today 💖"
        }
      );

    }, timeDiff);

  }
}

function saveLog() {

  const date =
    document.getElementById("date").value;

  const mood =
    document.getElementById("mood").value;

  const flow =
    document.getElementById("flow").value;

  const note =
    document.getElementById("note").value;

  const symptomCheckboxes =
    document.querySelectorAll(".symptom");

  let symptoms = [];

  symptomCheckboxes.forEach((checkbox) => {

    if (checkbox.checked) {

      symptoms.push(checkbox.value);
    }

  });

  const log = {
    date,
    mood,
    flow,
    symptoms,
    note
  };

  let logs =
    JSON.parse(localStorage.getItem("hercycleLogs"))
    || [];

  logs.push(log);

  localStorage.setItem(
    "hercycleLogs",
    JSON.stringify(logs)
  );

  alert("Saved Successfully 🌸");
}

document.addEventListener("DOMContentLoaded", () => {

  const calendarEl =
    document.getElementById("calendar");

  if(!calendarEl) return;

  let logs =
    JSON.parse(localStorage.getItem("hercycleLogs"))
    || [];

  let events = logs.map(log => {

    return {

      title: "🌸 Period",

      date: log.date,

      extendedProps: {
        mood: log.mood,
        flow: log.flow,
        symptoms: log.symptoms,
        note: log.note
      }

    };

  });

  const calendar = new FullCalendar.Calendar(
    calendarEl,
    {

      initialView: "dayGridMonth",

      height: "auto",

      events: events,

      eventClick: function(info) {

        const data =
          info.event.extendedProps;

        document.getElementById(
          "dayInfo"
        ).innerHTML = `

          <p>
            <strong>Date:</strong>
            ${info.event.start.toDateString()}
          </p>

          <p>
            <strong>Mood:</strong>
            ${data.mood}
          </p>

          <p>
            <strong>Flow:</strong>
            ${data.flow}
          </p>

          <p>
            <strong>Symptoms:</strong>
            ${data.symptoms.join(", ")}
          </p>

          <p>
            <strong>Notes:</strong>
            ${data.note}
          </p>

        `;

      }

    }
  );

  calendar.render();

  generateAIInsight(logs);

});

function generateAIInsight(logs) {

  const insightBox =
    document.getElementById("aiInsight");

  if(!insightBox || logs.length === 0) return;

  let heavyCount = 0;

  let tiredCount = 0;

  logs.forEach(log => {

    if(log.flow.includes("Heavy")) {
      heavyCount++;
    }

    if(log.mood.includes("Tired")) {
      tiredCount++;
    }

  });

  let insight =
    "🌸 Your cycle patterns look healthy. ";

  if(heavyCount >= 3) {

    insight +=
      "You often track heavy flow days. Stay hydrated 💖 ";
  }

  if(tiredCount >= 3) {

    insight +=
      "You frequently feel tired during cycles. Rest well ✨";
  }

  insightBox.innerHTML = insight;
}