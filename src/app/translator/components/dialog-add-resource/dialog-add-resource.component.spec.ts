import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddResourceComponent } from './dialog-add-resource.component';

describe('DialogAddResourceComponent', () => {
  let component: DialogAddResourceComponent;
  let fixture: ComponentFixture<DialogAddResourceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogAddResourceComponent]
    });
    fixture = TestBed.createComponent(DialogAddResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
