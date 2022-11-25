import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VjInputComponent } from './vj-input.component';

describe('VjInputComponent', () => {
  let component: VjInputComponent;
  let fixture: ComponentFixture<VjInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VjInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VjInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
