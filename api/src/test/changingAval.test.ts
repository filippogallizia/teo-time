import { expect } from 'chai';

import { FROM_DATE_TO_DAY } from '../utils';

describe('differents_utc', () => {
  // cases in which we expect not availabilites

  it('Monday utc + 1', function () {
    const Monday = FROM_DATE_TO_DAY('2022-05-09T01:01:01.000+01:00');

    expect(Monday).to.equal('Monday');
  });

  it('Monday utc + 2', function () {
    const Monday = FROM_DATE_TO_DAY('2022-05-30T01:01:01.000+02:00');

    expect(Monday).to.equal('Monday');
  });
});
