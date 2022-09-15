import type { Event, EventPlayer, EventTeam } from './firebase/db';
export type beforeContent = (
	| { type: 'text'; text: string }
	| { type: 'player'; player: EventPlayer }
	| { type: 'team'; team: EventTeam }
)[];

export function getBeforeContent(str: string, event: Event): beforeContent {
	var re = /@(([A-Za-z]{3})(\d+|))/g;
	let match: RegExpExecArray | null;
	const val: beforeContent = [];
	let lastIndex = 0;
	let proxy: string;
	while ((match = re.exec(str)) != null) {
		proxy = match[2].toUpperCase();
		const team = event.sortedTeams.find((x) => x.acronym === proxy);
		if (!team) continue;
		if ((proxy = match[3])) {
			const player = team.players.find((x) => x.jerseyNum === proxy);
			if (!player) continue;
			val.push(
				{ type: 'text', text: str.substring(lastIndex, match.index) },
				{ type: 'player', player }
			);
		} else {
			val.push(
				{ type: 'text', text: str.substring(lastIndex, match.index) },
				{ type: 'team', team }
			);
		}
		lastIndex = match.index + match[0].length;
	}
	val.push({ type: 'text', text: str.substring(lastIndex) });
	return val;
}

export type Suggestions =
	| { type: 'team'; suggestion: { val: EventTeam; setStr: string }[] }
	| { type: 'player'; suggestion: { val: EventPlayer; setStr: string }[] };
export function getSuggestionsInContent(str: string, event: Event): Suggestions {
	if (str.endsWith('@')) {
		return {
			type: 'team',
			suggestion: event.sortedTeams.map((x) => ({ val: x, setStr: str + x.acronym }))
		};
	}
	let proxy: string;
	if ((proxy = str.substring(str.length - 3)).includes('@')) {
		proxy = proxy.substring(1).toUpperCase();
		return {
			type: 'team',
			suggestion: event.sortedTeams
				.filter((x) => x.acronym.includes(proxy))
				.map((x) => ({
					val: x,
					setStr: str.substring(0, str.length - proxy.length) + x.acronym
				}))
		};
	}
	if ((proxy = str.substring(str.length - 4)).includes('@')) {
		proxy = proxy.substring(1).toUpperCase();
		const team = event.sortedTeams.find((x) => x.acronym === proxy);
		if (!team) {
			return {
				type: 'team',
				suggestion: event.sortedTeams.map((x) => ({
					val: x,
					setStr: str.substring(str.length - 4) + x.acronym
				}))
			};
		}
		return {
			type: 'player',
			suggestion: team.players.map((x) => ({ val: x, setStr: str + x.jerseyNum + ' ' }))
		};
	}
	return {
		type: 'team',
		suggestion: event.sortedTeams.map((x) => ({ val: x, setStr: str + '@' + x.acronym }))
	};
}
