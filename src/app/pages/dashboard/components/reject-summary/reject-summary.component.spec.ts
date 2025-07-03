import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectSummaryComponent } from './reject-summary.component';

describe('RejectSummaryComponent', () => {
  let component: RejectSummaryComponent;
  let fixture: ComponentFixture<RejectSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
