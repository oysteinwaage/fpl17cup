import React from 'react';

export interface League {
  id: number;
  name: string;
}

export const leaguesInDropdownList: League[] = [
  { id: 2427,    name: 'Never Give Up' },
  { id: 42396,   name: '200-kronersligaen' },
  { id: 179591,  name: 'Dataligaen' },
  { id: 240022,  name: 'Graduates 2012 FTW!' },
  { id: 240026,  name: 'Toern' },
  { id: 240028,  name: 'Holmen League' },
  { id: 298628,  name: 'Nå er det alvor FPL' },
  { id: 1170808, name: 'Kragskogen invtl.' },
  { id: 1209039, name: 'VASK 2016' },
  { id: 1716038, name: '90minutefamily 250kr' },
];

export const allRounds: number[] = Array.from({ length: 38 }, (_, i) => i + 1);
export const roundsUpTilNow = (currentround: number | null): number[] =>
  allRounds.filter(r => r <= (currentround || 0)).reverse();

export function SelectBox(
  values: (number | string)[],
  onChange: () => void,
  _extraClassName: string = '',
  extraName: string = '',
  startRound?: number | string
): JSX.Element {
  return (
    <div className="flex justify-center py-2">
      <select
        name={'selectBox' + extraName}
        id="selectBox"
        onChange={onChange}
        value={startRound as any}
        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-fpl-purple"
      >
        <option value={undefined}>Velg runde</option>
        {values.map(val => (
          <option key={val} value={val as any}>
            {val !== 'Utslagningsrunder' && val !== 'Playoff' ? 'Runde ' : ''}{val}
          </option>
        ))}
      </select>
    </div>
  );
}
