import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForestComponent } from './forest.component';

describe('ForestComponent', () => {
  let component: ForestComponent;
  let fixture: ComponentFixture<ForestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
