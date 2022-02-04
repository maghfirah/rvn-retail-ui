import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class ApiModelTranslatorService {

  ToSnakeCase (str) {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }

  toCamelCase(s: string) {
    return s.replace(/([-_][a-z])/ig, ($1) => {
      return $1.toUpperCase()
        .replace('-', '')
        .replace('_', '');
    });
  }

  snakeToCamelCase(o: any) {
    if (o === Object(o) && !Array.isArray(o) && typeof o !== 'function') {
      const n = {};
      Object.keys(o)
        .forEach((k) => {
          n[this.toCamelCase(k)] = this.snakeToCamelCase(o[k]);
        });
      return n;
    } else if (Array.isArray(o)) {
      return o.map((i) => {
        return this.snakeToCamelCase(i);
      });
    }
    return o;
  }

  camelToSnakeCase(o: any) {
    if (o === Object(o) && !Array.isArray(o) && typeof o !== 'function') {
      const n = {};
      Object.keys(o)
        .forEach((k) => {
          n[this.ToSnakeCase(k)] = this.camelToSnakeCase(o[k]);
        });
      return n;
    } else if (Array.isArray(o)) {
      return o.map((i) => {
        return this.camelToSnakeCase(i);
      });
    }
    return o;
  }

}
