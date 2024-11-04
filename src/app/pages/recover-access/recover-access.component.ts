import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-recover-access',
  templateUrl: './recover-access.component.html',
  styleUrl: './recover-access.component.css'
})
export class RecoverAccessComponent {
  recoverForm!: FormGroup ;
  hide: boolean = true;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.recoverForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  onSubmit(): void {
    if (this.recoverForm.valid) {
      const formData = this.recoverForm.value;
      console.log('Form data:', formData);
    } else {
      console.log('Form is invalid');
    }
  }
}
