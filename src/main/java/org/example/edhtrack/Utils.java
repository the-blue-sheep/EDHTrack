package org.example.edhtrack;

import org.example.edhtrack.entity.GameParticipant;

import java.util.List;

public final class Utils {
    public static int countWins(List<GameParticipant> participants) {
        return (int) participants.stream()
                .filter(p -> p.getGame().getWinner() != null &&
                        p.getGame().getWinner().equals(p.getPlayer()))
                .count();
    }

}
