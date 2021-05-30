import { Component, Input, EventEmitter, Output } from '@angular/core';
import { emptyTile, Tile, Coord } from 'src/app/grid';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css']
})
export class TileComponent {
  @Input() tile!: Tile;
  @Input() isGameOver!: boolean;
  @Input() coord!: Coord;

  @Output() leftClickEmit = new EventEmitter<Coord>();
  @Output() rightClickEmit = new EventEmitter<Coord>();

  readonly frontierValueToColor = new Map([
    [1, "#0074D9"],
    [2, "#FF4136"],
    [3, "#FFDC00"],
    [4, "#F012BE"],
    [5, "#7FDBFF"],
    [6, "#FF851B"],
    [7, "pink"],
    [8, "cyan"],
  ]);



  getDisplaySymbol() {
    if (this.tile.hasFlag && !this.tile.hasBomb && this.isGameOver) {
      return "❌";
    } else if (!this.tile.hasFlag && this.tile.hasBomb && this.isGameOver) {
      return "💣";
    } else if (this.tile.hasFlag) {
      return "🚩";
    } else if (this.tile.isRevealed && this.tile.bombNeighbourCount > 0) {
      return this.tile.bombNeighbourCount.toString();
    } else {
      return "";
    }
  }

  onLeftClick() {
    this.leftClickEmit.emit(this.coord);
  }

  onRightClick(event: Event) {
    event.preventDefault();

    this.rightClickEmit.emit(this.coord);
  }




}
