import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LigaPage } from './liga.page';

describe('LigaPage', () => {
  let component: LigaPage;
  let fixture: ComponentFixture<LigaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LigaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
