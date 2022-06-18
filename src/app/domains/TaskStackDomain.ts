import { TaskRepository } from "../repositories/TaskRepository";
import { ObservableValue } from "../../lib/ObservableValue";
import { TaskItemDomain, TaskItemDomainPort } from "./TaskItemDomain";
import { ActiveTaskDomain, ActiveTaskDomainPort } from "./ActiveTaskDomain";
import { TaskFormDomain, TaskFormDomainPort } from "./TaskFormDomain";

export class TaskStackDomain
  implements TaskItemDomainPort, ActiveTaskDomainPort, TaskFormDomainPort {
  taskRepository: TaskRepository;
  taskItemDomains = new ObservableValue<TaskItemDomain[]>([]);
  activeTaskDomain = new ObservableValue<ActiveTaskDomain | null>(null);

  constructor(taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }
}
