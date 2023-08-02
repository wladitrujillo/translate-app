import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRemoveComponent } from './dialog-remove.component';

describe('DialogRemoveComponent', () => {
  let component: DialogRemoveComponent;
  let fixture: ComponentFixture<DialogRemoveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogRemoveComponent]
    });
    fixture = TestBed.createComponent(DialogRemoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
