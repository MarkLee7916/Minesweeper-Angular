import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  @Input() bombProbabilityPerTile!: number;

  @Output() bombProbabilityPerTileChange = new EventEmitter<number>();
  @Output() resetEmit = new EventEmitter();
  @Output() resizeEmit = new EventEmitter();
  @Output() showTutorialEmit = new EventEmitter();

  onBombProbabiltyChange(event: Event) {
    const htmlSliderElement = <HTMLInputElement>event.target;
    const newProbability = parseInt(htmlSliderElement.value);

    this.bombProbabilityPerTileChange.emit(newProbability);
  }

  onReset() {
    this.resetEmit.emit();
  }

  onResize() {
    this.resizeEmit.emit();
  }

  onShowTutorial() {
    this.showTutorialEmit.emit();
  }
}
