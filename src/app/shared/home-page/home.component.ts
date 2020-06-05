import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { CrudService } from '../../services/crud.service';
import * as moment from 'moment';
moment.locale('fr');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public currentUser: any;
  public articles: Object[] = null;
  public sources: Object[] = [];
  public selectedSource: any = {};
  public keyword = '';
  public loading: Boolean = false;
  public adding: Boolean = false;
  public removing: Boolean = false;
  public moment = moment;

  constructor(
    private userService: CrudService,
    private articleService: ArticleService
  ) {}

  ngOnInit(): void {
    this.articleService.getSources().subscribe((response: any) => {
      this.sources = response.data.sources;

      if (localStorage.getItem('previousSource')) {
        this.changeSelectedSource(localStorage.getItem('previousSource'));
      }
    });

    this.userService.getCurrentUser().subscribe((currentUser) => {
      this.currentUser = currentUser;
    });

    if (localStorage.getItem('previousKeyword')) {
      this.keyword = localStorage.getItem('previousKeyword');
    }
  }

  changeSelectedSource(sourceId) {
    this.selectedSource = this.sources.find((source: any) => source.id === sourceId);
  }

  addToBookmarks() {
    this.adding = true;
    this.userService.addToBookmarks(this.selectedSource).subscribe(() => {
      this.adding = false;
    }, () => {
      this.adding = false;
    });
  }

  removeFromBookmarks() {
    const bookmark = this.currentUser.bookmarks.find(bookmark => bookmark.id === this.selectedSource.id);
    this.userService.removeFromBookmarks(bookmark).subscribe(() => {
      this.removing = false;
    }, () => {
      this.removing = false;
    });
  }

  isInBookmark() {
    return this.currentUser.bookmarks.find(bookmark => bookmark.id === this.selectedSource.id) ? true : false;
  }

  search() {
    if (this.selectedSource === null || this.loading === true) { return; }

    this.loading = true;
    if (!this.keyword || this.keyword.trim() === '') { this.keyword = null; }

    this.articleService
      .getArticles(this.selectedSource.id, this.keyword)
      .subscribe(
        (response: any) => {
          localStorage.setItem('previousSource', this.selectedSource.id);
          if (this.keyword) {
            localStorage.setItem('previousKeyword', this.keyword);
          }
          this.articles = response.data.articles;
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          console.error('An error occured', error);
        }
      );
  }
}
