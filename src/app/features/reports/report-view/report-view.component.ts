import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'sh-report-view',
  standalone: true,
  imports: [MatCardModule, MatProgressSpinnerModule],
  templateUrl: './report-view.component.html',
  styleUrl: './report-view.component.scss',
})
export class ReportViewComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  slug = '';
  title = '';
  loading = true;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.slug = params.get('slug') ?? '';
      this.title = this.slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      this.loading = false;
    });
  }
}
