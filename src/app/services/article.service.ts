import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ArticleService {
  constructor(private http: HttpClient) {}

  getSources() {
    return this.http.post(`${environment.API_URL}/news/sources`, {"news_api_token": environment.NEWS_API_TOKEN});
  }

  getArticles(sourceId, keyword) {
    return this.http.post(`${environment.API_URL}/news/${sourceId}/${keyword}`, {"news_api_token": environment.NEWS_API_TOKEN});
  }
}
