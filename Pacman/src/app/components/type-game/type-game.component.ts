import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-type-game',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './type-game.component.html',
  styleUrl: './type-game.component.css'
})

export class TypeGameComponent {
  words = ['Dentista', 'Arroz', 'Ventana', 'Sol', 'Anoche'];
  currentWord = signal<string>('');
  displayedWord = signal<Array<{letter: string, underlined: boolean}>>([]);
  userInput = signal<string>('');
  attempts = signal<number>(3);
  wins = signal<number>(0);
  gameOver = signal<boolean>(false);
  gameWon = signal<boolean>(false);

  constructor() {
    this.newWord();
  }

  newWord() {
    const randomWord = this.words[Math.floor(Math.random() * this.words.length)];
    this.currentWord.set(randomWord);
    this.displayedWord.set(
      randomWord.split('').map(letter => ({
        letter,
        underlined: true
      }))
    );
    this.userInput.set('');
  }

  onInput(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    
    // Check if the entire word is correct
    if (input.toLowerCase() === this.currentWord().toLowerCase()) {
      this.userInput.set(input);
      this.updateDisplayedWord(input);
      this.wins.update(wins => wins + 1);
      if (this.wins() >= 3) {
        this.gameWon.set(true);
        this.gameOver.set(true);
      } else {
        setTimeout(() => this.newWord(), 300); // Small delay before new word
      }
      return;
    }

    // Check if the current input is a valid start of the word
    if (this.currentWord().toLowerCase().startsWith(input.toLowerCase())) {
      this.userInput.set(input);
      this.updateDisplayedWord(input);
    } else {
      // If input is incorrect, count as mistake and clear input
      this.attempts.update(attempts => attempts - 1);
      if (this.attempts() <= 0) {
        this.gameOver.set(true);
      }
      this.userInput.set('');
      (event.target as HTMLInputElement).value = '';
      this.updateDisplayedWord('');
    }
  }

  updateDisplayedWord(input: string) {
    const updatedDisplay = this.displayedWord().map((char, index) => ({
      letter: char.letter,
      underlined: input[index]?.toLowerCase() !== char.letter.toLowerCase()
    }));
    this.displayedWord.set(updatedDisplay);
  }

  resetGame() {
    this.attempts.set(3);
    this.wins.set(0);
    this.gameOver.set(false);
    this.gameWon.set(false);
    this.newWord();
  }
}
