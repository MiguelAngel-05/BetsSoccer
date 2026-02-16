import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchDetailPage } from './match-detail.page';

describe('MatchDetailPage', () => {
  let component: MatchDetailPage;
  let fixture: ComponentFixture<MatchDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
