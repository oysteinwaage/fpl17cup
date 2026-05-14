export interface League {
    id: number;
    name: string;
}

export const leaguesInDropdownList: League[] = [
    {id: 114763, name: "Toern",},
    {id: 1043487, name: "Kragskogen Invtl.",},
    {id: 1648230, name: "Progit",},
    {id: 732614, name: "Nå er det alvor FPL",},
    {id: 503704, name: "200-kroners ligaen",},
    {id: 937424, name: "Dataligaen",},
    {id: 114757, name: "Graduates 2012 FTW!",},
    {id: 110024, name: "Never Give Up",},
    {id: 114769, name: "Holmen League",},
    {id: 1165146, name: "Eika Fantasy",},
];

export const allRounds: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38];
export const roundsUpTilNow = (currentround: number | null): number[] => allRounds.filter(r => r <= (currentround || 0)).reverse();

export function SelectBox(
    values: (number | string)[],
    onChange: () => void,
    extraClassName: string = '',
    extraName: string = '',
    startRound?: number | string
): JSX.Element {
    return (
        <div className='selectBoxContainer'>
            <select className={'select_style' + extraClassName} name={"selectBox" + extraName} id="selectBox"
                    onChange={onChange} value={startRound as any}>
                <option value={undefined}>Velg runde</option>
                {values.map(val => {
                    return <option key={val}
                                   value={val as any}>{(val !== 'Utslagningsrunder' && val !== 'Playoff' ? 'Runde' : '') + val}</option>;
                })}
            </select>
        </div>
    );
}
