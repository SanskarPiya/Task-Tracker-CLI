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
    writeToFile(tasks);
    console.log(
      `Task [${newTask.id}] "${description}" has been added to TODO list.`
    );
  } else if (command === "update") {
    const id = parseInt(argv[1]);
    const description = argv[2];
    if (isfileEmpty()) {
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

    console.log(`Task [${id}] has been updated to: ${description}`);
  } else if (command === "delete") {
    const id = parseInt(argv[1]);

    if (!id) {
      console.log("Please enter an id to delete");
      return;
    }

    if (isfileEmpty()) {
      console.log("File is Empty\nNo Task in tasks.json to delete");
      return;
    }

    const task = tasks.find((t) => {
      return t.id === id;
    });

    if (!task) {
      console.log("No task found having Id:", id);
      console.log("Please try again.");
      return;
    }

    const newtasks = tasks.filter((t) => {
      return t.id !== id;
    });

    writeToFile(newtasks);
    console.log(`Task ${id} has been deleted from task.json.`);
  } else if (command === "list") {
    const status = argv[1];

    if (!status) {
      tasks.forEach((task) => {
        console.log(
          `Task [${task.id}] , Description: ${task.description}, Status: ${task.status}`
        );
      });
      return;
    }

    if (status === "todo") {
      const todoTasks = tasks
        .filter((t) => {
          return t.status === status;
        })
        .forEach((task) => {
          console.log(
            `Task [${task.id}] , Description: ${task.description}, Status: ${task.status}`
          );
        });
      return;
    } else if (status === "in_progress") {
      const inProgressTasks = tasks
        .filter((t) => {
          return t.status === status;
        })
        .forEach((task) => {
          console.log(
            `Task [${task.id}] , Description: ${task.description}, Status: ${task.status}`
          );
        });
      return;
    } else if (status === "done") {
      const doneTasks = tasks
        .filter((t) => {
          return t.status === status;
        })
        .forEach((task) => {
          console.log(
            `Task [${task.id}] , Description: ${task.description}, Status: ${task.status}`
          );
        });
      return;
    } else {
      console.log(
        "\nInvalid argument for [task.status]\nEnter from [todo, in_progress, done]\n"
      );
    }
  }
} else {
  console.log("Please write a command");
}
