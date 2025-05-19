import { Elysia } from 'elysia';
import swagger from '@elysiajs/swagger';
import { note } from './note';

class Note {
  constructor(public data: string[] = ['moonhalo']) {}

  add(title: string) {
    this.data.push(title);
  }
}

const app = new Elysia()
  .use(swagger())
  .use(note)
  .get('/', () => 'Hello Elysia')
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
