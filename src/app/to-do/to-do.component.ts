import { itask } from "./../model/task";
import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
@Component({
  selector: "app-to-do",
  templateUrl: "./to-do.component.html",
  styleUrls: ["./to-do.component.css"],
})
export class ToDoComponent {
  todoForm!: FormGroup;
  tasks: itask[] = [];
  done: itask[] = [];
  updateIndex!: any;
  editEnabled: boolean = false;
  constructor(private frmb: FormBuilder) {}
  ngOnInit(): void {
    this.todoForm = this.frmb.group({
      item: ["", Validators.required],
    });
    this.tasks = JSON.parse(localStorage.getItem("ToDoTask") || "[]");
    this.done = JSON.parse(localStorage.getItem("DoneTask") || "[]");
  }
  drop(event: CdkDragDrop<itask[]>, source: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      if (source == "todotask") {
        localStorage.setItem(
          "ToDoTask",
          JSON.stringify(event.previousContainer.data)
        );
        localStorage.setItem("DoneTask", JSON.stringify(event.container.data));
      } else if (source == "donetask") {
        localStorage.setItem(
          "DoneTask",
          JSON.stringify(event.previousContainer.data)
        );
        localStorage.setItem("ToDoTask", JSON.stringify(event.container.data));
      }

      this.tasks = JSON.parse(localStorage.getItem("ToDoTask") || "[]");
      this.done = JSON.parse(localStorage.getItem("DoneTask") || "[]");
      this.done.forEach((v) => {
        v.done = true;
      });
      localStorage.setItem("DoneTask", JSON.stringify(this.done));
    }
  }
  addTask() {
    this.tasks.push({
      description: this.todoForm.value.item,
      done: false,
    });
    this.todoForm.reset();
    localStorage.setItem("ToDoTask", JSON.stringify(this.tasks));
  }
  updateTask() {
    this.tasks[this.updateIndex].description = this.todoForm.value.item;
    this.tasks[this.updateIndex].done = false;
    this.todoForm.reset();
    this.updateIndex = undefined;
    this.editEnabled = false;
    localStorage.setItem("ToDoTask", JSON.stringify(this.tasks));
  }
  deleteTask(i: number) {
    this.tasks.splice(i, 1);
    localStorage.setItem("ToDoTask", JSON.stringify(this.tasks));
  }
  deleteDone(i: number) {
    this.done.splice(i, 1);
    localStorage.setItem("DoneTask", JSON.stringify(this.done));
  }
  onEditTask(item: itask, i: number) {
    this.todoForm.controls["item"].setValue(item.description);
    this.updateIndex = i;
    this.editEnabled = true;
  }
}
