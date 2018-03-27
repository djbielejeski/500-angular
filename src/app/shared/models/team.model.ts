export class Team {
  Id: number;
  TeamMember1Id: number;
  TeamMember2Id: number;

  constructor(teamId: number){
    this.Id = teamId;
  }
}
