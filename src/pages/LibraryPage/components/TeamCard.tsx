import type { Team } from "../../../types/team";
import { Badge } from "../../../components/ui/Badge";
import { getLeagueName } from "../../../data/leagues";
import styles from "./TeamCard.module.css";

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <div className={styles.card}>
      <Badge src={team.badgeUrl} alt={`${team.name} badge`} size="lg" />
      <div className={styles.info}>
        <h3 className={styles.name}>{team.name}</h3>
        {(team.city || team.state) && (
          <p className={styles.location}>
            {[team.city, team.state].filter(Boolean).join(", ")}
          </p>
        )}
        <div className={styles.meta}>
          <span className={styles.league}>{getLeagueName(team.leagueId)}</span>
          {team.foundedYear > 0 && (
            <span className={styles.year}>Est. {team.foundedYear}</span>
          )}
        </div>
      </div>
      <div
        className={styles.colorStripe}
        style={{
          background: `linear-gradient(135deg, ${team.colors[0]} 50%, ${team.colors[1]} 50%)`,
        }}
      />
    </div>
  );
}
