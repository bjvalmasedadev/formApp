import { Component } from '@angular/core';
import {
  Form,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  templateUrl: './dynamic-page.component.html',
  styles: [],
})
export class DynamicPageComponent {
  public dynamicForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    favoriteGames: this.fb.array([
      ['Metal Gear', Validators.required],
      ['Death Stranding', Validators.required],
    ]),
  });

  public newFavorite: FormControl = new FormControl('', [Validators.required]);

  constructor(private fb: FormBuilder) {}

  get favoriteGamesControls() {
    return this.dynamicForm.get('favoriteGames') as FormArray;
  }

  isValidField(field: string): boolean | null {
    return (
      this.dynamicForm.controls[field].errors &&
      this.dynamicForm.controls[field].touched
    );
  }

  getFieldError(field: string): string | null {
    if (!this.dynamicForm.controls[field]) return null;

    const errors = this.dynamicForm.controls[field].errors || {};
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Field required';
        case 'minlength':
          return `Min ${errors['minlength'].requiredLength} characters`;
      }
    }
    return null;
  }

  isValidFieldInArray(formArray: FormArray, index: number) {
    return (
      formArray.controls[index].errors && formArray.controls[index].touched
    );
  }

  onDeleteFavoriteGame(index: number): void {
    this.favoriteGamesControls.removeAt(index);
  }

  onAddFavoriteControl(): void {
    if (this.newFavorite.invalid) return;
    const newGame = this.newFavorite.value;
    this.favoriteGamesControls.push(
      this.fb.control(newGame, Validators.required)
    );
    this.newFavorite.reset();
  }
  onSubmit(): void {
    if (this.dynamicForm.invalid) {
      this.dynamicForm.markAllAsTouched();
      return;
    }
    console.log(this.dynamicForm.value);
    (this.dynamicForm.controls['favoriteGames'] as FormArray) = this.fb.array(
      []
    );
    this.dynamicForm.reset();
  }
}
