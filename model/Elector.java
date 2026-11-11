package model;

import java.time.LocalDateTime;

/**
 * Represents a registered citizen elector in the Indian electoral database.
 * Follows core Object-Oriented Programming (OOP) encapsulation principles.
 */
public class Elector {
    private final String id;           // Unique ID e.g. VTR482910
    private final String name;         // Full legal citizen name
    private final int age;             // Must be >= 18 under Article 326
    private final String state;        // State / Union Territory constituency
    private final String pin;          // 4-digit security PIN for authentication
    private boolean hasVoted;          // Strict flag: One vote per elector
    private LocalDateTime votedAt;     // Timestamp of ballot submission

    public Elector(String id, String name, int age, String state, String pin) {
        if (age < 18) {
            throw new IllegalArgumentException("Citizen must be at least 18 years of age to register as an elector.");
        }
        if (pin == null || !pin.matches("^\\d{4}$")) {
            throw new IllegalArgumentException("PIN must be exactly 4 numeric digits.");
        }
        this.id = id;
        this.name = name;
        this.age = age;
        this.state = state;
        this.pin = pin;
        this.hasVoted = false;
        this.votedAt = null;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    public String getState() {
        return state;
    }

    public String getPin() {
        return pin;
    }

    public boolean hasVoted() {
        return hasVoted;
    }

    public LocalDateTime getVotedAt() {
        return votedAt;
    }

    /**
     * Marks the elector as having voted and records the immutable timestamp.
     */
    public synchronized void recordVote() {
        if (this.hasVoted) {
            throw new IllegalStateException("Duplicate voting violation: Elector has already cast a ballot.");
        }
        this.hasVoted = true;
        this.votedAt = LocalDateTime.now();
    }
}

