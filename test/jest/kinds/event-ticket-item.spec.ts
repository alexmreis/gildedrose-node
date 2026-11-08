import { Item, GildedRose } from '@/gilded-rose';

describe('Event Tickets', () => {
  describe('update', () => {
    function updatedTicket(sellIn: number, quality: number) {
      const ticket = new Item('Backstage passes to a TAFKAL80ETC concert', sellIn, quality);

      new GildedRose([ticket]).updateQuality();

      return ticket;
    }

    it('lowers sellIn by 1', () => {
      expect(updatedTicket(15, 20).sellIn).toBe(14);
    });

    it('lowers sellIn below 0 once the concert has passed', () => {
      expect(updatedTicket(0, 20).sellIn).toBe(-1);
    });

    it('gains 1 quality with Sell In above 10', () => {
      expect(updatedTicket(11, 20).quality).toBe(21);
    });

    it('gains 2 quality with Sell In at 10', () => {
      expect(updatedTicket(10, 20).quality).toBe(22);
    });

    it('gains 2 quality with Sell In at 6', () => {
      expect(updatedTicket(6, 20).quality).toBe(22);
    });

    it('gains 3 quality with Sell In at 5', () => {
      expect(updatedTicket(5, 20).quality).toBe(23);
    });

    it('gains 3 quality with Sell In at 1', () => {
      expect(updatedTicket(1, 20).quality).toBe(23);
    });

    it('drops quality to 0 once the concert has passed', () => {
      expect(updatedTicket(0, 20).quality).toBe(0);
    });

    it('stays at 0 quality after the concert', () => {
      expect(updatedTicket(-1, 0).quality).toBe(0);
    });

    it('maxes out quality at 50 with Sell In above 10', () => {
      expect(updatedTicket(11, 50).quality).toBe(50);
    });

    it('caps quality at 50 when gaining 2', () => {
      expect(updatedTicket(10, 49).quality).toBe(50);
    });

    it('caps quality at 50 when gaining 3', () => {
      expect(updatedTicket(5, 48).quality).toBe(50);
    });

    it('returns the same Event Ticket before the concert', () => {
      const ticket = new Item('Backstage passes to a TAFKAL80ETC concert', 5, 20);

      expect(new GildedRose([ticket]).updateQuality()[0]).toBe(ticket);
    });

    it('returns the same Event Ticket after the concert', () => {
      const ticket = new Item('Backstage passes to a TAFKAL80ETC concert', 0, 20);

      expect(new GildedRose([ticket]).updateQuality()[0]).toBe(ticket);
    });
  });
});
