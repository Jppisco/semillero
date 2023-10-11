import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProgramaComponent } from './create-programa.component';

describe('CreateProgramaComponent', () => {
  let component: CreateProgramaComponent;
  let fixture: ComponentFixture<CreateProgramaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateProgramaComponent]
    });
    fixture = TestBed.createComponent(CreateProgramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
