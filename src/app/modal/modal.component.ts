import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Output() hideEmit = new EventEmitter();

  modalIndex: number = 0;

  nextModal() {
    this.modalIndex++;
  }

  prevModal() {
    this.modalIndex--;
  }

  onHide() {
    this.hideEmit.emit();
  }
}
