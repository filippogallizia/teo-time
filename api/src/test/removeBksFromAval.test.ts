import { expect } from 'chai';

import { removeBksFromAval } from '../utils';

describe('removeBksFromAval', () => {
  // cases in which we expect not availabilites

  it('avalStart < bkgStart and bkgStart < AvalEnd < bkgEnd', function () {
    const aval = removeBksFromAval(
      [
        {
          start: '2022-03-21T05:29:00.000+00:00',
          end: '2022-03-21T08:00:00.000+00:00',
        },
      ],
      [
        {
          start: '2022-03-21T07:30:00.000+00:00',
          end: '2022-03-21T08:30:00.000+00:00',
        },
      ]
    );

    expect(aval).length(0);
  });

  it('bkgStart < avalStart < bkgEnd  and  AvalEnd > bkgEnd', function () {
    const aval = removeBksFromAval(
      [
        {
          start: '2022-03-21T08:00:00.000+00:00',
          end: '2022-03-21T10:00:00.000+00:00',
        },
      ],
      [
        {
          start: '2022-03-21T07:30:00.000+00:00',
          end: '2022-03-21T08:30:00.000+00:00',
        },
      ]
    );

    expect(aval).length(0);
  });

  it('bkgStart === avalStart and AvalEnd === bkgEnd', function () {
    const aval = removeBksFromAval(
      [
        {
          start: '2022-03-21T08:00:00.000+00:00',
          end: '2022-03-21T10:00:00.000+00:00',
        },
      ],
      [
        {
          start: '2022-03-21T08:00:00.000+00:00',
          end: '2022-03-21T10:00:00.000+00:00',
        },
      ]
    );

    expect(aval).length(0);
  });

  it('bkgStart > avalStart and AvalEnd < bkgEnd', function () {
    const aval = removeBksFromAval(
      [
        {
          start: '2022-03-21T08:01:00.000+00:00',
          end: '2022-03-21T09:59:00.000+00:00',
        },
      ],
      [
        {
          start: '2022-03-21T08:00:00.000+00:00',
          end: '2022-03-21T10:00:00.000+00:00',
        },
      ]
    );

    expect(aval).length(0);
  });
  it('avalStart < bkgStart and AvalEnd > bkgEnd', function () {
    const aval = removeBksFromAval(
      [
        {
          start: '2022-03-21T05:29:00.000+00:00',
          end: '2022-03-21T08:31:00.000+00:00',
        },
      ],
      [
        {
          start: '2022-03-21T07:30:00.000+00:00',
          end: '2022-03-21T08:30:00.000+00:00',
        },
      ]
    );

    expect(aval).length(0);
  });

  // cases in which we expect  availabilites
  it('avalStart and avalEnd < bkgStart and bkgEnd', function () {
    const aval = removeBksFromAval(
      [
        {
          start: '2022-03-21T05:29:00.000+00:00',
          end: '2022-03-21T07:29:00.000+00:00',
        },
      ],
      [
        {
          start: '2022-03-21T07:30:00.000+00:00',
          end: '2022-03-21T08:30:00.000+00:00',
        },
      ]
    );

    expect(aval).length(1);
  });

  it('avalStart < bkgStart and AvalEnd === bkgStart', function () {
    const aval = removeBksFromAval(
      [
        {
          start: '2022-03-21T05:29:00.000+00:00',
          end: '2022-03-21T07:30:00.000+00:00',
        },
      ],
      [
        {
          start: '2022-03-21T07:30:00.000+00:00',
          end: '2022-03-21T08:30:00.000+00:00',
        },
      ]
    );

    expect(aval).length(1);
  });

  it('avalStart < bkgStart and AvalEnd > bkgStart', function () {
    const aval = removeBksFromAval(
      [
        {
          start: '2022-03-21T05:29:00.000+00:00',
          end: '2022-03-21T07:31:00.000+00:00',
        },
      ],
      [
        {
          start: '2022-03-21T07:30:00.000+00:00',
          end: '2022-03-21T08:30:00.000+00:00',
        },
      ]
    );

    expect(aval).length(0);
  });

  it('avalStart === bkgEnd and AvalEnd > bkgEnd', function () {
    const aval = removeBksFromAval(
      [
        {
          start: '2022-03-21T08:30:00.000+00:00',
          end: '2022-03-21T10:31:00.000+00:00',
        },
      ],
      [
        {
          start: '2022-03-21T07:30:00.000+00:00',
          end: '2022-03-21T08:30:00.000+00:00',
        },
      ]
    );

    expect(aval).length(1);
  });

  it('aval in between bookings', function () {
    const aval = removeBksFromAval(
      [
        {
          start: '2022-03-21T08:30:00.000+00:00',
          end: '2022-03-21T10:30:00.000+00:00',
        },
      ],
      [
        {
          start: '2022-03-21T07:30:00.000+00:00',
          end: '2022-03-21T08:30:00.000+00:00',
        },
        {
          start: '2022-03-21T10:30:00.000+00:00',
          end: '2022-03-21T11:30:00.000+00:00',
        },
      ]
    );

    expect(aval).length(1);
  });

  it('aval in btw bookings but overlapping', function () {
    const aval = removeBksFromAval(
      [
        {
          start: '2022-03-21T08:30:00.000+00:00',
          end: '2022-03-21T10:31:00.000+00:00',
        },
      ],
      [
        {
          start: '2022-03-21T07:30:00.000+00:00',
          end: '2022-03-21T08:30:00.000+00:00',
        },
        {
          start: '2022-03-21T10:30:00.000+00:00',
          end: '2022-03-21T11:30:00.000+00:00',
        },
      ]
    );

    expect(aval).length(0);
  });
});
