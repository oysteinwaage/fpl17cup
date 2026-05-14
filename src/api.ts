let leagueId: number;

export let loadedPlayerIds: number[] = [];

export function getManagerList(chosenLeagueId: number): Promise<any> {
    leagueId = chosenLeagueId;

    return new Promise((resolve, reject) => {
        setTimeout(function () {
            fetch(`/api/getLeagueInfo?leagueId=${chosenLeagueId}`)
                .then(r => r.json())
                .then(data => {
                    console.log('leagueInfo ', data);
                    return resolve({
                        ...data,
                        managers: data.standings.results.map((p: any) => p.entry),
                        leagueName: data.league.name
                    });
                })
                .catch(error => {reject(error);});
        });
    });
}

export function getRoundScores(managerIds: number[]): Promise<any> {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            fetch(`/api/scores?teams=${managerIds}`)
                .then(r => r.json())
                .then(data => {
                    return resolve(data);
                })
                .catch(error => reject(error));
        });
    });
}

export function getStats(): Promise<any> {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            fetch(`/api/stats`)
                .then(r => r.json())
                .then(data => {
                    return resolve(data);
                })
                .catch(error => reject(error));
        });
    });
}

export function getPlayerScoresFor(players: number[]): Promise<any> {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            fetch(`/api/playerscores?players=${players}`)
                .then(r => r.json())
                .then(data => {
                    return resolve(data);
                })
                .catch(error => reject(error));
        });
    });
}

export function getTransfers(managerIds: number[]): Promise<any> {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            fetch(`/api/getTransfers?teams=${managerIds}`)
                .then(r => r.json())
                .then(data => {
                    return resolve(data);
                })
                .catch(error => reject(error));
        });
    });
}

export const getLiveData = (round: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            fetch(`/api/getLiveData?round=${round}`)
                .then(r => r.json())
                .then(data => {
                    return resolve(data);
                })
                .catch(error => reject(error));
        });
    });
};

export const getEntryPicks = (teams: number[], round: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            fetch(`/api/getEntryPicks?round=${round}&teams=${teams}`)
                .then(r => r.json())
                .then(data => {
                    return resolve(data);
                })
                .catch(error => reject(error));
        });
    });
};

export function getCaptainHistory(teams: number[], rounds: number[]): Promise<any> {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            fetch(`/api/getCaptainHistory?teams=${teams}&rounds=${rounds}`)
                .then(r => r.json())
                .then(data => resolve(data))
                .catch(error => reject(error));
        });
    });
}

export function getEntryInfo(entryId: number): Promise<any> {
    return new Promise((resolve, reject) => {
        fetch(`/api/getEntryInfo?entryId=${entryId}`)
            .then(r => {
                if (!r.ok) throw new Error('Laget ble ikke funnet');
                return r.json();
            })
            .then(data => resolve(data))
            .catch(error => reject(error));
    });
}

export function getTestNoe(): Promise<any> {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            fetch(`/api/test`)
                .then(r => r.json())
                .then(data => {
                    console.log('testDirekte', data);
                    return resolve(data);
                })
                .catch(error => reject(error));
        });
    });
}
