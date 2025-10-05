const fs = require("fs");
const file = "tasks.json";

const loadTasks = () => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, "[]");
  }
  const data = fs.readFileSync(file, "utf8");
  return data ? JSON.parse(data) : [];
};

const writeToFile = (tasks) => {
  if (tasks) {
    fs.writeFileSync(file, JSON.stringify(tasks, null, 2));
  } else {
    console.log("Empty task received");
  }
};

const isfileEmpty = () => {
  const data = fs.readFileSync(file, "utf8");
  // return data ? true : false;
  const parsed = data ? JSON.parse(data) : [];
  return parsed.length === 0;
};

const argv = process.argv.slice(2);
const command = argv[0];
const tasks = loadTasks();

if (command) {
  if (command === "add") {
    const description = argv[1];
    if (!description) {
      console.log("There must be a description while adding a task.");
      return;
    }
    const newTask = {
      id:
        tasks.length > 0
          ? Math.max(
              ...tasks.map((t) => {
                return t.id;
              })
            ) + 1
          : 1,
      description,
      status: "todo",
    };
    tasks.push(newTask);
    console.log(tasks);
    writeToFile(tasks);
  } else if (command === "update") {
    const id = parseInt(argv[1]);
    const description = argv[2];

    console.log(isfileEmpty());
    if (!isfileEmpty()) {
      console.log("File is Empty\nNo Task in tasks.json to update");
      return;
    }
    const allIds = tasks.map((t) => {
      return t.id;
    });

    if (!allIds.includes(id)) {
      console.log(`Invalid Id: ${id}\nPlease select among these: ${allIds}`);
      return;
    }

    if (!description) {
      console.log("There must be a description while adding a task.");
      return;
    }

    //Depending upon id, filtering out the object and destructuring it.
    const [taskToBeUpdated] = tasks.filter((t) => {
      return t.id === id;
    });

    //Identifying the index of the object
    const index = tasks.indexOf(taskToBeUpdated);

    //Changing the description of taskToBeUpdated;
    taskToBeUpdated.description = description;

    //Changing the description of specified id on MAIN "TASKS"
    tasks[index] = taskToBeUpdated;

    //Writing updated tasks to the tasks.json file
    writeToFile(tasks);

    console.log(`Task ${id} has been updated to: ${description}`);
  } else if (command === "list") {
  }
} else {
  console.log("Please write a command");
}
