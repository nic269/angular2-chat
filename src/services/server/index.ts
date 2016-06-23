import {
  Injectable,
  provide
} from '@angular/core';

import {
  Http,
  Request,
  Response,
  Headers
} from '@angular/http';

import { NgRedux } from 'ng2-redux';

import 'rxjs/add/operator/map';

import { IAppState } from '../../reducers';

export { RealTime } from './real-time';

const url = path => `/api${path}`;

@Injectable()
export class ServerService {
  constructor(
    private ngRedux: NgRedux<IAppState>,
    private http: Http) {}

  post<T>(path: string, data: T) {
    return this.http.post(url(path), JSON.stringify(data), this.options)
      .map(response => response.json());
  }

  postSingle<TResult>(path, data) {
    return new Promise<TResult>((resolve, reject) => {
      const subject = this.post(path, data);

      subject.subscribe(result => resolve(result), err => reject(err));
    });
  }

  get(path: string) {
    return this.http.get(url(path), this.options)
      .map(response => response.json());
  }

  getSingle<TResult>(path) {
    return new Promise<TResult>((resolve, reject) => {
      this.get(path).subscribe(result => resolve(result), err => reject(err));
    });
  }

  put(path, id, data) {
    return this.http.put(url(`${path}/${id}`), data, this.options)
      .map(res => res.json());
  }

  putSingle<TResult>(path, id, data) {
    return new Promise<TResult>((resolve, reject) => {
      const request = this.put(path, id, data);

      request.subscribe(result => resolve(result), err => reject(err));
    });
  }

  delete(path, id) {
    return this.http.delete(url(`${path}/${id}`), this.options);
  }

  deleteSingle<TResult>(path, id) {
    return new Promise((resolve, reject) => {
      const request = this.delete(path, id);

      request.subscribe(result => resolve(result), err => reject(err));
    });
  }

  private get options() {
    const state = this.ngRedux.getState();

    const token = state == null || state.session == null
      ? null
      : state.session.get('token');

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authentication-Token': token
    });

    return { headers };
  }
}
