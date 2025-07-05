import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejetTableComponent } from './rejet-table.component';

describe('RejetTableComponent', () => {
  let component: RejetTableComponent;
  let fixture: ComponentFixture<RejetTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejetTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejetTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
