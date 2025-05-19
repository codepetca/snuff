import Elysia, { t } from 'elysia';

class Note {
  constructor(public data: string[] = ['moonhalo']) {}

  add(title: string) {
    this.data.push(title);
    return this.data;
  }

  remove(index: number) {
    return this.data.splice(index, 1);
  }

  update(index: number, note: string) {
    this.data[index] = note;
    return this.data;
  }
}

export const note = new Elysia({ prefix: '/note' })
  .decorate('note', new Note())
  .onTransform(function log({ body, params, path, request: { method } }) {
    console.log(`${method} ${path}`, { body, params });
  })
  .get('/', ({ note }) => note.data)
  .put('/', ({ note, body: { data } }) => note.add(data), {
    body: t.Object({
      data: t.String(),
    }),
  })
  .guard({
    params: t.Object({
      index: t.Number(),
    }),
  })
  .get('/:index', ({ note, params: { index }, status }) => {
    return note.data[index] ?? status(404, 'Ruh roh :(');
  })
  .delete('/:index', ({ note, params: { index }, status }) => {
    if (index in note.data) return note.remove(index);
    return status(404, 'Ruh roh :p');
  })
  .patch(
    '/:index',
    ({ note, params: { index }, body: { data }, status }) => {
      if (index in note.data) return note.update(index, data);
      return status(404, 'Ruh roh :o');
    },
    {
      body: t.Object({
        data: t.String(),
      }),
    }
  );
