package service;

import model.Candidate;
import model.Elector;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Service Layer enforcing core business logic and thread-safe operations.
 */
public class ElectionService {

    private final Map<String, Elector> electors = new ConcurrentHashMap<>();
    private final Map<String, AtomicInteger> tallies = new ConcurrentHashMap<>();
    private final List<Candidate> candidates = new ArrayList<>();

    public ElectionService() {
        initCandidates();
        initTallies();
    }

    private void initCandidates() {
        candidates.add(new Candidate("AAP", "Aam Aadmi Party", "Broom (Jhadu)", "#0F766E"));
        candidates.add(new Candidate("BJP", "Bharatiya Janata Party", "Lotus (Kamal)", "#C2410C"));
        candidates.add(new Candidate("BSP", "Bahujan Samaj Party", "Elephant (Haathi)", "#1D4ED8"));
        candidates.add(new Candidate("CPI(M)", "Communist Party of India (Marxist)", "Hammer, Sickle & Star", "#B91C1C"));
        candidates.add(new Candidate("INC", "Indian National Congress", "Hand (Haath)", "#047857"));
        candidates.add(new Candidate("TMC", "All India Trinamool Congress", "Twin Flowers (Jora Ghash Phul)", "#0284C7"));
        candidates.add(new Candidate("NOTA", "None of the Above", "Ballot Paper with Cross", "#6B7280"));
    }

    private void initTallies() {
        for (Candidate c : candidates) {
            tallies.put(c.getCode(), new AtomicInteger(0));
        }
    }

    public synchronized Elector enrollElector(String name, int age, String state, String pin) {
        String voterId;
        do {
            int randomSix = 100000 + new Random().nextInt(900000);
            voterId = "VTR" + randomSix;
        } while (electors.containsKey(voterId));

        Elector elector = new Elector(voterId, name, age, state, pin);
        electors.put(voterId, elector);
        return elector;
    }

    public Elector findElector(String voterId) {
        if (voterId == null) return null;
        return electors.get(voterId.trim().toUpperCase());
    }

    public synchronized boolean castVote(String voterId, String partyCode) {
        Elector elector = findElector(voterId);
        if (elector == null || elector.hasVoted()) {
            return false;
        }
        AtomicInteger count = tallies.get(partyCode);
        if (count == null) {
            return false;
        }

        count.incrementAndGet();
        elector.recordVote();
        return true;
    }

    public int getTotalElectors() {
        return electors.size();
    }

    public int getTotalBallotsCast() {
        return tallies.values().stream().mapToInt(AtomicInteger::get).sum();
    }

    public double getTurnoutPercentage() {
        int reg = getTotalElectors();
        return reg > 0 ? (getTotalBallotsCast() * 100.0 / reg) : 0.0;
    }

    public Map<String, Integer> getConfidentialTally() {
        Map<String, Integer> result = new LinkedHashMap<>();
        for (Candidate c : candidates) {
            result.put(c.getCode(), tallies.get(c.getCode()).get());
        }
        return Collections.unmodifiableMap(result);
    }

    public Collection<Elector> getAllElectors() {
        return Collections.unmodifiableCollection(electors.values());
    }
}

