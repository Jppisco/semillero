import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInstanciaComponent } from './list-instancia.component';

describe('ListInstanciaComponent', () => {
  let component: ListInstanciaComponent;
  let fixture: ComponentFixture<ListInstanciaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListInstanciaComponent]
    });
    fixture = TestBed.createComponent(ListInstanciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
