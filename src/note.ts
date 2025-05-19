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

export const note = new Elysia()
  .decorate('note', new Note())
  .get('/note', ({ note }) => note.data)
  .get(
    '/note/:index',
    ({ note, params: { index }, status }) => {
      return note.data[index] ?? status(404, 'Ruh roh :(');
    },
    {
      params: t.Object({
        index: t.Number(),
      }),
    }
  )
  .put('/note', ({ note, body }) => note.add(body.title), {
    body: t.Object({
      title: t.String(),
    }),
  })
  .delete(
    '/note/:index',
    ({ note, params: { index }, status }) => {
      if (index in note.data) return note.remove(index);
      return status(404, 'Ruh roh :(');
    },
    {
      params: t.Object({
        index: t.Number(),
      }),
    }
  );
