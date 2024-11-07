import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import L, { LatLng } from 'leaflet';
import { Papa } from 'ngx-papaparse';
import { LatLong } from '../../../../../domain/models/lat_long';
import { RESEARCH_AREA_SERVICE_TOKEN } from '../../../../../core/services/injection-tokens';
import { ResearchAreaService } from '../../../../../domain/external_services/research_area.service';
import { catchError, of, throwError } from 'rxjs';

@Component({
  selector: 'app-research-area',
  templateUrl: './research-area.component.html',
  styleUrl: './research-area.component.scss'
})
export class ResearchAreaComponent implements OnInit {
  private map: L.Map | undefined;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  changesMade: boolean = false;
  private researchAreaPolygon: L.Polygon | undefined;
  private nodes: LatLong[] | undefined;
  errorOnLoadingCurrentResearchArea: boolean = false;
  private rememberedNodes: LatLong[] | undefined;


  constructor(private papa: Papa,
    @Inject(RESEARCH_AREA_SERVICE_TOKEN) private readonly researchAreaService: ResearchAreaService
  ) {} 

  ngOnInit(): void {
    this.initMap();
    this.loadCurrentResearchArea();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [52.2297, 21.0122],
      zoom: 13,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
  }

  private loadCurrentResearchArea(): void {
    this.nodes = undefined;
    this.rememberedNodes = undefined;
    this.errorOnLoadingCurrentResearchArea = false;

    this.researchAreaService
    .getResearchArea()
    .pipe(
      catchError((error) => {
        if (error.status ==  404){
          return of([]);
        }

        return throwError(() => error);
      })
    )
    .subscribe({
      next: (data) => {
        this.drawPolygon(data);
      },
      error: () => {
        this.errorOnLoadingCurrentResearchArea = true;
      }
    })
  }

  loadFromFile(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      this.papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const data: LatLong[] = result.data as LatLong[];
          this.drawPolygon(data);
          this.changesMade = true;
        },
        error: (error) => {
          console.error('Error parsing CSV file:', error);
        }
      });
    }
  }

  private drawPolygon(vertices: LatLong[]): void {
    if (this.nodes && !this.rememberedNodes){
      this.rememberedNodes = this.nodes;
    }
    this.removePolygon();
    this.nodes = vertices;
    const latLngs = vertices.map(vertex => new LatLng(vertex.latitude, vertex.longitude));
    this.researchAreaPolygon = L.polygon(latLngs, {
      color: 'darkblue',
      fillColor: 'blue',
      fillOpacity: 0.5
    });

    this.researchAreaPolygon.addTo(this.map!);
    this.map?.fitBounds(this.researchAreaPolygon.getBounds());
  }

  private removePolygon(): void {
    if (this.map && this.researchAreaPolygon) {
      this.map.removeLayer(this.researchAreaPolygon);
      this.researchAreaPolygon = undefined;
    }
  }
}
