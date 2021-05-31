import { Component, Input, Output, EventEmitter } from '@angular/core';
import { OperationType } from 'src/app/game';
import { isTouchscreen } from 'src/app/utils';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent {
  @Input() bombProbabilityPerTile!: number;
  @Input() operationTypeOnLeftClick!: OperationType;

  @Output() bombProbabilityPerTileChange = new EventEmitter<number>();
  @Output() operationTypeOnLeftClickChange = new EventEmitter<OperationType>();
  @Output() resetEmit = new EventEmitter();
  @Output() resizeEmit = new EventEmitter();
  @Output() showTutorialEmit = new EventEmitter();

  readonly isTouchscreen = isTouchscreen;

  readonly operationTypeToMessage = new Map<OperationType, string>([
    [OperationType.Flag, "Placing Flags 🚩"],
    [OperationType.Reveal, "Revealing Tiles 💣"]
  ]);

  onBombProbabiltyChange(event: Event) {
    const htmlSliderElement = <HTMLInputElement>event.target;
    const newProbability = parseInt(htmlSliderElement.value);

    this.bombProbabilityPerTileChange.emit(newProbability);
  }

  onOperationTypeOnLeftClickChange(event: Event) {
    const htmlSliderElement = <HTMLInputElement>event.target;
    const sliderValue = parseInt(htmlSliderElement.value);
    const operationType = sliderValue === 0 ? OperationType.Flag : OperationType.Reveal;

    this.operationTypeOnLeftClickChange.emit(operationType);
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
