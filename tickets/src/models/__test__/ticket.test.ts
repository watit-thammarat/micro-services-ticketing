import { Ticket } from '../ticket';

it('Implements optimistic concurrency control', async (done) => {
  const ticket = Ticket.build({
    title: 'title',
    price: 5,
    userId: '123',
  });
  await ticket.save();
  const ticket1 = await Ticket.findById(ticket.id);
  const ticket2 = await Ticket.findById(ticket.id);

  ticket1!.set({ price: 10 });
  ticket2!.set({ price: 20 });

  await ticket1!.save();

  try {
    await ticket2!.save();
  } catch (err) {
    return done();
  }
  throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'title',
    price: 5,
    userId: '123',
  });
  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
