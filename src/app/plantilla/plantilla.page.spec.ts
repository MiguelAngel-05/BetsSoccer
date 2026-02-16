import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlantillaPage } from './plantilla.page';

describe('PlantillaPage', () => {
  let component: PlantillaPage;
  let fixture: ComponentFixture<PlantillaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantillaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
